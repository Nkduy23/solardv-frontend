export interface VisitPoint {
  date: string; // "01/06"
  pageViews: number;
  visitors: number;
}

export interface AnalyticsOverview {
  totalVisitsToday: number;
  totalVisitsThisMonth: number;
  totalConsultationsThisMonth: number;
  conversionRate: number; // % lượt truy cập -> đăng ký tư vấn
}
