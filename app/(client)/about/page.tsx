import { PageHeader } from "@/components/sections/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { StaggerList, StaggerItem } from "@/components/motion/StaggerList";
import { Container } from "@/components/layout/Container";

const VALUES = [
  {
    title: "Chất lượng thi công",
    desc: "Tuân thủ tiêu chuẩn kỹ thuật, kiểm tra nghiệm thu chặt chẽ ở mọi công đoạn.",
  },
  {
    title: "Minh bạch chi phí",
    desc: "Báo giá rõ ràng theo từng hạng mục, không phát sinh ẩn trong quá trình thi công.",
  },
  {
    title: "Đồng hành dài hạn",
    desc: "Bảo trì, giám sát vận hành sau lắp đặt để hệ thống vận hành ổn định lâu dài.",
  },
];

const TIMELINE = [
  { year: "2016", desc: "Thành lập, hoạt động trong lĩnh vực thi công hệ thống điện." },
  { year: "2020", desc: "Mở rộng sang lắp đặt thiết bị cơ điện lạnh và viễn thông." },
  { year: "2023", desc: "Phát triển mảng giải pháp điện năng lượng mặt trời." },
  { year: "2026", desc: "Ra mắt nền tảng SolarDV, số hoá quy trình tư vấn và quản lý." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Giới thiệu"
        title="Đức Vinh Việt Nam — đối tác kỹ thuật điện cho công trình của bạn."
        description="Từ thi công hệ thống điện truyền thống đến giải pháp năng lượng mặt trời, chúng tôi đồng hành cùng khách hàng ở mọi quy mô công trình."
      />

      <section className="bg-paper py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <p className="eyebrow mb-4 text-navy/70">Câu chuyện</p>
            <h2 className="font-display text-2xl font-semibold text-navy sm:text-3xl">Bắt đầu từ thi công điện dân dụng, mở rộng sang năng lượng sạch.</h2>
            <p className="mt-5 text-navy/70">
              Công ty TNHH Đức Vinh Việt Nam hoạt động trong lĩnh vực thi công, lắp đặt và cung cấp giải pháp kỹ thuật điện cho công trình dân dụng và công nghiệp, bao gồm thiết bị điện, hệ thống bưu
              chính viễn thông, cơ điện lạnh và điện năng lượng mặt trời.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ul className="space-y-6 border-l border-navy/10 pl-6">
              {TIMELINE.map((item) => (
                <li key={item.year}>
                  <span className="font-mono text-xs text-sunrise-copper">{item.year}</span>
                  <p className="mt-1 text-sm text-navy/70">{item.desc}</p>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </Container>
      </section>

      <section className="bg-navy py-24 text-paper">
        <Container>
          <ScrollReveal>
            <p className="eyebrow mb-4">Giá trị cốt lõi</p>
            <h2 className="max-w-xl font-display text-2xl font-semibold sm:text-3xl">Những nguyên tắc giữ vững trong từng công trình.</h2>
          </ScrollReveal>

          <StaggerList className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <StaggerItem key={value.title}>
                <div className="h-full rounded-2xl border border-paper/10 bg-paper/5 p-6">
                  <span className="font-mono text-xs text-sunrise-amber">0{i + 1}</span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-paper/60">{value.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </Container>
      </section>
    </>
  );
}
