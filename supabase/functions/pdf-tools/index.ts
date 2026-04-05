import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { PDFDocument, StandardFonts, rgb, degrees } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getSupabase() {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key);
}

async function uploadResult(
  supabase: ReturnType<typeof createClient>,
  pdfBytes: Uint8Array,
  fileName: string
) {
  const filePath = `${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, pdfBytes, {
      contentType: "application/pdf",
      upsert: false,
    });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(filePath);

  await supabase.from("uploaded_files").insert({
    file_name: fileName,
    file_path: filePath,
    file_size: pdfBytes.length,
    mime_type: "application/pdf",
    source_format: "pdf",
  });

  return { publicUrl: urlData.publicUrl, filePath };
}

// Fetch a Unicode-capable font for multi-language text
async function fetchUnicodeFont(): Promise<Uint8Array | null> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf"
    );
    if (!res.ok) throw new Error("Font fetch failed");
    return new Uint8Array(await res.arrayBuffer());
  } catch {
    console.warn("Could not fetch Unicode font, falling back to standard");
    return null;
  }
}

// ─── MERGE ────────────────────────────────────────────
async function handleMerge(formData: FormData) {
  const files: File[] = [];
  for (const [, value] of formData.entries()) {
    if (value instanceof File && value.type === "application/pdf") {
      files.push(value);
    }
  }
  if (files.length < 2)
    return jsonResponse({ error: "Need at least 2 PDF files" }, 400);

  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const doc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }

  const pdfBytes = await merged.save();
  const supabase = await getSupabase();
  const result = await uploadResult(supabase, pdfBytes, "merged.pdf");
  return jsonResponse({ success: true, ...result });
}

// ─── SPLIT ────────────────────────────────────────────
async function handleSplit(formData: FormData) {
  const file = formData.get("file") as File;
  const pagesParam = formData.get("pages") as string; // e.g. "1,3,5" or "1-3"
  if (!file) return jsonResponse({ error: "No file provided" }, 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const srcDoc = await PDFDocument.load(bytes);
  const totalPages = srcDoc.getPageCount();

  // Parse page ranges
  let pageIndices: number[] = [];
  if (pagesParam) {
    for (const part of pagesParam.split(",")) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map(Number);
        for (let i = start; i <= Math.min(end, totalPages); i++) {
          pageIndices.push(i - 1);
        }
      } else {
        const n = Number(trimmed);
        if (n >= 1 && n <= totalPages) pageIndices.push(n - 1);
      }
    }
  } else {
    // Default: split every page
    pageIndices = Array.from({ length: totalPages }, (_, i) => i);
  }

  const supabase = await getSupabase();
  const results = [];

  for (const idx of pageIndices) {
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(srcDoc, [idx]);
    newDoc.addPage(page);
    const pdfBytes = await newDoc.save();
    const name = `${file.name.replace(".pdf", "")}_page${idx + 1}.pdf`;
    const result = await uploadResult(supabase, pdfBytes, name);
    results.push({ page: idx + 1, ...result });
  }

  return jsonResponse({ success: true, files: results });
}

// ─── ROTATE ───────────────────────────────────────────
async function handleRotate(formData: FormData) {
  const file = formData.get("file") as File;
  const angle = Number(formData.get("angle") || "90");
  const pagesParam = formData.get("pages") as string; // "all" or "1,2,3"

  if (!file) return jsonResponse({ error: "No file provided" }, 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes);
  const totalPages = doc.getPageCount();

  let pageIndices: number[];
  if (!pagesParam || pagesParam === "all") {
    pageIndices = Array.from({ length: totalPages }, (_, i) => i);
  } else {
    pageIndices = pagesParam
      .split(",")
      .map((s) => Number(s.trim()) - 1)
      .filter((n) => n >= 0 && n < totalPages);
  }

  for (const idx of pageIndices) {
    const page = doc.getPage(idx);
    page.setRotation(degrees(page.getRotation().angle + angle));
  }

  const pdfBytes = await doc.save();
  const supabase = await getSupabase();
  const result = await uploadResult(
    supabase,
    pdfBytes,
    file.name.replace(".pdf", "_rotated.pdf")
  );
  return jsonResponse({ success: true, ...result });
}

// ─── WATERMARK ────────────────────────────────────────
async function handleWatermark(formData: FormData) {
  const file = formData.get("file") as File;
  const text = (formData.get("text") as string) || "WATERMARK";

  if (!file) return jsonResponse({ error: "No file provided" }, 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    const fontSize = Math.min(width, height) * 0.08;

    page.drawText(text, {
      x: width / 2 - font.widthOfTextAtSize(text, fontSize) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.3,
      rotate: degrees(45),
    });
  }

  const pdfBytes = await doc.save();
  const supabase = await getSupabase();
  const result = await uploadResult(
    supabase,
    pdfBytes,
    file.name.replace(".pdf", "_watermarked.pdf")
  );
  return jsonResponse({ success: true, ...result });
}

// ─── COMPRESS (basic) ─────────────────────────────────
async function handleCompress(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return jsonResponse({ error: "No file provided" }, 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes);

  // Basic compression: re-save with object stream optimization
  const pdfBytes = await doc.save({ useObjectStreams: true });
  const supabase = await getSupabase();
  const result = await uploadResult(
    supabase,
    pdfBytes,
    file.name.replace(".pdf", "_compressed.pdf")
  );
  return jsonResponse({
    success: true,
    originalSize: file.size,
    compressedSize: pdfBytes.length,
    savings: Math.round((1 - pdfBytes.length / file.size) * 100),
    ...result,
  });
}

// ─── PROTECT ──────────────────────────────────────────
async function handleProtect(formData: FormData) {
  // pdf-lib doesn't support encryption natively
  // We'll re-save and note limitation
  const file = formData.get("file") as File;
  const password = formData.get("password") as string;
  if (!file) return jsonResponse({ error: "No file provided" }, 400);
  if (!password) return jsonResponse({ error: "No password provided" }, 400);

  return jsonResponse(
    {
      error:
        "PDF password protection requires a specialized library. This feature is coming soon.",
    },
    501
  );
}

// ─── UNLOCK ───────────────────────────────────────────
async function handleUnlock(formData: FormData) {
  return jsonResponse(
    {
      error:
        "PDF unlock requires a specialized library. This feature is coming soon.",
    },
    501
  );
}

// ─── TXT TO PDF ───────────────────────────────────────
async function handleConvert(formData: FormData) {
  const file = formData.get("file") as File;
  const targetFormat = (formData.get("target") as string) || "pdf";

  if (!file) return jsonResponse({ error: "No file provided" }, 400);

  const sourceExt = file.name.split(".").pop()?.toLowerCase();

  // TXT/MD → PDF
  if (
    (sourceExt === "txt" || sourceExt === "md" || sourceExt === "csv") &&
    targetFormat === "pdf"
  ) {
    const textContent = await file.text();
    const doc = await PDFDocument.create();

    // Try to get a Unicode font
    let font;
    const fontBytes = await fetchUnicodeFont();
    if (fontBytes) {
      try {
        font = await doc.embedFont(fontBytes);
      } catch {
        font = await doc.embedFont(StandardFonts.Helvetica);
      }
    } else {
      font = await doc.embedFont(StandardFonts.Helvetica);
    }

    const fontSize = 11;
    const margin = 50;
    const lineHeight = fontSize * 1.4;

    const lines = textContent.split("\n");
    let page = doc.addPage();
    let { width, height } = page.getSize();
    let y = height - margin;

    for (const line of lines) {
      // Word-wrap long lines
      const maxCharsPerLine = Math.floor((width - margin * 2) / (fontSize * 0.5));
      const wrappedLines =
        line.length > maxCharsPerLine
          ? line.match(new RegExp(`.{1,${maxCharsPerLine}}`, "g")) || [""]
          : [line];

      for (const wl of wrappedLines) {
        if (y < margin + lineHeight) {
          page = doc.addPage();
          ({ width, height } = page.getSize());
          y = height - margin;
        }

        try {
          page.drawText(wl || " ", {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
        } catch {
          // If character not in font, replace with ?
          const safe = wl.replace(/[^\x20-\x7E]/g, "?");
          page.drawText(safe || " ", {
            x: margin,
            y,
            size: fontSize,
            font: await doc.embedFont(StandardFonts.Helvetica),
            color: rgb(0.1, 0.1, 0.1),
          });
        }
        y -= lineHeight;
      }
    }

    const pdfBytes = await doc.save();
    const supabase = await getSupabase();
    const outputName = file.name.replace(/\.\w+$/, ".pdf");
    const result = await uploadResult(supabase, pdfBytes, outputName);
    return jsonResponse({ success: true, ...result });
  }

  // PDF → TXT
  if (sourceExt === "pdf" && targetFormat === "txt") {
    // pdf-lib doesn't extract text well; basic approach
    return jsonResponse(
      { error: "PDF to TXT extraction requires OCR capabilities. Use the OCR tool instead." },
      501
    );
  }

  return jsonResponse(
    {
      error: `Conversion from ${sourceExt} to ${targetFormat} is not yet supported server-side. File has been uploaded as-is.`,
    },
    501
  );
}

// ─── OCR (uses AI) ────────────────────────────────────
async function handleOCR(formData: FormData) {
  return jsonResponse(
    {
      error: "OCR feature is coming soon. It will use AI to extract text from scanned documents.",
    },
    501
  );
}

// ─── MAIN HANDLER ─────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (!action) {
      return jsonResponse({ error: "Missing 'action' query parameter" }, 400);
    }

    const formData = await req.formData();

    switch (action) {
      case "merge":
        return await handleMerge(formData);
      case "split":
        return await handleSplit(formData);
      case "rotate":
        return await handleRotate(formData);
      case "watermark":
        return await handleWatermark(formData);
      case "compress":
        return await handleCompress(formData);
      case "protect":
        return await handleProtect(formData);
      case "unlock":
        return await handleUnlock(formData);
      case "convert":
        return await handleConvert(formData);
      case "ocr":
        return await handleOCR(formData);
      default:
        return jsonResponse({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (error) {
    console.error("PDF tools error:", error);
    return jsonResponse({ error: error.message }, 500);
  }
});
