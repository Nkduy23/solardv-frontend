"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackVisit } from "@/lib/api/analytics.api";

/**
 * Ghi nhận 1 lượt xem trang mỗi khi pathname đổi — chỉ dùng trong (client) layout,
 * KHÔNG import vào layout admin để không lẫn traffic admin vào số liệu.
 */
export function useVisitTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Tránh track trùng nếu effect chạy 2 lần (React StrictMode ở dev)
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    trackVisit(pathname);
  }, [pathname]);
}
