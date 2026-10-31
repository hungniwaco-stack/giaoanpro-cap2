// ponytail: THCS chưa có KaTeX/Word-equation như Cấp 3, nên yêu cầu AI viết công thức bằng ký tự Unicode thường
// (x², √, ×, ÷, ≤, ≥, ≠, π, phân số 1/2) để hiển thị đúng ở màn hình, Word và PowerPoint.
// Nâng lên LaTeX + KaTeX như Cấp 3 nếu cần công thức phức tạp (ma trận, tích phân).
export const MATH_INSTRUCTION =
  "Công thức Toán/Lý/Hóa viết bằng ký tự Unicode thông thường, dễ đọc, KHÔNG dùng LaTeX hay dấu ^: ví dụ x², (a + b)², a² − b², √(x + 1), 3 × 4, 6 ÷ 2, x ≤ 5, π, phân số viết 1/2 hoặc (a + b)/c.";
