import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  /** vd: "+12% so với tháng trước" */
  trend?: { positive: boolean; label: string };
}) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-navy/50">{label}</p>
        <div className="flex size-8 items-center justify-center rounded-full bg-sunrise-amber/15 text-sunrise-copper">
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-navy">{value}</p>
      {trend && <p className={cn("mt-1 text-xs font-medium", trend.positive ? "text-emerald-600" : "text-red-600")}>{trend.label}</p>}
    </div>
  );
}
