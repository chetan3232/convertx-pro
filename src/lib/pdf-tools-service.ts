/**
 * pdf-tools-service.ts
 * Core PDF + conversion logic.
 * Falls back gracefully when Supabase edge functions are not available.
 */
import { supabase } from "@/integrations/supabase/client";
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as pdfjsLib from "pdfjs-dist";

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;

const isSupabaseConfigured =
  !!SUPABASE_URL && !SUPABASE_URL.includes("your-project") && !!ANON_KEY;

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

async function callPdfTool(
  action: string,
  formData: FormData
): Promise<PdfToolResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error:
        "Backend not configured. Supabase edge functions are required for PDF tools. Please set up your .env credentials.",
    };
  }

  try {
    const projectId = PROJECT_ID;
    const anonKey = ANON_KEY;

    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/pdf-tools?action=${action}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey!,
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Operation failed" };
    }
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return { success: false, error: message };
  }
}

export async function mergePdfs(files: File[]): Promise<PdfToolResult> {
  const formData = new FormData();
  files.forEach((f) => formData.append("file", f));
  return callPdfTool("merge", formData);
}

export async function splitPdf(
  file: File,
  pages?: string
): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (pages) formData.append("pages", pages);
  return callPdfTool("split", formData);
}

export async function rotatePdf(
  file: File,
  angle: number,
  pages?: string
): Promise<PdfToolResult> {
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

export async function watermarkPdf(
  file: File,
  text: string
): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("text", text);
  return callPdfTool("watermark", formData);
}

export async function protectPdf(
  file: File,
  password: string
): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);
  return callPdfTool("protect", formData);
}

export async function unlockPdf(
  file: File,
  password: string
): Promise<PdfToolResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);
  return callPdfTool("unlock", formData);
}

export async function convertFile(
  file: File,
  target: string
): Promise<PdfToolResult> {
  // Local fallback: for text-based conversions, do them in-browser
  const ext = file.name.split(".").pop()?.toLowerCase() || "";

  // If backend is configured, prioritize it for "Working Mode" accuracy
  if (isSupabaseConfigured) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", target);
    const res = await callPdfTool("convert", formData);
    if (res.success) return res;
    // If backend fails, we can fall through to local fallbacks
  }

  // Local fallback: for simple text-based conversions
  // TXT/MD → PDF (browser print approach via object URL)
  if (["txt", "md"].includes(ext) && target === "pdf") {
    const text = await file.text();
    const blob = new Blob(
      [
        `<html><body style="font-family:sans-serif;padding:3rem;line-height:1.6"><pre style="white-space:pre-wrap">${text}</pre></body></html>`,
      ],
      { type: "text/html" }
    );
    const url = URL.createObjectURL(blob);
    return { success: true, publicUrl: url, note: "Browser-rendered PDF preview" };
  }

  // IMAGE → PDF (simple wrap)
  if (["jpg", "jpeg", "png", "webp"].includes(ext) && target === "pdf") {
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
    const blob = new Blob(
      [
        `<html><body style="margin:0;display:flex;justify-content:center;align-items:center;background:#f0f0f0"><img src="${dataUrl}" style="max-width:100%;height:auto;box-shadow:0 0 20px rgba(0,0,0,0.1)"></body></html>`,
      ],
      { type: "text/html" }
    );
    const url = URL.createObjectURL(blob);
    return { success: true, publicUrl: url, note: "Image-to-PDF preview" };
  }

  // CSV → local JSON conversion
  if (ext === "csv" && target === "json") {
    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    const headers = lines[0].split(",").map(h => h.trim());
    const json = lines.slice(1).map((line) => {
      const values = line.split(",");
      return Object.fromEntries(headers.map((h, i) => [h, values[i]?.trim()]));
    });
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    return { success: true, publicUrl: url };
  }

  // JSON → CSV
  if (ext === "json" && target === "csv") {
    const text = await file.text();
    const json = JSON.parse(text) as Record<string, unknown>[];
    if (Array.isArray(json) && json.length > 0) {
      const headers = Object.keys(json[0]);
      const csv = [
        headers.join(","),
        ...json.map((row) => headers.map((h) => {
          const val = row[h];
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      return { success: true, publicUrl: url };
    }
  }

  // TXT → DOCX
  if (ext === "txt" && target === "docx") {
    const text = await file.text();
    const blob = await createDocxFromText(text, file.name);
    const url = URL.createObjectURL(blob);
    return { success: true, publicUrl: url };
  }

  // Fallback: try Supabase edge function
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

/** Generate a DOCX Blob from plain text */
export async function createDocxFromText(
  text: string,
  _fileName: string
): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: text.split("\n").map(
          (line) =>
            new Paragraph({
              children: [new TextRun(line || " ")],
            })
        ),
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/** Trigger a direct download from a URL or Blob */
export async function downloadFile(
  urlOrBlob: string | Blob,
  fileName: string
) {
  try {
    const isBlob = urlOrBlob instanceof Blob;
    const blobUrl = isBlob ? URL.createObjectURL(urlOrBlob) : urlOrBlob;

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (isBlob) {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    }
  } catch {
    if (typeof urlOrBlob === "string") {
      window.open(urlOrBlob, "_blank");
    }
  }
}

/** Extract text from a PDF file in the browser */
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n\n";
  }
  return fullText;
}
