"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center pt-16">
      <Container>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="eyebrow mb-6">
          Năng lượng mặt trời · Đức Vinh Việt Nam
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-paper sm:text-6xl"
        >
          Mỗi mái nhà là một
          <br />
          <span className="text-sunrise-amber">nhà máy điện</span> tương lai.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg"
        >
          SolarDV thiết kế, thi công và vận hành hệ thống điện năng lượng mặt trời cho công trình dân dụng và công nghiệp — từ khảo sát đến bảo trì dài hạn.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="mt-10 flex flex-wrap gap-4">
          <Button variant="primary">
            <Link href="/contact">Đăng ký tư vấn miễn phí</Link>
          </Button>
          <Button variant="ghost" className="text-paper">
            <Link href="/projects">Xem dự án đã triển khai</Link>
          </Button>
        </motion.div>
      </Container>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-paper/40" aria-hidden>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Cuộn xuống</span>
      </motion.div>
    </section>
  );
}
