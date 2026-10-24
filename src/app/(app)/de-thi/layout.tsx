import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thiết kế đề thi THCS bằng AI — Giáo Án Pro Cấp 2",
  description: "Ra đề kiểm tra THCS trộn trắc nghiệm và tự luận, kèm đáp án, xuất Word và PowerPoint. Dùng thử miễn phí 3 lượt.",
  alternates: { canonical: "/de-thi" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
