import { AnalyticsOverview, VisitPoint } from "@/types/analytics";

// Dữ liệu mẫu cho Dashboard — sẽ thay bằng GET /analytics/overview và
// GET /analytics/visits khi nối backend thật (xem lib/api/analytics.api.ts).
export const analyticsOverviewMock: AnalyticsOverview = {
  totalVisitsToday: 342,
  totalVisitsThisMonth: 8540,
  totalConsultationsThisMonth: 47,
  conversionRate: 0.55,
};

export const visitsMock: VisitPoint[] = [
  { date: "01/06", pageViews: 220, visitors: 140 },
  { date: "05/06", pageViews: 310, visitors: 190 },
  { date: "10/06", pageViews: 280, visitors: 175 },
  { date: "15/06", pageViews: 410, visitors: 260 },
  { date: "20/06", pageViews: 380, visitors: 230 },
  { date: "25/06", pageViews: 460, visitors: 300 },
  { date: "30/06", pageViews: 520, visitors: 340 },
];
