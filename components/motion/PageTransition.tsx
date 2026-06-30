"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Bọc nội dung từng page trong (client) layout để tạo hiệu ứng fade nhẹ
 * khi chuyển trang. Đặt trong app/(client)/layout.tsx bao quanh {children}.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
