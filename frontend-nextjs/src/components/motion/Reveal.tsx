"use client";

import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  /** Atraso em segundos (use para escalonar itens de uma lista). */
  delay?: number;
  /** Deslocamento vertical inicial em px. */
  y?: number;
  className?: string;
}

/**
 * Fade + leve subida quando o elemento entra na viewport (uma única vez).
 * Use em conteúdo abaixo da dobra — o conteúdo do topo da página já é
 * animado pelo template de transição de rota.
 */
export function Reveal({ children, delay = 0, y = 14, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -48px 0px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
