"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyText?: string;
}

export function DataTable<T>({ columns, data, keyExtractor, emptyText = "Chưa có dữ liệu" }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy/10">
            {columns.map((col) => (
              <th key={col.key} className={cn("px-5 py-3.5 text-xs font-medium text-navy/50", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-navy/40">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="border-b border-navy/5 transition-colors hover:bg-navy/[0.02] last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-5 py-3.5", col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
