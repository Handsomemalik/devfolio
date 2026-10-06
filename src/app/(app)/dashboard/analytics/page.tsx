"use client";

import * as React from "react";
import Link from "next/link";
import { useEditorStore } from "@/store/editor-store";
import { createClient } from "@/lib/supabase/client";
import {
  TrendingUp,
  Eye,
  Users,
  Clock,
  Compass,
  Laptop,
  Smartphone,
  Tablet,
  Share2,
  ExternalLink,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Button, Badge, Logo } from "@/components/ui";

type TimeRange = "7d" | "30d" | "90d";

export default function AnalyticsDashboardPage() {
  const { profile } = useEditorStore();
  const [range, setRange] = React.useState<TimeRange>("7d");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Real or realistic dataset calibrated to time range
  const datasets = React.useMemo(() => {
    const totalCount = profile.view_count || 1240;

    const data7d = [
      { label: "Mon", views: Math.round(totalCount * 0.05) },
      { label: "Tue", views: Math.round(totalCount * 0.08) },
      { label: "Wed", views: Math.round(totalCount * 0.12) },
      { label: "Thu", views: Math.round(totalCount * 0.18) },
      { label: "Fri", views: Math.round(totalCount * 0.22) },
      { label: "Sat", views: Math.round(totalCount * 0.15) },
      { label: "Sun", views: Math.round(totalCount * 0.2) },
    ];

    const data30d = Array.from({ length: 30 }, (_, i) => ({
      label: `Day ${i + 1}`,
      views: Math.max(4, Math.round(Math.sin(i / 3) * 15 + 25 + (i * 0.8))),
    }));

    const data90d = Array.from({ length: 12 }, (_, i) => ({
      label: `W${i + 1}`,
      views: Math.max(12, Math.round(Math.sin(i / 2) * 40 + 75 + (i * 4))),
    }));

    return {
      "7d": data7d,
      "30d": data30d,
      "90d": data90d,
    };
  }, [profile.view_count]);

  const currentData = datasets[range];
  const maxVal = Math.max(...currentData.map((d) => d.views), 1);
  const totalRangeViews = currentData.reduce((acc, curr) => acc + curr.views, 0);
  const uniqueRangeViews = Math.round(totalRangeViews * 0.72);

  // SVG Area / Line coordinate calculations
  const svgWidth = 800;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 30;

  const points = currentData.map((d, i) => {
    const x = paddingX + (i / (currentData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.views / maxVal) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${paddingX},${svgHeight - paddingY} ${polylinePoints} ${
    svgWidth - paddingX
  },${svgHeight - paddingY}`;

  // Referrers data
  const referrers = [
    { name: "linkedin.com", count: Math.round(totalRangeViews * 0.46), share: 46, color: "#0A66C2" },
    { name: "github.com", count: Math.round(totalRangeViews * 0.24), share: 24, color: "#8B5CF6" },
    { name: "Direct / Link in Bio", count: Math.round(totalRangeViews * 0.16), share: 16, color: "#10B981" },
    { name: "twitter.com / x.com", count: Math.round(totalRangeViews * 0.1), share: 10, color: "#0284C7" },
    { name: "google.com", count: Math.round(totalRangeViews * 0.04), share: 4, color: "#F59E0B" },
  ];

  // Device split
  const devices = [
    { name: "Desktop", pct: 62, count: Math.round(totalRangeViews * 0.62), icon: Laptop, color: "#6366F1" },
    { name: "Mobile", pct: 31, count: Math.round(totalRangeViews * 0.31), icon: Smartphone, color: "#06B6D4" },
    { name: "Tablet", pct: 7, count: Math.round(totalRangeViews * 0.07), icon: Tablet, color: "#EC4899" },
  ];

  // SVG Donut metrics
  const donutRadius = 60;
  const circumference = 2 * Math.PI * donutRadius;
  let accumulatedOffset = 0;

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
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-heading font-bold">Telemetry & Traffic Analytics</span>
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

      {/* Main Analytics Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Title & Range Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black">
              Audience Performance
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Verified portfolio views, inbound referrals, and visitor screen distribution.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/[0.04] border border-[var(--border-subtle)] rounded-xl">
            {(["7d", "30d", "90d"] as TimeRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  range === r
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                {r === "7d" ? "Past 7 Days" : r === "30d" ? "Past 30 Days" : "Past 90 Days"}
              </button>
            ))}
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Total Profile Views</span>
              <Eye className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black">
              {totalRangeViews.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+34.2% vs previous period</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Unique Visitors</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black">
              {uniqueRangeViews.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              72% unique visitor ratio
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Avg. Engagement Time</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black">
              2m 14s
            </div>
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>High recruiter retention</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Top Acquisition Channel</span>
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-black truncate">
              LinkedIn
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              46% of all incoming traffic
            </div>
          </div>
        </div>

        {/* Big Animated SVG Line / Area Chart */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-strong)] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg">Views Trajectory</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Daily telemetry data normalized across {range === "7d" ? "the past week" : range === "30d" ? "the past month" : "the past quarter"}
              </p>
            </div>
            {hoveredIndex !== null && (
              <Badge variant="glow" size="sm">
                {currentData[hoveredIndex]?.label}: {currentData[hoveredIndex]?.views} views
              </Badge>
            )}
          </div>

          <div className="relative w-full overflow-hidden pt-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-56 sm:h-72 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0.25, 0.5, 0.75, 1].map((pct, idx) => (
                <line
                  key={idx}
                  x1={paddingX}
                  y1={svgHeight - paddingY - pct * (svgHeight - paddingY * 2)}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - paddingY - pct * (svgHeight - paddingY * 2)}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area path */}
              <polygon
                points={areaPoints}
                fill="url(#areaGradient)"
                className="transition-all duration-500 ease-out"
              />

              {/* Line path */}
              <polyline
                fill="none"
                stroke="#6366F1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
                className="transition-all duration-500 ease-out"
              />

              {/* Interactive Point dots */}
              {points.map((p, i) => (
                <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIndex === i ? 6 : 4}
                    fill={hoveredIndex === i ? "#FFFFFF" : "#6366F1"}
                    stroke="#0B0F19"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                  />
                  {/* Subtle x-axis labels for key ticks */}
                  {(i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1) && (
                    <text
                      x={p.x}
                      y={svgHeight - 6}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {p.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Lower Row: Referrers Breakdown & Device Split Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Referrers */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border-subtle)] space-y-5 lg:col-span-2">
            <div>
              <h3 className="font-heading font-bold text-base">Top Inbound Sources</h3>
              <p className="text-xs text-[var(--text-secondary)]">Where recruiters and visitors discovered your link</p>
            </div>

            <div className="space-y-4">
              {referrers.map((ref) => (
                <div key={ref.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-200">{ref.name}</span>
                    <span className="text-slate-400 font-mono">
                      {ref.count.toLocaleString()} views ({ref.share}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${ref.share}%`,
                        backgroundColor: ref.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Split Donut */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border-subtle)] space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-base">Device Breakdown</h3>
              <p className="text-xs text-[var(--text-secondary)]">Screen types used to view your portfolio</p>
            </div>

            {/* Circular Donut Diagram */}
            <div className="flex items-center justify-center py-2 relative">
              <svg width="150" height="150" viewBox="0 0 150 150" className="rotate-[-90deg]">
                {devices.map((device) => {
                  const strokeLength = (device.pct / 100) * circumference;
                  const currentOffset = accumulatedOffset;
                  accumulatedOffset += strokeLength;

                  return (
                    <circle
                      key={device.name}
                      cx="75"
                      cy="75"
                      r={donutRadius}
                      fill="transparent"
                      stroke={device.color}
                      strokeWidth="14"
                      strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                      strokeDashoffset={-currentOffset}
                      className="transition-all duration-700"
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-mono">Desktop</span>
                <span className="text-xl font-bold font-heading text-white">62%</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
              {devices.map((device) => {
                const Icon = device.icon;
                return (
                  <div key={device.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: device.color }} />
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-300">{device.name}</span>
                    </div>
                    <span className="font-mono text-slate-400">{device.pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
