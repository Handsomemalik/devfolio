import { type Transition, type Variants } from "framer-motion";

/**
 * FolioNova Motion Design Tokens
 * Easing curve: cubic-bezier(0.22, 1, 0.36, 1)
 * Standardized durations for UI micro-interactions vs page storytelling.
 */

export const FOLIONOVA_EASE = [0.22, 1, 0.36, 1] as const;

export const transitionFast: Transition = {
  duration: 0.2,
  ease: FOLIONOVA_EASE,
};

export const transitionMedium: Transition = {
  duration: 0.4,
  ease: FOLIONOVA_EASE,
};

export const transitionSlow: Transition = {
  duration: 0.8,
  ease: FOLIONOVA_EASE,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionMedium,
  },
  exit: {
    opacity: 0,
    transition: transitionFast,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionMedium,
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: transitionFast,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionMedium,
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionMedium,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitionFast,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: FOLIONOVA_EASE,
    },
  },
};
