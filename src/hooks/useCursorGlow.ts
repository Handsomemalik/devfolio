"use client";

import { useRef, useCallback, MouseEvent } from "react";

/**
 * Updates CSS custom properties --mouse-x and --mouse-y on hover.
 * Used for dynamic radial glow cards and spotlights.
 */
export function useCursorGlow<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent<T>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    containerRef.current.style.setProperty("--mouse-x", `${x}px`);
    containerRef.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return {
    ref: containerRef,
    onMouseMove: handleMouseMove,
  };
}
