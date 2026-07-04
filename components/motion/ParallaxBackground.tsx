"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { SolarParticles } from "./SolarParticles";
import { CloudDrift } from "./CloudDrift";

// Định nghĩa mái nhà bằng danh sách "plateau" (gò cao) rõ ràng, thay vì
// path string khó đối chiếu. Mỗi plateau: điểm bắt đầu/kết thúc theo x,
// độ cao (topY), và ground-line (đáy) dùng chung.
const GROUND_Y = 140;
const PLATEAUS = [
  { xStart: 180, xEnd: 390, topY: 100 }, // gò 1
  { xStart: 730, xEnd: 970, topY: 80 }, // gò 2 (cao nhất)
  { xStart: 1250, xEnd: 1420, topY: 110 }, // gò 3
];

// Sinh path mái từ PLATEAUS — đảm bảo path luôn khớp với vị trí đã khai báo,
// không còn 2 nguồn số liệu tách rời như bản cũ.
function buildRoofPath() {
  const slopeIn = 30; // độ dốc lên plateau
  let d = `M0,220 L0,${GROUND_Y}`;
  PLATEAUS.forEach((p) => {
    d += ` L${p.xStart - slopeIn},${GROUND_Y} L${p.xStart},${p.topY} L${p.xEnd},${p.topY} L${p.xEnd + slopeIn},${GROUND_Y}`;
  });
  d += ` L1440,${GROUND_Y} L1440,220 Z`;
  return d;
}

// Panel frame được tính TRỰC TIẾP từ plateau tương ứng — đáy panel luôn
// đúng bằng topY của plateau (không có khe hở), width panel nhỏ hơn width
// plateau 1 khoảng để chừa viền 2 bên, căn giữa theo trục x của plateau.
function buildPanelFrame(plateau: (typeof PLATEAUS)[number], margin: number, height: number, cols: number, rows: number) {
  const plateauWidth = plateau.xEnd - plateau.xStart;
  const w = plateauWidth - margin * 2;
  const x = plateau.xStart + margin;
  const y = plateau.topY - height; // đáy panel = topY, đỉnh panel = topY - height
  return { x, y, w, h: height, cols, rows };
}

const PANEL_FRAMES = [buildPanelFrame(PLATEAUS[0], 15, 42, 7, 3), buildPanelFrame(PLATEAUS[1], 15, 46, 6, 3), buildPanelFrame(PLATEAUS[2], 15, 38, 5, 2)];

// 4 mốc gradient nền — thay vì nội suy 1 chuỗi background-image (rất tốn vì
// phải repaint full-viewport mỗi frame scroll), ta dựng 4 lớp gradient TĨNH
// chồng lên nhau và chỉ crossfade bằng opacity. Opacity được compositor xử
// lý trực tiếp trên GPU, không cần layout/paint lại -> hết delay khi lướt
// touchpad (vốn bắn rất nhiều sự kiện scroll nhỏ liên tục).
const BG_STOPS = [
  "linear-gradient(180deg, #0B1220 0%, #14213D 100%)",
  "linear-gradient(180deg, #14213D 0%, #5B3A29 100%)",
  "linear-gradient(180deg, #8A4E22 0%, #C9742C 100%)",
  "linear-gradient(180deg, #C9742C 0%, #F5A623 100%)",
];

export function ParallaxBackground({ targetRef }: { targetRef?: React.RefObject<HTMLElement> }) {
  const fallbackRef = useRef<HTMLElement>(null);

  // Dùng trực tiếp scrollYProgress, KHÔNG bọc useSpring nữa. Giá trị này đã
  // được Framer Motion tính từ scrollY của trình duyệt (vốn mượt sẵn nhờ
  // trình duyệt tự nội suy khung hình), nên bám sát input mà không cần lớp
  // làm mượt thêm — tránh cả 2 vấn đề: dao động khi cuộn touchpad liên tục
  // (do spring bị "reset" giữa chừng) VÀ độ trễ sau khi ngừng cuộn (do
  // spring overdamped chưa kịp settle).
  const { scrollYProgress: progress } = useScroll({
    target: targetRef ?? fallbackRef,
    offset: ["start start", "end end"],
  });

  const sunTop = useTransform(progress, [0, 1], [78, 10]);
  const sunOpacity = useTransform(progress, [0, 1], [0.35, 1]);
  const sunScale = useTransform(progress, [0, 1], [0.7, 1.15]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <BackgroundGradientLayers progress={progress} />
      <SkyLayer progress={progress} />
      <SunLayer sunTop={sunTop} sunOpacity={sunOpacity} sunScale={sunScale} />
      <RoofPanelLayer progress={progress} sunTop={sunTop} sunOpacity={sunOpacity} />
    </div>
  );
}

/* ---------- LỚP NỀN: 4 gradient tĩnh crossfade bằng opacity ---------- */
function BackgroundGradientLayers({ progress }: { progress: any }) {
  // Mỗi lớp chỉ "hiện" trong khoảng progress của nó rồi mờ dần sang lớp kế.
  const o0 = useTransform(progress, [0, 0.35], [1, 0]);
  const o1 = useTransform(progress, [0, 0.35, 0.7], [0, 1, 0]);
  const o2 = useTransform(progress, [0.35, 0.7, 1], [0, 1, 0]);
  const o3 = useTransform(progress, [0.7, 1], [0, 1]);
  const opacities = [o0, o1, o2, o3];

  return (
    <div className="absolute inset-0">
      {BG_STOPS.map((bg, i) => (
        <motion.div key={bg} className="absolute inset-0" style={{ background: bg, opacity: opacities[i], willChange: "opacity" }} />
      ))}
    </div>
  );
}

/* ---------- LỚP 1: bầu trời, mây, aurora ---------- */
function SkyLayer({ progress }: { progress: any }) {
  const y = useTransform(progress, [0, 1], [0, -60]);
  const auroraOpacity = useTransform(progress, [0, 0.5, 1], [0.5, 0.25, 0]);

  return (
    <motion.div className="absolute inset-0" style={{ y, willChange: "transform" }}>
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
      <CloudDrift />
      <SolarParticles />
    </motion.div>
  );
}

/* ---------- MẶT TRỜI ---------- */
function SunLayer({ sunTop, sunOpacity, sunScale }: { sunTop: any; sunOpacity: any; sunScale: any }) {
  const rayOpacity = useTransform(sunOpacity, [0.35, 1], [0.15, 0.6]);
  const topPercent = useTransform(sunTop, (v: number) => `${v}%`);

  return (
    <motion.div className="absolute left-1/2 -translate-x-1/2" style={{ top: topPercent, opacity: sunOpacity, scale: sunScale, willChange: "transform, opacity" }}>
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
      <motion.div
        className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,227,163,0.5) 0%, rgba(245,166,35,0) 72%)" }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="relative size-32 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, #FFF4D6 0%, #FFE3A3 30%, #F5A623 65%, #D97B1F 100%)",
          boxShadow: "0 0 60px 12px rgba(245,166,35,0.45)",
        }}
      />
    </motion.div>
  );
}

/* ---------- LỚP 2+3 GỘP LÀM 1: mái nhà + tấm pin cùng 1 khối, cùng 1
   transform duy nhất -> không thể tách rời nhau dù cuộn nhanh tới đâu ---------- */
function RoofPanelLayer({ progress, sunTop, sunOpacity }: { progress: any; sunTop: any; sunOpacity: any }) {
  const y = useTransform(progress, [0, 1], [0, -50]);
  const horizonOpacity = useTransform(progress, [0, 0.15], [0.5, 1]);

  const glowOpacity = useTransform([sunTop, sunOpacity], ([top, op]: number[]) => {
    const heightFactor = 1 - top / 78;
    return Math.min(0.5, heightFactor * (op as number) * 0.6);
  });

  function generateCells(x: number, y: number, w: number, h: number, cols: number, rows: number) {
    const cw = w / cols;
    const ch = h / rows;
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({ x: x + c * cw, y: y + r * ch, w: cw, h: ch, key: `${x}-${r}-${c}` });
      }
    }
    return cells;
  }

  return (
    <motion.svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full" style={{ y, opacity: horizonOpacity, willChange: "transform" }}>
      <defs>
        <linearGradient id="roofShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2A4A" />
          <stop offset="100%" stopColor="#0B1220" />
        </linearGradient>
        <linearGradient id="frameShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151F38" />
          <stop offset="100%" stopColor="#0B1220" />
        </linearGradient>
        <linearGradient id="cellShade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A4E7A" />
          <stop offset="45%" stopColor="#24365C" />
          <stop offset="100%" stopColor="#182545" />
        </linearGradient>
        <linearGradient id="shineSweep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,227,163,0)" />
          <stop offset="50%" stopColor="rgba(255,227,163,0.35)" />
          <stop offset="100%" stopColor="rgba(255,227,163,0)" />
        </linearGradient>
        <linearGradient id="sunGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,200,120,0.9)" />
          <stop offset="100%" stopColor="rgba(255,200,120,0)" />
        </linearGradient>
        <clipPath id="panelsClip">
          {PANEL_FRAMES.map((f) => (
            <rect key={`${f.x}-${f.y}`} x={f.x} y={f.y} width={f.w} height={f.h} />
          ))}
        </clipPath>
      </defs>

      {/* Mái nhà — sinh từ PLATEAUS, đảm bảo khớp toạ độ với panel */}
      <path d={buildRoofPath()} fill="url(#roofShade)" />

      {/* Panel — đáy luôn = topY của plateau tương ứng, không còn khe hở */}
      {PANEL_FRAMES.map((frame) => (
        <g key={`${frame.x}-${frame.y}`}>
          <rect x={frame.x - 3} y={frame.y - 3} width={frame.w + 6} height={frame.h + 6} fill="url(#frameShade)" rx={2} />
          {generateCells(frame.x, frame.y, frame.w, frame.h, frame.cols, frame.rows).map((cell) => (
            <rect key={cell.key} x={cell.x} y={cell.y} width={cell.w} height={cell.h} fill="url(#cellShade)" stroke="#0B1220" strokeWidth={1.2} />
          ))}
          <line x1={frame.x} y1={frame.y} x2={frame.x + frame.w} y2={frame.y} stroke="rgba(255,227,163,0.45)" strokeWidth={1.5} />
          <motion.rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} fill="url(#sunGlow)" style={{ opacity: glowOpacity }} />
        </g>
      ))}

      <g clipPath="url(#panelsClip)">
        <motion.rect y="0" width="120" height="220" fill="url(#shineSweep)" animate={{ x: [-200, 1500] }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} />
      </g>
    </motion.svg>
  );
}
