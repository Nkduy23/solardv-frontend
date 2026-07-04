"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Container } from "@/components/layout/Container";

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category?: string;
}

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  if (images.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-navy py-24 text-paper">
      {/* Blend transition — hắt màu hoàng hôn từ ParallaxBackground xuống,
          nhạt dần thành navy. Đây là lớp DUY NHẤT xử lý vụ "cắt ngang", vì
          bg-navy vốn là màu đặc, không có gì để mắt "trôi" qua. Đặt height
          đủ lớn (~320px) để độ chuyển đủ mượt, không tạo viền rõ ở đáy dải
          gradient. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#C9742C]/35 via-[#5B3A29]/20 to-transparent sm:h-96" />

      {/* Vài hạt sáng trôi nhẹ, độc lập với scroll — nối tiếp cảm giác
          "năng lượng toả ra" từ SolarParticles ở Hero, chỉ đặt trong vùng
          blend phía trên để không lặp lại quá nhiều xuống cuối section. */}
      <AmbientEmbers />

      <Container className="relative">
        <ScrollReveal>
          <p className="eyebrow mb-4">Thư viện bàn giao</p>
          <h2 className="max-w-xl font-display text-3xl font-semibold sm:text-4xl">Hình ảnh công trình thực tế.</h2>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
              onClick={() => setLightbox(img)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-navy-light to-navy"
            >
              {img.url && (
                <img src={img.url} alt={img.caption ?? "Ảnh công trình SolarDV"} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/30" />
            </motion.button>
          ))}
        </div>
      </Container>

      {/* Lightbox — giữ nguyên không đổi */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.url} alt={lightbox.caption ?? "Ảnh công trình"} className="max-h-[85vh] w-full object-contain" />
              {lightbox.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-navy/70 px-4 py-3 backdrop-blur-sm">
                  <p className="text-sm text-paper/90">{lightbox.caption}</p>
                </div>
              )}
              <button onClick={() => setLightbox(null)} className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-navy/60 text-paper backdrop-blur-sm hover:bg-navy">
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * Hạt sáng trôi nhẹ, chỉ 4 hạt, giới hạn trong vùng blend phía trên section
 * (top ~280px) — không dùng useScroll vì section này nằm ngoài track chính,
 * chạy loop độc lập giống SolarParticles nhưng ít + mờ hơn để không "giành"
 * sự chú ý với ảnh gallery bên dưới.
 */
function AmbientEmbers() {
  const embers = [
    { left: "15%", size: 3, duration: 10, delay: 0 },
    { left: "42%", size: 2, duration: 13, delay: 2 },
    { left: "68%", size: 3, duration: 11, delay: 4 },
    { left: "88%", size: 2, duration: 14, delay: 1 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
      {embers.map((e, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: e.left,
            top: "60%",
            width: e.size,
            height: e.size,
            background: "rgba(245,166,35,0.7)",
            boxShadow: "0 0 6px 2px rgba(245,166,35,0.4)",
          }}
          animate={{ y: ["0%", "-140%"], opacity: [0, 0.7, 0] }}
          transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
