-- Create sales_leads table
CREATE TABLE IF NOT EXISTS public.sales_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  coaches_count integer NOT NULL DEFAULT 0,
  clients_count integer NOT NULL DEFAULT 0,
  pain_points text[] DEFAULT '{}',
  pricing_quoted numeric NOT NULL DEFAULT 0,
  founding_partner boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'demo', 'negotiation', 'won', 'lost')),
  assigned_to text,
  demo_date timestamptz,
  closed_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create sales_notes table
CREATE TABLE IF NOT EXISTS public.sales_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.sales_leads(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_by text NOT NULL DEFAULT 'Admin',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sales_leads_status ON public.sales_leads(status);
CREATE INDEX IF NOT EXISTS idx_sales_leads_created_at ON public.sales_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_notes_lead_id ON public.sales_notes(lead_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_sales_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sales_leads_updated_at
  BEFORE UPDATE ON public.sales_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_sales_leads_updated_at();

-- RLS policies (anon full access, matching existing pattern)
ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_leads_select" ON public.sales_leads
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "sales_leads_insert" ON public.sales_leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "sales_leads_update" ON public.sales_leads
  FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "sales_leads_delete" ON public.sales_leads
  FOR DELETE TO anon, authenticated USING (true);

ALTER TABLE public.sales_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_notes_select" ON public.sales_notes
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "sales_notes_insert" ON public.sales_notes
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "sales_notes_delete" ON public.sales_notes
  FOR DELETE TO anon, authenticated USING (true);
