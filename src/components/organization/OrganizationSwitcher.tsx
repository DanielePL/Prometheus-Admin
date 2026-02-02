import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building2, Check, ChevronDown, Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OrganizationSwitcher() {
  const { organization, organizations, switchOrganization, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Don't show if user only has one organization
  if (organizations.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 h-auto py-2 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium truncate max-w-32">
              {organization?.name}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {organization?.subscription_plan} Plan
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrganization(org.id)}
            className="gap-3 cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{org.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {org.subscription_plan}
              </p>
            </div>
            {org.id === organization?.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/settings/organization")}
              className="gap-3 cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              Organization Settings
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate("/onboarding/create-organization")}
          className="gap-3 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
