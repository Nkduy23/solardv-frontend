"use client";

import { motion } from "framer-motion";

// Config cố định (không dùng Math.random() trực tiếp lúc render để tránh
// hydration mismatch giữa server/client). 14 hạt đủ dày để có cảm giác sống
// động nhưng không nặng hiệu năng.
const PARTICLES = [
  { left: "6%", size: 3, duration: 14, delay: 0 },
  { left: "14%", size: 2, duration: 18, delay: 2 },
  { left: "22%", size: 4, duration: 12, delay: 4 },
  { left: "31%", size: 2, duration: 16, delay: 1 },
  { left: "40%", size: 3, duration: 20, delay: 6 },
  { left: "49%", size: 2, duration: 13, delay: 3 },
  { left: "58%", size: 4, duration: 17, delay: 5 },
  { left: "66%", size: 2, duration: 15, delay: 0.5 },
  { left: "74%", size: 3, duration: 19, delay: 7 },
  { left: "81%", size: 2, duration: 12, delay: 2.5 },
  { left: "88%", size: 4, duration: 16, delay: 4.5 },
  { left: "94%", size: 2, duration: 14, delay: 8 },
  { left: "10%", size: 2, duration: 22, delay: 9 },
  { left: "70%", size: 3, duration: 21, delay: 1.5 },
];

/**
 * Hạt ánh sáng trôi lơ lửng từ dưới lên — ẩn dụ "năng lượng" toả ra liên tục.
 * Chạy độc lập với scroll (animate loop vô hạn) để trang Home có chuyển động
 * ngay từ khung hình đầu tiên, không cần đợi người dùng cuộn.
 */
export function SolarParticles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-sunrise-amber"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: "-5%",
            boxShadow: "0 0 8px 2px rgba(245,166,35,0.6)",
          }}
          animate={{
            y: ["0%", "-115vh"],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            opacity: { times: [0, 0.1, 0.85, 1], duration: p.duration },
          }}
        />
      ))}
    </div>
  );
}
