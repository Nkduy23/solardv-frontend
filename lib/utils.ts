import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Gộp className an toàn (clsx + tailwind-merge) — dùng trong mọi component UI
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
