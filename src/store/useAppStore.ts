import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Feature = "giao-an" | "de-thi" | "bai-tap" | "chat" | "phan-tich";

const FREE_TRIALS_PER_FEATURE = 3;
const FEATURES: Feature[] = ["giao-an", "de-thi", "bai-tap", "chat", "phan-tich"];

interface AppState {
  trialsUsed: Partial<Record<Feature, number>>;
  isVip: boolean;
  vipExpiresAt: number | null;
  useTrial: (feature: Feature) => void;
  syncTrials: (counts: Partial<Record<Feature, number>>, blocked: boolean) => void;
  activate: (expiresAt: number) => void;
  trialsLeft: (feature: Feature) => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      trialsUsed: {},
      isVip: false,
      vipExpiresAt: null,
      useTrial: (feature) =>
        set((s) => ({ trialsUsed: { ...s.trialsUsed, [feature]: (s.trialsUsed[feature] ?? 0) + 1 } })),
      syncTrials: (counts, blocked) =>
        set({
          trialsUsed: blocked
            ? Object.fromEntries(FEATURES.map((f) => [f, FREE_TRIALS_PER_FEATURE]))
            : counts,
        }),
      activate: (expiresAt) => set({ isVip: true, vipExpiresAt: expiresAt }),
      trialsLeft: (feature) => Math.max(0, FREE_TRIALS_PER_FEATURE - (get().trialsUsed[feature] ?? 0)),
    }),
    {
      name: "giao-an-pro-storage",
      // isVip tự lưu trong localStorage nhưng không tự hết hạn — nếu không
      // sửa lại ở đây, sau khi gói hết hạn (server đã chặn đúng) giao diện
      // vẫn hiện "Tài khoản VIP — dùng không giới hạn" vô thời hạn.
      onRehydrateStorage: () => (state) => {
        if (state?.isVip && (!state.vipExpiresAt || state.vipExpiresAt <= Date.now())) {
          state.isVip = false;
        }
      },
    }
  )
);

// Server là nguồn đúng về lượt dùng thử; ghi đè bộ đếm cục bộ bằng số của server.
export async function syncTrialsFromServer() {
  try {
    const res = await fetch("/api/trial", { cache: "no-store" });
    if (!res.ok) return;
    const { counts, blocked } = await res.json();
    useAppStore.getState().syncTrials(counts ?? {}, !!blocked);
  } catch {
    // mất mạng: giữ nguyên số cục bộ
  }
}

export { FREE_TRIALS_PER_FEATURE };
