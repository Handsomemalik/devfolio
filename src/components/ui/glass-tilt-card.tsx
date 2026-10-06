"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tiltIntensity?: number;
  glowColor?: "fiery" | "cosmic" | "silver" | "dual";
}

export function GlassTiltCard({
  children,
  className,
  tiltIntensity = 7,
  glowColor = "dual",
  ...props
}: GlassTiltCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = React.useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normY = (y / rect.height - 0.5) * 2;

    setRotate({
      x: -normY * tiltIntensity,
      y: normX * tiltIntensity,
    });
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const glowGradients = {
    fiery: "radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(228, 87, 46, 0.18), transparent 60%)",
    cosmic: "radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(27, 42, 107, 0.22), transparent 60%)",
    silver: "radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255, 255, 255, 0.25), transparent 60%)",
    dual: "radial-gradient(450px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(228, 87, 46, 0.15), rgba(27, 42, 107, 0.12) 40%, transparent 70%)",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--glow-x": `${glowPos.x}%`,
          "--glow-y": `${glowPos.y}%`,
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-6px)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
          transition: isHovered
            ? "transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease"
            : "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.4s ease",
        } as React.CSSProperties
      }
      className={cn(
        "glass-panel relative overflow-hidden group transition-all duration-300",
        isHovered && "border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.16)]",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Edge Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: glowGradients[glowColor],
          opacity: isHovered ? 1 : 0,
        }}
      />
      {/* Top subtle highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
