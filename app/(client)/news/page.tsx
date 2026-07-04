export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/api/posts.api";
import { postsMock } from "@/mocks/posts.mock";
import { PageHeader } from "@/components/sections/PageHeader";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Tin tức | SolarDV — Kiến thức điện năng lượng mặt trời",
  description: "Cập nhật kiến thức, xu hướng và chính sách về điện năng lượng mặt trời từ đội ngũ SolarDV.",
  openGraph: {
    title: "Tin tức | SolarDV",
    description: "Kiến thức & cập nhật về điện mặt trời từ SolarDV.",
    url: "https://solardv.vn/news",
  },
};

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function NewsPage() {
  const posts = USE_MOCK ? postsMock.filter((p) => p.isPublished) : (await getPosts({ published: true, limit: 50 })).data;

  return (
    <>
      <PageHeader eyebrow="Tin tức" title="Kiến thức & cập nhật từ SolarDV." description="Những bài viết hữu ích về điện năng lượng mặt trời, công nghệ và chính sách năng lượng sạch." />
      <section className="bg-paper py-24">
        <Container>
          {posts.length === 0 ? (
            <p className="py-20 text-center text-navy/40">Chưa có bài viết nào.</p>
          ) : (
            <StaggerList className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <StaggerItem key={post.id}>
                  <Link href={`/news/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white transition-colors hover:border-sunrise-amber/50">
                    <div className="aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-navy-light to-navy">
                      {post.thumbnail && <img src={post.thumbnail} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="font-mono text-xs text-sunrise-copper">{formatDate(post.publishedAt)}</span>
                      <h2 className="mt-3 font-display text-lg font-semibold text-navy group-hover:text-sunrise-copper">{post.title}</h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/60">{post.excerpt}</p>
                      <span className="mt-5 text-xs font-medium text-sunrise-copper">Đọc tiếp →</span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </Container>
      </section>
    </>
  );
}
