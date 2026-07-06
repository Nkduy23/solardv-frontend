import type { Metadata } from "next";
import { Space_Grotesk, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ToastProvider } from "@/hooks/useToast";

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
    url: "https://www.ducvinhgreen.io.vn/",
    siteName: "SolarDV",
    title: "SolarDV — Giải pháp điện năng lượng mặt trời",
    description: "Thiết kế, thi công và vận hành hệ thống điện năng lượng mặt trời — từ khảo sát đến bảo trì dài hạn.",
    images: [
      {
        url: "https://www.ducvinhgreen.io.vn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SolarDV — Giải pháp điện năng lượng mặt trời",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SolarDV — Giải pháp điện năng lượng mặt trời",
    description: "Thiết kế, thi công và vận hành hệ thống điện năng lượng mặt trời.",
    images: ["https://www.ducvinhgreen.io.vn/og-image.jpg"],
  },
  icons: {
    icon: "https://www.ducvinhgreen.io.vn/favicon.png",
    shortcut: "https://www.ducvinhgreen.io.vn/favicon.png",
    apple: "https://www.ducvinhgreen.io.vn/apple-icon.png",
  },
  robots: { index: true, follow: true },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${spaceGrotesk.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ToastProvider>{children}</ToastProvider>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <Analytics />
      </body>
    </html>
  );
}
