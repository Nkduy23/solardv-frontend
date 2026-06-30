"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/** Fade-in đơn giản, không dịch chuyển vị trí — dùng cho ảnh, badge nhỏ */
export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
