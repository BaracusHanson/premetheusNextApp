import { Variants } from "framer-motion";

// Durations & Easing
export const TRANSITION_DEFAULT = { duration: 0.3, ease: "easeOut" };
export const TRANSITION_SLOW = { duration: 0.5, ease: "easeInOut" };
export const TRANSITION_FAST = { duration: 0.2, ease: "easeOut" };

// Presets
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: TRANSITION_DEFAULT },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: TRANSITION_DEFAULT },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: TRANSITION_DEFAULT },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: TRANSITION_DEFAULT },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Micro-interactions (Hover/Tap)
export const hoverScale = { scale: 1.02 };
export const tapScale = { scale: 0.98 };

export const hoverCard = {
  y: -4,
  transition: { duration: 0.2 },
};
