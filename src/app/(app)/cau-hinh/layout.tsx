import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cấu hình cá nhân — Giáo Án Pro Cấp 2",
  alternates: { canonical: "/cau-hinh" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
