import type { Metadata } from "next";
import { Literata, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import RefCapture from "@/components/RefCapture";
import { PLAN_PRICE_VND } from "@/lib/plans";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["vietnamese", "latin"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const SITE_URL = "https://cap2.giaoanpro.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AI Giáo Án Pro 2026 — Soạn giáo án THCS chuẩn 5512 bằng AI",
  description:
    "Tạo giáo án THCS chuẩn Công văn 5512, sách Kết nối tri thức, xuất thẳng file Word chỉ trong vài giây. Dùng thử miễn phí 3 lượt mỗi chức năng.",
  keywords: ["giáo án AI", "soạn giáo án", "công văn 5512", "giáo án THCS", "kết nối tri thức"],
  openGraph: {
    title: "AI Giáo Án Pro 2026",
    description: "Soạn giáo án THCS chuẩn 5512 bằng AI, xuất thẳng file Word.",
    locale: "vi_VN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const prices = Object.values(PLAN_PRICE_VND);

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Giáo Án Pro — Cấp 2",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "vi",
  url: SITE_URL,
  description: metadata.description,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "VND",
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: prices.length,
  },
  provider: { "@type": "Organization", name: "Giáo Án Pro", url: "https://www.giaoanpro.com" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${literata.variable} ${beVietnam.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
        <RefCapture />
        {children}
      </body>
    </html>
  );
}
