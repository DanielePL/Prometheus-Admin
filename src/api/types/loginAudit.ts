// =============================================================================
// Login Audit Types
// =============================================================================

export type LoginAuditStatus = 'success' | 'failed_not_found' | 'failed_wrong_password';

export interface LoginAuditLog {
  id: string;
  email: string;
  account_name: string | null;
  status: LoginAuditStatus;
  ip_address: string | null;
  user_agent: string | null;
  attempted_at: string;
}

export interface LoginAuditFilters {
  status?: LoginAuditStatus;
  email?: string;
  days?: number;
  limit?: number;
}

export interface CreateLoginAuditInput {
  email: string;
  account_name?: string | null;
  status: LoginAuditStatus;
  ip_address?: string | null;
  user_agent?: string | null;
}

export interface LoginAuditStats {
  total: number;
  successful: number;
  failed: number;
  last24h: number;
  failedLast24h: number;
  uniqueEmails: number;
}
