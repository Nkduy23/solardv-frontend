import { Container } from "@/components/layout/Container";

/**
 * Banner đầu trang dùng chung cho các trang con (About, Services, Products,
 * Projects, Contact) — không full-screen như Hero ở Home, chỉ giới thiệu
 * ngắn gọn trang đang ở đâu.
 */
export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="bg-navy pb-20 pt-32 text-paper sm:pb-24 sm:pt-40">
      <Container>
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-5 max-w-xl text-paper/70">{description}</p>}
      </Container>
    </section>
  );
}
