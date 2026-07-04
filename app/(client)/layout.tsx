"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";
import { useVisitTracker } from "@/hooks/useVisitTracker";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useVisitTracker();

  return (
    <>
      <Header />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
