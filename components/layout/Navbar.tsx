"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "font-display text-sm font-medium text-paper/70 transition-colors hover:text-paper",
            pathname === link.href && "text-paper",
          )}
        >
          {link.label}
        </Link>
      ))}
      <Button variant="primary" className="px-5 py-2.5 text-xs">
        Đăng ký tư vấn
      </Button>
    </nav>
  );
}
