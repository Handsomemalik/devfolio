"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Zap,
  FileDown,
  Mail,
  Flame,
  Layers,
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

export interface KineticPortfolioProps {
  data: PortfolioPayload;
  accent?: string;
  themeMode?: "light" | "dark" | "system";
  font?: string;
  mode?: "live" | "preview" | "editor";
  isOwner?: boolean;
}

export function KineticPortfolio({
  data,
  accent = data.profile.accent_color || "#06B6D4",
  themeMode = data.profile.theme_mode || "dark",
  font = data.profile.font_style || "sora",
  mode = "live",
  isOwner = false,
}: KineticPortfolioProps) {
  const { profile, skills, experiences, education, projects, social_links } = data;
  const rtl = isRTL(profile.full_name) || isRTL(profile.about_me);
  const contrastText = getContrastTextColor(accent);
  const fontClass = getFontFamilyClass(font);
  const isDark = themeMode !== "light";

  const cvDownloadUrl = `/api/cv/${profile.username || "alex-vance"}`;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`min-h-screen w-full relative transition-colors duration-300 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-300 ${fontClass} ${
        isDark ? "bg-[#050811] text-[#F0F6FC]" : "bg-[#F0F4F8] text-[#0A101D]"
      }`}
    >
      {/* Dynamic Top Bar */}
      <nav className="sticky top-0 z-40 w-full px-6 sm:px-12 h-16 backdrop-blur-xl border-b border-cyan-500/20 bg-slate-950/70 flex items-center justify-between text-xs font-mono">
        <a href="#hero" className="flex items-center gap-2 font-black text-cyan-400">
          <Zap className="w-4 h-4 fill-cyan-400" />
          <span className="tracking-widest uppercase">{profile.full_name || "KINETIC"}</span>
        </a>

        <div className="hidden md:flex items-center gap-8 uppercase font-bold tracking-wider text-slate-400">
          <a href="#about" className="hover:text-cyan-400 transition-colors">01. About</a>
          {skills?.length > 0 && <a href="#skills" className="hover:text-cyan-400 transition-colors">02. Skills</a>}
          {projects?.length > 0 && <a href="#projects" className="hover:text-cyan-400 transition-colors">03. Projects</a>}
          {experiences?.length > 0 && <a href="#experience" className="hover:text-cyan-400 transition-colors">04. Experience</a>}
          <a href="#contact" className="hover:text-cyan-400 transition-colors">05. Contact</a>
        </div>

        <a href={cvDownloadUrl} target="_blank" rel="noreferrer">
          <button
            type="button"
            style={{ backgroundColor: accent, color: contrastText }}
            className="px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            CV PDF
          </button>
        </a>
      </nav>

      {/* Looping Marquee Ribbon */}
      <div
        style={{ backgroundColor: accent, color: contrastText }}
        className="w-full py-2.5 overflow-hidden whitespace-nowrap font-heading font-black text-xs uppercase tracking-widest select-none shadow-md"
      >
        <div className="inline-flex gap-8 animate-marquee">
          <span>● KINETIC FLOW PROTOCOL</span>
          <span>● CRAFTED AT 60FPS</span>
          <span>● ZERO REDUNDANCY</span>
          <span>● INTERACTION DESIGN &amp; CODE</span>
          <span>● KINETIC FLOW PROTOCOL</span>
          <span>● CRAFTED AT 60FPS</span>
          <span>● ZERO REDUNDANCY</span>
          <span>● INTERACTION DESIGN &amp; CODE</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-28 text-left relative z-10">
        {/* HERO KINETIC STACK */}
        <section id="hero" className="space-y-8 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 font-bold">
              ⚡ LIVE PORTFOLIO INSTANCE
            </span>

            {profile.open_to_work && (
              <div
                style={{ backgroundColor: accent, color: contrastText }}
                className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg animate-bounce"
              >
                ★ AVAILABLE FOR WORK
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black tracking-tighter uppercase leading-[0.9]">
              <span className="block text-white hover:skew-x-3 transition-transform">
                {profile.full_name || "ALEX VANCE"}
              </span>
            </h1>

            <div className="pt-2">
              <span
                className="inline-block px-4 py-2 rounded-2xl text-lg sm:text-2xl font-black font-mono tracking-tight uppercase shadow-lg"
                style={{ backgroundColor: accent, color: contrastText }}
              >
                &gt; {profile.professional_title || "Full-Stack Technologist"}
              </span>
            </div>
          </div>

          {profile.short_bio && (
            <p className="text-base sm:text-xl font-medium text-slate-300 max-w-2xl leading-relaxed pt-2">
              {profile.short_bio}
            </p>
          )}

          {/* Avatar and Metric Sticker */}
          <div className="flex items-center gap-6 pt-4">
            <MonogramAvatar
              avatarUrl={profile.avatar_url}
              name={profile.full_name}
              size="lg"
              accentColor={accent}
              className="border-4 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            />

            {profile.years_of_experience > 0 && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border-2 border-cyan-500/30 text-xs font-mono text-cyan-300 space-y-0.5">
                <div className="font-black text-xl text-white font-heading">
                  {profile.years_of_experience}+ YEARS
                </div>
                <div>PRODUCTION TRACK RECORD</div>
              </div>
            )}
          </div>
        </section>

        {/* 01. NARRATIVE BLOCK */}
        {profile.about_me && (
          <section id="about" className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              01 // CORE PHILOSOPHY
            </h2>

            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border-2 border-cyan-500/20 shadow-xl space-y-6">
              <p className="text-base sm:text-lg leading-relaxed text-slate-200 whitespace-pre-line">
                {profile.about_me}
              </p>

              {profile.location && (
                <div className="inline-block px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                  📍 {profile.location}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 02. SKILLS PILE */}
        {skills && skills.length > 0 && (
          <section id="skills" className="space-y-6">
            <div className="flex justify-between items-baseline">
              <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                02 // INTERACTIVE SKILLS PILE
              </h2>
              <span className="text-xs font-mono text-slate-500">({skills.length} TOTAL)</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {skills.map((s, idx) => (
                <div
                  key={s.id}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900/80 border-2 border-cyan-500/20 text-xs sm:text-sm font-black font-mono text-slate-100 hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all shadow-md cursor-grab"
                  style={{
                    transform: `rotate(${((idx % 5) - 2) * 1.5}deg)`,
                  }}
                >
                  ⚡ {s.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 03. STACKED STICKY PROJECT CARDS */}
        {projects && projects.length > 0 && (
          <section id="projects" className="space-y-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              03 // SELECTED SHIPMENTS
            </h2>

            <div className="space-y-8">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="sticky top-20 p-8 sm:p-10 rounded-3xl bg-slate-950 border-2 border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] space-y-6 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-cyan-400">
                        PROJECT #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-2xl sm:text-4xl font-heading font-black text-white group-hover:text-cyan-400 transition-colors">
                        {proj.title}
                      </h3>
                    </div>

                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-black uppercase font-mono shadow-md flex items-center gap-1.5 hover:scale-105 transition-all"
                        style={{ backgroundColor: accent, color: contrastText }}
                      >
                        <span>Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <ProjectCover imageUrl={proj.image_url} title={proj.title} />

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-cyan-500/20">
                      {proj.tech_stack.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 04. EXPERIENCE TIMELINE */}
        {experiences && experiences.length > 0 && (
          <section id="experience" className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              04 // FIELD HISTORY
            </h2>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border-2 border-cyan-500/20 hover:border-cyan-400 hover:bg-slate-900/80 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2">
                    <div>
                      <span className="font-mono text-xs text-cyan-400">0{idx + 1} {"//"}</span>
                      <h4 className="text-xl font-heading font-black text-white">{exp.role}</h4>
                      <p className="text-xs font-bold text-cyan-300 font-mono uppercase">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                      {exp.start_date} — {exp.is_current ? "PRESENT" : exp.end_date}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 05. CONTACT & DISPATCH */}
        <section id="contact" className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              05 // DISPATCH TRANSMISSION
            </h2>
            <h3 className="text-4xl sm:text-6xl font-heading font-black uppercase text-white tracking-tight">
              Let&apos;s build fast.
            </h3>
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
