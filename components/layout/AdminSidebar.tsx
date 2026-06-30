"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Inbox, Wrench, Package, Building2, Newspaper, Images, Settings, ChevronLeft, Sun } from "lucide-react";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS = {
  LayoutDashboard,
  Inbox,
  Wrench,
  Package,
  Building2,
  Newspaper,
  Images,
  Settings,
} as const;

export function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 flex h-screen shrink-0 flex-col border-r border-navy/10 bg-navy text-paper"
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-display text-sm font-semibold">
            <Sun size={18} className="text-sunrise-amber" />
            SolarDV
          </Link>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          className="ml-auto flex size-8 items-center justify-center rounded-lg text-paper/60 hover:bg-paper/10 hover:text-paper"
        >
          <ChevronLeft size={16} className={cn("transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = ICONS[link.icon];
          const active = pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm transition-colors",
                active ? "bg-sunrise-amber/15 text-sunrise-amber" : "text-paper/60 hover:bg-paper/5 hover:text-paper",
                collapsed && "justify-center px-0",
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
