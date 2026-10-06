"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Sliders,
  Eye,
  Settings,
  Sparkles,
  FileDown,
  Share2,
  CheckCircle2,
  Globe,
  TrendingUp,
  Shield,
  Layers,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Calendar,
  AlertCircle,
  FileText,
  Palette,
  Send,
  Mail,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import {
  Button,
  Badge,
  Twitter,
  Linkedin,
  ProgressRing,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Logo,
} from "@/components/ui";
import { BRAND_NAME } from "@/config/brand";
import { PORTFOLIO_DESIGN_LIST } from "@/config/designs";
import { CV_TEMPLATE_LIST } from "@/config/cv-templates";
import { useEditorStore } from "@/store/editor-store";
import { toast } from "sonner";
import QRCode from "qrcode";

export default function DashboardPage() {
  const { profile, skills, experiences, projects, updateProfile } = useEditorStore();

  const [copied, setCopied] = React.useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string | null>(null);

  // Sparkline chart data for views last 7 days
  const viewsData = [12, 19, 28, 45, 62, 85, 114];
  const maxViews = Math.max(...viewsData);
  const sparklinePoints = viewsData
    .map((v, i) => `${(i / (viewsData.length - 1)) * 200},${40 - (v / maxViews) * 35}`)
    .join(" ");

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/u/${profile.username || "alex-vance"}`
    : `https://folionova.io/u/${profile.username || "alex-vance"}`;

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      QRCode.toDataURL(publicUrl, { width: 200, margin: 2 }, (err, url) => {
        if (!err && url) setQrCodeDataUrl(url);
      });
    }
  }, [publicUrl]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(publicUrl);
    setCopied(true);
    toast.success("Public link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.full_name}'s Portfolio`,
          text: `Check out my portfolio on ${BRAND_NAME}!`,
          url: publicUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  // Profile completeness calculation
  const missingItems: { label: string; done: boolean; card: string }[] = [
    { label: "Profile photo uploaded", done: !!profile.avatar_url, card: "personal" },
    { label: "Headline & short bio defined", done: !!(profile.headline && profile.short_bio), card: "personal" },
    { label: "At least 3 core skills added", done: skills.length >= 3, card: "skills" },
    { label: "Work experience milestone added", done: experiences.length > 0, card: "experience" },
    { label: "Featured project spotlighted", done: projects.length > 0, card: "projects" },
    { label: "Custom accent color chosen", done: !!profile.accent_color, card: "customization" },
  ];

  const completedCount = missingItems.filter((i) => i.done).length;
  const completenessPercent = Math.round((completedCount / missingItems.length) * 100);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm"
              >
                Studio
              </Link>
              <Link
                href="/dashboard/messages"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Inbox</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/edit">
              <Button size="sm" variant="primary" leftIcon={<Sliders className="w-3.5 h-3.5" />}>
                Edit Portfolio
              </Button>
            </Link>

            <Link href={`/u/${profile.username || "alex-vance"}`} target="_blank">
              <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                Preview Full Screen
              </Button>
            </Link>

            <Link href="/settings">
              <Button size="icon" variant="ghost" aria-label="Settings">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10 text-left">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-black">
              Welcome back, {profile.full_name || "Alex"} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Manage your live portfolio, track views, and download ATS-ready resumes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/edit">
              <Button size="sm" variant="secondary" leftIcon={<Palette className="w-3.5 h-3.5 text-purple-400" />}>
                Change Design
              </Button>
            </Link>

            <Link href="/cv">
              <Button size="sm" variant="outline" leftIcon={<FileDown className="w-3.5 h-3.5 text-cyan-400" />}>
                CV Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* Portfolio Status Card & Big Share Bar */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-strong)] space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <Badge variant={profile.is_published ? "success" : "warning"} dot>
                {profile.is_published ? "Published & Live" : "Private Draft"}
              </Badge>
              <span className="text-xs text-[var(--text-secondary)] font-mono">
                {profile.is_published
                  ? "Search engines and visitors can view your site"
                  : "Only you can preview this portfolio"}
              </span>
            </div>

            <Button
              size="sm"
              variant={profile.is_published ? "outline" : "primary"}
              onClick={() => {
                updateProfile({ is_published: !profile.is_published });
                toast.success(
                  profile.is_published
                    ? "Portfolio unpublished."
                    : "Portfolio published live!"
                );
              }}
            >
              {profile.is_published ? "Switch to Draft" : "Publish Portfolio Live"}
            </Button>
          </div>

          {/* Big Copyable Link with Actions */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400">
              Your Public Link:
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 h-12 px-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-[var(--border-subtle)] flex items-center justify-between font-mono text-xs sm:text-sm text-indigo-400 truncate">
                <span className="truncate">{publicUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="ml-2 hover:text-white transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="md"
                  variant="primary"
                  onClick={handleCopyLink}
                  leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? "Copied" : "Copy Link"}
                </Button>

                {/* QR Code Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="md" variant="secondary" leftIcon={<QrCode className="w-4 h-4" />}>
                      QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="text-center sm:text-left">
                    <DialogHeader>
                      <DialogTitle>Scan Portfolio QR Code</DialogTitle>
                      <DialogDescription>
                        Present this QR code on slides, business cards, or during interviews.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col items-center justify-center space-y-3">
                      {qrCodeDataUrl && (
                        <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-200">
                          <img src={qrCodeDataUrl} alt="Portfolio QR Code" className="w-48 h-48 rounded-lg" />
                        </div>
                      )}
                      <p className="text-xs font-mono text-slate-400">{publicUrl}</p>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="md"
                  variant="outline"
                  onClick={handleNativeShare}
                  leftIcon={<Share2 className="w-4 h-4" />}
                >
                  Share
                </Button>
              </div>
            </div>

            {/* Quick Social Share Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">Share to:</span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-slate-100/50 dark:bg-white/[0.02] hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                <span>LinkedIn</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent("Check out my new portfolio built on FolioNova:")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-slate-100/50 dark:bg-white/[0.02] hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
              >
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                <span>X / Twitter</span>
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my portfolio: ${publicUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-slate-100/50 dark:bg-white/[0.02] hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(`${profile.full_name}'s Portfolio`)}&body=${encodeURIComponent(`Hi,\n\nTake a look at my portfolio:\n${publicUrl}\n`)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-slate-100/50 dark:bg-white/[0.02] hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Row with Sparkline & Completeness */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Views & 7-Day Sparkline */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Visitor Telemetry</span>
              <Eye className="w-4 h-4 text-indigo-400" />
            </div>

            <div>
              <div className="text-3xl font-heading font-black">
                {profile.view_count.toLocaleString()}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Total Verified Views</p>
            </div>

            {/* Sparkline Chart */}
            <div className="pt-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Past 7 Days</span>
                <span className="text-emerald-400 font-bold">+28% growth</span>
              </div>
              <svg viewBox="0 0 200 45" className="w-full h-12 overflow-visible">
                <polyline
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sparklinePoints}
                />
              </svg>
            </div>
          </div>

          {/* Card 2: Profile Completeness Ring & Checklist */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border-subtle)] space-y-4 md:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base">Profile Completeness</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {completedCount} of {missingItems.length} essential checkpoints completed.
                </p>
              </div>
              <ProgressRing progress={completenessPercent} size={54} color="#6366F1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {missingItems.map((item) => (
                <Link
                  key={item.label}
                  href={`/edit`}
                  className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-xs hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className={item.done ? "text-slate-300" : "text-amber-300 font-medium"}>
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Design Switcher Row */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-bold">Active Portfolio Archetype</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Switch layout anytime. Your data instantly adapts.
              </p>
            </div>
            <Link href="/edit" className="text-xs text-indigo-400 hover:underline">
              Customize typography in editor →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PORTFOLIO_DESIGN_LIST.map((design) => {
              const isSelected = profile.design_id === design.id;
              return (
                <div
                  key={design.id}
                  onClick={() => {
                    updateProfile({ design_id: design.id });
                    toast.success(`Switched active archetype to ${design.name}!`);
                  }}
                  className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-500/[0.04]"
                      : "hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-heading">{design.name}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                      {design.tagline}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Badge size="sm" variant={isSelected ? "primary" : "secondary"}>
                      {design.vibe}
                    </Badge>

                    <Link
                      href={`/demo/${design.id}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-mono text-indigo-400 hover:text-white flex items-center gap-1 hover:underline"
                      title="Preview full screen in new tab"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
