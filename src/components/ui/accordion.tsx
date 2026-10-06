"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-md overflow-hidden transition-all duration-300 mb-3 data-[state=open]:border-white/60 data-[state=open]:shadow-[0_12px_35px_rgba(0,0,0,0.12)]",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    icon?: React.ReactNode;
    badge?: React.ReactNode;
  }
>(({ className, children, icon, badge, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4.5 px-6 text-base font-semibold transition-all hover:bg-white/10 dark:hover:bg-white/[0.04] [&[data-state=open]>svg]:rotate-180 cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 text-left">
        {icon && <span className="text-[#e4572e] shrink-0">{icon}</span>}
        <span className="text-[var(--text-primary)] font-heading tracking-wide uppercase text-sm sm:text-base">
          {children}
        </span>
        {badge}
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-300" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down text-[var(--text-secondary)] leading-relaxed font-sans"
    {...props}
  >
    <div className={cn("px-6 pb-6 pt-1", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
