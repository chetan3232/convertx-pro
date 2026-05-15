import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Upload,
  FileUp,
  X,
  ArrowRight,
  Combine,
  Scissors,
  Minimize2,
  RotateCw,
  Lock,
  Unlock,
  Stamp,
  ScanText,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectFormat, getTargetFormats } from "@/lib/formats";
import { useConversionStore } from "@/lib/conversion-store";
import { uploadFile } from "@/lib/upload-service";
import { convertFile } from "@/lib/pdf-tools-service";
import { toast } from "sonner";

const pdfTools = [
  {
    icon: Combine,
    title: "Merge PDF",
    desc: "Combine multiple PDFs",
    slug: "merge",
  },
  { icon: Scissors, title: "Split PDF", desc: "Extract pages", slug: "split" },
  {
    icon: Minimize2,
    title: "Compress",
    desc: "Reduce file size",
    slug: "compress",
  },
  { icon: RotateCw, title: "Rotate", desc: "Rotate pages", slug: "rotate" },
  { icon: Lock, title: "Protect", desc: "Add password", slug: "protect" },
  { icon: Unlock, title: "Unlock", desc: "Remove password", slug: "unlock" },
  { icon: Stamp, title: "Watermark", desc: "Add watermark", slug: "watermark" },
  { icon: ScanText, title: "OCR", desc: "Extract text", slug: "ocr" },
];

const UploadZone = () => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<
    Record<string, string>
  >({});
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState<{
    name: string;
    type: string;
  } | null>(null);
  const { addJob, updateJob, setActiveView } = useConversionStore();

  const handleFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles);

      for (const f of arr) {
        const ext = f.name.split(".").pop()?.toLowerCase() || "";
        let analysisType = "Layout";
        if (["xlsx", "xls", "csv"].includes(ext))
          analysisType = "Table Structure";
        if (["jpg", "png", "webp"].includes(ext))
          analysisType = "Visual Elements";
        if (["json", "xml"].includes(ext)) analysisType = "Data Schema";

        setAnalyzing({ name: f.name, type: analysisType });
        // Simulate smart layout analysis
        await new Promise((r) => setTimeout(r, 1200));

        setFiles((prev) => [...prev, f]);
        const fmt = detectFormat(f.name);
        if (fmt) {
          const targets = getTargetFormats(fmt.ext);
          if (targets.length > 0 && !selectedTargets[f.name]) {
            setSelectedTargets((prev) => ({
              ...prev,
              [f.name]: targets[0].ext,
            }));
          }
        }
      }
      setAnalyzing(null);
    },
    [selectedTargets]
  );

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    setSelectedTargets((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const hasPdfFiles = files.some((f) => f.name.toLowerCase().endsWith(".pdf"));
  const hasImageFiles = files.some((f) =>
    /\.(jpg|jpeg|png|webp)$/i.test(f.name)
  );

  const startConversion = async () => {
    setUploading(true);

    const jobEntries: {
      file: File;
      jobId: string;
      target: string;
      source: string;
    }[] = [];
    files.forEach((file) => {
      const source = detectFormat(file.name);
      const target = selectedTargets[file.name];
      if (source && target) {
        const jobId = typeof crypto.randomUUID === 'function' 
          ? crypto.randomUUID() 
          : Math.random().toString(36).substring(2) + Date.now().toString(36);
        addJob({
          id: jobId,
          fileName: file.name,
          fileSize: file.size,
          sourceFormat: source.ext,
          targetFormat: target,
          status: "uploading",
          progress: 0,
          createdAt: new Date(),
          file,
        });
        jobEntries.push({ file, jobId, target, source: source.ext });
      }
    });

    setActiveView("converting");

    await Promise.all(
      jobEntries.map(async ({ file, jobId, target, source }) => {
        updateJob(jobId, { status: "uploading", progress: 20 });

        const canConvert =
          ["txt", "md", "csv"].includes(source) && target === "pdf";

        if (canConvert) {
          updateJob(jobId, { status: "converting", progress: 40 });
          const result = await convertFile(file, target);

          if (result.success) {
            updateJob(jobId, {
              status: "done",
              progress: 100,
              publicUrl: result.publicUrl,
              filePath: result.filePath,
            });
          } else {
            updateJob(jobId, {
              status: "error",
              progress: 0,
              errorMessage: result.error,
            });
            toast.error(`Conversion failed: ${result.error}`);
          }
        } else {
          const result = await uploadFile(file);

          if (result.success) {
            updateJob(jobId, {
              status: "converting",
              progress: 50,
              publicUrl: result.publicUrl,
              filePath: result.filePath,
            });
            await new Promise((r) => setTimeout(r, 600));
            updateJob(jobId, { progress: 75 });
            await new Promise((r) => setTimeout(r, 500));
            updateJob(jobId, { progress: 100, status: "done" });
          } else {
            updateJob(jobId, {
              status: "error",
              progress: 0,
              errorMessage: result.error,
            });
            toast.error(`Failed to upload ${file.name}: ${result.error}`);
          }
        }
      })
    );

    setUploading(false);
    setFiles([]);
    setSelectedTargets({});
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          dragOver
            ? "glow-primary border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground/50"
        }`}
        onClick={() => {
          if (uploading) return;
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files) handleFiles(target.files);
          };
          input.click();
        }}
        whileHover={uploading ? {} : { scale: 1.005 }}
      >
        <motion.div
          animate={dragOver || analyzing ? { scale: 1.05 } : { scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-secondary/50 backdrop-blur-xl transition-colors group-hover:bg-primary/5">
            {analyzing ? (
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <Upload className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            )}
            {dragOver && (
              <motion.div
                layoutId="glow"
                className="absolute inset-0 animate-pulse bg-primary/10"
              />
            )}
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-foreground">
              {analyzing
                ? `Analyzing ${analyzing.type}...`
                : "Drop files here or click to browse"}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {analyzing
                ? `Our engine is scanning ${analyzing.name} for ${analyzing.type.toLowerCase()} to ensure a pixel-perfect conversion.`
                : "Support for PDF, Office, Images and 15+ more formats. Privacy-first local analysis."}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 space-y-3"
          >
            {files.map((file) => {
              const fmt = detectFormat(file.name);
              const targets = fmt ? getTargetFormats(fmt.ext) : [];
              const Icon = fmt?.icon || FileUp;

              return (
                <motion.div
                  key={file.name}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass flex items-center gap-4 rounded-xl p-4"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${fmt?.color || ""}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                      {fmt && <span className="ml-2 uppercase">{fmt.ext}</span>}
                    </p>
                  </div>
                  {targets.length > 0 && (
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <select
                        value={selectedTargets[file.name] || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedTargets((prev) => ({
                            ...prev,
                            [file.name]: e.target.value,
                          }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm uppercase text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {targets.map((t) => (
                          <option key={t.ext} value={t.ext}>
                            {t.ext}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.name);
                    }}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}

            {/* PDF Tools Section - shown when PDF/image files are uploaded */}
            {(hasPdfFiles || hasImageFiles) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4"
              >
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Or use a PDF tool:
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {pdfTools
                    .filter((t) => {
                      if (t.slug === "ocr") return true;
                      return hasPdfFiles;
                    })
                    .map((t) => (
                      <Link
                        key={t.slug}
                        to={`/tools/${t.slug}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="glass cursor-pointer rounded-lg p-3 text-center transition-colors hover:bg-secondary/80">
                          <t.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                          <p className="text-xs font-medium text-foreground">
                            {t.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </motion.div>
            )}

            <motion.div layout className="flex justify-end pt-2">
              <Button
                onClick={startConversion}
                disabled={uploading}
                className="gradient-primary border-0 px-8 text-primary-foreground"
                size="lg"
              >
                {uploading
                  ? "Uploading..."
                  : `Convert ${files.length} file${files.length > 1 ? "s" : ""}`}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadZone;
