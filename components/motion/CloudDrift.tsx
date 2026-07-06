"use client";

import { useScroll, useSpring, useTransform, useVelocity, motion, useReducedMotion } from "framer-motion";
import { usePageVisible } from "@/hooks/usePageVisible";

type CloudConfig = {
  top: string;
  size: number;
  duration: number;
  opacity: number;
  delay: number;
  depth: number;
};

// ĐÃ SỬA: trước đây code trỏ nhầm vào CLOUDS_DEBUG (opacity 0.5, size 300px —
// dùng để test cho dễ nhìn) và QUÊN đổi lại bản tinh tế trước khi ship. Đây là
// nguyên nhân khiến mây trông đậm/to bất thường. Giờ chỉ giữ 1 bộ config duy
// nhất — không còn 2 phiên bản dễ nhầm lẫn nữa.
const CLOUDS: CloudConfig[] = [
  { top: "12%", size: 180, duration: 90, opacity: 0.12, delay: 0, depth: 0.4 },
  { top: "22%", size: 260, duration: 130, opacity: 0.08, delay: 15, depth: 0.7 },
  { top: "8%", size: 140, duration: 75, opacity: 0.1, delay: 30, depth: 1 },
];

export function CloudDrift() {
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const { scrollY } = useScroll();

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.5,
  });

  const skewX = useTransform(smoothVelocity, [-3000, 0, 3000], [40, 0, -40], {
    clamp: true,
  });

  if (reducedMotion || !pageVisible) return null;

  return (
    <>
      {CLOUDS.map((c, i) => (
        <Cloud key={i} config={c} skewX={skewX} />
      ))}
    </>
  );
}

function Cloud({ config, skewX }: { config: CloudConfig; skewX: any }) {
  const { top, size, duration, opacity, delay, depth } = config;
  const depthOffset = useTransform(skewX, (v: number) => v * depth);

  return (
    <motion.div className="absolute" style={{ top, x: depthOffset }}>
      <motion.div
        // Bỏ `blur-2xl` (filter blur rất tốn GPU khi animate liên tục) —
        // thay bằng radial-gradient có độ mờ tự nhiên qua các stop màu,
        // không cần filter vẫn cho cảm giác mềm tương đương.
        className="rounded-full"
        style={{
          width: size,
          height: size * 0.4,
          opacity,
          background: "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0) 75%)",
        }}
        animate={{ x: ["-20%", "120%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      />
    </motion.div>
  );
}
