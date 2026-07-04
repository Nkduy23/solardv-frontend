import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "dark" | "light";
}

export function ProductCard({ product, variant = "dark" }: ProductCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors",
        isDark ? "border-paper/10 bg-paper/5 hover:border-sunrise-amber/40" : "border-navy/10 bg-white hover:border-sunrise-amber/50",
      )}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-navy-light to-navy">
        {product.image && <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
      </div>
      <div className="p-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunrise-amber">{product.category}</span>

        {/* Đã thêm class `truncate` ở đây */}
        <h3 className={cn("mt-2 font-display text-base font-semibold truncate", isDark ? "text-paper" : "text-navy")} title={product.name}>
          {product.name}
        </h3>

        {/* Khuyến khích thêm `line-clamp-2` cho description để card đều nhau */}
        <p className={cn("mt-1 text-sm line-clamp-2", isDark ? "text-paper/60" : "text-navy/60")}>{product.description}</p>
      </div>
    </div>
  );
}
