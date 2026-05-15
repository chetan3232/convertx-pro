import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle, Upload } from "lucide-react";
import { useConversionStore } from "@/lib/conversion-store";
import { FORMAT_MAP } from "@/lib/formats";

const ConversionProgress = () => {
  const { jobs, setActiveView } = useConversionStore();

  const allDone =
    jobs.length > 0 &&
    jobs.every((j) => j.status === "done" || j.status === "error");

  useEffect(() => {
    if (allDone) {
      const t = setTimeout(() => setActiveView("results"), 800);
      return () => clearTimeout(t);
    }
  }, [allDone, setActiveView]);

  const statusLabel = (status: string) => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "converting":
        return "Processing...";
      case "done":
        return "Complete";
      case "error":
        return "Failed";
      default:
        return "Waiting...";
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 text-center text-2xl font-bold text-foreground"
      >
        {allDone ? "All done!" : "Uploading & processing your files..."}
      </motion.h2>

      {jobs.map((job, i) => {
        const source = FORMAT_MAP[job.sourceFormat];
        const isDone = job.status === "done";
        const isError = job.status === "error";
        const isUploading = job.status === "uploading";
        const SourceIcon = source?.icon || Loader2;

        return (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5"
          >
            <div className="mb-3 flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${source?.color || ""}`}
              >
                <SourceIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {job.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {statusLabel(job.status)} · {job.sourceFormat.toUpperCase()} →{" "}
                  {job.targetFormat.toUpperCase()}
                </p>
              </div>
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : isError ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : isUploading ? (
                <Upload className="h-5 w-5 animate-pulse text-primary" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className={`h-full rounded-full ${isError ? "bg-destructive" : "gradient-primary"}`}
                initial={{ width: 0 }}
                animate={{ width: `${job.progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ConversionProgress;
