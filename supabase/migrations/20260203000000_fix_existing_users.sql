-- =============================================================================
-- Fix for existing users after multi-tenant migration
-- Creates default organization and links existing users
-- =============================================================================

-- 1. Create default organization if none exists
INSERT INTO public.organizations (id, name, slug, subscription_status, subscription_plan, max_seats, max_creators)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Prometheus',
  'prometheus',
  'active',
  'enterprise',
  100,
  1000
WHERE NOT EXISTS (SELECT 1 FROM public.organizations LIMIT 1);

-- 2. Create user_profiles for all auth users that don't have one
INSERT INTO public.user_profiles (id, email, full_name, current_organization_id)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  (SELECT id FROM public.organizations ORDER BY created_at LIMIT 1)
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = u.id)
ON CONFLICT (id) DO UPDATE SET
  current_organization_id = COALESCE(
    public.user_profiles.current_organization_id,
    (SELECT id FROM public.organizations ORDER BY created_at LIMIT 1)
  );

-- 3. Make all existing users owners of the default org if they have no membership
INSERT INTO public.organization_members (organization_id, user_id, role)
SELECT
  (SELECT id FROM public.organizations ORDER BY created_at LIMIT 1),
  u.id,
  'owner'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.organization_members om WHERE om.user_id = u.id
)
ON CONFLICT (organization_id, user_id) DO NOTHING;

-- 4. Update user_profiles to set current_organization_id if null
UPDATE public.user_profiles
SET current_organization_id = (
  SELECT organization_id
  FROM public.organization_members
  WHERE user_id = user_profiles.id
  LIMIT 1
)
WHERE current_organization_id IS NULL;

-- 5. Ensure RLS allows authenticated users to read their own profile
DROP POLICY IF EXISTS "users_read_own_profile" ON public.user_profiles;
CREATE POLICY "users_read_own_profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "users_update_own_profile" ON public.user_profiles;
CREATE POLICY "users_update_own_profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 6. Ensure organization_members can be read by members
DROP POLICY IF EXISTS "members_read_own_memberships" ON public.organization_members;
CREATE POLICY "members_read_own_memberships" ON public.organization_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 7. Ensure organizations can be read by members
DROP POLICY IF EXISTS "org_members_read_org" ON public.organizations;
CREATE POLICY "org_members_read_org" ON public.organizations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organizations.id
      AND user_id = auth.uid()
    )
  );

-- 8. Enable RLS on all tables if not already enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
