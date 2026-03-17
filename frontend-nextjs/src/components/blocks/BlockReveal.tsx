"use client";

import { motion } from "framer-motion";

export function BlockReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} 
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
