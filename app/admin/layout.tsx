"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { ADMIN_NAV_LINKS } from "@/lib/constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Trang login dùng layout riêng (full-screen, không sidebar/topbar)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const currentTitle = ADMIN_NAV_LINKS.find((link) => pathname === link.href || pathname.startsWith(link.href + "/"))?.label;

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar title={currentTitle} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
