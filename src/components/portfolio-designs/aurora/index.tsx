"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  FileDown,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Badge,
  Button,
} from "@/components/ui";
import { PortfolioPayload } from "@/types/database";
import {
  MonogramAvatar,
  ProjectCover,
  PortfolioContactForm,
  OwnerToolbar,
  BrandedFooterBadge,
} from "../shared";
import { getContrastTextColor, isRTL, getFontFamilyClass } from "@/lib/design-utils";

export interface AuroraPortfolioProps {
  data: PortfolioPayload;
  accent?: string;
  themeMode?: "light" | "dark" | "system";
  font?: string;
  mode?: "live" | "preview" | "editor";
  isOwner?: boolean;
}

export function AuroraPortfolio({
  data,
  accent = data.profile.accent_color || "#6366F1",
  themeMode = data.profile.theme_mode || "dark",
  font = data.profile.font_style || "inter",
  mode = "live",
  isOwner = false,
}: AuroraPortfolioProps) {
  const { profile, skills, experiences, education, projects, social_links } = data;
  const rtl = isRTL(profile.full_name) || isRTL(profile.about_me);
  const contrastText = getContrastTextColor(accent);
  const fontClass = getFontFamilyClass(font);
  const isDark = themeMode !== "light";

  const cvDownloadUrl = `/api/cv/${profile.username || "alex-vance"}`;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`min-h-screen w-full relative transition-colors duration-300 selection:bg-indigo-500/20 ${fontClass} ${
        isDark ? "bg-[#090D16] text-[#F3F4F6]" : "bg-[#F8FAFC] text-[#0F172A]"
      }`}
    >
      {/* Aurora Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[500px] rounded-full blur-[140px] opacity-25 ${
            mode === "preview" ? "" : "animate-pulse"
          }`}
          style={{ backgroundColor: accent }}
        />
        <div
          className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15"
          style={{ backgroundColor: accent }}
        />
      </div>

      {/* Floating Header Navigation */}
      <nav
        className={`sticky top-4 z-40 max-w-4xl mx-auto px-4 sm:px-6 h-14 rounded-full border backdrop-blur-xl flex items-center justify-between shadow-lg transition-all ${
          isDark
            ? "bg-slate-950/70 border-white/10 text-white"
            : "bg-white/80 border-slate-200/80 text-slate-800"
        }`}
      >
        <a href="#hero" className="font-heading font-black text-sm tracking-tight">
          {profile.full_name || "Portfolio"}
        </a>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <a href="#about" className="hover:text-white transition-colors">01 / About</a>
          {skills?.length > 0 && <a href="#skills" className="hover:text-white transition-colors">02 / Skills</a>}
          {experiences?.length > 0 && <a href="#experience" className="hover:text-white transition-colors">03 / Experience</a>}
          {projects?.length > 0 && <a href="#projects" className="hover:text-white transition-colors">04 / Projects</a>}
          <a href="#contact" className="hover:text-white transition-colors">05 / Contact</a>
        </div>

        <div className="flex items-center gap-2">
          <a href={cvDownloadUrl} target="_blank" rel="noreferrer">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CV</span>
            </Button>
          </a>
          <a href="#contact">
            <button
              type="button"
              style={{ backgroundColor: accent, color: contrastText }}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              Contact
            </button>
          </a>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-24">
        {/* HERO SECTION */}
        <section id="hero" className="space-y-8 text-left pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-400">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accent }} />
            <span>HELLO, I&apos;M</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="space-y-3 flex-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-[-0.03em] leading-[1.05]">
                {profile.full_name || "Alex Vance"}
              </h1>

              <div className="relative inline-block">
                <span
                  className="text-xl sm:text-2xl font-bold tracking-tight block"
                  style={{ color: accent }}
                >
                  {profile.professional_title || "Principal Creative Technologist"}
                </span>
                <span
                  className="block h-1 w-full rounded-full opacity-60 mt-1"
                  style={{ backgroundColor: accent }}
                />
              </div>

              {profile.short_bio && (
                <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed pt-2">
                  {profile.short_bio}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a href="#contact">
                  <button
                    type="button"
                    style={{ backgroundColor: accent, color: contrastText }}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Get In Touch</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </a>

                <a href={cvDownloadUrl} target="_blank" rel="noreferrer">
                  <Button size="md" variant="secondary" className="text-xs gap-1.5">
                    <FileDown className="w-4 h-4" />
                    <span>Download CV</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Avatar with Rotating Glow Ring */}
            <div className="relative group shrink-0">
              <div
                className={`absolute -inset-1 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity ${
                  mode === "preview" ? "" : "animate-spin"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${accent}, #A855F7, #06B6D4)`,
                  animationDuration: "12s",
                }}
              />
              <MonogramAvatar
                avatarUrl={profile.avatar_url}
                name={profile.full_name}
                size="xl"
                accentColor={accent}
                className="relative z-10 border-4 border-slate-900 shadow-2xl"
              />
              {profile.open_to_work && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-md">
                  OPEN TO WORK
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 01 / ABOUT ME */}
        {(profile.about_me || profile.location || profile.years_of_experience > 0) && (
          <section id="about" className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
                01 / ABOUT
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div
              className={`p-6 sm:p-8 rounded-3xl border ${
                isDark ? "glass-panel border-white/10" : "bg-white border-slate-200 shadow-xl"
              } space-y-6`}
            >
              {profile.about_me && (
                <p className="text-sm sm:text-base leading-relaxed text-slate-300 whitespace-pre-line">
                  {profile.about_me}
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                {profile.location && (
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Location</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {profile.location}
                    </span>
                  </div>
                )}
                {profile.years_of_experience > 0 && (
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Experience</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      {profile.years_of_experience} Years In Industry
                    </span>
                  </div>
                )}
                {profile.languages?.length > 0 && (
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Languages</span>
                    <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                      {profile.languages.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 02 / SKILLS */}
        {skills && skills.length > 0 && (
          <section id="skills" className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
                02 / CORE SKILLS &amp; STACK
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className={`px-4 py-2 rounded-2xl border text-xs font-semibold backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    isDark
                      ? "bg-white/[0.04] border-white/10 text-white hover:border-indigo-400/40"
                      : "bg-white border-slate-200 text-slate-800 shadow-xs hover:border-indigo-500"
                  }`}
                >
                  <span className="mr-1.5 opacity-60 font-mono text-[10px]">#</span>
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 03 / WORK EXPERIENCE */}
        {experiences && experiences.length > 0 && (
          <section id="experience" className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
                03 / WORK TRAJECTORY
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-500/30 space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Node */}
                  <span
                    className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 bg-indigo-500 group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: accent }}
                  />

                  <div
                    className={`p-6 rounded-3xl border transition-all ${
                      isDark ? "glass-panel border-white/10 hover:border-white/20" : "bg-white border-slate-200 shadow-md"
                    } space-y-2`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h3 className="text-base font-bold font-heading text-white">{exp.role}</h3>
                        <span className="text-xs font-semibold" style={{ color: accent }}>
                          {exp.company}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 04 / FEATURED PROJECTS */}
        {projects && projects.length > 0 && (
          <section id="projects" className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
                04 / SELECTED WORKS
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    isDark ? "glass-panel border-white/10 hover:border-indigo-500/40" : "bg-white border-slate-200 shadow-xl"
                  }`}
                >
                  <ProjectCover imageUrl={proj.image_url} title={proj.title} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-heading font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {proj.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {proj.live_url && (
                          <a
                            href={proj.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-white transition-colors"
                            title="Live Demo"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                        {proj.repo_url && (
                          <a
                            href={proj.repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-white transition-colors"
                            title="Source Code"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  {proj.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {proj.tech_stack.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-slate-300"
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

        {/* 05 / EDUCATION */}
        {education && education.length > 0 && (
          <section id="education" className="space-y-6 text-left">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
                05 / EDUCATION &amp; FOUNDATIONS
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className={`p-6 rounded-3xl border ${
                    isDark ? "glass-panel border-white/10" : "bg-white border-slate-200 shadow-md"
                  } space-y-1`}
                >
                  <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                  <p className="text-xs font-medium" style={{ color: accent }}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                  {edu.start_year && (
                    <span className="text-[11px] font-mono text-slate-400 block pt-1">
                      {edu.start_year} {edu.end_year ? `— ${edu.end_year}` : ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 06 / CONTACT SECTION */}
        <section id="contact" className="space-y-6 text-left">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              06 / GET IN TOUCH
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Info Cards (4 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {profile.show_email && profile.email_public && (
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? "glass-panel border-white/10" : "bg-white border-slate-200"
                  } flex items-center gap-3`}
                >
                  <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Email</span>
                    <a href={`mailto:${profile.email_public}`} className="text-xs font-semibold hover:underline truncate">
                      {profile.email_public}
                    </a>
                  </div>
                </div>
              )}

              {profile.show_phone && profile.phone_public && (
                <div
                  className={`p-4 rounded-2xl border ${
                    isDark ? "glass-panel border-white/10" : "bg-white border-slate-200"
                  } flex items-center gap-3`}
                >
                  <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Direct Phone</span>
                    <span className="text-xs font-semibold">{profile.phone_public}</span>
                  </div>
                </div>
              )}

              {/* Social Channels */}
              {social_links && social_links.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {social_links.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-medium hover:bg-white/10 transition-colors"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Working Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <PortfolioContactForm
                username={profile.username}
                accentColor={accent}
                theme={isDark ? "dark" : "light"}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Branded Footer */}
      <BrandedFooterBadge />

      {/* Floating Owner Toolbar */}
      {isOwner && <OwnerToolbar username={profile.username} />}
    </div>
  );
}
