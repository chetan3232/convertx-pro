import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Download, Trash2, FileCheck } from "lucide-react";
import { useConversionStore } from "@/lib/conversion-store";
import { Button } from "@/components/ui/button";
import { FORMAT_MAP } from "@/lib/formats";
import { downloadFile } from "@/lib/pdf-tools-service";

export const HistoryDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { jobs, removeJob, clearJobs } = useConversionStore();
  const doneJobs = jobs.filter((j) => j.status === "done");

  const handleDownload = (job: (typeof jobs)[0]) => {
    if (job.publicUrl) {
      const ext = job.targetFormat || "pdf";
      const outputName = job.fileName.replace(/\.\w+$/, `.${ext}`);
      downloadFile(job.publicUrl, outputName);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 md:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative z-10 flex w-full max-w-2xl flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden max-h-none min-h-0 my-auto"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">History</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {doneJobs.length === 0 ? (
                <div className="py-12 text-center">
                  <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">No recent conversions</p>
                </div>
              ) : (
                doneJobs.map((job) => {
                  const target = FORMAT_MAP[job.targetFormat];
                  const Icon = target?.icon || FileCheck;
                  return (
                    <div
                      key={job.id}
                      className="glass group flex items-center gap-3 rounded-xl p-4"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${target?.color || ""}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {job.fileName}
                        </p>
                        <p className="text-xs uppercase text-muted-foreground">
                          {job.targetFormat}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(job)}
                          className="h-8 w-8"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeJob(job.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {doneJobs.length > 0 && (
              <div className="border-t border-border p-6">
                <Button
                  variant="outline"
                  onClick={clearJobs}
                  className="w-full font-bold"
                >
                  Clear History
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
