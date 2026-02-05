-- =====================================================
-- Add DELETE Policy for Partners Table
-- Created: 2026-02-04
-- Description: Allow deletion of partners from admin panel
-- =====================================================

-- Ensure RLS is enabled (if not already)
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Drop existing delete policy if exists
DROP POLICY IF EXISTS "Allow delete for partners" ON public.partners;

-- Create DELETE policy for anon and authenticated users
-- This allows the admin panel to delete partners
CREATE POLICY "Allow delete for partners"
  ON public.partners
  FOR DELETE
  TO anon, authenticated
  USING (true);
