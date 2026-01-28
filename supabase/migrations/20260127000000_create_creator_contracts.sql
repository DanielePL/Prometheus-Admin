-- Create creator_contracts table
CREATE TABLE IF NOT EXISTS public.creator_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL,
  pdf_url text,
  signed_pdf_url text,
  signature_data text,
  signed_at timestamptz,
  signed_by_ip text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_signature', 'signed', 'expired')),
  template_name text,
  version text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

-- Index for fast lookups by creator
CREATE INDEX IF NOT EXISTS idx_creator_contracts_creator_id ON public.creator_contracts(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_contracts_status ON public.creator_contracts(status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_creator_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_creator_contracts_updated_at
  BEFORE UPDATE ON public.creator_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_creator_contracts_updated_at();

-- RLS policies
ALTER TABLE public.creator_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creator_contracts_select" ON public.creator_contracts
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "creator_contracts_insert" ON public.creator_contracts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "creator_contracts_update" ON public.creator_contracts
  FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "creator_contracts_delete" ON public.creator_contracts
  FOR DELETE TO anon, authenticated USING (true);

-- Create contracts storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contracts',
  'contracts',
  true,
  10485760,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "contracts_storage_insert" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'contracts');

CREATE POLICY "contracts_storage_select" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'contracts');

CREATE POLICY "contracts_storage_update" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'contracts');

CREATE POLICY "contracts_storage_delete" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'contracts');
