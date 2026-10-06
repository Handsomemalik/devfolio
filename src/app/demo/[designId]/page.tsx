"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PORTFOLIO_COMPONENTS, PORTFOLIO_DESIGN_LIST, PortfolioDesignKey } from "@/components/portfolio-designs";
import { DEMO_PORTFOLIO_DATA } from "@/config/demo-profile";
import { Button, Logo, Badge } from "@/components/ui";
import { Sparkles, Sun, Moon, ArrowLeft, Check, Compass } from "lucide-react";

const DEMO_ACCENTS = [
  { label: "Indigo", value: "#6366F1" },
  { label: "Emerald", value: "#10B981" },
  { label: "Cyan", value: "#06B6D4" },
  { label: "Rose", value: "#F43F5E" },
  { label: "Amber", value: "#F59E0B" },
  { label: "Violet", value: "#8B5CF6" },
];

export default function DemoPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.designId as string) || "aurora";
  const activeDesignId: PortfolioDesignKey =
    rawId in PORTFOLIO_COMPONENTS ? (rawId as PortfolioDesignKey) : "aurora";

  const [themeMode, setThemeMode] = React.useState<"light" | "dark">("dark");
  const [accent, setAccent] = React.useState<string>(DEMO_PORTFOLIO_DATA.profile.accent_color || "#6366F1");

  const DesignComponent = PORTFOLIO_COMPONENTS[activeDesignId] || PORTFOLIO_COMPONENTS.aurora;

  return (
    <div className="min-h-screen relative bg-[#07090E] text-slate-100">
      {/* Top Interactive Demonstration Controller Dock */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#090D16]/90 border-b border-white/10 px-4 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Back button */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <Logo size="sm" showText={false} asLink={false} />
              <span className="hidden sm:inline font-semibold text-slate-200">Back</span>
            </Link>

            <span className="w-px h-4 bg-white/10 hidden sm:inline" />

            <Badge variant="glow" size="sm" className="hidden sm:inline-flex">
              Live Interactive Demo
            </Badge>
          </div>

          {/* Archetype Switcher Pills */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
            {PORTFOLIO_DESIGN_LIST.map((d) => {
              const isCurrent = d.id === activeDesignId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => router.push(`/demo/${d.id}`)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isCurrent
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{d.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Tools: Accent Swatches, Light/Dark, CTA */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            {/* Accent Color Circles */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/5">
              {DEMO_ACCENTS.map((swatch) => (
                <button
                  key={swatch.value}
                  type="button"
                  onClick={() => setAccent(swatch.value)}
                  className="w-4 h-4 rounded-full transition-transform hover:scale-125 relative flex items-center justify-center"
                  style={{ backgroundColor: swatch.value }}
                  title={swatch.label}
                >
                  {accent.toLowerCase() === swatch.value.toLowerCase() && (
                    <Check className="w-2.5 h-2.5 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setThemeMode((m) => (m === "dark" ? "light" : "dark"))}
              className="p-2 rounded-xl text-xs bg-white/[0.04] border border-white/10 hover:bg-white/10 text-slate-300 transition-colors"
              title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
            >
              {themeMode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Use Template CTA */}
            <Link href="/(auth)/signup">
              <Button size="sm" variant="primary" className="h-8 text-xs gap-1.5 px-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use This Design</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Render Selected Design Component with Sample Profile Data */}
      <main className="relative">
        <DesignComponent
          data={DEMO_PORTFOLIO_DATA}
          accent={accent}
          themeMode={themeMode}
          font={DEMO_PORTFOLIO_DATA.profile.font_style}
          mode="live"
        />
      </main>
    </div>
  );
}
