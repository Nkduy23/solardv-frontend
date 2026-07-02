import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPosts } from "@/lib/api/posts.api";
import { postsMock } from "@/mocks/posts.mock";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Container } from "@/components/layout/Container";
import { ArrowLeft } from "lucide-react";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Next.js static params khi build (optional)
export async function generateStaticParams() {
  if (USE_MOCK) return postsMock.map((p) => ({ slug: p.slug }));
  try {
    const { data } = await getPosts({ published: true, limit: 100 });
    return data.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = USE_MOCK ? postsMock.find((p) => p.slug === params.slug) : await getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  if (!post || !post.isPublished) notFound();

  return (
    <div className="bg-paper min-h-screen pt-24 pb-20">
      <Container className="max-w-3xl">
        <ScrollReveal>
          <Link href="/news" className="mb-8 inline-flex items-center gap-2 text-sm text-navy/50 hover:text-navy">
            <ArrowLeft size={15} /> Quay lại tin tức
          </Link>

          <p className="eyebrow mb-4 text-navy/60">{formatDate(post.publishedAt)}</p>

          <h1 className="font-display text-3xl font-semibold leading-tight text-navy sm:text-4xl">{post.title}</h1>

          {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-navy/60 border-l-2 border-sunrise-amber pl-4">{post.excerpt}</p>}
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-10 h-px bg-navy/10" />

          {/* Nội dung bài viết */}
          <div className="prose prose-navy mt-10 max-w-none text-navy/80">
            {post.content ? (
              // Khi BE trả về HTML string từ rich text editor
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-navy/40 italic">Nội dung đang được cập nhật...</p>
            )}
          </div>

          <div className="mt-14 h-px bg-navy/10" />

          <div className="mt-8 flex items-center justify-between">
            <Link href="/news" className="inline-flex items-center gap-2 text-sm font-medium text-sunrise-copper hover:underline">
              <ArrowLeft size={15} /> Xem tất cả bài viết
            </Link>
            <Link href="/contact" className="text-sm font-medium text-navy/50 hover:text-navy">
              Liên hệ tư vấn →
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </div>
  );
}
