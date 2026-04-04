import { supabase } from "@/integrations/supabase/client";

export async function uploadFile(file: File): Promise<{
  success: boolean;
  publicUrl?: string;
  filePath?: string;
  error?: string;
}> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data, error } = await supabase.functions.invoke("upload-file", {
      body: formData,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      publicUrl: data.public_url,
      filePath: data.file_path,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Upload failed" };
  }
}
