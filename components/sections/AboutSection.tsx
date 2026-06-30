import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Container } from "@/components/layout/Container";

const STATS = [
  { label: "Công trình đã triển khai", value: "120+" },
  { label: "Năm kinh nghiệm", value: "8" },
  { label: "Công suất lắp đặt", value: "15 MWp" },
];

export function AboutSection() {
  return (
    <section className="relative py-28 text-paper">
      <Container>
        <ScrollReveal>
          <p className="eyebrow mb-4">Về chúng tôi</p>
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Đồng hành cùng quá trình chuyển đổi sang năng lượng sạch.
          </h2>
          <p className="mt-5 max-w-xl text-paper/70">
            Đức Vinh Việt Nam hoạt động trong lĩnh vực thi công, lắp đặt hệ thống điện
            cho công trình dân dụng và công nghiệp, từng bước mở rộng sang các giải
            pháp điện năng lượng mặt trời bền vững.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} index={i}>
              <p className="font-mono text-3xl font-medium text-sunrise-amber sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-paper/60">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
