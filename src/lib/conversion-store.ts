import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ConversionStatus =
  | "idle"
  | "uploading"
  | "converting"
  | "done"
  | "error";

export interface ConversionJob {
  id: string;
  fileName: string;
  fileSize: number;
  sourceFormat: string;
  targetFormat: string;
  status: ConversionStatus;
  progress: number;
  createdAt: Date | string;
  publicUrl?: string;
  filePath?: string;
  file?: File;
  errorMessage?: string;
}

interface ConversionStore {
  jobs: ConversionJob[];
  activeView: "upload" | "converting" | "results";
  addJob: (job: ConversionJob) => void;
  updateJob: (id: string, updates: Partial<ConversionJob>) => void;
  removeJob: (id: string) => void;
  clearJobs: () => void;
  setActiveView: (view: "upload" | "converting" | "results") => void;
}

export const useConversionStore = create<ConversionStore>()(
  persist(
    (set) => ({
      jobs: [],
      activeView: "upload",
      addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
      updateJob: (id, updates) =>
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
        })),
      removeJob: (id) =>
        set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) })),
      clearJobs: () => set({ jobs: [], activeView: "upload" }),
      setActiveView: (view) => set({ activeView: view }),
    }),
    {
      name: "convertx-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        jobs: state.jobs.map((j) => ({ ...j, file: undefined })), // Don't persist File objects
      }),
    }
  )
);
