"use client";

import { MotionConfig } from "framer-motion";

/**
 * Configuração global do framer-motion: respeita `prefers-reduced-motion`
 * (animações de transform/layout são desligadas, opacidade é mantida).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
