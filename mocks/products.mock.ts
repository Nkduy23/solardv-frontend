import { Product } from "@/types/product";

export const productsMock: Product[] = [
  {
    id: "prod-1",
    name: "Tấm pin Mono PERC 550W",
    slug: "tam-pin-mono-perc-550w",
    category: "Tấm pin",
    description: "Hiệu suất chuyển đổi cao, phù hợp mái dân dụng và công nghiệp.",
    image: "/images/placeholder-product-1.jpg",
  },
  {
    id: "prod-2",
    name: "Biến tần hòa lưới 10kW",
    slug: "bien-tan-hoa-luoi-10kw",
    category: "Biến tần",
    description: "Chuyển đổi DC-AC ổn định, tích hợp giám sát từ xa qua ứng dụng.",
    image: "/images/placeholder-product-2.jpg",
  },
  {
    id: "prod-3",
    name: "Hệ thống lưu trữ pin 5kWh",
    slug: "he-thong-luu-tru-pin-5kwh",
    category: "Lưu trữ",
    description: "Dự trữ điện năng dư thừa, chủ động nguồn điện khi mất lưới.",
    image: "/images/placeholder-product-3.jpg",
  },
];
