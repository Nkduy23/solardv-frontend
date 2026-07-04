"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

/**
 * Banner đầu trang dùng chung cho các trang con (About, Services, Products,
 * Projects, Contact) — không full-screen như Hero ở Home, chỉ giới thiệu
 * ngắn gọn trang đang ở đâu.
 *
 * Motion: text vào theo staggered fade-up (không cần chờ scroll, chạy ngay
 * khi mount vì đây là phần đầu trang luôn nằm trong viewport). Thêm 1 glow
 * orb mờ ở góc để đồng bộ tông màu "năng lượng mặt trời" với Home, tránh
 * cảm giác nền phẳng nhàm chán.
 */
export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy pb-20 pt-32 text-paper sm:pb-24 sm:pt-40">
      {/* Glow nền — mờ, tĩnh, chỉ để tạo chiều sâu, không ảnh hưởng layout */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(245,166,35,0.18) 0%, rgba(245,166,35,0) 70%)" }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 size-[300px] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, rgba(45,212,191,0) 70%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }}
      />

      <Container className="relative">
        <motion.p className="eyebrow mb-4" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          {eyebrow}
        </motion.p>

        <motion.h1
          className="max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p className="mt-5 max-w-xl text-paper/70" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.22 }}>
            {description}
          </motion.p>
        )}
      </Container>
    </section>
  );
}
