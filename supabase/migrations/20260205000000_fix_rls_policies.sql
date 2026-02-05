-- ============================================================================
-- RLS Fixes for Prometheus Admin
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. PARTNERS TABLE - Fix delete and full access
-- ============================================================================

-- Disable RLS completely (simplest fix for internal admin tool)
ALTER TABLE IF EXISTS partners DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS but allow all operations:
-- DROP POLICY IF EXISTS "Allow all operations on partners" ON partners;
-- CREATE POLICY "Allow all operations on partners" ON partners
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- ============================================================================
-- 2. BETA_TESTERS TABLE - Fix data visibility
-- ============================================================================

ALTER TABLE IF EXISTS beta_testers DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. PARTNER_REFERRALS TABLE - Related to partners
-- ============================================================================

ALTER TABLE IF EXISTS partner_referrals DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. PARTNER_PAYOUTS TABLE - Related to partners
-- ============================================================================

ALTER TABLE IF EXISTS partner_payouts DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. USER_PROFILES TABLE - For user data access
-- ============================================================================

ALTER TABLE IF EXISTS user_profiles DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. VELOCITY_HISTORY TABLE - For VBT/Lab data
-- ============================================================================

ALTER TABLE IF EXISTS velocity_history DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. ATHLETE_LVP_PROFILES TABLE - For VBT/Lab data
-- ============================================================================

ALTER TABLE IF EXISTS athlete_lvp_profiles DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 8. WORKOUT_SESSIONS TABLE - For VBT/Lab data
-- ============================================================================

ALTER TABLE IF EXISTS workout_sessions DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. EXERCISES TABLE - For VBT/Lab data
-- ============================================================================

ALTER TABLE IF EXISTS exercises DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 10. LOGIN_AUDIT TABLE - For security logs
-- ============================================================================

ALTER TABLE IF EXISTS login_audit DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VERIFICATION - Check RLS status on all tables
-- ============================================================================

SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
