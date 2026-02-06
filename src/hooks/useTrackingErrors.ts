import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trackingErrorsApi } from "@/api/endpoints/trackingErrors";
import type {
  TrackingErrorFilters,
  ReviewStatus,
} from "@/api/types/trackingErrors";

// Query Keys
export const trackingErrorKeys = {
  all: ["trackingErrors"] as const,
  list: (filters?: TrackingErrorFilters) =>
    [...trackingErrorKeys.all, "list", filters] as const,
  detail: (id: string) => [...trackingErrorKeys.all, "detail", id] as const,
  stats: () => [...trackingErrorKeys.all, "stats"] as const,
};

// List with filters
export function useTrackingErrors(filters?: TrackingErrorFilters) {
  return useQuery({
    queryKey: trackingErrorKeys.list(filters),
    queryFn: () => trackingErrorsApi.getTrackingErrors(filters),
  });
}

// Single detail
export function useTrackingError(id: string) {
  return useQuery({
    queryKey: trackingErrorKeys.detail(id),
    queryFn: () => trackingErrorsApi.getTrackingError(id),
    enabled: !!id,
  });
}

// Stats for dashboard cards
export function useTrackingErrorStats() {
  return useQuery({
    queryKey: trackingErrorKeys.stats(),
    queryFn: trackingErrorsApi.getStats,
  });
}

// Update review status mutation
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: ReviewStatus;
      notes?: string;
    }) => trackingErrorsApi.updateReviewStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackingErrorKeys.all });
    },
  });
}
