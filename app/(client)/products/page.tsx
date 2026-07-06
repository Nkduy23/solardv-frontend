import { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";

export const metadata: Metadata = {
  title: "Sản phẩm | SolarDV — Thiết bị điện mặt trời chính hãng",
  description: "Tấm pin, biến tần và hệ thống lưu trữ điện năng lượng mặt trời chính hãng, bảo hành rõ ràng từ SolarDV.",
  openGraph: {
    title: "Sản phẩm | SolarDV",
    description: "Thiết bị điện mặt trời chính hãng — tấm pin, biến tần, lưu trữ.",
    url: "https://www.ducvinhgreen.io.vn//products",
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
