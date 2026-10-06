"use client";

import { useState, useRef, useCallback, MouseEvent } from "react";

interface MagneticOffset {
  x: number;
  y: number;
}

/**
 * Creates subtle magnetic attraction towards the cursor.
 * Respects max distance pull to maintain organic, non-disorienting feel.
 */
export function useMagnetic(strength = 0.35) {
  const [offset, setOffset] = useState<MagneticOffset>({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | HTMLButtonElement | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setOffset({ x: deltaX, y: deltaY });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    offset,
    listeners: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
