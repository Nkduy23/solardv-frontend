"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Container } from "./Container";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? "bg-navy/80 backdrop-blur-md" : "bg-transparent"}`}>
      <Container className="flex h-16 items-center justify-between lg:h-20">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-paper">
          <Image src="https://res.cloudinary.com/fieao5lz/image/upload/v1783314401/ChatGPT_Image_12_05_11_6_thg_7_2026_fbdpvw.png" alt={SITE_NAME} width={200} height={200}></Image>
        </Link>
        <Navbar />
        <MobileMenu />
      </Container>
    </header>
  );
}
