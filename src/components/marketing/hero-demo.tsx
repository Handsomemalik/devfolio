"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Monitor, ExternalLink, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DEMO_CYCLES = [
  {
    name: "Alex Vance",
    title: "Principal Creative Technologist",
    bio: "Engineering fluid motion and procedural systems at the frontier of digital craft.",
    accent: "#6366F1",
    design: "Aurora Glass",
    skills: ["Next.js", "TypeScript", "Three.js", "GSAP"],
    views: "1,240",
  },
  {
    name: "Elena Rostova",
    title: "Lead Design Systems Architect",
    bio: "Unifying tokens, typography, and micro-interactions for global product suites.",
    accent: "#22D3EE",
    design: "Kinetic Flow",
    skills: ["Figma", "Tailwind", "Radix UI", "Tokens"],
    views: "2,890",
  },
  {
    name: "Marcus Thorne",
    title: "VP of Product Engineering",
    bio: "Scaling distributed cloud infrastructure and leading high-velocity engineering squads.",
    accent: "#8B5CF6",
    design: "Obsidian Noir",
    skills: ["Rust", "PostgreSQL", "Supabase", "K8s"],
    views: "4,120",
  },
];

export function HeroProductDemo() {
  const [cycleIndex, setCycleIndex] = React.useState(0);
  const current = DEMO_CYCLES[cycleIndex];

  // Typing simulation state
  const [typedName, setTypedName] = React.useState("");
  const [typedTitle, setTypedTitle] = React.useState("");

  React.useEffect(() => {
    let nameIdx = 0;
    let titleIdx = 0;

    const targetName = current.name;
    const targetTitle = current.title;

    const resetTimer = setTimeout(() => {
      setTypedName("");
      setTypedTitle("");
    }, 0);

    const interval = setInterval(() => {
      if (nameIdx < targetName.length) {
        nameIdx++;
        setTypedName(targetName.slice(0, nameIdx));
      } else if (titleIdx < targetTitle.length) {
        titleIdx++;
        setTypedTitle(targetTitle.slice(0, titleIdx));
      }
    }, 45);

    const switchTimeout = setTimeout(() => {
      setCycleIndex((prev) => (prev + 1) % DEMO_CYCLES.length);
    }, 6500);

    return () => {
      clearTimeout(resetTimer);
      clearInterval(interval);
      clearTimeout(switchTimeout);
    };
  }, [cycleIndex, current.name, current.title]);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl p-3 sm:p-5 glass-panel border border-[var(--border-strong)] shadow-[0_20px_70px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Top OS Window Bar */}
      <div className="flex items-center justify-between pb-3 px-2 border-b border-[var(--border-subtle)] text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          <span className="ml-2 text-[11px] text-slate-400 hidden sm:inline">
            FolioNova Studio — Split Live Sync
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Reactive State: &lt;16ms</span>
          </span>
          <Badge size="sm" variant="glow">
            {current.design}
          </Badge>
        </div>
      </div>

      {/* Split Window Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 text-left">
        {/* LEFT: Editor Panel Simulation */}
        <div className="md:col-span-5 rounded-2xl bg-slate-950/60 dark:bg-white/[0.02] border border-[var(--border-subtle)] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-mono tracking-wider text-slate-400">
              Live Input Field
            </span>
            <span className="text-[10px] text-indigo-400 font-mono">Autosaving...</span>
          </div>

          {/* Simulated Input: Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-slate-400">
              Full Name
            </label>
            <div className="h-10 px-3 rounded-xl bg-black/40 border border-indigo-500/30 flex items-center text-sm font-medium text-white shadow-inner">
              <span>{typedName}</span>
              <span className="w-1.5 h-4 ml-0.5 bg-indigo-500 animate-pulse" />
            </div>
          </div>

          {/* Simulated Input: Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase text-slate-400">
              Professional Title
            </label>
            <div className="h-10 px-3 rounded-xl bg-black/40 border border-white/10 flex items-center text-xs text-indigo-300 font-medium">
              <span>{typedTitle}</span>
              {typedName.length === current.name.length && (
                <span className="w-1.5 h-4 ml-0.5 bg-indigo-400 animate-pulse" />
              )}
            </div>
          </div>

          {/* Simulated Color Swatches */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="uppercase font-semibold">Active Accent</span>
              <span className="font-mono">{current.accent}</span>
            </div>
            <div className="flex gap-2">
              {["#6366F1", "#22D3EE", "#8B5CF6", "#10B981"].map((hex) => (
                <div
                  key={hex}
                  style={{ backgroundColor: hex }}
                  className={`w-6 h-6 rounded-lg transition-transform ${
                    current.accent === hex
                      ? "ring-2 ring-white scale-110 shadow-lg"
                      : "opacity-60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Skills Chips Preview */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block">
              Stack Chips
            </span>
            <div className="flex flex-wrap gap-1.5">
              {current.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.06] text-slate-300 border border-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Live Portfolio Card Simulation */}
        <div className="md:col-span-7 rounded-2xl bg-slate-950 border border-[var(--border-strong)] p-5 sm:p-6 space-y-5 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-30 transition-colors duration-700"
            style={{ backgroundColor: current.accent }}
          />

          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-400">
                folionova.io/u/{typedName.toLowerCase().replace(/\s+/g, "-") || "creator"}
              </span>
            </div>
            <Badge variant="success" size="sm" dot>
              LIVE
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Glowing Avatar */}
              <div
                className="w-16 h-16 rounded-full p-1 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${current.accent}, transparent)`,
                  boxShadow: `0 0 25px ${current.accent}50`,
                }}
              >
                <div className="w-full h-full rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-lg text-white">
                  {typedName ? typedName.charAt(0) : "F"}
                </div>
              </div>

              <div>
                <motion.h3
                  key={typedName}
                  className="text-xl sm:text-2xl font-heading font-black text-white"
                >
                  {typedName || "Your Name"}
                </motion.h3>
                <p
                  className="text-xs sm:text-sm font-semibold transition-colors duration-500"
                  style={{ color: current.accent }}
                >
                  {typedTitle || "Your Professional Title"}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              {current.bio}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {current.skills.map((s, idx) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  style={{ borderColor: `${current.accent}40` }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] text-white border"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Footer Metrics */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Verified Portfolio // 1-Click PDF Ready</span>
            <span className="font-mono text-emerald-400">{current.views} Views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
