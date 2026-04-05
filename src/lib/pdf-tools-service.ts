import { supabase } from "@/integrations/supabase/client";

export interface PdfToolResult {
  success: boolean;
  publicUrl?: string;
  filePath?: string;
  files?: { page: number; publicUrl: string; filePath: string }[];
  originalSize?: number;
  compressedSize?: number;
  savings?: number;
  extractedText?: string;
  fullLength?: number;
  note?: string;
  error?: string;
}

async function callPdfTool(action: string, formData: FormData): Promise<PdfToolResult> {
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/pdf-tools?action=${action}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Operation failed" };
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || "Network error" };
  }
}

export async function mergePdfs(files: File[]): Promise<PdfToolResult> {
  const formData = new FormData();
  files.forEach((f) => formData.append("file", f));
  return callPdfTool("merge", formData);
}

export async function splitPdf(file: File, pages?: string): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (pages) formData.append("pages", pages);
  return callPdfTool("split", formData);
}

export async function rotatePdf(file: File, angle: number, pages?: string): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("angle", String(angle));
  if (pages) formData.append("pages", pages);
  return callPdfTool("rotate", formData);
}

export async function compressPdf(file: File): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  return callPdfTool("compress", formData);
}

export async function watermarkPdf(file: File, text: string): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("text", text);
  return callPdfTool("watermark", formData);
}

export async function protectPdf(file: File, password: string): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);
  return callPdfTool("protect", formData);
}

export async function unlockPdf(file: File, password: string): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);
  return callPdfTool("unlock", formData);
}

export async function convertFile(file: File, target: string): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target", target);
  return callPdfTool("convert", formData);
}

export async function ocrFile(file: File): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  return callPdfTool("ocr", formData);
}

// Helper to trigger direct download from a URL
export async function downloadFile(url: string, fileName: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback: open in new tab
    window.open(url, "_blank");
  }
}
