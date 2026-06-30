import { MapPin, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { ContactForm } from "@/components/sections/ContactForm";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Container } from "@/components/layout/Container";
import { COMPANY_INFO } from "@/lib/constants";

const CONTACT_ITEMS = [
  { icon: MapPin, label: "Địa chỉ", value: COMPANY_INFO.address },
  { icon: Phone, label: "Điện thoại", value: COMPANY_INFO.phone },
  { icon: Mail, label: "Email", value: COMPANY_INFO.email },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Liên hệ" title="Sẵn sàng tư vấn giải pháp phù hợp với công trình của bạn." description="Điền thông tin bên dưới hoặc liên hệ trực tiếp theo thông tin sau." />

      <section className="bg-paper py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <ScrollReveal className="space-y-6">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunrise-amber/15 text-sunrise-copper">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-navy/50">{item.label}</p>
                  <p className="mt-1 text-sm text-navy/80">{item.value}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ContactForm />
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
