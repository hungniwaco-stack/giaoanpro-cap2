import type { Metadata } from "next";
import AppShell from "@/components/AppShell";

// Canonical của trang chủ; mỗi route con tự khai báo canonical riêng (metadata con thay thế hẳn `alternates` của cha).
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
