"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { SolarParticles } from "./SolarParticles";

/**
 * "Sunrise Scroll" v2 — nền gradient cố định phủ toàn bộ trang Home, chuyển
 * màu mượt từ tông đêm (navy) sang tông bình minh (vàng cam) theo tiến độ
 * cuộn trang. Khác bản đầu: mặt trời + đường chân trời hiện diện NGAY TỪ
 * KHUNG HÌNH ĐẦU TIÊN (mờ, nhỏ) thay vì opacity 0 chờ scroll — để trang không
 * bị "chết" lúc mới vào. Thêm particles ánh sáng trôi liên tục, tia nắng xoay
 * chậm, và tấm pin có shading + hiệu ứng ánh sáng quét qua.
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

  // Mặt trời: hiện diện mờ ngay từ đầu (không còn opacity 0), sáng dần + lớn dần theo scroll
  const sunY = useTransform(scrollYProgress, [0, 1], ["78%", "10%"]);
  const sunOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const sunScale = useTransform(scrollYProgress, [0, 1], [0.7, 1.15]);
  const rayOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 0.6]);
  const horizonOpacity = useTransform(scrollYProgress, [0, 0.15], [0.5, 1]);
  const auroraOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.25, 0]);

  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background }}>
      {/* Aurora blobs — trôi chậm, tạo chuyển động nền ngay cả khi chưa scroll */}
      <motion.div
        className="absolute left-[10%] top-[15%] size-[420px] rounded-full blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(45,212,191,0.25) 0%, rgba(45,212,191,0) 70%)", opacity: auroraOpacity }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[8%] top-[35%] size-[360px] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(245,166,35,0.2) 0%, rgba(245,166,35,0) 70%)", opacity: auroraOpacity }}
        animate={{ x: [0, -35, 25, 0], y: [0, 25, -15, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Hạt ánh sáng trôi lên liên tục */}
      <SolarParticles />

      {/* Mặt trời + tia sáng xoay chậm */}
      <motion.div className="absolute left-1/2 -translate-x-1/2" style={{ top: sunY, opacity: sunOpacity, scale: sunScale }}>
        {/* Tia sáng — conic gradient xoay chậm, ẩn dụ năng lượng toả ra */}
        <motion.div
          className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: rayOpacity,
            background: "repeating-conic-gradient(from 0deg, rgba(255,227,163,0.35) 0deg 4deg, transparent 4deg 18deg)",
            maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 70%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        {/* Quầng sáng ngoài — pulse nhẹ */}
        <motion.div
          className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,227,163,0.5) 0%, rgba(245,166,35,0) 72%)" }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Lõi mặt trời */}
        <div
          className="relative size-32 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, #FFF4D6 0%, #FFE3A3 30%, #F5A623 65%, #D97B1F 100%)",
            boxShadow: "0 0 60px 12px rgba(245,166,35,0.45)",
          }}
        />
      </motion.div>

      {/* Đường chân trời: nhiều mái nhà + tấm pin có shading, hiệu ứng ánh sáng quét */}
      <motion.svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full" style={{ opacity: horizonOpacity }}>
        <defs>
          <linearGradient id="roofShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B2A4A" />
            <stop offset="100%" stopColor="#0B1220" />
          </linearGradient>
          <linearGradient id="panelShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2C3E63" />
            <stop offset="100%" stopColor="#1B2A4A" />
          </linearGradient>
          <linearGradient id="shineSweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,227,163,0)" />
            <stop offset="50%" stopColor="rgba(255,227,163,0.35)" />
            <stop offset="100%" stopColor="rgba(255,227,163,0)" />
          </linearGradient>
          <clipPath id="panelsClip">
            <rect x="60" y="55" width="340" height="45" />
            <rect x="820" y="35" width="260" height="45" />
            <rect x="1140" y="60" width="220" height="40" />
          </clipPath>
        </defs>

        {/* Khối nhà nền (silhouette chính) */}
        <path d="M0,220 L0,130 L180,130 L210,95 L420,95 L450,130 L760,130 L790,75 L1020,75 L1050,130 L1260,130 L1290,105 L1440,105 L1440,220 Z" fill="url(#roofShade)" />

        {/* Các dãy tấm pin trên mái, vẽ dạng lưới ô để gợi cảm giác khối/3D nhẹ */}
        <g fill="url(#panelShade)" stroke="#0B1220" strokeWidth="1">
          <rect x="60" y="55" width="340" height="45" />
          <rect x="820" y="35" width="260" height="45" />
          <rect x="1140" y="60" width="220" height="40" />
        </g>
        {/* Lưới ô trong từng tấm pin */}
        <g stroke="rgba(11,18,32,0.6)" strokeWidth="1">
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`v1-${i}`} x1={60 + i * 48.5} y1="55" x2={60 + i * 48.5} y2="100" />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <line key={`h1-${i}`} x1="60" y1={55 + i * 15} x2="400" y2={55 + i * 15} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`v2-${i}`} x1={820 + i * 52} y1="35" x2={820 + i * 52} y2="80" />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <line key={`h2-${i}`} x1="820" y1={35 + i * 15} x2="1080" y2={35 + i * 15} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`v3-${i}`} x1={1140 + i * 44} y1="60" x2={1140 + i * 44} y2="100" />
          ))}
        </g>

        {/* Highlight cạnh trên tấm pin — tạo cảm giác ánh sáng chiếu từ mặt trời, giả 3D */}
        <g stroke="rgba(255,227,163,0.4)" strokeWidth="1.5">
          <line x1="60" y1="55" x2="400" y2="55" />
          <line x1="820" y1="35" x2="1080" y2="35" />
          <line x1="1140" y1="60" x2="1360" y2="60" />
        </g>

        {/* Ánh sáng quét qua các tấm pin — lặp vô hạn */}
        <g clipPath="url(#panelsClip)">
          <motion.rect y="0" width="120" height="220" fill="url(#shineSweep)" animate={{ x: [-200, 1500] }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} />
        </g>
      </motion.svg>
    </motion.div>
  );
}
