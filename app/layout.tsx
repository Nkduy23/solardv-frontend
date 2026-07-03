import type { Metadata } from "next";
import { Space_Grotesk, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--space-grotesk" });
const beVietnamPro = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600"], variable: "--be-vietnam-pro" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--jetbrains-mono" });

export const metadata: Metadata = {
  title: {
    default: "SolarDV — Giải pháp điện năng lượng mặt trời",
    template: "%s | SolarDV",
  },
  description: "SolarDV cung cấp giải pháp điện năng lượng mặt trời cho công trình dân dụng và công nghiệp — bởi Công ty TNHH Đức Vinh Việt Nam.",
  keywords: ["điện mặt trời", "năng lượng mặt trời", "lắp đặt điện mặt trời", "Đức Vinh", "SolarDV"],
  authors: [{ name: "SolarDV" }],
  creator: "SolarDV",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://solardv.vn",
    siteName: "SolarDV",
    title: "SolarDV — Giải pháp điện năng lượng mặt trời",
    description: "Thiết kế, thi công và vận hành hệ thống điện năng lượng mặt trời — từ khảo sát đến bảo trì dài hạn.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${spaceGrotesk.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
