import { productsMock } from "@/mocks/products.mock";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import { ProductCard } from "./ProductCard";
import { Container } from "@/components/layout/Container";

export function ProductGrid() {
  return (
    <section className="relative py-28 text-paper">
      <Container>
        <ScrollReveal>
          <p className="eyebrow mb-4">Sản phẩm nổi bật</p>
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">Thiết bị chính hãng, bảo hành rõ ràng.</h2>
        </ScrollReveal>

        <StaggerList className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productsMock.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerList>
      </Container>
    </section>
  );
}
