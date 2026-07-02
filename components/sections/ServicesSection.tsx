import { Service } from "@/types/service";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Container } from "@/components/layout/Container";

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="relative py-28 text-paper">
      <Container>
        <ScrollReveal>
          <p className="eyebrow mb-4">Dịch vụ</p>
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">Giải pháp trọn gói, từ khảo sát đến vận hành.</h2>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <ScrollReveal key={service.id} index={i}>
              <div className="h-full rounded-2xl border border-paper/10 bg-paper/5 p-6 backdrop-blur-sm transition-colors hover:border-sunrise-amber/40">
                <span className="font-mono text-xs text-sunrise-amber">0{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">{service.summary}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
