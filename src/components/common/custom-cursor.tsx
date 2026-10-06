"use client";

import * as React from "react";

export function CustomCursor() {
  const [position, setPosition] = React.useState({ x: -100, y: -100 });
  const [dotPos, setDotPos] = React.useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = React.useState(false);
  const [isViewing, setIsViewing] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  const targetPos = React.useRef({ x: -100, y: -100 });
  const animFrame = React.useRef<number | null>(null);

  React.useEffect(() => {
    // Detect touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setDotPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("button, a, input, textarea, select, [role='button'], .cursor-pointer")
        );
        const isImageView = Boolean(
          target.closest("img, [data-cursor='view'], .sculpture-tile, .image-tile, .statue-frame")
        );

        setIsHovering(isInteractive);
        setIsViewing(isImageView);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth lerp loop for the outer ring
    let currentX = -100;
    let currentY = -100;
    const lerpFactor = 0.18;

    const render = () => {
      currentX += (targetPos.current.x - currentX) * lerpFactor;
      currentY += (targetPos.current.y - currentY) * lerpFactor;
      setPosition({ x: currentX, y: currentY });
      animFrame.current = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    animFrame.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrame.current) {
        cancelAnimationFrame(animFrame.current);
      }
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Center dot - precise position */}
      <div
        className="fixed pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{
          left: `${dotPos.x}px`,
          top: `${dotPos.y}px`,
          opacity: isViewing ? 0 : 1,
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1c] dark:bg-white shadow-[0_0_8px_rgba(228,87,46,0.6)]" />
      </div>

      {/* Outer ring / View bubble - smoothed lerp */}
      <div
        className="fixed pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color,background-color] duration-250 ease-out flex items-center justify-center"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isViewing ? "76px" : isHovering ? "52px" : "34px",
          height: isViewing ? "76px" : isHovering ? "52px" : "34px",
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-200 flex items-center justify-center ${
            isViewing
              ? "backdrop-blur-md bg-white/30 dark:bg-black/40 border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.25)] scale-100"
              : isHovering
              ? "border-[1.5px] border-[#1a1a1c] dark:border-white bg-[#1a1a1c]/[0.06] dark:bg-white/[0.08] scale-105"
              : "border border-[#1a1a1c]/70 dark:border-white/70 scale-100"
          }`}
        >
          {isViewing && (
            <span
              className="text-[12px] font-serif tracking-widest text-[#1a1a1c] dark:text-white uppercase select-none font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              View
            </span>
          )}
        </div>
      </div>
    </>
  );
}
