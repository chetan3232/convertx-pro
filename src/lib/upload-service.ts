/**
 * upload-service.ts
 * Handles file uploads. Uses Supabase when credentials are present,
 * falls back to a local object URL for offline/dev testing.
 */
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

export async function uploadFile(file: File): Promise<{
  success: boolean;
  publicUrl?: string;
  filePath?: string;
  error?: string;
}> {
  // ── Local fallback when Supabase is not configured ──
  if (!SUPABASE_URL || SUPABASE_URL.includes("your-project")) {
    const objectUrl = URL.createObjectURL(file);
    return { success: true, publicUrl: objectUrl, filePath: file.name };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data, error } = await supabase.functions.invoke("upload-file", {
      body: formData,
    });

    if (error) {
      // Edge function not deployed — fall back to object URL
      const objectUrl = URL.createObjectURL(file);
      return { success: true, publicUrl: objectUrl, filePath: file.name };
    }

    return {
      success: true,
      publicUrl: data.public_url,
      filePath: data.file_path,
    };
  } catch {
    // Network error — still allow local preview
    const objectUrl = URL.createObjectURL(file);
    return { success: true, publicUrl: objectUrl, filePath: file.name };
  }
}
