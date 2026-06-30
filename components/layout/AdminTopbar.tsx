"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AdminTopbar({ title }: { title?: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-navy/10 bg-paper/80 px-6 backdrop-blur-sm">
      <h1 className="font-display text-base font-semibold text-navy">{title}</h1>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-navy">{user.fullName}</p>
            <p className="text-xs text-navy/50">{user.role}</p>
          </div>
        )}
        <button
          onClick={() => logout()}
          aria-label="Đăng xuất"
          className="flex size-9 items-center justify-center rounded-full border border-navy/10 text-navy/60 transition-colors hover:border-red-300 hover:text-red-600"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
