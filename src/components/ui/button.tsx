"use client";

import * as React from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  magnetic?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      magnetic = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const { ref: magneticRef, offset, listeners } = useMagnetic(0.2);

    // Merge forwarded ref with magnetic ref
    const handleRef = (node: HTMLButtonElement | null) => {
      magneticRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const baseStyles =
      "relative inline-flex items-center justify-center select-none font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const sizeStyles = {
      sm: "h-9 px-4 text-xs rounded-[5px] gap-1.5",
      md: "min-h-[46px] px-[22px] py-[14px] text-sm rounded-[6px] gap-2",
      lg: "min-h-[52px] px-7 py-3.5 text-base rounded-[6px] gap-2.5 font-medium",
      icon: "h-10 w-10 p-0 rounded-[6px]",
    };

    const variantStyles = {
      primary:
        "btn-primary-charcoal group active:scale-[0.98]",
      secondary:
        "btn-secondary-link group bg-transparent text-[var(--text-primary)] hover:opacity-90 active:scale-[0.98]",
      outline:
        "bg-white/10 dark:bg-white/[0.04] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-white/20 dark:hover:bg-white/[0.08] backdrop-blur-md shadow-sm active:scale-[0.98]",
      ghost:
        "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/15 dark:hover:bg-white/[0.06] rounded-[6px] active:scale-[0.98]",
      danger:
        "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/30 shadow-sm active:scale-[0.98]",
      glow:
        "bg-white/15 dark:bg-black/30 text-[var(--text-primary)] border border-white/40 hover:border-white/60 shadow-[0_0_20px_rgba(228,87,46,0.18)] hover:shadow-[0_0_30px_rgba(228,87,46,0.3)] backdrop-blur-md active:scale-[0.98]",
    };

    const transformStyle =
      magnetic && !disabled && !isLoading
        ? { transform: `translate(${offset.x}px, ${offset.y}px)` }
        : undefined;

    return (
      <button
        ref={handleRef}
        disabled={disabled || isLoading}
        style={transformStyle}
        {...(magnetic ? listeners : {})}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>{typeof children === "string" ? "Loading..." : children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
            {variant === "secondary" && !rightIcon && (
              <span className="arrow-icon inline-flex shrink-0 transition-transform duration-200">
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
            {rightIcon && (
              <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-1">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
