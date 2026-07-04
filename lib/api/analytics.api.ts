import apiClient from "./client";
import { AnalyticsOverview, VisitPoint } from "@/types/analytics";

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const { data } = await apiClient.get("/analytics/overview");
  return data.data;
}

export async function getVisits(params?: { from?: string; to?: string; groupBy?: "day" | "week" | "month" }): Promise<VisitPoint[]> {
  const { data } = await apiClient.get("/analytics/visits", { params });
  return data.data;
}

// Gọi bởi khách hàng thật khi vào trang client — không cần auth, không dùng ở admin
export async function trackVisit(path?: string): Promise<void> {
  try {
    await apiClient.post("/analytics/track", { path });
  } catch {
    // im lặng bỏ qua — không ảnh hưởng trải nghiệm người dùng nếu tracking lỗi
  }
}
