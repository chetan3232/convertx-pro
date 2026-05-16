import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { RefreshCw, Upload, FileUp, X, ArrowLeft, Download, Loader2, Combine, Scissors, Minimize2, RotateCw, Lock, Unlock, Stamp, ScanText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  mergePdfs,
  splitPdf,
  rotatePdf,
  compressPdf,
  watermarkPdf,
  protectPdf,
  unlockPdf,
  ocrFile,
  convertFile,
  downloadFile,
  createDocxFromText,
} from "@/lib/pdf-tools-service";
import type { PdfToolResult } from "@/lib/pdf-tools-service";
import { toast } from "sonner";

const toolConfig: Record<
  string,
  {
    title: string;
    desc: string;
    icon: typeof Combine;
    accept: string;
    multiple: boolean;
    extraFields?: {
      name: string;
      label: string;
      placeholder: string;
      type?: string;
    }[];
  }
> = {
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
      {
        name: "pages",
        label: "Pages",
        placeholder: "e.g. 1,3,5 or 1-3 (leave empty for all)",
      },
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
      {
        name: "password",
        label: "Password",
        placeholder: "Enter password",
        type: "password",
      },
    ],
  },
  unlock: {
    title: "Unlock PDF",
    desc: "Remove password from a protected PDF",
    icon: Unlock,
    accept: ".pdf",
    multiple: false,
    extraFields: [
      {
        name: "password",
        label: "Password",
        placeholder: "Enter current password",
        type: "password",
      },
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
    desc: "Extract text from scanned documents using AI",
    icon: ScanText,
    accept: ".pdf,.jpg,.jpeg,.png,.webp",
    multiple: false,
  },
  "pdf-converter": {
    title: "PDF Converter",
    desc: "Convert PDF to Word, Excel, PowerPoint, Image and more",
    icon: RefreshCw,
    accept: ".pdf",
    multiple: false,
    extraFields: [
      {
        name: "target",
        label: "Convert to",
        placeholder: "Select format",
        type: "select",
      },
    ],
  },
};

const pdfConversionTargets = [
  { ext: "docx", label: "Word (.docx)" },
  { ext: "xlsx", label: "Excel (.xlsx)" },
  { ext: "pptx", label: "PowerPoint (.pptx)" },
  { ext: "jpg", label: "Image (.jpg)" },
  { ext: "txt", label: "Text (.txt)" },
  { ext: "html", label: "HTML (.html)" },
];

const ToolPage = () => {
  const { tool } = useParams<{ tool: string }>();
  const config = toolConfig[tool || ""];
  const [files, setFiles] = useState<File[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PdfToolResult | null>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles);
      setFiles((prev) => (config?.multiple ? [...prev, ...arr] : arr));
    },
    [config]
  );

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
          res = await rotatePdf(
            files[0],
            Number(fields.angle || 90),
            fields.pages
          );
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
        case "ocr":
          res = await ocrFile(files[0]);
          break;
        case "pdf-converter":
          res = await convertFile(files[0], fields.target || "docx");
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

  const handleDownload = (url: string, name: string) => {
    downloadFile(url, name);
    toast.success(`Downloading ${name}`);
  };

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Tool not found
          </h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
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
      <section className="pb-16 pt-32">
        <div className="container max-w-2xl">
          <Link
            to="/#tools"
            className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Icon className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {config.title}
            </h1>
            <p className="mt-2 text-muted-foreground">{config.desc}</p>
          </motion.div>

          {/* Upload area */}
          {!result && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 cursor-pointer rounded-2xl border-2 border-dashed border-border p-10 text-center transition-colors hover:border-muted-foreground/50"
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
                <Upload className="mx-auto mb-3 h-10 w-10 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  {config.multiple
                    ? "Drop PDF files here or click to browse"
                    : "Drop a file here or click to browse"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
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
                    className="mb-6 space-y-3"
                  >
                    {files.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="glass flex items-center gap-3 rounded-xl p-3"
                      >
                        <FileUp className="h-5 w-5 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Extra fields */}
              {config.extraFields && files.length > 0 && (
                <div className="mb-6 space-y-4">
                  {config.extraFields.map((field) => (
                    <div key={field.name}>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <Select
                          onValueChange={(v) =>
                            setFields((prev) => ({ ...prev, [field.name]: v }))
                          }
                          defaultValue={pdfConversionTargets[0].ext}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {pdfConversionTargets.map((t) => (
                              <SelectItem key={t.ext} value={t.ext}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                          value={fields[field.name] || ""}
                          onChange={(e) =>
                            setFields((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Process button */}
              {files.length > 0 && (
                <Button
                  onClick={handleProcess}
                  disabled={processing}
                  className="gradient-primary w-full border-0 text-primary-foreground"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
              <div className="glass mb-6 rounded-2xl p-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                  <Download className="h-7 w-7 text-success" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-foreground">
                  Ready!
                </h2>
                {result.savings !== undefined && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    Reduced by {result.savings}% (
                    {((result.originalSize || 0) / 1024 / 1024).toFixed(2)} MB →{" "}
                    {((result.compressedSize || 0) / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </p>
                )}

                {/* OCR extracted text preview */}
                {result.extractedText && (
                  <div className="mb-4 text-left">
                    <p className="mb-2 text-sm font-medium text-foreground">
                      Extracted Text Preview:
                    </p>
                    <div className="max-h-60 overflow-y-auto rounded-lg bg-secondary p-4">
                      <pre className="whitespace-pre-wrap break-words font-mono text-xs text-muted-foreground">
                        {result.extractedText}
                      </pre>
                    </div>
                    {result.fullLength && result.fullLength > 2000 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Showing first 2000 of {result.fullLength} characters.
                        Download for full text.
                      </p>
                    )}
                  </div>
                )}

                {result.publicUrl && (
                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                      onClick={() =>
                        handleDownload(
                          result.publicUrl!,
                          tool === "ocr" ? "extracted_text.txt" : "output.pdf"
                        )
                      }
                      className="gradient-primary border-0 text-primary-foreground"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download {tool === "ocr" ? "Text File" : "PDF"}
                    </Button>

                    {tool === "ocr" && result.extractedText && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={async () => {
                          const blob = await createDocxFromText(
                            result.extractedText!,
                            "ocr_result.docx"
                          );
                          downloadFile(blob, "ocr_result.docx");
                          toast.success("Downloading DOCX...");
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download DOCX
                      </Button>
                    )}
                  </div>
                )}

                {result.files && result.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {result.files.map((f) => (
                      <Button
                        key={f.page}
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          handleDownload(f.publicUrl, `page_${f.page}.pdf`)
                        }
                      >
                        <Download className="mr-2 h-4 w-4" />
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
