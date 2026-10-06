"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  Code2,
} from "lucide-react";
import { Button, Input, Textarea, Badge } from "@/components/ui";
import { toast } from "sonner";
import { getContrastTextColor, getInitials, getMonogramGradient, isRTL } from "@/lib/design-utils";
import { BRAND_NAME } from "@/config/brand";

/* ========================================================================= */
/* 1. MONOGRAM AVATAR                                                        */
/* ========================================================================= */
export interface MonogramAvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  accentColor?: string;
}

export function MonogramAvatar({
  avatarUrl,
  name,
  size = "md",
  className = "",
  accentColor = "#6366F1",
}: MonogramAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-16 h-16 text-base",
    lg: "w-24 h-24 text-2xl",
    xl: "w-32 h-32 text-3xl",
  };

  const pxSizes = {
    sm: 40,
    md: 64,
    lg: 96,
    xl: 128,
  };

  const initials = getInitials(name);
  const textColor = getContrastTextColor(accentColor);

  if (avatarUrl) {
    return (
      <div className={`relative overflow-hidden rounded-full shrink-0 ${sizeClasses[size]} ${className}`}>
        <Image
          src={avatarUrl}
          alt={name ? `${name}'s profile photo` : "Profile photo"}
          width={pxSizes[size]}
          height={pxSizes[size]}
          unoptimized
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        background: getMonogramGradient(name || "Alex Vance"),
        color: "#FFFFFF",
      }}
      className={`rounded-full flex items-center justify-center font-heading font-black tracking-wider shadow-lg shrink-0 select-none ${sizeClasses[size]} ${className}`}
      aria-label={name || "User Avatar"}
    >
      <span>{initials}</span>
    </div>
  );
}

/* ========================================================================= */
/* 2. PROJECT COVER IMAGE / FALLBACK                                         */
/* ========================================================================= */
export interface ProjectCoverProps {
  imageUrl?: string | null;
  title: string;
  className?: string;
}

export function ProjectCover({ imageUrl, title, className = "" }: ProjectCoverProps) {
  const initials = getInitials(title, "PR");

  if (imageUrl) {
    return (
      <div className={`relative w-full h-48 overflow-hidden rounded-2xl bg-slate-900 ${className}`}>
        <Image
          src={imageUrl}
          alt={`${title} project preview`}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      style={{ background: getMonogramGradient(title) }}
      className={`relative w-full h-48 overflow-hidden rounded-2xl flex items-center justify-center shadow-inner ${className}`}
      aria-label={`${title} cover`}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div className="relative z-10 flex flex-col items-center gap-1 text-white">
        <span className="font-heading font-black text-3xl tracking-tight opacity-90 drop-shadow-md">
          {initials}
        </span>
        <span className="text-[11px] font-mono uppercase tracking-widest opacity-75">
          Case Study
        </span>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 3. WORKING PORTFOLIO CONTACT FORM                                         */
/* ========================================================================= */
export interface PortfolioContactFormProps {
  username?: string | null;
  accentColor?: string;
  theme?: "light" | "dark";
  className?: string;
}

export function PortfolioContactForm({
  username,
  accentColor = "#6366F1",
  theme = "dark",
  className = "",
}: PortfolioContactFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [honeypot, setHoneypot] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Silent honeypot drop
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/contact/${username || "alex-vance"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to send message right now.");
      }

      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send message. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contrastText = getContrastTextColor(accentColor);

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        theme === "light"
          ? "bg-white/80 border-slate-200 text-slate-900 shadow-xl"
          : "bg-slate-950/60 border-white/10 text-white shadow-2xl backdrop-blur-xl"
      } ${className}`}
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-400">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: accentColor, color: contrastText }}
          >
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-heading font-bold">Message Dispatched!</h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              Thank you for reaching out. Your note has been securely stored in the owner&apos;s
              inbox.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSuccess(false)}
            className="mt-2 text-xs"
          >
            Send Another Note
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Honeypot field (hidden from real humans, catches spam bots) */}
          <input
            type="text"
            name="website_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition-colors ${
                  theme === "light"
                    ? "bg-slate-100 border-slate-300 text-slate-900 focus:border-indigo-600"
                    : "bg-white/[0.04] border-white/10 text-white focus:border-indigo-500"
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Your Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className={`w-full h-11 px-3.5 rounded-xl border text-xs outline-none transition-colors ${
                  theme === "light"
                    ? "bg-slate-100 border-slate-300 text-slate-900 focus:border-indigo-600"
                    : "bg-white/[0.04] border-white/10 text-white focus:border-indigo-500"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Message / Inquiries *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your project, team, or opportunity..."
              className={`w-full p-3.5 rounded-xl border text-xs outline-none transition-colors resize-none ${
                theme === "light"
                  ? "bg-slate-100 border-slate-300 text-slate-900 focus:border-indigo-600"
                  : "bg-white/[0.04] border-white/10 text-white focus:border-indigo-500"
              }`}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: accentColor, color: contrastText }}
            className="w-full h-11 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Transmitting message...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Direct Message</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 4. OWNER-ONLY FLOATING TOOLBAR                                            */
/* ========================================================================= */
export function OwnerToolbar({ username }: { username?: string | null }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      toast.success("Public link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 glass-panel px-3 py-2 rounded-2xl border border-[var(--border-strong)] shadow-2xl flex items-center gap-2 backdrop-blur-2xl animate-in slide-in-from-bottom-4 duration-300">
      <Badge variant="primary" size="sm">
        Owner Mode
      </Badge>
      <Link href="/edit">
        <Button size="sm" variant="ghost" className="h-8 text-xs gap-1">
          <Sliders className="w-3.5 h-3.5" />
          <span>Edit Studio</span>
        </Button>
      </Link>
      <button
        type="button"
        onClick={handleCopy}
        className="p-2 rounded-xl text-xs hover:bg-white/10 text-slate-300 transition-colors"
        title="Copy Public Link"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

/* ========================================================================= */
/* 5. BRANDED FOOTER BADGE                                                   */
/* ========================================================================= */
export function BrandedFooterBadge() {
  return (
    <footer className="pt-16 pb-8 text-center text-xs font-mono text-slate-500">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:text-slate-300 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <span>Made with {BRAND_NAME}</span>
      </Link>
    </footer>
  );
}

export { TelemetryBeacon } from "./TelemetryBeacon";

