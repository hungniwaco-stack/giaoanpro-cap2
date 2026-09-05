"use client";

import { useEffect, useState } from "react";
import { useHistoryStore } from "@/store/useHistoryStore";
import { generateLessonPlanDocx, generateExamDocx, generateExerciseDocx, docxToBlob } from "@/lib/docx-generator";
import type { HistoryEntry, LessonPlan, ExamPlan, ExercisePlan } from "@/lib/types";

const TYPE_LABEL: Record<HistoryEntry["type"], string> = {
  "giao-an": "Giáo án",
  "de-thi": "Đề thi",
  "bai-tap": "Bài tập",
};

const TYPE_PREFIX: Record<HistoryEntry["type"], string> = {
  "giao-an": "Giao-an",
  "de-thi": "De-kiem-tra",
  "bai-tap": "Bai-tap",
};

async function downloadEntry(entry: HistoryEntry) {
  const doc =
    entry.type === "giao-an"
      ? generateLessonPlanDocx(entry.data as LessonPlan)
      : entry.type === "de-thi"
        ? generateExamDocx(entry.data as ExamPlan)
        : generateExerciseDocx(entry.data as ExercisePlan);

  const blob = await docxToBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${TYPE_PREFIX[entry.type]}-${entry.title.replace(/[^\p{L}\p{N}]+/gu, "-")}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

const TYPE_FILTERS: { id: HistoryEntry["type"] | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "giao-an", label: "Giáo án" },
  { id: "de-thi", label: "Đề thi" },
  { id: "bai-tap", label: "Bài tập" },
];

export default function LichSuPage() {
  const { entries, removeEntry } = useHistoryStore();
  // Zustand persist only reads localStorage after mount; rendering the list
  // before that would mismatch the server-rendered empty state.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<HistoryEntry["type"] | "all">("all");

  const allEntries = mounted ? entries : [];
  const visibleEntries = allEntries.filter(
    (e) =>
      (typeFilter === "all" || e.type === typeFilter) &&
      e.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <main className="px-6 py-8 sm:px-10 sm:py-10">
      <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Lịch Sử Soạn Thảo</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Toàn bộ giáo án, đề thi, bài tập đã tạo — lưu trên trình duyệt này, tải lại bất kỳ lúc nào.
      </p>

      {allEntries.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên bài..."
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 outline-none focus:border-pine sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-1.5">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  typeFilter === f.id ? "bg-pine text-paper" : "bg-sand text-ink-muted hover:bg-ink/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {visibleEntries.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/15 bg-paper-card/60 px-6 py-16 text-center">
          <p className="text-sm text-ink-muted">
            {allEntries.length === 0
              ? "Chưa có nội dung nào. Soạn giáo án, đề thi hoặc bài tập để thấy lịch sử tại đây."
              : "Không tìm thấy kết quả phù hợp với bộ lọc hiện tại."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-paper-card shadow-sm">
          {visibleEntries.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between gap-4 px-5 py-4 ${i > 0 ? "border-t border-ink/10" : ""}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-medium text-pine-dark">
                    {TYPE_LABEL[entry.type]}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {new Date(entry.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <p className="mt-1 truncate font-medium text-ink">{entry.title}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm">
                <button onClick={() => downloadEntry(entry)} className="font-medium text-pine hover:text-pine-dark">
                  Tải Word
                </button>
                <button onClick={() => removeEntry(entry.id)} className="text-ink-muted hover:text-seal">
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
