import { motion } from "framer-motion";
import { Download, RotateCcw, FileCheck, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConversionStore } from "@/lib/conversion-store";
import { FORMAT_MAP } from "@/lib/formats";
import { toast } from "sonner";

const ResultsView = () => {
  const { jobs, clearJobs } = useConversionStore();
  const doneJobs = jobs.filter((j) => j.status === "done");

  const handleDownload = (job: typeof doneJobs[0]) => {
    toast.success(`Downloaded ${job.fileName.replace(/\.\w+$/, "")}.${job.targetFormat}`);
  };

  const handleDownloadAll = () => {
    toast.success(`Downloaded ${doneJobs.length} files as ZIP`);
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
          {doneJobs.length} file{doneJobs.length > 1 ? "s" : ""} converted
        </h2>
        <p className="text-muted-foreground mt-1">Your files are ready for download</p>
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
                <p className="text-sm font-medium text-foreground truncate">
                  {job.fileName.replace(/\.\w+$/, "")}.{job.targetFormat}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(job.fileSize / 1024 / 1024).toFixed(2)} MB · Converted from {job.sourceFormat.toUpperCase()}
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
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        {doneJobs.length > 1 && (
          <Button onClick={handleDownloadAll} className="gradient-primary text-primary-foreground border-0">
            <Archive className="w-4 h-4 mr-2" />
            Download All as ZIP
          </Button>
        )}
        <Button variant="outline" onClick={clearJobs} className="border-border text-foreground hover:bg-secondary">
          <RotateCcw className="w-4 h-4 mr-2" />
          Convert More
        </Button>
      </motion.div>
    </div>
  );
};

export default ResultsView;
