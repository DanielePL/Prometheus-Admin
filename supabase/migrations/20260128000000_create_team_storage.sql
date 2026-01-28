-- Create team_files table for shared team storage
CREATE TABLE IF NOT EXISTS public.team_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  original_name text NOT NULL,
  storage_path text NOT NULL,
  mime_type text NOT NULL DEFAULT 'application/octet-stream',
  file_size bigint NOT NULL DEFAULT 0,
  file_category text NOT NULL DEFAULT 'other'
    CHECK (file_category IN ('image', 'document', 'spreadsheet', 'other')),
  uploaded_by text NOT NULL
    CHECK (uploaded_by IN ('Sjoerd', 'Valerie', 'Karin', 'Daniele')),
  description text,
  tags text[] DEFAULT '{}',
  public_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_team_files_uploaded_by ON public.team_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_team_files_file_category ON public.team_files(file_category);
CREATE INDEX IF NOT EXISTS idx_team_files_created_at ON public.team_files(created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_team_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_team_files_updated_at
  BEFORE UPDATE ON public.team_files
  FOR EACH ROW
  EXECUTE FUNCTION update_team_files_updated_at();

-- RLS policies (anon full access, matching existing pattern)
ALTER TABLE public.team_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_files_select" ON public.team_files
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "team_files_insert" ON public.team_files
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "team_files_update" ON public.team_files
  FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "team_files_delete" ON public.team_files
  FOR DELETE TO anon, authenticated USING (true);

-- Create team-storage bucket (public, 50MB limit, images + PDFs + docs + spreadsheets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-storage',
  'team-storage',
  true,
  52428800,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain'
  ]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for team-storage bucket
CREATE POLICY "team_storage_insert" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'team-storage');

CREATE POLICY "team_storage_select" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'team-storage');

CREATE POLICY "team_storage_update" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'team-storage');

CREATE POLICY "team_storage_delete" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'team-storage');
