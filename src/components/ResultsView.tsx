import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  RotateCcw,
  FileCheck,
  AlertCircle,
  Clock,
  Trash2,
  Zap,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConversionStore } from "@/lib/conversion-store";
import { FORMAT_MAP } from "@/lib/formats";
import { downloadFile } from "@/lib/pdf-tools-service";
import { toast } from "sonner";
import JSZip from "jszip";
import { FilePreview } from "./FilePreview";
import { useState } from "react";

const ResultsView = () => {
  const { jobs, clearJobs, removeJob } = useConversionStore();
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);
  const doneJobs = jobs.filter((j) => j.status === "done");
  const errorJobs = jobs.filter((j) => j.status === "error");

  const handleDownload = (job: (typeof jobs)[0]) => {
    if (job.publicUrl) {
      const ext = job.targetFormat || "pdf";
      const outputName = job.fileName.replace(/\.\w+$/, `.${ext}`);
      downloadFile(job.publicUrl, outputName);
      toast.success(`Downloading ${outputName}`);
    } else {
      toast.error("Download URL not available");
    }
  };

  const handleBatchDownload = async () => {
    if (doneJobs.length === 0) return;

    const zip = new JSZip();
    toast.info("Preparing ZIP archive...");

    try {
      await Promise.all(
        doneJobs.map(async (job) => {
          if (!job.publicUrl) return;
          const response = await fetch(job.publicUrl);
          const blob = await response.blob();
          const ext = job.targetFormat || "pdf";
          const outputName = job.fileName.replace(/\.\w+$/, `.${ext}`);
          zip.file(outputName, blob);
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `convertx-batch-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Batch ZIP downloaded successfully!");
    } catch (err) {
      toast.error("Failed to create ZIP archive");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-success/10">
          <FileCheck className="h-10 w-10 text-success" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary"
          >
            <Zap className="h-3 w-3 text-primary-foreground" />
          </motion.div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {doneJobs.length > 0 ? "Conversions Ready" : "No recent conversions"}
        </h2>
        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Auto-delete in 30 minutes
          </div>
          <span className="h-1 w-1 rounded-full bg-border" />
          <div className="font-medium text-foreground">
            {doneJobs.length} Successful · {errorJobs.length} Failed
          </div>
        </div>
      </motion.div>

      {doneJobs.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Success History
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBatchDownload}
            className="font-bold text-primary hover:bg-primary/5 hover:text-primary"
          >
            <Download className="mr-2 h-4 w-4" />
            Download All (ZIP)
          </Button>
        </div>
      )}

      <div className="mb-8 space-y-3">
        <AnimatePresence mode="popLayout">
          {doneJobs.map((job) => {
            const target = FORMAT_MAP[job.targetFormat];
            const Icon = target?.icon || FileCheck;

            return (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass group flex items-center gap-4 rounded-2xl p-4"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-secondary ${target?.color || ""}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    {job.fileName}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {((job.fileSize || 0) / 1024 / 1024).toFixed(2)} MB ·{" "}
                    {job.sourceFormat.toUpperCase()} →{" "}
                    {job.targetFormat.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeJob(job.id)}
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPreviewFile({
                        url: job.publicUrl!,
                        name: job.fileName,
                        type: job.targetFormat,
                      })
                    }
                    className="hidden px-3 font-bold sm:flex"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(job)}
                    className="px-4 font-bold"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {errorJobs.length > 0 && (
          <div className="pt-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-destructive">
              Errors
            </h3>
            <div className="space-y-3">
              {errorJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass flex items-center gap-4 rounded-2xl border-destructive/20 bg-destructive/5 p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {job.fileName}
                    </p>
                    <p className="text-xs font-medium text-destructive">
                      {job.errorMessage || "Processing failed"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeJob(job.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          variant="outline"
          onClick={clearJobs}
          className="h-12 rounded-xl border-border px-8 font-bold text-foreground hover:bg-secondary"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Batch
        </Button>
        {doneJobs.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {doneJobs.length} files available in this session
          </p>
        )}
      </div>

      <FilePreview
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileUrl={previewFile?.url || ""}
        fileName={previewFile?.name || ""}
        fileType={previewFile?.type || ""}
      />
    </div>
  );
};

export default ResultsView;
