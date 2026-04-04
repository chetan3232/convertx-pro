import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle, Upload } from "lucide-react";
import { useConversionStore } from "@/lib/conversion-store";
import { FORMAT_MAP } from "@/lib/formats";

const ConversionProgress = () => {
  const { jobs, setActiveView } = useConversionStore();

  const allDone = jobs.length > 0 && jobs.every((j) => j.status === "done" || j.status === "error");

  useEffect(() => {
    if (allDone) {
      const t = setTimeout(() => setActiveView("results"), 800);
      return () => clearTimeout(t);
    }
  }, [allDone, setActiveView]);

  const statusLabel = (status: string) => {
    switch (status) {
      case "uploading": return "Uploading...";
      case "converting": return "Processing...";
      case "done": return "Complete";
      case "error": return "Failed";
      default: return "Waiting...";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold text-foreground text-center mb-8"
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
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${source?.color || ""}`}>
                <SourceIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{job.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {statusLabel(job.status)} · {job.sourceFormat.toUpperCase()} → {job.targetFormat.toUpperCase()}
                </p>
              </div>
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-destructive" />
              ) : isUploading ? (
                <Upload className="w-5 h-5 text-primary animate-pulse" />
              ) : (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              )}
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
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
