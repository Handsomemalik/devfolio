import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "outline" | "success" | "danger" | "warning" | "glow";
  size?: "sm" | "md";
  dot?: boolean;
  onRemove?: () => void;
}

export function Badge({
  className,
  variant = "secondary",
  size = "md",
  dot = false,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-white/20 dark:bg-white/[0.08] text-[var(--text-primary)] border-white/40 shadow-sm backdrop-blur-md",
    secondary: "bg-white/10 dark:bg-white/[0.04] text-[var(--text-secondary)] border-white/20 backdrop-blur-sm",
    outline: "bg-transparent text-[var(--text-primary)] border-[var(--border-subtle)]",
    success: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-500/30",
    danger: "bg-red-500/10 text-red-800 dark:text-red-400 border-red-500/30",
    warning: "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30",
    glow: "bg-white/25 dark:bg-white/[0.1] text-[var(--text-primary)] border-white/50 shadow-[0_0_16px_rgba(228,87,46,0.22)] backdrop-blur-md",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px] gap-1 font-mono tracking-wider",
    md: "px-3 py-1 text-xs gap-1.5 font-mono tracking-wider",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium rounded-full border select-none transition-all",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === "success" && "bg-emerald-500 animate-pulse",
            variant === "danger" && "bg-red-500",
            variant === "warning" && "bg-amber-500",
            variant === "primary" && "bg-[#e4572e]",
            variant === "glow" && "bg-[#e4572e] animate-pulse",
            variant === "secondary" && "bg-slate-500",
            variant === "outline" && "bg-slate-500"
          )}
        />
      )}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove item"
          className="hover:text-red-500 hover:bg-red-500/10 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
