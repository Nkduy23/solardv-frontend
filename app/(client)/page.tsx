"use client";

import { useRef } from "react";
import { ParallaxBackground } from "@/components/motion/ParallaxBackground";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { CtaSection } from "@/components/sections/CtaSection";

export default function HomePage() {
  // targetRef bao trùm toàn bộ phần "Sunrise Scroll" (Hero -> trước CTA),
  // CTA dùng nền sáng riêng nên nằm ngoài track.
  const sunriseTrackRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={sunriseTrackRef} className="relative">
        <ParallaxBackground targetRef={sunriseTrackRef} />
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProductGrid />
      </div>

      <div className="bg-paper">
        <CtaSection />
      </div>
    </>
  );
}
