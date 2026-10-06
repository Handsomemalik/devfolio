import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div className={cn("w-full flex items-center justify-between", className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isClickable = !!onStepClick;

        return (
          <React.Fragment key={step.id}>
            <div
              onClick={() => isClickable && onStepClick(idx)}
              className={cn(
                "flex items-center gap-2.5 select-none",
                isClickable && "cursor-pointer group"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border",
                  isCompleted &&
                    "bg-indigo-600 border-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]",
                  isCurrent &&
                    "bg-white dark:bg-[#0E0E17] border-indigo-500 text-indigo-500 ring-4 ring-indigo-500/20",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-slate-100 dark:bg-white/[0.04] border-slate-300 dark:border-white/10 text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <span
                  className={cn(
                    "text-xs font-semibold font-heading transition-colors",
                    isCurrent
                      ? "text-indigo-600 dark:text-indigo-400"
                      : isCompleted
                      ? "text-slate-800 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500"
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {/* Connecting Bar */}
            {idx < steps.length - 1 && (
              <div className="flex-1 mx-3 h-0.5 bg-slate-200 dark:bg-white/10 relative overflow-hidden rounded-full">
                <div
                  className="absolute inset-0 bg-indigo-600 transition-all duration-500"
                  style={{
                    width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
