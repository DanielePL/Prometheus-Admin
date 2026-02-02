// =============================================================================
// LaunchPad - Multi-Tenant Permission System
// =============================================================================

// Organization roles - defines what a user can do within their organization
export type OrganizationRole = "owner" | "admin" | "member" | "viewer";

// Standard permissions (areas in the app)
export type Permission =
  | "dashboard"
  | "costs"
  | "costs:fixed"
  | "costs:services"
  | "costs:users"
  | "revenue"
  | "analytics"
  | "analytics:break-even"
  | "analytics:trends"
  | "creators"
  | "creators:payouts"
  | "creators:create"
  | "creators:contracts"
  | "creators:deals"
  | "employees"
  | "performance"
  | "users"
  | "sales"
  | "sales:demo"
  | "sales:crm"
  | "tasks"
  | "tasks:projects"
  | "storage"
  | "lab"
  | "settings"
  | "settings:team"
  | "settings:billing"
  | "settings:permissions";

// Sensitive permissions (compensation data, billing)
export type SensitivePermission =
  | "compensation:view"
  | "compensation:edit"
  | "billing:view"
  | "billing:manage";

// Predefined permissions for each organization role
export const ROLE_PERMISSIONS: Record<OrganizationRole, Permission[]> = {
  owner: [
    "dashboard",
    "costs",
    "costs:fixed",
    "costs:services",
    "costs:users",
    "revenue",
    "analytics",
    "analytics:break-even",
    "analytics:trends",
    "creators",
    "creators:payouts",
    "creators:create",
    "creators:contracts",
    "creators:deals",
    "employees",
    "performance",
    "users",
    "sales",
    "sales:demo",
    "sales:crm",
    "tasks",
    "tasks:projects",
    "storage",
    "lab",
    "settings",
    "settings:team",
    "settings:billing",
    "settings:permissions",
  ],
  admin: [
    "dashboard",
    "costs",
    "costs:fixed",
    "costs:services",
    "costs:users",
    "revenue",
    "analytics",
    "analytics:break-even",
    "analytics:trends",
    "creators",
    "creators:payouts",
    "creators:create",
    "creators:contracts",
    "creators:deals",
    "users",
    "sales",
    "sales:demo",
    "sales:crm",
    "tasks",
    "tasks:projects",
    "storage",
    "lab",
    "settings",
    "settings:team",
  ],
  member: [
    "dashboard",
    "creators",
    "creators:payouts",
    "creators:contracts",
    "creators:deals",
    "sales",
    "sales:crm",
    "tasks",
    "tasks:projects",
    "storage",
  ],
  viewer: [
    "dashboard",
    "creators",
    "tasks",
  ],
};

// Sensitive permissions by role
export const ROLE_SENSITIVE_PERMISSIONS: Record<OrganizationRole, SensitivePermission[]> = {
  owner: ["compensation:view", "compensation:edit", "billing:view", "billing:manage"],
  admin: ["compensation:view", "billing:view"],
  member: [],
  viewer: [],
};

// Permission configuration for UI
export interface PermissionConfig {
  id: Permission;
  label: string;
  description?: string;
  children?: Permission[];
}

export const PERMISSION_CONFIG: PermissionConfig[] = [
  { id: "dashboard", label: "Dashboard" },
  {
    id: "costs",
    label: "Costs",
    children: ["costs:fixed", "costs:services", "costs:users"],
  },
  { id: "costs:fixed", label: "Fixed Costs" },
  { id: "costs:services", label: "Service Costs" },
  { id: "costs:users", label: "User Costs" },
  { id: "revenue", label: "Revenue" },
  {
    id: "analytics",
    label: "Analytics",
    children: ["analytics:break-even", "analytics:trends"],
  },
  { id: "analytics:break-even", label: "Break-Even" },
  { id: "analytics:trends", label: "Trends" },
  {
    id: "creators",
    label: "Creators",
    children: ["creators:payouts", "creators:create", "creators:contracts", "creators:deals"],
  },
  { id: "creators:payouts", label: "Payouts" },
  { id: "creators:create", label: "Create Creators" },
  { id: "creators:contracts", label: "Contracts" },
  { id: "creators:deals", label: "Deals" },
  { id: "employees", label: "Employees" },
  { id: "performance", label: "Performance" },
  { id: "users", label: "Users" },
  {
    id: "sales",
    label: "Sales",
    children: ["sales:demo", "sales:crm"],
  },
  { id: "sales:demo", label: "Demo Wizard" },
  { id: "sales:crm", label: "Pipeline / CRM" },
  {
    id: "tasks",
    label: "Tasks",
    children: ["tasks:projects"],
  },
  { id: "tasks:projects", label: "Projects" },
  { id: "storage", label: "Team Storage" },
  { id: "lab", label: "Lab", description: "VBT Analytics & Research" },
  {
    id: "settings",
    label: "Settings",
    children: ["settings:team", "settings:billing", "settings:permissions"],
  },
  { id: "settings:team", label: "Team Management" },
  { id: "settings:billing", label: "Billing" },
  { id: "settings:permissions", label: "Permissions" },
];

// Top-level permissions for the UI checkboxes
export const TOP_LEVEL_PERMISSIONS: PermissionConfig[] = PERMISSION_CONFIG.filter(
  (p) => !p.id.includes(":")
);

// Helper to check if user has a specific permission
export function hasPermission(
  userPermissions: Permission[],
  required: Permission,
  isOwner: boolean
): boolean {
  if (isOwner) return true;

  // Check exact match
  if (userPermissions.includes(required)) return true;

  // Check parent permission (e.g., "costs" grants access to "costs:fixed")
  const parent = required.split(":")[0] as Permission;
  if (parent !== required && userPermissions.includes(parent)) return true;

  return false;
}

// Helper to check sensitive permission
export function hasSensitivePermission(
  sensitivePermissions: SensitivePermission[],
  required: SensitivePermission,
  isOwner: boolean
): boolean {
  if (isOwner) return true;
  return sensitivePermissions.includes(required);
}

// =============================================================================
// Subscription Plans
// =============================================================================

export type SubscriptionPlan = "starter" | "professional" | "enterprise";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "incomplete";

export interface PlanLimits {
  maxSeats: number;
  maxCreators: number;
  features: string[];
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  starter: {
    maxSeats: 3,
    maxCreators: 50,
    features: ["Core CRM", "Tasks", "Basic Analytics"],
  },
  professional: {
    maxSeats: 10,
    maxCreators: 200,
    features: ["Core CRM", "Tasks", "Deals", "Contracts", "Advanced Analytics", "API Access"],
  },
  enterprise: {
    maxSeats: -1, // Unlimited
    maxCreators: -1, // Unlimited
    features: ["All Features", "SSO", "Priority Support", "Custom Integrations"],
  },
};

// =============================================================================
// Database Types (matching Supabase tables)
// =============================================================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_plan: SubscriptionPlan;
  trial_ends_at: string | null;
  max_seats: number;
  max_creators: number;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  permissions: Permission[];
  created_at: string;
}

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  email: string;
  role: OrganizationRole;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  current_organization_id: string | null;
  created_at: string;
}
