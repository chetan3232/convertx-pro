import { motion } from "framer-motion";
import { Download, RotateCcw, FileCheck, Archive, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConversionStore } from "@/lib/conversion-store";
import { FORMAT_MAP } from "@/lib/formats";
import { toast } from "sonner";

const ResultsView = () => {
  const { jobs, clearJobs } = useConversionStore();
  const doneJobs = jobs.filter((j) => j.status === "done");
  const errorJobs = jobs.filter((j) => j.status === "error");

  const handleDownload = (job: typeof doneJobs[0]) => {
    if (job.publicUrl) {
      window.open(job.publicUrl, "_blank");
      toast.success(`Downloading ${job.fileName}`);
    } else {
      toast.error("Download URL not available");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
          <FileCheck className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {doneJobs.length} file{doneJobs.length > 1 ? "s" : ""} uploaded
          {errorJobs.length > 0 && `, ${errorJobs.length} failed`}
        </h2>
        <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Files auto-delete in 30 minutes
        </div>
      </motion.div>

      <div className="space-y-3 mb-6">
        {doneJobs.map((job, i) => {
          const target = FORMAT_MAP[job.targetFormat];
          const Icon = target?.icon || FileCheck;

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${target?.color || ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{job.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {(job.fileSize / 1024 / 1024).toFixed(2)} MB · Uploaded as {job.sourceFormat.toUpperCase()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(job)}
                className="border-border text-foreground hover:bg-secondary"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </motion.div>
          );
        })}

        {errorJobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (doneJobs.length + i) * 0.08 }}
            className="glass rounded-xl p-4 flex items-center gap-4 border-destructive/30"
          >
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{job.fileName}</p>
              <p className="text-xs text-destructive">{job.errorMessage || "Upload failed"}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button variant="outline" onClick={clearJobs} className="border-border text-foreground hover:bg-secondary">
          <RotateCcw className="w-4 h-4 mr-2" />
          Convert More
        </Button>
      </motion.div>
    </div>
  );
};

export default ResultsView;
