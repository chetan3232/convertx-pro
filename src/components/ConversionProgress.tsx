import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useConversionStore } from "@/lib/conversion-store";
import { FORMAT_MAP } from "@/lib/formats";

const ConversionProgress = () => {
  const { jobs, updateJob, setActiveView } = useConversionStore();

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    jobs.forEach((job) => {
      if (job.status === "converting") {
        const interval = setInterval(() => {
          const current = useConversionStore.getState().jobs.find((j) => j.id === job.id);
          if (!current) return clearInterval(interval);
          const next = Math.min(current.progress + Math.random() * 15 + 5, 100);
          updateJob(job.id, {
            progress: next,
            status: next >= 100 ? "done" : "converting",
          });
          if (next >= 100) clearInterval(interval);
        }, 400 + Math.random() * 300);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach(clearInterval);
  }, [jobs.length]);

  const allDone = jobs.length > 0 && jobs.every((j) => j.status === "done");

  useEffect(() => {
    if (allDone) {
      const t = setTimeout(() => setActiveView("results"), 800);
      return () => clearTimeout(t);
    }
  }, [allDone, setActiveView]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold text-foreground text-center mb-8"
      >
        {allDone ? "All done!" : "Converting your files..."}
      </motion.h2>

      {jobs.map((job, i) => {
        const source = FORMAT_MAP[job.sourceFormat];
        const target = FORMAT_MAP[job.targetFormat];
        const isDone = job.status === "done";
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
                <p className="text-xs text-muted-foreground uppercase">
                  {job.sourceFormat} → {job.targetFormat}
                </p>
              </div>
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              )}
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full gradient-primary"
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
