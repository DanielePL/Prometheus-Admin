// Fixed admin email accounts
export const ADMIN_EMAILS = {
  SUPER_ADMIN: "management@prometheus.coach",
  ADMIN: "admin@prometheus.coach",
  CAMPUS: "campus@prometheus.coach",
  PARTNER_MANAGER: "partners@prometheus.coach",
  LAB: "lab@prometheus.coach",
} as const;

export type AdminEmail = (typeof ADMIN_EMAILS)[keyof typeof ADMIN_EMAILS];

// All valid admin emails
export const VALID_ADMIN_EMAILS: AdminEmail[] = [
  ADMIN_EMAILS.SUPER_ADMIN,
  ADMIN_EMAILS.ADMIN,
  ADMIN_EMAILS.CAMPUS,
  ADMIN_EMAILS.PARTNER_MANAGER,
  ADMIN_EMAILS.LAB,
];

// Admin account credentials and metadata
export interface AdminAccount {
  email: AdminEmail;
  name: string;
  password: string;
  role: "super_admin" | "admin" | "campus" | "partner_manager" | "lab";
}

export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    email: ADMIN_EMAILS.SUPER_ADMIN,
    name: "Daniele",
    password: "Ichiban_11",
    role: "super_admin",
  },
  {
    email: ADMIN_EMAILS.ADMIN,
    name: "Karin",
    password: "karin2026",
    role: "admin",
  },
  {
    email: ADMIN_EMAILS.CAMPUS,
    name: "Sjoerd",
    password: "sjoerd2026",
    role: "campus",
  },
  {
    email: ADMIN_EMAILS.PARTNER_MANAGER,
    name: "Valerie",
    password: "valerie2026",
    role: "partner_manager",
  },
  {
    email: ADMIN_EMAILS.LAB,
    name: "Basil",
    password: "basil2026",
    role: "lab",
  },
];

// Standard permissions (areas in the admin portal)
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
  | "partners"
  | "partners:payouts"
  | "partners:create"
  | "creators"
  | "creators:create"
  | "employees"
  | "performance"
  | "users"
  | "sales"
  | "sales:demo"
  | "sales:crm"
  | "influencers"
  | "ambassadors"
  | "lab"
  | "storage"
  | "tasks"
  | "settings";

// Predefined permissions for each role
export const ROLE_PERMISSIONS: Record<AdminAccount["role"], Permission[]> = {
  super_admin: [
    "dashboard", "costs", "revenue", "analytics", "partners", "partners:create",
    "employees", "performance", "users", "sales", "influencers", "ambassadors", "lab", "settings",
  ],
  admin: [
    "dashboard", "costs", "revenue", "analytics", "partners",
    "users", "sales", "influencers", "ambassadors", "lab", "settings",
  ],
  campus: [
    "dashboard", "costs", "revenue", "analytics", "partners",
    "users", "sales", "influencers", "ambassadors", "lab", "settings",
  ],
  partner_manager: [
    "partners", "influencers", "ambassadors",
  ],
  lab: [
    "dashboard", "costs", "revenue", "analytics", "partners",
    "users", "sales", "influencers", "ambassadors", "lab", "settings",
  ],
};

// Sensitive permissions (compensation data)
export type SensitivePermission =
  | "compensation:view"    // View salaries, bonuses, revenue shares
  | "compensation:edit";   // Edit compensation (super admin only)

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
    id: "partners",
    label: "Partners",
    children: ["partners:payouts", "partners:create"],
  },
  { id: "partners:payouts", label: "Payouts" },
  { id: "partners:create", label: "Create Partners" },
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
  { id: "influencers", label: "Influencers" },
  { id: "ambassadors", label: "Ambassadors" },
  { id: "lab", label: "Prometheus Lab", description: "VBT Analytics & Research" },
  { id: "settings", label: "Settings" },
];

// Top-level permissions for the UI checkboxes
export const TOP_LEVEL_PERMISSIONS: PermissionConfig[] = PERMISSION_CONFIG.filter(
  (p) => !p.id.includes(":")
);

// Admin permissions stored in database
export interface AdminPermissions {
  email: AdminEmail;
  permissions: Permission[];
  sensitive_permissions: SensitivePermission[];
  updated_at: string;
  updated_by: string;
}

// Helper to check if email is super admin
export function isSuperAdmin(email: string): boolean {
  return email === ADMIN_EMAILS.SUPER_ADMIN;
}

// Helper to check if email is valid admin
export function isValidAdminEmail(email: string): email is AdminEmail {
  return VALID_ADMIN_EMAILS.includes(email as AdminEmail);
}

// Helper to check if user has a specific permission
export function hasPermission(
  userPermissions: Permission[],
  required: Permission,
  isSuperAdmin: boolean
): boolean {
  if (isSuperAdmin) return true;

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
  isSuperAdmin: boolean
): boolean {
  if (isSuperAdmin) return true;
  return sensitivePermissions.includes(required);
}

// =============================================================================
// Organization & Multi-tenant Types
// =============================================================================

export type OrganizationRole = "owner" | "admin" | "member" | "viewer";

export type SubscriptionPlan = "starter" | "professional" | "enterprise";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "unpaid";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  trial_ends_at?: string;
  max_seats?: number;
  max_creators?: number;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  email: string;
  role: OrganizationRole;
  token: string;
  expires_at: string;
  created_at: string;
  invited_by: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  current_organization_id?: string;
  created_at: string;
  updated_at: string;
}

// Role-based sensitive permissions
export const ROLE_SENSITIVE_PERMISSIONS: Record<OrganizationRole, SensitivePermission[]> = {
  owner: ["compensation:view", "compensation:edit"],
  admin: ["compensation:view"],
  member: [],
  viewer: [],
};

// Plan limits
export const PLAN_LIMITS: Record<SubscriptionPlan, {
  maxMembers: number;
  maxProjects: number;
  maxSeats: number;
  maxCreators: number;
  features: string[];
}> = {
  starter: {
    maxMembers: 3,
    maxProjects: 5,
    maxSeats: 3,
    maxCreators: 10,
    features: ["basic_analytics", "email_support"],
  },
  professional: {
    maxMembers: 10,
    maxProjects: 25,
    maxSeats: 10,
    maxCreators: 50,
    features: ["advanced_analytics", "priority_support", "api_access"],
  },
  enterprise: {
    maxMembers: -1, // unlimited
    maxProjects: -1,
    maxSeats: -1,
    maxCreators: -1,
    features: ["custom_analytics", "dedicated_support", "api_access", "sso", "audit_logs"],
  },
};
