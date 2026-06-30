import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ConsultationFormQuick } from "./ConsultationFormQuick";
import { Container } from "@/components/layout/Container";

export function CtaSection() {
  return (
    <section className="relative py-28 text-navy">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <ScrollReveal>
          <p className="eyebrow mb-4 text-navy/70">Bắt đầu ngay</p>
          <h2 className="max-w-md font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Để lại thông tin, đội ngũ SolarDV sẽ liên hệ tư vấn trong 24h.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ConsultationFormQuick />
        </ScrollReveal>
      </Container>
    </section>
  );
}
