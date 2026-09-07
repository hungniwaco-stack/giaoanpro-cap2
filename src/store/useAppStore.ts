import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Feature = "giao-an" | "de-thi" | "bai-tap" | "chat";

const FREE_TRIALS_PER_FEATURE = 3;

interface AppState {
  trialsUsed: Partial<Record<Feature, number>>;
  isVip: boolean;
  vipExpiresAt: number | null;
  useTrial: (feature: Feature) => void;
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

export { FREE_TRIALS_PER_FEATURE };
