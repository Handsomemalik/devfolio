"use client";

import * as React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      onClear,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const inputId = props.id || id;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wider uppercase text-[var(--text-primary)] flex items-center justify-between font-mono"
          >
            <span>{label}</span>
            {props.required && <span className="text-[#e4572e] font-normal lowercase">*required</span>}
          </label>
        )}

        <div className="relative flex items-center w-full group">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--text-secondary)] group-focus-within:text-[var(--text-primary)] transition-colors">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            value={value}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-desc` : undefined}
            className={cn(
              "w-full h-11 rounded-xl bg-white/20 dark:bg-white/[0.05] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm font-medium transition-all duration-200 border border-white/35 dark:border-white/15 focus:border-[var(--text-primary)] focus:bg-white/30 dark:focus:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/10 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed shadow-inner",
              leftIcon ? "pl-10" : "pl-4",
              rightIcon || onClear || error ? "pr-10" : "pr-4",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />

          {/* Right actions: clear button, custom icon, or error icon */}
          <div className="absolute right-3.5 flex items-center gap-1.5 text-[var(--text-secondary)]">
            {onClear && value && !disabled && (
              <button
                type="button"
                onClick={onClear}
                tabIndex={-1}
                aria-label="Clear input"
                className="hover:text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {error ? (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            ) : (
              rightIcon
            )}
          </div>
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="text-xs font-medium text-red-500 flex items-center gap-1 mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-desc`} className="text-xs text-[var(--text-secondary)] mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
