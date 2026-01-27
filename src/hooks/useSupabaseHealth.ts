import { useQuery } from "@tanstack/react-query";
import {
  getDatabaseHealth,
  getTableHealth,
  getIndexHealth,
} from "@/api/supabaseHealthClient";

// =====================================================
// Database Health Hooks
// =====================================================

export function useDatabaseHealth() {
  return useQuery({
    queryKey: ["db-health"],
    queryFn: getDatabaseHealth,
    refetchInterval: 30_000,
  });
}

export function useTableHealth() {
  return useQuery({
    queryKey: ["table-health"],
    queryFn: getTableHealth,
    refetchInterval: 60_000,
  });
}

export function useIndexHealth() {
  return useQuery({
    queryKey: ["index-health"],
    queryFn: getIndexHealth,
    refetchInterval: 60_000,
  });
}
