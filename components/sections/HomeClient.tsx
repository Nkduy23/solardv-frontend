"use client";

import { useRef } from "react";
import { Service } from "@/types/service";
import { Product } from "@/types/product";
import { Post } from "@/types/post";
import { GalleryImage } from "./GallerySection";
import { ParallaxBackground } from "@/components/motion/ParallaxBackground";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { ServicesSection } from "./ServicesSection";
import { ProductGrid } from "./ProductGrid";
import { GallerySection } from "./GallerySection";
import { NewsSection } from "./NewsSection";
import { CtaSection } from "./CtaSection";

interface HomeClientProps {
  services: Service[];
  products: Product[];
  posts: Post[];
  images: GalleryImage[];
}

export function HomeClient({ services, products, posts, images }: HomeClientProps) {
  const sunriseTrackRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={sunriseTrackRef} className="relative">
        <ParallaxBackground targetRef={sunriseTrackRef} />
        <HeroSection />
        <AboutSection />
        <ServicesSection services={services} />
        <ProductGrid products={products} />
      </div>

      <GallerySection images={images} />
      <NewsSection posts={posts} />

      <div className="bg-paper">
        <CtaSection />
      </div>
    </>
  );
}
