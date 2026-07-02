import { getServices } from "@/lib/api/services.api";
import { getProducts } from "@/lib/api/products.api";
import { getPosts } from "@/lib/api/posts.api";
import { getMediaFiles } from "@/lib/api/media.api";
import { servicesMock } from "@/mocks/services.mock";
import { productsMock } from "@/mocks/products.mock";
import { HomeClient } from "@/components/sections/HomeClient";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default async function HomePage() {
  const [services, products, posts, mediaFiles] = await Promise.all([
    USE_MOCK ? Promise.resolve(servicesMock) : getServices({ limit: 6 }).then((r) => r.data),
    USE_MOCK ? Promise.resolve(productsMock) : getProducts({ limit: 6 }).then((r) => r.data),
    USE_MOCK ? Promise.resolve([]) : getPosts({ published: true, limit: 3 }).then((r) => r.data),
    USE_MOCK ? Promise.resolve([]) : getMediaFiles("handover"),
  ]);

  const images = mediaFiles.map((f) => ({
    id: f.id,
    url: f.url,
    caption: f.caption,
    category: f.category,
  }));

  return <HomeClient services={services} products={products} posts={posts} images={images} />;
}
