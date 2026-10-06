"use client";

import * as React from "react";
import Link from "next/link";
import { useEditorStore } from "@/store/editor-store";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/database";
import {
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  CheckCircle,
  ExternalLink,
  Reply,
  ArrowLeft,
  Calendar,
  User,
  Search,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button, Badge, Logo, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui";
import { toast } from "sonner";

// Sample mock messages if running locally or before first visitor contact
const INITIAL_DEMO_MESSAGES: Message[] = [
  {
    id: "msg-1",
    profile_id: "demo-profile-id",
    name: "Sarah Lin",
    email: "sarah.lin@stripe.com",
    message:
      "Hi Alex! We came across your portfolio and were really impressed by your interactive design systems work. We are currently scouting for a Staff Frontend Engineer to lead our Core Experiences team at Stripe. Would you be open to an introductory chat this Thursday or Friday?",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
  },
  {
    id: "msg-2",
    profile_id: "demo-profile-id",
    name: "David K.",
    email: "david@lumina.design",
    message:
      "Hello! Loved the tactile feel of the kinetic typography on your portfolio. We're redesigning our flagship SaaS platform and looking for a high-level design technologist for a 3-month consulting engagement. Let us know your current availability and project rates.",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
  },
  {
    id: "msg-3",
    profile_id: "demo-profile-id",
    name: "Elena Rostova",
    email: "elena@frontier.vc",
    message:
      "Alex, brilliant execution on the WebGL demos and clean component architecture. Passing this over to two of our series-A portfolio founders who are actively looking for design engineers. Expect a couple of pings shortly!",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

export default function MessagesInboxPage() {
  const { profile } = useEditorStore();
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_DEMO_MESSAGES);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch real messages from Supabase on mount
  React.useEffect(() => {
    async function loadMessages() {
      try {
        const supabase = createClient();
        if (profile?.id && profile.id !== "demo-profile-id") {
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("profile_id", profile.id)
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            setMessages(data);
          }
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMessages();
  }, [profile?.id]);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const filteredMessages = messages
    .filter((m) => (filter === "unread" ? !m.is_read : true))
    .filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: isRead } : m))
    );

    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, is_read: isRead } : null));
    }

    try {
      const supabase = createClient();
      await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
    } catch {
      // Handled silently
    }
    toast.success(isRead ? "Message marked as read" : "Message marked as unread");
  };

  const handleDelete = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }

    try {
      const supabase = createClient();
      await supabase.from("messages").delete().eq("id", id);
    } catch {
      // Handled silently
    }
    toast.success("Message deleted");
  };

  const handleOpenMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      handleMarkAsRead(msg.id, true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>

            <span className="w-px h-4 bg-white/10" />

            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-heading font-bold">Contact Inbox</span>
              {unreadCount > 0 && (
                <Badge variant="primary" size="sm">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/u/${profile.username || "alex-vance"}`} target="_blank">
              <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                View Public Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Inbox Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        {/* Title & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black">
              Inbound Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Messages submitted by recruiters, clients, and visitors through your portfolio contact form.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/[0.04] border border-[var(--border-subtle)] rounded-xl">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === "all"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              All ({messages.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === "unread"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender name, email, or message keyword..."
            className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-[var(--border-subtle)] focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-[var(--border-subtle)] text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
              <MailOpen className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg">No inquiries found</h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              {searchQuery
                ? `No messages matched "${searchQuery}". Try searching for a different term.`
                : "When visitors fill out the contact form on your portfolio, their inquiries will land here in your private inbox."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`glass-panel p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !msg.is_read
                    ? "border-indigo-500/50 bg-indigo-500/[0.04] shadow-md shadow-indigo-500/5"
                    : "border-[var(--border-subtle)] hover:border-[var(--border-strong)] opacity-85 hover:opacity-100"
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                      !msg.is_read ? "bg-indigo-500 animate-pulse" : "bg-slate-600"
                    }`}
                  />

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[var(--text-primary)]">
                        {msg.name}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)] font-mono truncate">
                        &lt;{msg.email}&gt;
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedMessage.is_read ? "secondary" : "primary"} size="sm">
                    {selectedMessage.is_read ? "Read" : "New"}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.is_read)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1"
                    title="Toggle read status"
                  >
                    {selectedMessage.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 transition-colors text-xs flex items-center gap-1"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <DialogTitle className="text-xl font-bold font-heading">
                  {selectedMessage.name}
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-indigo-400 mt-1">
                  {selectedMessage.email}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="py-4">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-[var(--border-subtle)] text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </Button>

              <a
                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                  `Re: Portfolio Inquiry from ${selectedMessage.name}`
                )}&body=${encodeURIComponent(`Hi ${selectedMessage.name},\n\nThank you for reaching out through my portfolio!\n\n`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="primary" size="sm" leftIcon={<Reply className="w-4 h-4" />}>
                  Reply via Email
                </Button>
              </a>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
