import { Post } from "@/types/post";

export const postsMock: Post[] = [
  {
    id: "p-1",
    title: "Điện mặt trời áp mái — xu hướng 2026",
    slug: "dien-mat-troi-ap-mai-2026",
    excerpt: "Tổng quan thị trường và chính sách hỗ trợ điện mặt trời áp mái tại Việt Nam năm 2026.",
    isPublished: true,
    publishedAt: "2026-06-20T07:00:00Z",
  },
  {
    id: "p-2",
    title: "Cách tính toán công suất hệ thống phù hợp",
    slug: "cach-tinh-cong-suat-he-thong",
    excerpt: "Hướng dẫn đơn giản giúp chủ nhà tự tính công suất hệ thống điện mặt trời phù hợp nhu cầu.",
    isPublished: true,
    publishedAt: "2026-06-10T07:00:00Z",
  },
  {
    id: "p-3",
    title: "So sánh biến tần on-grid và hybrid",
    slug: "so-sanh-bien-tan-on-grid-hybrid",
    excerpt: "Phân tích ưu nhược điểm từng loại biến tần để lựa chọn phù hợp với mục tiêu sử dụng.",
    isPublished: false,
    publishedAt: null,
  },
];
