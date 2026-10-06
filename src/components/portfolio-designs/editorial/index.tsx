"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  FileDown,
  Quote,
  Mail,
  MapPin,
  Calendar,
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

export interface EditorialPortfolioProps {
  data: PortfolioPayload;
  accent?: string;
  themeMode?: "light" | "dark" | "system";
  font?: string;
  mode?: "live" | "preview" | "editor";
  isOwner?: boolean;
}

export function EditorialPortfolio({
  data,
  accent = data.profile.accent_color || "#D97706",
  themeMode = data.profile.theme_mode || "dark",
  font = data.profile.font_style || "inter",
  mode = "live",
  isOwner = false,
}: EditorialPortfolioProps) {
  const { profile, skills, experiences, education, projects, social_links, testimonials } = data;
  const rtl = isRTL(profile.full_name) || isRTL(profile.about_me);
  const contrastText = getContrastTextColor(accent);
  const isDark = themeMode !== "light";

  const cvDownloadUrl = `/api/cv/${profile.username || "alex-vance"}`;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`min-h-screen w-full relative transition-colors duration-300 selection:bg-amber-500/25 ${
        isDark ? "bg-[#11100D] text-[#ECE7DE]" : "bg-[#FAF7F2] text-[#1E1B16]"
      }`}
    >
      {/* Editorial Header / Masthead */}
      <header className="border-b border-amber-900/20 max-w-5xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between text-xs font-serif uppercase tracking-widest text-amber-900/60 dark:text-amber-200/50">
        <div>FolioNova Gazette // Vol. 01</div>
        <div className="font-sans font-mono text-[11px]">{new Date().getFullYear()} Edition</div>
        <a href={cvDownloadUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 font-sans">
          <FileDown className="w-3.5 h-3.5" />
          <span>Curriculum Vitae</span>
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-28 text-left">
        {/* MASTHEAD HERO TITLE */}
        <section className="space-y-10 border-b border-amber-900/20 pb-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-sans">
                SELECTED ANTHOLOGY OF WORKS
              </span>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-normal italic tracking-tight text-amber-950 dark:text-white leading-[0.95]">
                {profile.full_name || "Alex Vance"}
              </h1>

              <p className="text-lg sm:text-2xl font-serif text-amber-900/80 dark:text-amber-200/70 font-light italic">
                {profile.professional_title || "Principal Systems Architect"}
              </p>
            </div>

            {/* Tall Arched Portrait Frame */}
            <div className="relative shrink-0">
              <MonogramAvatar
                avatarUrl={profile.avatar_url}
                name={profile.full_name}
                size="xl"
                accentColor={accent}
                className="rounded-t-[80px] rounded-b-2xl border-2 border-amber-900/30 shadow-2xl"
              />
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-600/70 block pt-2 text-center font-sans">
                Fig. 01 — Portrait
              </span>
            </div>
          </div>

          {/* Editorial Pull Quote */}
          {profile.short_bio && (
            <div className="p-8 sm:p-10 rounded-2xl bg-amber-900/[0.04] dark:bg-amber-500/[0.03] border-l-4 border-amber-600 dark:border-amber-400 font-serif italic text-xl sm:text-2xl text-amber-950 dark:text-amber-100/90 leading-relaxed max-w-3xl">
              &ldquo;{profile.short_bio}&rdquo;
            </div>
          )}

          {/* Social Links Editorial Row */}
          {social_links && social_links.length > 0 && (
            <div className="flex flex-wrap gap-8 font-sans text-xs uppercase tracking-widest text-amber-900/70 dark:text-amber-300/60 pt-2">
              {social_links.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline hover:text-amber-950 dark:hover:text-white transition-colors"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          )}
        </section>

        {/* 01. NARRATIVE ESSAY / ABOUT */}
        {profile.about_me && (
          <section className="space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-sans">
              I. ESSAY ON CRAFT &amp; PRACTICE
            </span>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-base sm:text-lg leading-relaxed font-serif font-light text-amber-950/90 dark:text-amber-100/80">
              <div className="md:col-span-8 whitespace-pre-line">
                {profile.about_me}
              </div>

              <div className="md:col-span-4 space-y-4 font-sans text-xs border-l border-amber-900/20 pl-6 text-amber-900/70 dark:text-amber-300/60">
                {profile.location && (
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-amber-900 dark:text-amber-200">
                      Coordinates
                    </span>
                    <span className="text-amber-950/80 dark:text-amber-100/70">{profile.location}</span>
                  </div>
                )}
                {profile.years_of_experience > 0 && (
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-amber-900 dark:text-amber-200">
                      Tenure
                    </span>
                    <span className="text-amber-950/80 dark:text-amber-100/70">{profile.years_of_experience} Years in Discipline</span>
                  </div>
                )}
                {profile.open_to_work && (
                  <div className="p-3 rounded-xl bg-amber-600/10 border border-amber-600/30 text-amber-700 dark:text-amber-300 font-semibold">
                    Accepting Select Commissions
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 02. CORE COMPETENCIES / SKILLS */}
        {skills && skills.length > 0 && (
          <section className="space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-sans">
              II. TAXONOMY OF SKILLS
            </span>

            <div className="flex flex-wrap gap-2.5 font-sans">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="px-3.5 py-1.5 rounded-full text-xs font-serif bg-amber-900/[0.06] dark:bg-amber-400/[0.08] border border-amber-900/20 dark:border-amber-400/20 text-amber-950 dark:text-amber-200"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 03. MONOGRAPH / FEATURED PROJECTS */}
        {projects && projects.length > 0 && (
          <section className="space-y-12">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-sans">
              III. SELECTED MONOGRAPHS
            </span>

            <div className="space-y-16">
              {projects.map((proj, idx) => (
                <div key={proj.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-amber-900/15 pb-12">
                  <div className="md:col-span-5 space-y-4">
                    <span className="font-serif italic text-3xl sm:text-4xl text-amber-600/40 dark:text-amber-400/30 block">
                      No. 0{idx + 1}
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-serif font-normal italic text-amber-950 dark:text-white">
                      {proj.title}
                    </h3>

                    <p className="text-sm font-serif font-light text-amber-950/80 dark:text-amber-100/70 leading-relaxed">
                      {proj.description}
                    </p>

                    {proj.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 font-sans pt-2">
                        {proj.tech_stack.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-900/10 dark:bg-white/5 text-amber-900/80 dark:text-amber-200/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:underline pt-2"
                      >
                        <span>Inspect Publication</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="md:col-span-7">
                    <ProjectCover imageUrl={proj.image_url} title={proj.title} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 04. TABLE-OF-CONTENTS EXPERIENCE */}
        {experiences && experiences.length > 0 && (
          <section className="space-y-8">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-sans">
              IV. CHRONOLOGICAL APPOINTMENTS
            </span>

            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-6 border-b border-amber-900/10">
                  <div className="md:col-span-4 font-sans text-xs uppercase tracking-wider text-amber-900/60 dark:text-amber-400/60 font-mono">
                    {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                  </div>

                  <div className="md:col-span-8 space-y-1">
                    <h4 className="text-xl font-serif font-normal italic text-amber-950 dark:text-white">
                      {exp.role} · <span className="font-sans text-sm font-semibold not-italic">{exp.company}</span>
                    </h4>
                    {exp.description && (
                      <p className="text-xs sm:text-sm font-serif font-light text-amber-950/80 dark:text-amber-100/70 leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 05. TESTIMONIAL CITATIONS */}
        {testimonials && testimonials.length > 0 && (
          <section className="space-y-8">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-sans">
              V. TESTIMONIAL CITATIONS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="p-8 rounded-2xl bg-amber-900/[0.03] border border-amber-900/15 space-y-4">
                  <Quote className="w-6 h-6 text-amber-600/50" />
                  <p className="font-serif italic text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="font-sans text-xs pt-2 border-t border-amber-900/10">
                    <div className="font-bold text-amber-950 dark:text-white">{t.author}</div>
                    <div className="text-amber-900/60 dark:text-amber-300/60">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 06. CORRESPONDENCE / CONTACT */}
        <section id="contact" className="space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-sans">
              VI. CORRESPONDENCE
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif font-normal italic text-amber-950 dark:text-white">
              Open to intellectual dialogue &amp; commissions.
            </h2>
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
