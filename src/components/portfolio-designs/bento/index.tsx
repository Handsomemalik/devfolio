"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  ArrowUpRight,
  Clock,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  Copy,
  Check,
  FileDown,
  Globe,
  Mail,
} from "lucide-react";
import { PortfolioPayload } from "@/types/database";
import {
  MonogramAvatar,
  ProjectCover,
  PortfolioContactForm,
  OwnerToolbar,
  BrandedFooterBadge,
} from "../shared";
import { getContrastTextColor, isRTL, getFontFamilyClass } from "@/lib/design-utils";
import { toast } from "sonner";

export interface BentoPortfolioProps {
  data: PortfolioPayload;
  accent?: string;
  themeMode?: "light" | "dark" | "system";
  font?: string;
  mode?: "live" | "preview" | "editor";
  isOwner?: boolean;
}

export function BentoPortfolio({
  data,
  accent = data.profile.accent_color || "#A855F7",
  themeMode = data.profile.theme_mode || "dark",
  font = data.profile.font_style || "inter",
  mode = "live",
  isOwner = false,
}: BentoPortfolioProps) {
  const { profile, skills, experiences, education, projects, social_links } = data;
  const rtl = isRTL(profile.full_name) || isRTL(profile.about_me);
  const contrastText = getContrastTextColor(accent);
  const fontClass = getFontFamilyClass(font);
  const isDark = themeMode !== "light";

  // Real-time formatted local clock
  const [currentTime, setCurrentTime] = React.useState("12:00 PM");

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  const cvDownloadUrl = `/api/cv/${profile.username || "alex-vance"}`;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`min-h-screen w-full relative transition-colors duration-300 selection:bg-purple-500/25 ${fontClass} ${
        isDark ? "bg-[#090A0F] text-[#F1F5F9]" : "bg-[#F8FAFC] text-[#0F172A]"
      }`}
    >
      {/* Top Header */}
      <header className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-black text-xs">
            B
          </div>
          <span className="font-heading font-black text-sm">{profile.full_name || "Portfolio"}</span>
        </div>

        <a href={cvDownloadUrl} target="_blank" rel="noreferrer">
          <button
            type="button"
            className={`h-9 px-4 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? "bg-white/[0.04] border-white/10 hover:bg-white/10 text-white"
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs"
            }`}
          >
            <FileDown className="w-3.5 h-3.5 text-purple-400" />
            <span>Download CV</span>
          </button>
        </a>
      </header>

      {/* RESPONSIVE BENTO MATRIX */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* TILE 1: HERO IDENTITY (2 cols, 2 rows) */}
          <div
            className={`md:col-span-2 lg:col-span-2 p-8 rounded-3xl border flex flex-col justify-between space-y-6 relative overflow-hidden transition-all hover:border-purple-500/40 ${
              isDark ? "glass-panel border-white/10" : "bg-white border-slate-200 shadow-xl"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                  BENTO MATRIX // 01
                </span>
                {profile.open_to_work && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    OPEN TO WORK
                  </span>
                )}
              </div>

              <div className="flex items-center gap-5">
                <MonogramAvatar
                  avatarUrl={profile.avatar_url}
                  name={profile.full_name}
                  size="lg"
                  accentColor={accent}
                  className="rounded-2xl border-2 border-white/10 shadow-lg shrink-0"
                />
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-white">
                    {profile.full_name || "Alex Vance"}
                  </h1>
                  <p className="text-sm font-semibold text-purple-300">
                    {profile.professional_title || "Principal Technologist"}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                {profile.about_me || profile.short_bio}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs text-slate-400 font-mono">
              {profile.location && <span>📍 {profile.location}</span>}
              {profile.years_of_experience > 0 && <span>• {profile.years_of_experience}+ yrs exp</span>}
            </div>
          </div>

          {/* TILE 2: REAL-TIME LOCAL CLOCK & COORDINATES (1 col) */}
          <div
            className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
              isDark ? "glass-panel border-white/10" : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Local Time</span>
              </div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-white pt-2">
                {currentTime}
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/5 text-xs">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Base</span>
              <span className="font-semibold text-slate-200">{profile.location || "Remote / Earth"}</span>
            </div>
          </div>

          {/* TILE 3: METRICS & TRACK RECORD (1 col) */}
          <div
            className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
              isDark ? "glass-panel border-white/10" : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
              VERIFIED IMPACT
            </span>

            <div className="space-y-3">
              <div>
                <div className="text-3xl font-heading font-black text-white">
                  {profile.years_of_experience > 0 ? `${profile.years_of_experience}+` : "10+"}
                </div>
                <p className="text-xs text-slate-400">Years in Engineering</p>
              </div>

              <div>
                <div className="text-3xl font-heading font-black text-purple-400">
                  {projects?.length || 4}
                </div>
                <p className="text-xs text-slate-400">Production Projects</p>
              </div>
            </div>
          </div>

          {/* TILE 4: FEATURED PROJECT SPOTLIGHT (2 cols) */}
          {projects && projects[0] && (
            <div
              className={`md:col-span-2 lg:col-span-2 p-6 sm:p-8 rounded-3xl border space-y-4 group transition-all hover:border-purple-500/40 ${
                isDark ? "glass-panel border-white/10" : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                  FLAGSHIP SPOTLIGHT
                </span>
                {projects[0].live_url && (
                  <a
                    href={projects[0].live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1"
                  >
                    Demo <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <ProjectCover imageUrl={projects[0].image_url} title={projects[0].title} />

              <div className="space-y-1">
                <h3 className="text-xl font-heading font-bold text-white group-hover:text-purple-400 transition-colors">
                  {projects[0].title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {projects[0].description}
                </p>
              </div>
            </div>
          )}

          {/* TILE 5: CORE SKILLS CLOUD (2 cols) */}
          {skills && skills.length > 0 && (
            <div
              className={`md:col-span-2 lg:col-span-2 p-6 sm:p-8 rounded-3xl border space-y-4 ${
                isDark ? "glass-panel border-white/10" : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                  SKILLS ECOSYSTEM
                </span>
                <span className="text-xs font-mono text-slate-400">{skills.length} competencies</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/10 text-slate-200 hover:border-purple-400 transition-colors"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TILE 6: WORK HISTORY (2 cols) */}
          {experiences && experiences.length > 0 && (
            <div
              className={`md:col-span-2 lg:col-span-2 p-6 sm:p-8 rounded-3xl border space-y-4 ${
                isDark ? "glass-panel border-white/10" : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                EXPERIENCE ROSTER
              </span>

              <div className="space-y-3 divide-y divide-white/5">
                {experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-white">{exp.role}</span>
                      <span className="font-mono text-slate-500 text-[10px]">{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
                    </div>
                    <p className="text-[11px] text-purple-300 font-medium">{exp.company}</p>
                    {exp.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TILE 7: SOCIAL COORDINATES & CONNECT (2 cols) */}
          <div
            className={`md:col-span-2 lg:col-span-2 p-6 sm:p-8 rounded-3xl border space-y-4 flex flex-col justify-between ${
              isDark ? "glass-panel border-white/10" : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            <div>
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-1">
                CONTACT HUB
              </span>
              <h4 className="text-lg font-heading font-bold text-white">Direct Dispatch</h4>
              <p className="text-xs text-slate-400 mt-1">
                Inquire about consulting, speaking, or full-time opportunities.
              </p>
            </div>

            {social_links && social_links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {social_links.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-mono capitalize hover:bg-white/10 transition-colors"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FULL BENTO CONTACT FORM */}
        <section id="contact" className="pt-6">
          <PortfolioContactForm
            username={profile.username}
            accentColor={accent}
            theme={isDark ? "dark" : "light"}
          />
        </section>
      </main>

      <BrandedFooterBadge />

      {isOwner && <OwnerToolbar username={profile.username} />}
    </div>
  );
}
