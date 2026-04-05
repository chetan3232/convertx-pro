import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Upload, FileUp, X, ArrowRight,
  Combine, Scissors, Minimize2, RotateCw,
  Lock, Unlock, Stamp, ScanText, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectFormat, getTargetFormats } from "@/lib/formats";
import { useConversionStore } from "@/lib/conversion-store";
import { uploadFile } from "@/lib/upload-service";
import { convertFile } from "@/lib/pdf-tools-service";
import { toast } from "sonner";

const pdfTools = [
  { icon: Combine, title: "Merge PDF", desc: "Combine multiple PDFs", slug: "merge" },
  { icon: Scissors, title: "Split PDF", desc: "Extract pages", slug: "split" },
  { icon: Minimize2, title: "Compress", desc: "Reduce file size", slug: "compress" },
  { icon: RotateCw, title: "Rotate", desc: "Rotate pages", slug: "rotate" },
  { icon: Lock, title: "Protect", desc: "Add password", slug: "protect" },
  { icon: Unlock, title: "Unlock", desc: "Remove password", slug: "unlock" },
  { icon: Stamp, title: "Watermark", desc: "Add watermark", slug: "watermark" },
  { icon: ScanText, title: "OCR", desc: "Extract text", slug: "ocr" },
];

const UploadZone = () => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const { addJob, updateJob, setActiveView } = useConversionStore();

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles);
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const fmt = detectFormat(f.name);
      if (fmt) {
        const targets = getTargetFormats(fmt.ext);
        if (targets.length > 0 && !selectedTargets[f.name]) {
          setSelectedTargets((prev) => ({ ...prev, [f.name]: targets[0].ext }));
        }
      }
    });
  }, [selectedTargets]);

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    setSelectedTargets((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const hasPdfFiles = files.some((f) => f.name.toLowerCase().endsWith(".pdf"));
  const hasImageFiles = files.some((f) => /\.(jpg|jpeg|png|webp)$/i.test(f.name));

  const startConversion = async () => {
    setUploading(true);

    const jobEntries: { file: File; jobId: string; target: string; source: string }[] = [];
    files.forEach((file) => {
      const source = detectFormat(file.name);
      const target = selectedTargets[file.name];
      if (source && target) {
        const jobId = crypto.randomUUID();
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
          (["txt", "md", "csv"].includes(source) && target === "pdf");

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
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center cursor-pointer ${
          dragOver
            ? "border-primary bg-primary/5 glow-primary"
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
          animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              PDF, DOCX, XLSX, PPTX, Images, and 15+ formats · Auto-deleted after 30 min
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
                  className="glass rounded-xl p-4 flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${fmt?.color || ""}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                      {fmt && <span className="ml-2 uppercase">{fmt.ext}</span>}
                    </p>
                  </div>
                  {targets.length > 0 && (
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <select
                        value={selectedTargets[file.name] || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedTargets((prev) => ({ ...prev, [file.name]: e.target.value }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-secondary text-foreground text-sm rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                      >
                        {targets.map((t) => (
                          <option key={t.ext} value={t.ext}>{t.ext}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
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
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Or use a PDF tool:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                        <div className="glass rounded-lg p-3 text-center hover:bg-secondary/80 transition-colors cursor-pointer">
                          <t.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                          <p className="text-xs font-medium text-foreground">{t.title}</p>
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
                className="gradient-primary text-primary-foreground border-0 px-8"
                size="lg"
              >
                {uploading ? "Uploading..." : `Convert ${files.length} file${files.length > 1 ? "s" : ""}`}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadZone;
