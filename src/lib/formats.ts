import { FileText, FileSpreadsheet, Presentation, Image, Code, BookOpen } from "lucide-react";

export interface FormatInfo {
  ext: string;
  label: string;
  category: string;
  icon: typeof FileText;
  color: string;
}

export const FORMAT_MAP: Record<string, FormatInfo> = {
  pdf: { ext: "pdf", label: "PDF", category: "Document", icon: FileText, color: "text-destructive" },
  docx: { ext: "docx", label: "DOCX", category: "Document", icon: FileText, color: "text-primary" },
  doc: { ext: "doc", label: "DOC", category: "Document", icon: FileText, color: "text-primary" },
  txt: { ext: "txt", label: "TXT", category: "Text", icon: FileText, color: "text-muted-foreground" },
  rtf: { ext: "rtf", label: "RTF", category: "Document", icon: FileText, color: "text-primary" },
  md: { ext: "md", label: "Markdown", category: "Text", icon: Code, color: "text-accent" },
  html: { ext: "html", label: "HTML", category: "Web", icon: Code, color: "text-warning" },
  xlsx: { ext: "xlsx", label: "XLSX", category: "Spreadsheet", icon: FileSpreadsheet, color: "text-success" },
  xls: { ext: "xls", label: "XLS", category: "Spreadsheet", icon: FileSpreadsheet, color: "text-success" },
  csv: { ext: "csv", label: "CSV", category: "Data", icon: FileSpreadsheet, color: "text-success" },
  pptx: { ext: "pptx", label: "PPTX", category: "Presentation", icon: Presentation, color: "text-warning" },
  ppt: { ext: "ppt", label: "PPT", category: "Presentation", icon: Presentation, color: "text-warning" },
  epub: { ext: "epub", label: "EPUB", category: "eBook", icon: BookOpen, color: "text-accent" },
  jpg: { ext: "jpg", label: "JPG", category: "Image", icon: Image, color: "text-accent" },
  png: { ext: "png", label: "PNG", category: "Image", icon: Image, color: "text-accent" },
  json: { ext: "json", label: "JSON", category: "Data", icon: Code, color: "text-warning" },
  xml: { ext: "xml", label: "XML", category: "Data", icon: Code, color: "text-warning" },
};

export const CONVERSION_TARGETS: Record<string, string[]> = {
  pdf: ["docx", "xlsx", "pptx", "txt", "html", "jpg", "png", "epub"],
  docx: ["pdf", "html", "epub", "txt", "rtf"],
  doc: ["docx", "pdf", "txt"],
  txt: ["pdf", "docx", "html", "md"],
  md: ["html", "pdf", "docx"],
  rtf: ["docx", "pdf", "txt"],
  html: ["pdf", "docx", "txt"],
  xlsx: ["csv", "pdf"],
  xls: ["xlsx", "csv", "pdf"],
  csv: ["xlsx", "json"],
  pptx: ["pdf", "jpg", "png"],
  ppt: ["pptx", "pdf"],
  epub: ["pdf", "docx", "txt"],
  jpg: ["png", "pdf", "txt"],
  png: ["jpg", "pdf", "txt"],
  json: ["csv", "xml"],
  xml: ["json"],
};

export function detectFormat(fileName: string): FormatInfo | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ext ? FORMAT_MAP[ext] || null : null;
}

export function getTargetFormats(sourceExt: string): FormatInfo[] {
  const targets = CONVERSION_TARGETS[sourceExt] || [];
  return targets.map((ext) => FORMAT_MAP[ext]).filter(Boolean);
}
