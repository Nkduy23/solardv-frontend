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
    <section className="bg-navy py-24 text-paper">
      <Container>
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

      {/* Lightbox */}
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
