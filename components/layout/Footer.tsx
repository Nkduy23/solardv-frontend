import Link from "next/link";
import { Container } from "./Container";
import { NAV_LINKS, COMPANY_INFO, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-navy text-paper/70">
      <Container className="grid gap-10 py-16 lg:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-paper">{SITE_NAME}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Giải pháp điện năng lượng mặt trời cho công trình dân dụng và công nghiệp —
            bởi {COMPANY_INFO.fullName}.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Điều hướng</p>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Liên hệ</p>
          <ul className="space-y-2 text-sm">
            <li>{COMPANY_INFO.address}</li>
            <li>{COMPANY_INFO.phone}</li>
            <li>{COMPANY_INFO.email}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-paper/10 py-6 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} {COMPANY_INFO.fullName}. All rights reserved.
      </div>
    </footer>
  );
}
