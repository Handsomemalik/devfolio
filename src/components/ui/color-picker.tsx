"use client";

import * as React from "react";
import { Check, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";
import { isValidHexColor } from "@/lib/security/sanitize";

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

export const PRESET_SWATCHES = [
  { name: "Indigo Nova", hex: "#6366F1" },
  { name: "Electric Cyan", hex: "#22D3EE" },
  { name: "Violet Nebula", hex: "#8B5CF6" },
  { name: "Emerald Pulse", hex: "#10B981" },
  { name: "Amber Solar", hex: "#F59E0B" },
  { name: "Crimson Blaze", hex: "#F43F5E" },
  { name: "Obsidian Slate", hex: "#94A3B8" },
  { name: "Pure White", hex: "#F8FAFC" },
];

export function ColorPicker({
  value,
  onChange,
  label = "Accent Color",
  className,
}: ColorPickerProps) {
  const [hexInput, setHexInput] = React.useState(value);
  const [prevValue, setPrevValue] = React.useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setHexInput(value);
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setHexInput(text);
    if (isValidHexColor(text)) {
      onChange(text);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-2.5 text-left", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300">
            {label}
          </span>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase">
            {value}
          </span>
        </div>
      )}

      {/* Preset Swatches */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {PRESET_SWATCHES.map((swatch) => {
          const isSelected = value.toLowerCase() === swatch.hex.toLowerCase();
          return (
            <button
              key={swatch.hex}
              type="button"
              title={swatch.name}
              onClick={() => {
                setHexInput(swatch.hex);
                onChange(swatch.hex);
              }}
              style={{ backgroundColor: swatch.hex }}
              className={cn(
                "h-8 rounded-lg relative flex items-center justify-center transition-all duration-200 border border-black/10 dark:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                isSelected && "ring-2 ring-offset-2 ring-indigo-500 scale-105 shadow-md"
              )}
            >
              {isSelected && (
                <Check
                  className={cn(
                    "w-4 h-4 stroke-[3]",
                    swatch.hex === "#F8FAFC" || swatch.hex === "#22D3EE"
                      ? "text-slate-900"
                      : "text-white"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Hex input + Native Color Input Picker */}
      <div className="flex items-center gap-2 mt-1">
        <div className="relative flex-1">
          <input
            type="text"
            value={hexInput}
            maxLength={7}
            placeholder="#6366F1"
            onChange={handleTextChange}
            className="w-full h-9 pl-3 pr-8 rounded-lg bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 uppercase"
          />
          <div
            className="absolute right-2 top-2 w-5 h-5 rounded border border-black/10 dark:border-white/20 shadow-xs"
            style={{ backgroundColor: isValidHexColor(hexInput) ? hexInput : value }}
          />
        </div>

        {/* Native color picker trigger */}
        <label
          title="Pick custom color"
          className="h-9 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] cursor-pointer transition-colors"
        >
          <Pipette className="w-3.5 h-3.5 text-indigo-500" />
          <span>Custom</span>
          <input
            type="color"
            value={isValidHexColor(value) ? value : "#6366F1"}
            onChange={(e) => {
              setHexInput(e.target.value);
              onChange(e.target.value);
            }}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
