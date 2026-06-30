import { Eye, Users, Inbox, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { VisitsChart } from "@/components/admin/VisitsChart";
import { analyticsOverviewMock, visitsMock } from "@/mocks/analytics.mock";
import { consultationsMock } from "@/mocks/consultations.mock";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  DONE: "Hoàn tất",
  CANCELLED: "Đã huỷ",
};

const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-sunrise-amber/15 text-sunrise-copper",
  CONTACTED: "bg-blue-100 text-blue-700",
  DONE: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-navy/10 text-navy/50",
};

export default function AdminDashboardPage() {
  const o = analyticsOverviewMock;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Lượt truy cập hôm nay" value={o.totalVisitsToday.toLocaleString("vi-VN")} icon={Eye} />
        <StatCard label="Lượt truy cập tháng này" value={o.totalVisitsThisMonth.toLocaleString("vi-VN")} icon={Users} trend={{ positive: true, label: "+12% so với tháng trước" }} />
        <StatCard label="Đăng ký tư vấn tháng này" value={String(o.totalConsultationsThisMonth)} icon={Inbox} trend={{ positive: true, label: "+5 so với tuần trước" }} />
        <StatCard label="Tỉ lệ chuyển đổi" value={`${o.conversionRate.toFixed(2)}%`} icon={TrendingUp} />
      </div>

      <VisitsChart data={visitsMock} />

      <div className="rounded-2xl border border-navy/10 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-base font-semibold text-navy">Đăng ký tư vấn gần đây</p>
          <a href="/admin/consultations" className="text-xs font-medium text-sunrise-copper hover:underline">
            Xem tất cả
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy/10 text-xs text-navy/50">
                <th className="pb-3 font-medium">Khách hàng</th>
                <th className="pb-3 font-medium">Điện thoại</th>
                <th className="pb-3 font-medium">Nội dung</th>
                <th className="pb-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {consultationsMock.map((c) => (
                <tr key={c.id} className="border-b border-navy/5 last:border-0">
                  <td className="py-3 font-medium text-navy">{c.fullName}</td>
                  <td className="py-3 text-navy/60">{c.phone}</td>
                  <td className="max-w-xs truncate py-3 text-navy/60">{c.message}</td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_COLOR[c.status])}>{STATUS_LABEL[c.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
