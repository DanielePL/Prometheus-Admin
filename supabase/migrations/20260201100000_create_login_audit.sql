-- =============================================================================
-- Login Audit Logs - Track all login attempts (success and failed)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.login_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,                    -- Attempted email
  account_name text,                      -- Name if account exists
  status text NOT NULL CHECK (status IN ('success', 'failed_not_found', 'failed_wrong_password')),
  ip_address text,                        -- IP address (if available)
  user_agent text,                        -- Browser/device info
  attempted_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_login_audit_logs_email ON public.login_audit_logs(email);
CREATE INDEX IF NOT EXISTS idx_login_audit_logs_status ON public.login_audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_login_audit_logs_attempted_at ON public.login_audit_logs(attempted_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_login_audit_logs_email_attempted_at
  ON public.login_audit_logs(email, attempted_at DESC);

-- =============================================================================
-- RLS Policies (matching existing pattern - open access for internal admin)
-- =============================================================================

ALTER TABLE public.login_audit_logs ENABLE ROW LEVEL SECURITY;

-- SELECT: Allow reading audit logs
CREATE POLICY "login_audit_logs_select" ON public.login_audit_logs
  FOR SELECT TO anon, authenticated USING (true);

-- INSERT: Allow inserting audit logs (needed for login tracking)
CREATE POLICY "login_audit_logs_insert" ON public.login_audit_logs
  FOR INSERT TO anon, authenticated WITH CHECK (true);
