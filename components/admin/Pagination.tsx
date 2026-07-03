"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, total, limit, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Hiển thị tối đa 5 trang, với ellipsis
  function getVisible() {
    if (totalPages <= 5) return pages;
    if (page <= 3) return [...pages.slice(0, 5), -1, totalPages];
    if (page >= totalPages - 2) return [1, -1, ...pages.slice(totalPages - 5)];
    return [1, -1, page - 1, page, page + 1, -2, totalPages];
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <p className="text-navy/50">
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total} kết quả
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex size-8 items-center justify-center rounded-lg border border-navy/10 text-navy/50 transition-colors hover:border-navy/30 hover:text-navy disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft size={15} />
        </button>

        {getVisible().map((p, i) =>
          p < 0 ? (
            <span key={p + "_" + i} className="px-1 text-navy/30">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                p === page ? "border-sunrise-amber bg-sunrise-amber text-navy" : "border-navy/10 text-navy/60 hover:border-navy/30 hover:text-navy",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="flex size-8 items-center justify-center rounded-lg border border-navy/10 text-navy/50 transition-colors hover:border-navy/30 hover:text-navy disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
