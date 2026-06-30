"use client";

import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * "Sunrise Scroll" — nền gradient cố định (fixed) phủ toàn bộ trang Home,
 * chuyển màu mượt từ tông đêm (navy) sang tông bình minh (vàng cam) theo
 * tiến độ cuộn trang. Đặt component này một lần ở đầu page Home, các section
 * bên trên nó cần có background trong suốt để thấy được gradient.
 *
 * Ý nghĩa: ẩn dụ cho "năng lượng mặt trời dần lan tỏa" khi người dùng khám phá
 * càng sâu vào nội dung trang.
 */
export function ParallaxBackground({ targetRef }: { targetRef?: React.RefObject<HTMLElement> }) {
  const fallbackRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef ?? fallbackRef,
    offset: ["start start", "end end"],
  });

  const background = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [
      "linear-gradient(180deg, #0B1220 0%, #14213D 100%)",
      "linear-gradient(180deg, #14213D 0%, #5B3A29 100%)",
      "linear-gradient(180deg, #8A4E22 0%, #C9742C 100%)",
      "linear-gradient(180deg, #C9742C 0%, #F5A623 100%)",
    ],
  );

  const sunY = useTransform(scrollYProgress, [0, 1], ["85%", "12%"]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.08, 1], [0, 1, 1]);
  const horizonOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background }}
    >
      {/* Mặt trời di chuyển dần lên theo scroll */}
      <motion.div
        className="absolute left-1/2 size-40 -translate-x-1/2 rounded-full"
        style={{
          top: sunY,
          opacity: sunOpacity,
          background:
            "radial-gradient(circle, #FFE3A3 0%, #F5A623 60%, rgba(245,166,35,0) 75%)",
          filter: "blur(2px)",
        }}
      />
      {/* Đường chân trời silhouette mái nhà + tấm pin */}
      <motion.svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full"
        style={{ opacity: horizonOpacity }}
      >
        <path
          d="M0,160 L0,90 L180,90 L210,60 L420,60 L450,90 L760,90 L790,40 L1020,40 L1050,90 L1260,90 L1290,70 L1440,70 L1440,160 Z"
          fill="#0B1220"
          fillOpacity={0.85}
        />
      </motion.svg>
    </motion.div>
  );
}
