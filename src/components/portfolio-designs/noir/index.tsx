"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  ArrowUpRight,
  Mail,
  ChevronDown,
  FileDown,
  Globe,
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

export interface NoirPortfolioProps {
  data: PortfolioPayload;
  accent?: string;
  themeMode?: "light" | "dark" | "system";
  font?: string;
  mode?: "live" | "preview" | "editor";
  isOwner?: boolean;
}

export function NoirPortfolio({
  data,
  accent = data.profile.accent_color || "#FFFFFF",
  themeMode = data.profile.theme_mode || "dark",
  font = data.profile.font_style || "inter",
  mode = "live",
  isOwner = false,
}: NoirPortfolioProps) {
  const { profile, skills, experiences, education, projects, social_links } = data;
  const rtl = isRTL(profile.full_name) || isRTL(profile.about_me);
  const contrastText = getContrastTextColor(accent);
  const fontClass = getFontFamilyClass(font);
  const isDark = themeMode !== "light";

  // Active expanded experience row
  const [expandedExpId, setExpandedExpId] = React.useState<string | null>(
    experiences?.[0]?.id || null
  );

  // Mouse spotlight coordinates
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === "preview") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const cvDownloadUrl = `/api/cv/${profile.username || "alex-vance"}`;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      onMouseMove={handleMouseMove}
      className={`min-h-screen w-full relative transition-colors duration-300 font-sans selection:bg-white/20 selection:text-white ${fontClass} ${
        isDark ? "bg-[#09090B] text-[#EDEDED]" : "bg-[#F5F5F0] text-[#121212]"
      }`}
    >
      {/* Subtle Cinematic Spotlight Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.08), transparent 80%)`,
        }}
      />

      {/* Noir Minimal Top Bar */}
      <nav
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl px-6 sm:px-12 h-16 flex items-center justify-between transition-colors ${
          isDark
            ? "bg-[#09090B]/80 border-neutral-900 text-neutral-300"
            : "bg-[#F5F5F0]/80 border-neutral-200 text-neutral-800"
        }`}
      >
        <a href="#hero" className="font-heading font-black text-xs uppercase tracking-widest">
          {profile.full_name || "NOIR"}
        </a>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-neutral-500">
          <a href="#about" className="hover:text-white transition-colors">01. Identity</a>
          {skills?.length > 0 && <a href="#skills" className="hover:text-white transition-colors">02. Stack</a>}
          {projects?.length > 0 && <a href="#projects" className="hover:text-white transition-colors">03. Archive</a>}
          {experiences?.length > 0 && <a href="#experience" className="hover:text-white transition-colors">04. History</a>}
          <a href="#contact" className="hover:text-white transition-colors">05. Connect</a>
        </div>

        <div className="flex items-center gap-3">
          <a href={cvDownloadUrl} target="_blank" rel="noreferrer">
            <button
              type="button"
              className="h-8 px-3 rounded-full border border-neutral-800 hover:border-neutral-500 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          </a>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-16 sm:py-28 space-y-32 text-left">
        {/* HERO CINEMATIC BLOCK */}
        <section id="hero" className="space-y-10 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 text-xs font-mono uppercase tracking-widest text-neutral-500">
            <span>VOL. ARCHIVE // 2026</span>
            {profile.open_to_work && (
              <span className="text-white border border-neutral-700 px-2 py-0.5 rounded">
                AVAILABLE FOR ASSIGNMENTS
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              {/* Massive Name with Outlined / Filled interplay */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-heading font-black tracking-tighter uppercase leading-[0.95]">
                <span className="block text-white">{profile.full_name?.split(" ")[0] || "ALEX"}</span>
                <span className="block text-transparent [-webkit-text-stroke:1.5px_#A3A3A3] hover:text-white transition-colors">
                  {profile.full_name?.split(" ").slice(1).join(" ") || "VANCE"}
                </span>
              </h1>

              <p className="text-lg sm:text-xl font-mono text-neutral-400 tracking-tight pt-2">
                — {profile.professional_title || "Principal Systems Architect"}
              </p>
            </div>

            {/* Grayscale-to-Color Hover Avatar */}
            <div className="relative group shrink-0">
              <MonogramAvatar
                avatarUrl={profile.avatar_url}
                name={profile.full_name}
                size="xl"
                accentColor={accent}
                className="rounded-2xl grayscale group-hover:grayscale-0 contrast-125 transition-all duration-700 border-2 border-neutral-800 shadow-2xl"
              />
              <span className="absolute -bottom-3 right-0 font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                [PORTRAIT]
              </span>
            </div>
          </div>

          {profile.short_bio && (
            <p className="text-base sm:text-lg text-neutral-400 max-w-2xl font-light leading-relaxed pt-2">
              &ldquo;{profile.short_bio}&rdquo;
            </p>
          )}

          {/* Social Links Bar */}
          {social_links && social_links.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-900 text-xs font-mono uppercase tracking-widest">
              {social_links.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          )}
        </section>

        {/* 01. IDENTITY & PHILOSOPHY */}
        {profile.about_me && (
          <section id="about" className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              01 // PHILOSOPHY &amp; NARRATIVE
            </span>

            <div className="border-l-2 border-neutral-800 pl-6 sm:pl-10 space-y-4">
              <p className="text-base sm:text-xl font-light text-neutral-200 leading-relaxed whitespace-pre-line">
                {profile.about_me}
              </p>
              {profile.location && (
                <span className="text-xs font-mono text-neutral-500 block pt-2">
                  Operating out of: {profile.location}
                </span>
              )}
            </div>
          </section>
        )}

        {/* 02. INFINITE SKILLS MARQUEE */}
        {skills && skills.length > 0 && (
          <section id="skills" className="space-y-6 overflow-hidden">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              02 // CORE CAPABILITIES
            </span>

            {/* Row 1 Marquee */}
            <div className="relative w-full overflow-hidden whitespace-nowrap py-2 border-y border-neutral-900">
              <div className="inline-flex gap-4 animate-marquee font-mono text-sm uppercase tracking-wider text-neutral-300">
                {skills.map((s) => (
                  <span key={s.id} className="px-3 py-1 rounded bg-neutral-900 border border-neutral-800">
                    {s.name}
                  </span>
                ))}
                {skills.map((s) => (
                  <span key={`dup-${s.id}`} className="px-3 py-1 rounded bg-neutral-900 border border-neutral-800">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 03. ARCHIVE / PROJECTS GALLERY */}
        {projects && projects.length > 0 && (
          <section id="projects" className="space-y-8">
            <div className="flex justify-between items-baseline border-b border-neutral-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                03 // SELECTED ARTIFACTS
              </span>
              <span className="text-xs font-mono text-neutral-500">
                TOTAL ({projects.length})
              </span>
            </div>

            <div className="space-y-8">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="p-8 rounded-3xl bg-neutral-950 border border-neutral-800 hover:border-neutral-600 transition-all group space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-neutral-500">
                        [{String(idx + 1).padStart(2, "0")}]
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-heading font-black uppercase text-white group-hover:text-neutral-300 transition-colors">
                        {proj.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {proj.live_url && (
                        <a
                          href={proj.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1"
                        >
                          View Artifact <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <ProjectCover imageUrl={proj.image_url} title={proj.title} />

                  <p className="text-sm text-neutral-400 leading-relaxed max-w-3xl">
                    {proj.description}
                  </p>

                  {proj.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-900">
                      {proj.tech_stack.map((t) => (
                        <span key={t} className="text-xs font-mono text-neutral-500">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 04. EXPANDABLE EXPERIENCE ROWS */}
        {experiences && experiences.length > 0 && (
          <section id="experience" className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              04 // CHRONOLOGY &amp; ROLES
            </span>

            <div className="divide-y divide-neutral-900 border-y border-neutral-900">
              {experiences.map((exp) => {
                const isExpanded = expandedExpId === exp.id;
                return (
                  <div
                    key={exp.id}
                    onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
                    className="py-6 cursor-pointer group transition-colors hover:bg-neutral-900/30 px-2 rounded-xl"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2">
                      <div className="space-y-0.5">
                        <h4 className="text-lg font-bold font-heading uppercase text-white group-hover:text-neutral-300 transition-colors">
                          {exp.role}
                        </h4>
                        <span className="text-xs font-mono text-neutral-400 uppercase">
                          {exp.company} {exp.location && `// ${exp.location}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-neutral-500">
                          {exp.start_date} — {exp.is_current ? "PRESENT" : exp.end_date}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {isExpanded && exp.description && (
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pt-4 max-w-3xl animate-in fade-in duration-300">
                        {exp.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 05. MASSIVE CONTACT HEADLINE & WORKING FORM */}
        <section id="contact" className="space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              05 // TRANSMISSION
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black uppercase text-white tracking-tight leading-[0.95]">
              Let&apos;s build <br />
              <span className="text-neutral-500">the definitive.</span>
            </h2>
            {profile.show_email && profile.email_public && (
              <a
                href={`mailto:${profile.email_public}`}
                className="inline-flex items-center gap-2 font-mono text-base sm:text-lg text-neutral-300 hover:text-white underline underline-offset-8 transition-colors pt-2"
              >
                <Mail className="w-4 h-4" />
                <span>{profile.email_public}</span>
              </a>
            )}
          </div>

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
