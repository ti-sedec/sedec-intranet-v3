"use client";

import type { CSSProperties } from "react";
import SpotlightCard from "@/src/components/react-bits/SpotlightCard";

type Tone = "light" | "dark";

const TONES: Record<Tone, { theme: "light" | "dark"; color: string; vars: Record<string, string> }> = {
  light: {
    theme: "light",
    color: "#e0662b",
    vars: {
      "--spotlight-card-surface": "var(--color-surface)",
      "--spotlight-card-border": "var(--color-border)",
      "--spotlight-card-shadow": "none",
    },
  },
  dark: {
    theme: "dark",
    color: "#ffffff",
    vars: {
      "--spotlight-card-surface": "var(--color-navy-panel)",
      "--spotlight-card-border": "var(--color-navy-border)",
      "--spotlight-card-shadow": "none",
    },
  },
};

/**
 * Card com luz que segue o cursor (React Bits "Spotlight Card"), já ajustado
 * aos cards do site: cantos `rounded-md`, superfície e borda do tema, sem a
 * sombra/padding padrão da biblioteca. O padding e o layout vêm do `className`.
 */
export function SpotlightSurface({
  tone = "light",
  className = "",
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  const t = TONES[tone];
  return (
    <SpotlightCard
      theme={t.theme}
      spotlightColor={t.color}
      intensity={tone === "light" ? 0.55 : 0.4}
      className={`rounded-md! p-0! ${className}`}
      style={t.vars as CSSProperties}
    >
      {children}
    </SpotlightCard>
  );
}
