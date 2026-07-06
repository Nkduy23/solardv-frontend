"use client";

import { useEffect, useState } from "react";

/**
 * Trả về false khi tab đang bị ẩn (user chuyển sang tab khác / minimize).
 * Dùng để tạm dừng các animation vô hạn (particles, mây, aurora...) — tránh
 * tốn CPU/GPU và pin của người dùng khi họ không thực sự nhìn vào trang.
 */
export function usePageVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return visible;
}
