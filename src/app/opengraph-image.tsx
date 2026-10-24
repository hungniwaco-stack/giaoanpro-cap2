import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Giáo Án Pro — Cấp 2: soạn giáo án THCS chuẩn Công văn 5512 bằng AI";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf6ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#20291f" }}>Giáo Án Pro — Cấp 2</div>
        <div style={{ marginTop: 20, fontSize: 36, color: "#5b6358" }}>
          Soạn giáo án THCS chuẩn Công văn 5512 bằng AI
        </div>
        <div style={{ marginTop: 12, fontSize: 28, color: "#5b6358" }}>
          Xuất Word & PowerPoint · Dùng thử miễn phí
        </div>
      </div>
    ),
    size
  );
}
