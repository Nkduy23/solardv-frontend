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
