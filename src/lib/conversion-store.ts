import { create } from "zustand";

export type ConversionStatus = "idle" | "uploading" | "converting" | "done" | "error";

export interface ConversionJob {
  id: string;
  fileName: string;
  fileSize: number;
  sourceFormat: string;
  targetFormat: string;
  status: ConversionStatus;
  progress: number;
  createdAt: Date;
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

export const useConversionStore = create<ConversionStore>((set) => ({
  jobs: [],
  activeView: "upload",
  addJob: (job) => set((s) => ({ jobs: [...s.jobs, job] })),
  updateJob: (id, updates) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),
  removeJob: (id) => set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) })),
  clearJobs: () => set({ jobs: [], activeView: "upload" }),
  setActiveView: (view) => set({ activeView: view }),
}));
