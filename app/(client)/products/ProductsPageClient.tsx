"use client";

import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/lib/api/products.api";
import { productsMock } from "@/mocks/products.mock";
import { Product } from "@/types/product";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductCard } from "@/components/sections/ProductCard";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(USE_MOCK ? productsMock : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [active, setActive] = useState("Tất cả");

  useEffect(() => {
    if (USE_MOCK) return;
    getProducts({ limit: 100 })
      .then((res) => setProducts(res.data.map((p: any) => ({ ...p, image: p.images?.[0] ?? "" }))))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["Tất cả", ...Array.from(new Set(products.map((p) => p.category)))], [products]);

  const filtered = active === "Tất cả" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <PageHeader eyebrow="Sản phẩm" title="Thiết bị chính hãng, lựa chọn theo nhu cầu công trình." description="Tấm pin, biến tần và hệ thống lưu trữ — đầy đủ thông số và bảo hành rõ ràng." />
      <section className="bg-paper py-24">
        <Container>
          <div className="mb-12 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "rounded-full border px-4 py-2 font-display text-sm transition-colors",
                  active === cat ? "border-sunrise-amber bg-sunrise-amber text-navy" : "border-navy/15 text-navy/60 hover:border-navy/30",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-navy/5" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-20 text-center text-navy/40">Chưa có sản phẩm nào.</p>
          ) : (
            <StaggerList key={active} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} variant="light" />
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </Container>
      </section>
    </>
  );
}
