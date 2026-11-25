"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// O template é remontado a cada navegação (o layout, com Header e Footer,
// permanece). Na carga inicial não animamos, para o conteúdo renderizado no
// servidor aparecer imediatamente; só as navegações seguintes têm transição.
// `hydrated` só vira true depois da primeira hidratação (no servidor nunca
// muda), então o initializer do useState continua puro — importante porque o
// StrictMode o executa duas vezes em desenvolvimento.
let hydrated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hydrated);

  useEffect(() => {
    hydrated = true;
  }, []);

  return (
    <motion.div
      className="flex-1 flex flex-col"
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
