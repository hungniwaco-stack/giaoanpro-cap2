import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch sử soạn thảo — Giáo Án Pro Cấp 2",
  alternates: { canonical: "/lich-su" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
