import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  Code,
  BookOpen,
  FileCode,
  Globe,
} from "lucide-react";

export interface FormatInfo {
  ext: string;
  label: string;
  category: string;
  icon: typeof FileText;
  color: string;
}

export const FORMAT_MAP: Record<string, FormatInfo> = {
  // --- Text & Markup ---
  pdf: { ext: "pdf", label: "PDF", category: "Document", icon: FileText, color: "text-destructive" },
  docx: { ext: "docx", label: "DOCX", category: "Document", icon: FileText, color: "text-primary" },
  doc: { ext: "doc", label: "DOC", category: "Document", icon: FileText, color: "text-primary" },
  txt: { ext: "txt", label: "TXT", category: "Text", icon: FileText, color: "text-muted-foreground" },
  rtf: { ext: "rtf", label: "RTF", category: "Document", icon: FileText, color: "text-primary" },
  md: { ext: "md", label: "Markdown", category: "Text", icon: Code, color: "text-accent" },
  html: { ext: "html", label: "HTML", category: "Web", icon: Globe, color: "text-warning" },

  // --- Spreadsheets ---
  xlsx: { ext: "xlsx", label: "XLSX", category: "Spreadsheet", icon: FileSpreadsheet, color: "text-success" },
  xls: { ext: "xls", label: "XLS", category: "Spreadsheet", icon: FileSpreadsheet, color: "text-success" },
  csv: { ext: "csv", label: "CSV", category: "Data", icon: FileSpreadsheet, color: "text-success" },

  // --- Presentations ---
  pptx: { ext: "pptx", label: "PPTX", category: "Presentation", icon: Presentation, color: "text-warning" },
  ppt: { ext: "ppt", label: "PPT", category: "Presentation", icon: Presentation, color: "text-warning" },

  // --- eBooks ---
  epub: { ext: "epub", label: "EPUB", category: "eBook", icon: BookOpen, color: "text-accent" },
  mobi: { ext: "mobi", label: "MOBI", category: "eBook", icon: BookOpen, color: "text-accent" },

  // --- Images ---
  jpg: { ext: "jpg", label: "JPG", category: "Image", icon: Image, color: "text-accent" },
  jpeg: { ext: "jpeg", label: "JPEG", category: "Image", icon: Image, color: "text-accent" },
  png: { ext: "png", label: "PNG", category: "Image", icon: Image, color: "text-accent" },
  webp: { ext: "webp", label: "WEBP", category: "Image", icon: Image, color: "text-accent" },

  // --- Data ---
  json: { ext: "json", label: "JSON", category: "Data", icon: FileCode, color: "text-warning" },
  xml: { ext: "xml", label: "XML", category: "Data", icon: FileCode, color: "text-warning" },
};

export const CONVERSION_TARGETS: Record<string, string[]> = {
  // Text & Markup
  txt: ["pdf", "docx", "html", "md", "rtf"],
  md:  ["html", "pdf", "docx", "txt"],
  rtf: ["docx", "pdf", "txt"],
  html: ["pdf", "docx", "txt"],

  // PDF (Advanced)
  pdf: ["docx", "xlsx", "pptx", "txt", "html", "jpg", "png", "epub"],

  // Microsoft Office
  doc:  ["docx", "pdf", "txt"],
  docx: ["pdf", "html", "epub", "txt", "rtf"],
  xls:  ["xlsx", "csv", "pdf"],
  xlsx: ["csv", "pdf", "json"],
  ppt:  ["pptx", "pdf"],
  pptx: ["pdf", "jpg", "png"],

  // eBooks
  epub: ["pdf", "docx", "txt"],
  mobi: ["epub", "pdf", "txt"],

  // Images (OCR path)
  jpg:  ["png", "pdf", "txt"],
  jpeg: ["jpg", "pdf", "txt"],
  png:  ["jpg", "pdf", "txt"],
  webp: ["jpg", "png", "pdf"],

  // Data
  csv:  ["xlsx", "json", "xml"],
  json: ["csv", "xml"],
  xml:  ["json", "csv"],
};

export function detectFormat(fileName: string): FormatInfo | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ext ? FORMAT_MAP[ext] || null : null;
}

export function getTargetFormats(sourceExt: string): FormatInfo[] {
  const targets = CONVERSION_TARGETS[sourceExt] || [];
  return targets.map((ext) => FORMAT_MAP[ext]).filter(Boolean);
}
