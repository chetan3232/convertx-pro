
-- Create storage bucket for uploaded files
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Allow anyone to upload files (no auth required for MVP)
CREATE POLICY "Anyone can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');

-- Allow anyone to read/download files
CREATE POLICY "Anyone can read uploaded files" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

-- Allow anyone to delete files (needed for cleanup function)
CREATE POLICY "Anyone can delete uploaded files" ON storage.objects FOR DELETE USING (bucket_id = 'uploads');

-- Create a table to track uploaded files and their expiry
CREATE TABLE public.uploaded_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT,
  source_format TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 minutes')
);

-- Enable RLS
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert/read/delete (no auth for MVP)
CREATE POLICY "Anyone can insert file records" ON public.uploaded_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read file records" ON public.uploaded_files FOR SELECT USING (true);
CREATE POLICY "Anyone can delete file records" ON public.uploaded_files FOR DELETE USING (true);

-- Enable pg_cron and pg_net for scheduled cleanup
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
