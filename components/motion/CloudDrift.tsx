"use client";

import { useScroll, useSpring, useTransform, useVelocity, motion } from "framer-motion";

type CloudConfig = {
  top: string;
  size: number;
  duration: number;
  opacity: number;
  delay: number;
  depth: number;
};

// TẠM THỜI tăng opacity (0.08-0.12 -> 0.35-0.5) và size để dễ quan sát
// chuyển động khi test. Sau khi xác nhận hoạt động đúng, hạ lại theo
// CLOUDS_SUBTLE bên dưới để dùng cho production.
const CLOUDS_DEBUG: CloudConfig[] = [
  { top: "12%", size: 220, duration: 90, opacity: 0.5, delay: 0, depth: 0.4 },
  { top: "22%", size: 300, duration: 130, opacity: 0.4, delay: 15, depth: 0.7 },
  { top: "8%", size: 180, duration: 75, opacity: 0.45, delay: 30, depth: 1 },
];

// Bản gốc "tinh tế" — dùng lại khi đã test xong
const CLOUDS_SUBTLE: CloudConfig[] = [
  { top: "12%", size: 180, duration: 90, opacity: 0.12, delay: 0, depth: 0.4 },
  { top: "22%", size: 260, duration: 130, opacity: 0.08, delay: 15, depth: 0.7 },
  { top: "8%", size: 140, duration: 75, opacity: 0.1, delay: 30, depth: 1 },
];

// Đổi thành CLOUDS_SUBTLE khi đã kiểm tra xong chuyển động
const CLOUDS = CLOUDS_DEBUG;

export function CloudDrift() {
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
        className="rounded-full bg-white blur-2xl"
        style={{ width: size, height: size * 0.4, opacity }}
        animate={{ x: ["-20%", "120%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      />
    </motion.div>
  );
}
