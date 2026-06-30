"use client";

import { useMemo, useState } from "react";
import { productsMock } from "@/mocks/products.mock";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductCard } from "@/components/sections/ProductCard";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const categories = useMemo(() => ["Tất cả", ...Array.from(new Set(productsMock.map((p) => p.category)))], []);
  const [active, setActive] = useState("Tất cả");

  const filtered = active === "Tất cả" ? productsMock : productsMock.filter((p) => p.category === active);

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

          <StaggerList key={active} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} variant="light" />
              </StaggerItem>
            ))}
          </StaggerList>
        </Container>
      </section>
    </>
  );
}
