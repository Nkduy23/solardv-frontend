import type { MetadataRoute } from "next";
import { getServices } from "@/lib/api/services.api";
import { getProducts } from "@/lib/api/products.api";
import { getProjects } from "@/lib/api/projects.api";
import { getPosts } from "@/lib/api/posts.api";

const SITE_URL = "https://www.ducvinhgreen.io.vn/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];

  // Lấy dynamic routes từ BE — nếu lỗi (BE chưa sẵn sàng khi build) thì bỏ qua, không làm fail cả build
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const [services, products, projects, posts] = await Promise.all([
      getServices({ limit: 100 })
        .then((r) => r.data)
        .catch(() => []),
      getProducts({ limit: 100 })
        .then((r) => r.data)
        .catch(() => []),
      getProjects({ limit: 100 })
        .then((r) => r.data)
        .catch(() => []),
      getPosts({ published: true, limit: 100 })
        .then((r) => r.data)
        .catch(() => []),
    ]);

    dynamicPages = [
      ...products.map((p: any) => ({
        url: `${SITE_URL}/products/${p.slug}`,
        lastModified: new Date(p.updatedAt ?? p.createdAt ?? Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...projects.map((p: any) => ({
        url: `${SITE_URL}/projects/${p.slug}`,
        lastModified: new Date(p.updatedAt ?? p.createdAt ?? Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...posts.map((p: any) => ({
        url: `${SITE_URL}/news/${p.slug}`,
        lastModified: new Date(p.publishedAt ?? Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      ...services.map((s: any) => ({
        url: `${SITE_URL}/services/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch {
    // BE không phản hồi lúc build — sitemap vẫn có static pages
  }

  return [...staticPages, ...dynamicPages];
}
