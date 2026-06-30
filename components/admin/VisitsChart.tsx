"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { VisitPoint } from "@/types/analytics";

export function VisitsChart({ data }: { data: VisitPoint[] }) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-base font-semibold text-navy">Lượt truy cập</p>
          <p className="text-xs text-navy/50">Theo dõi pageviews & visitors 30 ngày gần nhất</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-navy/60">
            <span className="size-2 rounded-full bg-sunrise-amber" /> Pageviews
          </span>
          <span className="flex items-center gap-1.5 text-navy/60">
            <span className="size-2 rounded-full bg-navy/40" /> Visitors
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5A623" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#F5A623" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B1220" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#0B1220" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#0B122014" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#0B122080" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#0B122080" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #0B122014",
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="pageViews" stroke="#F5A623" strokeWidth={2} fill="url(#pageViewsGradient)" />
            <Area type="monotone" dataKey="visitors" stroke="#0B1220" strokeWidth={2} fill="url(#visitorsGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
