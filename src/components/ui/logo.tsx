import * as React from "react";
import Link from "next/link";
import { BRAND_NAME } from "@/config/brand";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  asLink?: boolean;
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
  asLink = true,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, font: "text-lg" },
    md: { icon: 32, font: "text-xl" },
    lg: { icon: 40, font: "text-2xl" },
    xl: { icon: 52, font: "text-3xl" },
  };

  const { icon: iconSize, font: fontSize } = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Geometric 'F' Monogram in liquid chrome & cosmic core */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-white/20 dark:bg-white/[0.08] p-1 border border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105 backdrop-blur-md"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="fn-grad-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#1a1a1c" />
              <stop offset="70%" stopColor="#8a8d93" />
              <stop offset="100%" stopColor="#1a1a1c" />
            </linearGradient>
            <linearGradient id="fn-grad-cosmic-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e4572e" />
              <stop offset="100%" stopColor="#1b2a6b" />
            </linearGradient>
          </defs>

          {/* Stem & Top Bar */}
          <path
            d="M8 7C8 5.89543 8.89543 5 10 5H27C27.5523 5 28 5.44772 28 6V11C28 11.5523 27.5523 12 27 12H16V16H23C23.5523 16 24 16.4477 24 17V21C24 21.5523 23.5523 22 23 22H16V30C16 30.5523 15.5523 31 15 31H9C8.44772 31 8 30.5523 8 30V7Z"
            fill="url(#fn-grad-chrome)"
          />

          {/* Dynamic Cosmic Flare */}
          <circle cx="25" cy="18.5" r="3.5" fill="url(#fn-grad-cosmic-glow)" />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-heading tracking-tight ${fontSize} text-[var(--text-primary)] uppercase font-bold`}
        >
          <span>Folio</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e4572e] via-[#1a1a1c] to-[#1b2a6b] dark:from-[#e4572e] dark:via-white dark:to-[#38bdf8]">
            Nova
          </span>
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
