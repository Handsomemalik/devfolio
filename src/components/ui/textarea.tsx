"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      showCount = false,
      maxLength,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const textareaId = props.id || id;
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-xs font-semibold tracking-wider uppercase text-[var(--text-primary)] font-mono"
            >
              {label}
            </label>
          )}

          {showCount && maxLength && (
            <span
              className={cn(
                "text-[11px] font-mono",
                currentLength >= maxLength ? "text-red-500 font-bold" : "text-[var(--text-secondary)]"
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            value={value}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={!!error}
            rows={props.rows || 4}
            className={cn(
              "w-full rounded-xl bg-white/20 dark:bg-white/[0.05] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm font-medium p-3.5 transition-all duration-200 border border-white/35 dark:border-white/15 focus:border-[var(--text-primary)] focus:bg-white/30 dark:focus:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/10 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed resize-y shadow-inner",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 inline shrink-0" />
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
