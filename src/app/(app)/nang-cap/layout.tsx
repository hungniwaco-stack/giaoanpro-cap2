import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nâng cấp tài khoản — Giáo Án Pro Cấp 2",
  alternates: { canonical: "/nang-cap" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
