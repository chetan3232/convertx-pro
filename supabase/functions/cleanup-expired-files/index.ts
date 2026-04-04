import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Find expired files
    const { data: expiredFiles, error: queryError } = await supabase
      .from("uploaded_files")
      .select("id, file_path")
      .lt("expires_at", new Date().toISOString());

    if (queryError) {
      throw new Error(`Query failed: ${queryError.message}`);
    }

    if (!expiredFiles || expiredFiles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No expired files to clean up", deleted: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const filePaths = expiredFiles.map((f) => f.file_path);
    const fileIds = expiredFiles.map((f) => f.id);

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("uploads")
      .remove(filePaths);

    if (storageError) {
      console.error("Storage delete error:", storageError);
    }

    // Delete records from database
    const { error: dbError } = await supabase
      .from("uploaded_files")
      .delete()
      .in("id", fileIds);

    if (dbError) {
      console.error("DB delete error:", dbError);
    }

    return new Response(
      JSON.stringify({
        message: `Cleaned up ${filePaths.length} expired files`,
        deleted: filePaths.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
