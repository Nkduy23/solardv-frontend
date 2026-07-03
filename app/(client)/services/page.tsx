import type { Metadata } from "next";
import { getServices } from "@/lib/api/services.api";
import { servicesMock } from "@/mocks/services.mock";
import { PageHeader } from "@/components/sections/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Dịch vụ | SolarDV — Giải pháp điện năng lượng mặt trời",
  description: "SolarDV cung cấp giải pháp trọn gói: khảo sát, thiết kế, thi công và bảo trì hệ thống điện mặt trời cho dân dụng và công nghiệp.",
  openGraph: {
    title: "Dịch vụ | SolarDV",
    description: "Giải pháp điện mặt trời trọn gói — từ khảo sát đến vận hành.",
    url: "https://solardv.vn/services",
  },
};

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default async function ServicesPage() {
  const services = USE_MOCK ? servicesMock : (await getServices({ limit: 50 })).data;

  return (
    <>
      <PageHeader
        eyebrow="Dịch vụ"
        title="Giải pháp trọn gói cho mọi quy mô công trình."
        description="Từ khảo sát, thiết kế, thi công đến bảo trì dài hạn — đội ngũ SolarDV đồng hành xuyên suốt vòng đời hệ thống."
      />
      <section className="bg-paper py-24">
        <Container className="space-y-6">
          {services.length === 0 ? (
            <p className="py-20 text-center text-navy/40">Chưa có dịch vụ nào.</p>
          ) : (
            services.map((service, i) => (
              <ScrollReveal key={service.id} index={i}>
                <div className="grid items-center gap-6 rounded-2xl border border-navy/10 bg-white p-8 transition-colors hover:border-sunrise-amber/50 lg:grid-cols-[auto_1fr_auto] lg:gap-10">
                  <span className="font-mono text-2xl font-medium text-sunrise-copper">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-navy">{service.title}</h3>
                    <p className="mt-2 text-sm text-navy/60">{service.summary}</p>
                    {service.detail && <p className="mt-2 text-sm leading-relaxed text-navy/50">{service.detail}</p>}
                  </div>
                  <Button variant="secondary" className="w-full lg:w-auto">
                    Tìm hiểu thêm
                  </Button>
                </div>
              </ScrollReveal>
            ))
          )}
        </Container>
      </section>
    </>
  );
}
