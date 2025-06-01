import type { Variants } from 'framer-motion';

export const staggerContainer = (staggerChildren?: number, delayChildren?: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0,
    },
  },
});

export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right', type: string, delay?: number, duration?: number): Variants => ({
  hidden: {
    opacity: 0,
    y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
    x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: type || 'spring',
      delay: delay || 0,
      duration: duration || 0.5,
      ease: 'easeOut',
    },
  },
});

export const slideIn = (direction: 'up' | 'down' | 'left' | 'right', type: string, delay?: number, duration?: number): Variants => ({
  hidden: {
    opacity: 0,
    y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
    x: direction === 'left' ? '100%' : direction === 'right' ? '-100%' : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: type || 'spring',
      delay: delay || 0,
      duration: duration || 0.5,
      ease: 'easeOut',
    },
  },
});