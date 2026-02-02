import { useState, useEffect } from "react";
import { Shield, Lock, Users, Crown, ShieldCheck, User, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/api/supabaseClient";
import {
  type OrganizationRole,
  TOP_LEVEL_PERMISSIONS,
  ROLE_PERMISSIONS,
} from "@/api/types/permissions";
import { cn } from "@/lib/utils";

interface MemberWithRole {
  id: string;
  user_id: string;
  role: OrganizationRole;
  user_profile?: {
    email: string;
    full_name: string | null;
  };
}

const roleConfig: Record<OrganizationRole, { icon: typeof User; color: string; label: string; description: string }> = {
  owner: {
    icon: Crown,
    color: "text-yellow-500 bg-yellow-500/20",
    label: "Owner",
    description: "Full access to everything including billing and organization settings"
  },
  admin: {
    icon: ShieldCheck,
    color: "text-blue-500 bg-blue-500/20",
    label: "Admin",
    description: "Full access except billing and ownership transfer"
  },
  member: {
    icon: User,
    color: "text-green-500 bg-green-500/20",
    label: "Member",
    description: "Standard access to creators, tasks, and sales"
  },
  viewer: {
    icon: Eye,
    color: "text-gray-500 bg-gray-500/20",
    label: "Viewer",
    description: "Read-only access to dashboard and creators"
  },
};

export function AdminPermissionsPage() {
  const { isOwner, organization } = useAuth();
  const [members, setMembers] = useState<MemberWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<OrganizationRole | null>(null);

  useEffect(() => {
    if (!organization || !supabase) return;

    const client = supabase; // Capture for TypeScript

    const fetchMembers = async () => {
      setIsLoading(true);
      const { data } = await client
        .from("organization_members")
        .select(`
          id,
          user_id,
          role,
          user_profile:user_profiles(email, full_name)
        `)
        .eq("organization_id", organization.id);

      if (data) {
        // Transform data to match our interface (user_profile is returned as array)
        const transformed = data.map((d: { id: string; user_id: string; role: string; user_profile: { email: string; full_name: string | null }[] | null }) => ({
          ...d,
          user_profile: d.user_profile?.[0] || undefined,
        }));
        setMembers(transformed as MemberWithRole[]);
      }
      setIsLoading(false);
    };

    fetchMembers();
  }, [organization]);

  // Only owner can access this page
  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Lock className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold">Access denied</h2>
        <p className="text-muted-foreground mt-2">
          Only organization owners can manage permissions.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Role Permissions
        </h1>
        <p className="text-muted-foreground mt-1">
          Understand what each role can do in your organization
        </p>
      </div>

      {/* Role Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(roleConfig) as OrganizationRole[]).map((role) => {
          const config = roleConfig[role];
          const Icon = config.icon;
          const permissions = ROLE_PERMISSIONS[role];
          const memberCount = members.filter(m => m.role === role).length;

          return (
            <button
              key={role}
              onClick={() => setSelectedRole(selectedRole === role ? null : role)}
              className={cn(
                "glass rounded-xl p-4 text-left transition-all",
                selectedRole === role && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{config.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {memberCount} member{memberCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {config.description}
              </p>
              <p className="text-xs text-primary mt-2">
                {permissions.length} permissions
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Role Permissions */}
      {selectedRole && (
        <div className="glass rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {roleConfig[selectedRole].label} Permissions
          </h2>

          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {TOP_LEVEL_PERMISSIONS.map((config) => {
              const hasPermission = ROLE_PERMISSIONS[selectedRole].includes(config.id);
              return (
                <div
                  key={config.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg text-sm",
                    hasPermission ? "bg-green-500/10 text-green-500" : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center text-xs",
                    hasPermission ? "bg-green-500 text-white" : "bg-muted"
                  )}>
                    {hasPermission ? "✓" : ""}
                  </div>
                  {config.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Members by Role */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Team Members by Role
        </h2>

        <div className="space-y-4">
          {(Object.keys(roleConfig) as OrganizationRole[]).map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            const roleMembers = members.filter(m => m.role === role);

            if (roleMembers.length === 0) return null;

            return (
              <div key={role}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${config.color.split(" ")[0]}`} />
                  <span className="text-sm font-medium">{config.label}s</span>
                </div>
                <div className="pl-6 space-y-1">
                  {roleMembers.map((member) => (
                    <div key={member.id} className="text-sm text-muted-foreground">
                      {member.user_profile?.full_name || member.user_profile?.email || "Unknown"}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-xl bg-muted/50 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">About Roles</p>
            <p className="mt-1">
              Roles define what areas of the app each team member can access.
              To change a member's role, go to Settings &gt; Team Members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
