import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Chuyển tiêu đề tiếng Việt có dấu thành slug URL-safe
// "Hệ thống điện mặt trời" -> "he-thong-dien-mat-troi"
export function slugify(text: string): string {
  return text
    .normalize("NFD") // tách dấu ra khỏi ký tự gốc
    .replace(/[\u0300-\u036f]/g, "") // xoá các dấu (accent marks)
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D") // đ/Đ không tách được bằng NFD
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // xoá ký tự đặc biệt còn sót
    .replace(/\s+/g, "-") // khoảng trắng -> gạch ngang
    .replace(/-+/g, "-") // gộp nhiều gạch ngang liên tiếp
    .replace(/^-|-$/g, ""); // xoá gạch ngang đầu/cuối
}
