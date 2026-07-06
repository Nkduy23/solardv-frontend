"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePageVisible } from "@/hooks/usePageVisible";

// Giảm từ 14 xuống 8 hạt — vẫn đủ cảm giác sống động, giảm ~40% số animation
// loop chạy song song (đỡ tải CPU/GPU liên tục).
const PARTICLES = [
  { left: "8%", size: 3, duration: 14, delay: 0 },
  { left: "20%", size: 2, duration: 18, delay: 2 },
  { left: "34%", size: 4, duration: 16, delay: 4 },
  { left: "48%", size: 2, duration: 13, delay: 1 },
  { left: "60%", size: 3, duration: 20, delay: 6 },
  { left: "72%", size: 2, duration: 15, delay: 3 },
  { left: "84%", size: 4, duration: 17, delay: 5 },
  { left: "92%", size: 2, duration: 19, delay: 7 },
];

/**
 * Hạt ánh sáng trôi lơ lửng từ dưới lên. Tự tắt hoàn toàn khi:
 * - Người dùng bật "Reduce Motion" ở hệ điều hành (accessibility)
 * - Tab đang không active (tiết kiệm CPU/GPU/pin khi user không nhìn vào trang)
 */
export function SolarParticles() {
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();

  if (reducedMotion || !pageVisible) return null;

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
