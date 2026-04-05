import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  Upload, FileUp, X, ArrowLeft, Download, Loader2,
  Combine, Scissors, Minimize2, RotateCw, Lock, Unlock, Stamp, ScanText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  mergePdfs, splitPdf, rotatePdf, compressPdf,
  watermarkPdf, protectPdf, unlockPdf,
} from "@/lib/pdf-tools-service";
import type { PdfToolResult } from "@/lib/pdf-tools-service";
import { toast } from "sonner";

const toolConfig: Record<string, {
  title: string;
  desc: string;
  icon: typeof Combine;
  accept: string;
  multiple: boolean;
  extraFields?: { name: string; label: string; placeholder: string; type?: string }[];
}> = {
  merge: {
    title: "Merge PDF",
    desc: "Combine multiple PDF files into a single document",
    icon: Combine,
    accept: ".pdf",
    multiple: true,
  },
  split: {
    title: "Split PDF",
    desc: "Extract specific pages or split into individual pages",
    icon: Scissors,
    accept: ".pdf",
    multiple: false,
    extraFields: [
      { name: "pages", label: "Pages", placeholder: "e.g. 1,3,5 or 1-3 (leave empty for all)" },
    ],
  },
  compress: {
    title: "Compress PDF",
    desc: "Reduce file size while maintaining quality",
    icon: Minimize2,
    accept: ".pdf",
    multiple: false,
  },
  rotate: {
    title: "Rotate Pages",
    desc: "Rotate PDF pages by 90°, 180°, or 270°",
    icon: RotateCw,
    accept: ".pdf",
    multiple: false,
    extraFields: [
      { name: "angle", label: "Rotation Angle", placeholder: "90" },
      { name: "pages", label: "Pages", placeholder: "all (or 1,2,3)" },
    ],
  },
  protect: {
    title: "Protect PDF",
    desc: "Add password protection to your PDF",
    icon: Lock,
    accept: ".pdf",
    multiple: false,
    extraFields: [
      { name: "password", label: "Password", placeholder: "Enter password", type: "password" },
    ],
  },
  unlock: {
    title: "Unlock PDF",
    desc: "Remove password from a protected PDF",
    icon: Unlock,
    accept: ".pdf",
    multiple: false,
    extraFields: [
      { name: "password", label: "Password", placeholder: "Enter current password", type: "password" },
    ],
  },
  watermark: {
    title: "Watermark",
    desc: "Add text watermark to all pages",
    icon: Stamp,
    accept: ".pdf",
    multiple: false,
    extraFields: [
      { name: "text", label: "Watermark Text", placeholder: "CONFIDENTIAL" },
    ],
  },
  ocr: {
    title: "OCR",
    desc: "Extract text from scanned documents",
    icon: ScanText,
    accept: ".pdf,.jpg,.jpeg,.png",
    multiple: false,
  },
};

const ToolPage = () => {
  const { tool } = useParams<{ tool: string }>();
  const config = toolConfig[tool || ""];
  const [files, setFiles] = useState<File[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PdfToolResult | null>(null);

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles);
    setFiles((prev) => (config?.multiple ? [...prev, ...arr] : arr));
  }, [config]);

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleProcess = async () => {
    if (!files.length || !tool) return;
    setProcessing(true);
    setResult(null);

    let res: PdfToolResult;
    try {
      switch (tool) {
        case "merge":
          res = await mergePdfs(files);
          break;
        case "split":
          res = await splitPdf(files[0], fields.pages);
          break;
        case "rotate":
          res = await rotatePdf(files[0], Number(fields.angle || 90), fields.pages);
          break;
        case "compress":
          res = await compressPdf(files[0]);
          break;
        case "watermark":
          res = await watermarkPdf(files[0], fields.text || "WATERMARK");
          break;
        case "protect":
          res = await protectPdf(files[0], fields.password || "");
          break;
        case "unlock":
          res = await unlockPdf(files[0], fields.password || "");
          break;
        default:
          res = { success: false, error: "Tool not implemented yet" };
      }
    } catch (err: any) {
      res = { success: false, error: err.message };
    }

    setResult(res);
    setProcessing(false);

    if (res.success) {
      toast.success("Done! Your file is ready to download.");
    } else {
      toast.error(res.error || "Operation failed");
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Tool not found</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-16">
        <div className="container max-w-2xl">
          <Link to="/#tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{config.title}</h1>
            <p className="text-muted-foreground mt-2">{config.desc}</p>
          </motion.div>

          {/* Upload area */}
          {!result && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-2 border-dashed border-border hover:border-muted-foreground/50 transition-colors p-10 text-center cursor-pointer mb-6"
                onClick={() => {
                  if (processing) return;
                  const input = document.createElement("input");
                  input.type = "file";
                  input.multiple = config.multiple;
                  input.accept = config.accept;
                  input.onchange = (e) => {
                    const t = e.target as HTMLInputElement;
                    if (t.files) handleFiles(t.files);
                  };
                  input.click();
                }}
              >
                <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  {config.multiple ? "Drop PDF files here or click to browse" : "Drop a file here or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Accepts: {config.accept}
                </p>
              </motion.div>

              {/* File list */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 mb-6"
                  >
                    {files.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="glass rounded-xl p-3 flex items-center gap-3">
                        <FileUp className="w-5 h-5 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button onClick={() => removeFile(idx)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Extra fields */}
              {config.extraFields && files.length > 0 && (
                <div className="space-y-4 mb-6">
                  {config.extraFields.map((field) => (
                    <div key={field.name}>
                      <label className="text-sm font-medium text-foreground mb-1 block">{field.label}</label>
                      <Input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        value={fields[field.name] || ""}
                        onChange={(e) => setFields((prev) => ({ ...prev, [field.name]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Process button */}
              {files.length > 0 && (
                <Button
                  onClick={handleProcess}
                  disabled={processing}
                  className="w-full gradient-primary text-primary-foreground border-0"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `${config.title} Now`
                  )}
                </Button>
              )}
            </>
          )}

          {/* Result */}
          {result && result.success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="glass rounded-2xl p-8 mb-6">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-7 h-7 text-success" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Ready!</h2>
                {result.savings !== undefined && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Reduced by {result.savings}% ({((result.originalSize || 0) / 1024 / 1024).toFixed(2)} MB → {((result.compressedSize || 0) / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}

                {result.publicUrl && (
                  <Button
                    onClick={() => window.open(result.publicUrl, "_blank")}
                    className="gradient-primary text-primary-foreground border-0"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                )}

                {result.files && result.files.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {result.files.map((f) => (
                      <Button
                        key={f.page}
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(f.publicUrl, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Page {f.page}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setFiles([]);
                  setFields({});
                }}
              >
                Process Another File
              </Button>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ToolPage;
