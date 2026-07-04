import Link from "next/link";
import { Post } from "@/types/post";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import { Container } from "@/components/layout/Container";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function NewsSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-paper py-24">
      {/* Blend từ navy (đáy GallerySection) sang paper — tránh chuyển tối
          sang sáng đột ngột, vốn là kiểu ranh giới dễ "giật mắt" nhất trong
          các cặp section liền kề của trang. NewsSection -> CtaSection thì
          không cần blend vì cả 2 đều bg-paper, đã liền màu sẵn. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy/15 to-transparent sm:h-56" />

      <Container className="relative">
        <ScrollReveal>
          <p className="eyebrow mb-4 text-navy/70">Tin tức</p>
          <h2 className="max-w-xl font-display text-3xl font-semibold text-navy sm:text-4xl">Kiến thức & cập nhật từ SolarDV.</h2>
        </ScrollReveal>

        <StaggerList className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/news/${post.slug}`} className="group block h-full overflow-hidden rounded-2xl border border-navy/10 bg-white transition-colors hover:border-sunrise-amber/50">
                <div className="aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-navy-light to-navy">
                  {post.thumbnail && <img src={post.thumbnail} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                </div>
                <div className="p-6">
                  <span className="font-mono text-xs text-sunrise-copper">{formatDate(post.publishedAt)}</span>
                  <h3 className="mt-3 font-display text-base font-semibold text-navy group-hover:text-sunrise-copper">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-navy/60">{post.excerpt}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerList>

        <ScrollReveal className="mt-10 text-center">
          <Link href="/news" className="font-display text-sm font-medium text-sunrise-copper hover:underline">
            Xem tất cả bài viết →
          </Link>
        </ScrollReveal>
      </Container>
    </section>
  );
}
