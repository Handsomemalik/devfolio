"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroGlassSlices() {
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Scroll parallax
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -35]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({
      x: normalizedX * 18,
      y: normalizedY * 18,
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // 5 vertical glass slices with alternating offsets
  const slices = [
    { factor: -1.2, delay: 0 },
    { factor: 0.8, delay: 0.4 },
    { factor: -1.0, delay: 0.8 },
    { factor: 1.1, delay: 1.2 },
    { factor: -0.7, delay: 1.6 },
  ];

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ y: parallaxY }}
      className="absolute inset-0 pointer-events-auto z-20 grid grid-cols-5 gap-2 sm:gap-3 p-3 sm:p-5 select-none"
    >
      {slices.map((slice, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, slice.factor * 6, 0],
            x: mouseOffset.x * slice.factor * 0.4,
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 4 + i * 0.6,
              ease: "easeInOut",
              delay: slice.delay,
            },
            x: {
              type: "spring",
              stiffness: 120,
              damping: 18,
            },
          }}
          className="h-full rounded-xl sm:rounded-2xl glass-slice relative overflow-hidden transition-all duration-300 hover:border-white/70 hover:backdrop-blur-md"
        >
          {/* Subtle internal edge reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        </motion.div>
      ))}
    </motion.div>
  );
}
