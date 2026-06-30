"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Khoảng cách dịch chuyển ban đầu (px) */
  y?: number;
  /** index dùng để stagger nhiều phần tử trong cùng 1 list */
  index?: number;
}

/**
 * Bọc một section/khối nội dung, fade + slide-up nhẹ khi cuộn tới.
 * Dùng `index` khi render trong danh sách (ProductGrid, ProjectGallery...)
 * để tạo hiệu ứng so le (stagger) tự nhiên.
 */
export function ScrollReveal({ children, className, delay = 0, y = 24, index = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: delay + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
