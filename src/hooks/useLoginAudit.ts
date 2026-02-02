import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAuditEndpoints } from "@/api/endpoints/loginAudit";
import type { LoginAuditFilters, CreateLoginAuditInput } from "@/api/types/loginAudit";

// =============================================================================
// Query Keys
// =============================================================================

export const loginAuditKeys = {
  all: ["loginAudit"] as const,
  logs: (filters?: LoginAuditFilters) => [...loginAuditKeys.all, "logs", filters] as const,
  stats: (days?: number) => [...loginAuditKeys.all, "stats", days] as const,
};

// =============================================================================
// Hooks
// =============================================================================

/**
 * Query hook for fetching login audit logs
 */
export function useLoginAuditLogs(filters?: LoginAuditFilters) {
  return useQuery({
    queryKey: loginAuditKeys.logs(filters),
    queryFn: () => loginAuditEndpoints.getLoginAuditLogs(filters),
  });
}

/**
 * Query hook for fetching login audit statistics
 */
export function useLoginAuditStats(days = 30) {
  return useQuery({
    queryKey: loginAuditKeys.stats(days),
    queryFn: () => loginAuditEndpoints.getLoginAuditStats(days),
  });
}

/**
 * Mutation hook for logging a login attempt
 */
export function useLogLoginAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLoginAuditInput) =>
      loginAuditEndpoints.logLoginAttempt(data),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: loginAuditKeys.all });
    },
  });
}
