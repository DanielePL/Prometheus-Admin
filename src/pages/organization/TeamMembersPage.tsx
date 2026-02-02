import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  UserPlus,
  Mail,
  MoreHorizontal,
  Trash2,
  Crown,
  ShieldCheck,
  User,
  Eye,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type {
  OrganizationRole,
  OrganizationMember,
  OrganizationInvitation,
} from "@/api/types/permissions";

interface MemberWithProfile extends OrganizationMember {
  user_profile?: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

const roleConfig: Record<OrganizationRole, { icon: typeof User; color: string; label: string }> = {
  owner: { icon: Crown, color: "text-yellow-500 bg-yellow-500/20", label: "Owner" },
  admin: { icon: ShieldCheck, color: "text-blue-500 bg-blue-500/20", label: "Admin" },
  member: { icon: User, color: "text-green-500 bg-green-500/20", label: "Member" },
  viewer: { icon: Eye, color: "text-gray-500 bg-gray-500/20", label: "Viewer" },
};

export function TeamMembersPage() {
  const { organization, isOwner, user } = useAuth();
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrganizationRole>("member");
  const [isInviting, setIsInviting] = useState(false);

  // Fetch members and invitations
  useEffect(() => {
    if (!organization || !supabase) return;

    const client = supabase; // Capture for TypeScript

    const fetchData = async () => {
      setIsLoading(true);

      // Fetch members with profiles
      const { data: membersData } = await client
        .from("organization_members")
        .select(`
          *,
          user_profile:user_profiles(email, full_name, avatar_url)
        `)
        .eq("organization_id", organization.id);

      if (membersData) {
        setMembers(membersData as MemberWithProfile[]);
      }

      // Fetch pending invitations
      const { data: invitationsData } = await client
        .from("organization_invitations")
        .select("*")
        .eq("organization_id", organization.id)
        .gte("expires_at", new Date().toISOString());

      if (invitationsData) {
        setInvitations(invitationsData);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [organization]);

  const handleInvite = async () => {
    if (!organization || !supabase || !user) return;

    setIsInviting(true);

    try {
      // Check if email is already a member
      const existingMember = members.find(
        (m) => m.user_profile?.email === inviteEmail
      );
      if (existingMember) {
        toast.error("This user is already a member of your organization.");
        return;
      }

      // Check if invitation already exists
      const existingInvite = invitations.find((i) => i.email === inviteEmail);
      if (existingInvite) {
        toast.error("An invitation has already been sent to this email.");
        return;
      }

      // Create invitation
      const { data, error } = await supabase
        .from("organization_invitations")
        .insert({
          organization_id: organization.id,
          email: inviteEmail,
          role: inviteRole,
          invited_by: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setInvitations([...invitations, data]);
      setIsInviteDialogOpen(false);
      setInviteEmail("");
      setInviteRole("member");
      toast.success(`Invitation sent to ${inviteEmail}`);
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("organization_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      setMembers(members.filter((m) => m.id !== memberId));
      toast.success("Team member removed");
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("organization_invitations")
        .delete()
        .eq("id", invitationId);

      if (error) throw error;

      setInvitations(invitations.filter((i) => i.id !== invitationId));
      toast.success("Invitation cancelled");
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast.error("Failed to cancel invitation");
    }
  };

  const handleChangeRole = async (memberId: string, newRole: OrganizationRole) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("organization_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;

      setMembers(
        members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
      toast.success("Role updated");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Team Members
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's team members and invitations
          </p>
        </div>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join {organization?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={inviteRole}
                  onValueChange={(v: string) => setInviteRole(v as OrganizationRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full access</SelectItem>
                    <SelectItem value="member">Member - Standard access</SelectItem>
                    <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsInviteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail || isInviting}
              >
                {isInviting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members List */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">
          Members ({members.length})
        </h2>

        <div className="space-y-3">
          {members.map((member) => {
            const config = roleConfig[member.role as OrganizationRole];
            const Icon = config.icon;
            const isCurrentUser = member.user_id === user?.id;
            const canManage = isOwner && !isCurrentUser && member.role !== "owner";

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.user_profile?.full_name || "Unknown"}
                      {isCurrentUser && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.user_profile?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${config.color}`}
                  >
                    {config.label}
                  </span>

                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(member.id, "admin")}
                          disabled={member.role === "admin"}
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(member.id, "member")}
                          disabled={member.role === "member"}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Make Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(member.id, "viewer")}
                          disabled={member.role === "viewer"}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Make Viewer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Invitations ({invitations.length})
          </h2>

          <div className="space-y-3">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-yellow-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Invited as {roleConfig[invitation.role as OrganizationRole]?.label || invitation.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    Expires{" "}
                    {new Date(invitation.expires_at).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCancelInvitation(invitation.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Info */}
      <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">Seat Usage</p>
            <p className="text-sm text-muted-foreground">
              {members.length} of {organization?.max_seats} seats used.
              {organization?.subscription_plan === "starter" && (
                <> Upgrade to Professional for more seats.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
