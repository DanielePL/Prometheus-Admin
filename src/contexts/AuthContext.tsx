import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/api/supabaseClient";
import {
  type Permission,
  type SensitivePermission,
  type OrganizationRole,
  type Organization,
  type OrganizationMember,
  type UserProfile,
  ROLE_PERMISSIONS,
  ROLE_SENSITIVE_PERMISSIONS,
  hasPermission as checkHasPermission,
  hasSensitivePermission as checkHasSensitivePermission,
} from "@/api/types/permissions";
import { loginAuditEndpoints } from "@/api/endpoints/loginAudit";

// =============================================================================
// Types
// =============================================================================

interface AuthContextType {
  // Supabase Auth
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Organization Context
  organization: Organization | null;
  membership: OrganizationMember | null;
  userProfile: UserProfile | null;
  organizations: Organization[]; // All orgs user belongs to

  // Role & Permission Checks
  isOwner: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canAccessCRM: boolean;
  role: OrganizationRole | null;
  permissions: Permission[];
  sensitivePermissions: SensitivePermission[];
  hasPermission: (permission: Permission) => boolean;
  hasSensitivePermission: (permission: SensitivePermission) => boolean;
  hasRole: (role: OrganizationRole | OrganizationRole[]) => boolean;

  // Auth Actions
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;

  // Organization Actions
  switchOrganization: (orgId: string) => Promise<void>;
  createOrganization: (
    name: string,
    slug: string
  ) => Promise<{ organization: Organization | null; error: Error | null }>;
  acceptInvitation: (
    token: string
  ) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// Provider Component
// =============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Organization State
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [membership, setMembership] = useState<OrganizationMember | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Legacy admin role (for hardcoded accounts)
  const [legacyAdminRole, setLegacyAdminRole] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch User Data (Profile, Memberships, Organizations)
  // ---------------------------------------------------------------------------

  const fetchUserData = useCallback(async (userId: string) => {
    if (!supabase) return;

    try {
      // Try to fetch user profile (may not exist in legacy setup)
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile && !profileError) {
        setUserProfile(profile);
      }

      // Try to fetch organization memberships (may not exist in legacy setup)
      const { data: memberships, error: membershipError } = await supabase
        .from("organization_members")
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq("user_id", userId);

      // If multi-tenant tables don't exist, use legacy mode
      if (membershipError?.code === '42P01' || membershipError?.message?.includes('does not exist')) {
        console.log("Multi-tenant tables not found, running in legacy mode");
        // Create mock organization for legacy mode
        const mockOrg: Organization = {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Prometheus',
          slug: 'prometheus',
          subscription_status: 'active',
          subscription_plan: 'enterprise',
          max_seats: 100,
          max_creators: 1000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const mockMembership: OrganizationMember = {
          id: '00000000-0000-0000-0000-000000000002',
          organization_id: mockOrg.id,
          user_id: userId,
          role: 'owner',
          permissions: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setOrganization(mockOrg);
        setMembership(mockMembership);
        setOrganizations([mockOrg]);
        return;
      }

      if (memberships && memberships.length > 0) {
        // Extract organizations
        const orgs = memberships
          .map((m) => m.organization as Organization)
          .filter(Boolean);
        setOrganizations(orgs);

        // Determine current organization
        let currentOrgId = profile?.current_organization_id;

        // If no current org set, use first one
        if (!currentOrgId && orgs.length > 0) {
          currentOrgId = orgs[0].id;
        }

        // Find the membership for current org
        const currentMembership = memberships.find(
          (m) => m.organization_id === currentOrgId
        );

        if (currentMembership) {
          setMembership(currentMembership);
          setOrganization(currentMembership.organization as Organization);

          // Update profile if current_organization_id was not set
          if (!profile?.current_organization_id && supabase) {
            await supabase
              .from("user_profiles")
              .update({ current_organization_id: currentOrgId })
              .eq("id", userId);
          }
        }
      } else {
        // No memberships - use legacy mode
        console.log("No organization memberships found, running in legacy mode");
        const mockOrg: Organization = {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Prometheus',
          slug: 'prometheus',
          subscription_status: 'active',
          subscription_plan: 'enterprise',
          max_seats: 100,
          max_creators: 1000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const mockMembership: OrganizationMember = {
          id: '00000000-0000-0000-0000-000000000002',
          organization_id: mockOrg.id,
          user_id: userId,
          role: 'owner',
          permissions: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setOrganization(mockOrg);
        setMembership(mockMembership);
        setOrganizations([mockOrg]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to legacy mode on any error
      const mockOrg: Organization = {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Prometheus',
        slug: 'prometheus',
        subscription_status: 'active',
        subscription_plan: 'enterprise',
        max_seats: 100,
        max_creators: 1000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const mockMembership: OrganizationMember = {
        id: '00000000-0000-0000-0000-000000000002',
        organization_id: mockOrg.id,
        user_id: userId,
        role: 'owner',
        permissions: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setOrganization(mockOrg);
      setMembership(mockMembership);
      setOrganizations([mockOrg]);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Initialize Auth & Listen for Changes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserData(session.user.id);
      }

      setIsLoading(false);
    }).catch((error) => {
      // Handle AbortError from StrictMode gracefully
      if (error?.name !== 'AbortError') {
        console.error('Error getting session:', error);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user) {
        await fetchUserData(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setOrganization(null);
        setMembership(null);
        setUserProfile(null);
        setOrganizations([]);
        setLegacyAdminRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  // ---------------------------------------------------------------------------
  // Computed Values
  // ---------------------------------------------------------------------------

  const role = membership?.role ?? null;
  const isOwner = role === "owner";
  const isAdmin = role === "owner" || role === "admin";
  const isSuperAdmin = isOwner; // Owner has super admin privileges
  const canAccessCRM = isOwner || isAdmin; // Owners and admins can access CRM

  // Get permissions based on role
  // If legacy admin role is set, use that directly; otherwise map org roles
  const getPermissions = (): Permission[] => {
    if (legacyAdminRole && legacyAdminRole in ROLE_PERMISSIONS) {
      return ROLE_PERMISSIONS[legacyAdminRole as keyof typeof ROLE_PERMISSIONS];
    }
    if (!role) return [];
    const rolePermissionMap: Record<OrganizationRole, Permission[]> = {
      owner: ROLE_PERMISSIONS.super_admin,
      admin: ROLE_PERMISSIONS.admin,
      member: ROLE_PERMISSIONS.campus,
      viewer: ["dashboard"],
    };
    return rolePermissionMap[role];
  };
  const permissions: Permission[] = getPermissions();
  const sensitivePermissions: SensitivePermission[] = role
    ? ROLE_SENSITIVE_PERMISSIONS[role]
    : [];

  // ---------------------------------------------------------------------------
  // Permission Helpers
  // ---------------------------------------------------------------------------

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return checkHasPermission(permissions, permission, isOwner);
    },
    [permissions, isOwner]
  );

  const hasSensitivePermission = useCallback(
    (permission: SensitivePermission): boolean => {
      return checkHasSensitivePermission(sensitivePermissions, permission, isOwner);
    },
    [sensitivePermissions, isOwner]
  );

  const hasRole = useCallback(
    (checkRole: OrganizationRole | OrganizationRole[]): boolean => {
      if (!role) return false;
      const roles = Array.isArray(checkRole) ? checkRole : [checkRole];
      return roles.includes(role);
    },
    [role]
  );

  // ---------------------------------------------------------------------------
  // Auth Actions
  // ---------------------------------------------------------------------------

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: Error | null }> => {
      // First, check hardcoded admin accounts (legacy mode)
      const { ADMIN_ACCOUNTS } = await import("@/api/types/permissions");
      const adminAccount = ADMIN_ACCOUNTS.find(
        (acc) => acc.email === email && acc.password === password
      );

      if (adminAccount) {
        // Hardcoded login successful - create mock user/session
        console.log("Legacy login successful for:", adminAccount.name);

        const mockUser = {
          id: `legacy-${adminAccount.email}`,
          email: adminAccount.email,
          user_metadata: { full_name: adminAccount.name },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as User;

        const mockSession = {
          access_token: "legacy-token",
          refresh_token: "legacy-refresh",
          expires_in: 3600,
          token_type: "bearer",
          user: mockUser,
        } as unknown as Session;

        setUser(mockUser);
        setSession(mockSession);

        // Set up mock organization based on role
        const roleToOrgRole: Record<string, OrganizationRole> = {
          super_admin: "owner",
          admin: "admin",
          campus: "member",
          partner_manager: "member",
          lab: "member",
        };

        const mockOrg: Organization = {
          id: "00000000-0000-0000-0000-000000000001",
          name: "Prometheus",
          slug: "prometheus",
          subscription_status: "active",
          subscription_plan: "enterprise",
          max_seats: 100,
          max_creators: 1000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const mockMembership: OrganizationMember = {
          id: "00000000-0000-0000-0000-000000000002",
          organization_id: mockOrg.id,
          user_id: mockUser.id,
          role: roleToOrgRole[adminAccount.role] || "member",
          permissions: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setOrganization(mockOrg);
        setMembership(mockMembership);
        setOrganizations([mockOrg]);
        setLegacyAdminRole(adminAccount.role); // Store the original admin role
        setUserProfile({
          id: mockUser.id,
          email: mockUser.email!,
          full_name: adminAccount.name,
          current_organization_id: mockOrg.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as UserProfile);

        return { error: null };
      }

      // If no hardcoded match, try Supabase Auth
      if (!supabase) {
        return { error: new Error("Invalid credentials") };
      }

      // Get metadata for audit logging (non-blocking)
      const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : null;
      let ipAddress: string | null = null;
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json", {
          signal: AbortSignal.timeout(3000),
        });
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch {
        // IP fetch failed, continue without it
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Log the attempt (silent - no console output)
      if (error) {
        const status = error.message.includes("Invalid login credentials")
          ? "failed_wrong_password"
          : "failed_not_found";
        loginAuditEndpoints.logLoginAttempt({
          email,
          status,
          ip_address: ipAddress,
          user_agent: userAgent,
        }).catch(() => {});
      } else if (data.user) {
        loginAuditEndpoints.logLoginAttempt({
          email,
          account_name: data.user.user_metadata?.full_name || null,
          status: "success",
          ip_address: ipAddress,
          user_agent: userAgent,
        }).catch(() => {});
      }

      return { error: error ? new Error(error.message) : null };
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName?: string
    ): Promise<{ error: Error | null }> => {
      if (!supabase) {
        return { error: new Error("Supabase not configured") };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      return { error: error ? new Error(error.message) : null };
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: Error | null }> => {
      if (!supabase) {
        return { error: new Error("Supabase not configured") };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error: error ? new Error(error.message) : null };
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Organization Actions
  // ---------------------------------------------------------------------------

  const switchOrganization = useCallback(
    async (orgId: string): Promise<void> => {
      if (!supabase || !user) return;

      // Find the membership for this org
      const newMembership = organizations.find((o) => o.id === orgId);
      if (!newMembership) return;

      // Update profile with new current org
      await supabase
        .from("user_profiles")
        .update({ current_organization_id: orgId })
        .eq("id", user.id);

      // Refetch to update state
      await fetchUserData(user.id);
    },
    [user, organizations, fetchUserData]
  );

  const createOrganization = useCallback(
    async (
      name: string,
      slug: string
    ): Promise<{ organization: Organization | null; error: Error | null }> => {
      if (!supabase || !user) {
        return { organization: null, error: new Error("Not authenticated") };
      }

      try {
        // Create organization
        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .insert({ name, slug })
          .select()
          .single();

        if (orgError) {
          return { organization: null, error: new Error(orgError.message) };
        }

        // Add user as owner
        const { error: memberError } = await supabase
          .from("organization_members")
          .insert({
            organization_id: org.id,
            user_id: user.id,
            role: "owner",
          });

        if (memberError) {
          // Rollback org creation
          await supabase.from("organizations").delete().eq("id", org.id);
          return { organization: null, error: new Error(memberError.message) };
        }

        // Update user's current org
        await supabase
          .from("user_profiles")
          .update({ current_organization_id: org.id })
          .eq("id", user.id);

        // Refetch user data
        await fetchUserData(user.id);

        return { organization: org, error: null };
      } catch (err) {
        return {
          organization: null,
          error: err instanceof Error ? err : new Error("Unknown error"),
        };
      }
    },
    [user, fetchUserData]
  );

  const acceptInvitation = useCallback(
    async (token: string): Promise<{ error: Error | null }> => {
      if (!supabase || !user) {
        return { error: new Error("Not authenticated") };
      }

      try {
        // Find invitation by token
        const { data: invitation, error: inviteError } = await supabase
          .from("organization_invitations")
          .select("*")
          .eq("token", token)
          .single();

        if (inviteError || !invitation) {
          return { error: new Error("Invalid or expired invitation") };
        }

        // Check if invitation has expired
        if (new Date(invitation.expires_at) < new Date()) {
          return { error: new Error("Invitation has expired") };
        }

        // Check if user email matches invitation
        if (invitation.email !== user.email) {
          return { error: new Error("Invitation is for a different email address") };
        }

        // Add user to organization
        const { error: memberError } = await supabase
          .from("organization_members")
          .insert({
            organization_id: invitation.organization_id,
            user_id: user.id,
            role: invitation.role,
          });

        if (memberError) {
          // Might already be a member
          if (memberError.code === "23505") {
            return { error: new Error("You are already a member of this organization") };
          }
          return { error: new Error(memberError.message) };
        }

        // Delete the invitation
        await supabase
          .from("organization_invitations")
          .delete()
          .eq("id", invitation.id);

        // Refetch user data
        await fetchUserData(user.id);

        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err : new Error("Unknown error"),
        };
      }
    },
    [user, fetchUserData]
  );

  // ---------------------------------------------------------------------------
  // Context Value
  // ---------------------------------------------------------------------------

  const value: AuthContextType = {
    // Auth State
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,

    // Organization State
    organization,
    membership,
    userProfile,
    organizations,

    // Role & Permissions
    isOwner,
    isAdmin,
    isSuperAdmin,
    canAccessCRM,
    role,
    permissions,
    sensitivePermissions,
    hasPermission,
    hasSensitivePermission,
    hasRole,

    // Auth Actions
    login: signIn, // Alias for backwards compatibility
    signIn,
    signUp,
    signOut,
    resetPassword,

    // Organization Actions
    switchOrganization,
    createOrganization,
    acceptInvitation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// Hook
// =============================================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
