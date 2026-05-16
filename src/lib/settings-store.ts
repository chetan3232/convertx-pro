import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ConversionMode = "quick" | "lossless";
export type DeleteDelay = "1h" | "30m" | "session";

interface SettingsState {
  mode: ConversionMode;
  deleteDelay: DeleteDelay;
  noStore: boolean;
  notifications: boolean;
  apiKey: string | null;
  setMode: (mode: ConversionMode) => void;
  setDeleteDelay: (delay: DeleteDelay) => void;
  toggleNoStore: () => void;
  toggleNotifications: () => void;
  setApiKey: (key: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      mode: "quick",
      deleteDelay: "1h",
      noStore: false,
      notifications: true,
      apiKey: null,
      setMode: (mode) => set({ mode }),
      setDeleteDelay: (deleteDelay) => set({ deleteDelay }),
      toggleNoStore: () => set((s) => ({ noStore: !s.noStore })),
      toggleNotifications: () => set((s) => ({ notifications: !s.notifications })),
      setApiKey: (apiKey) => set({ apiKey }),
    }),
    {
      name: "convertx-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
