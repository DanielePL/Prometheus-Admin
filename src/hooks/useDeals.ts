import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dealsApi, type CreateDealInput, type UpdateDealInput } from "@/api/endpoints/deals";

// ============================================
// ENTERPRISE DEALS HOOKS
// ============================================

// Get all deals
export function useDeals() {
  return useQuery({
    queryKey: ["deals"],
    queryFn: () => dealsApi.getAll(),
  });
}

// Get deals by creator
export function useCreatorDeals(creatorId: string) {
  return useQuery({
    queryKey: ["deals", "creator", creatorId],
    queryFn: () => dealsApi.getByCreator(creatorId),
    enabled: !!creatorId,
  });
}

// Get single deal
export function useDeal(dealId: string) {
  return useQuery({
    queryKey: ["deals", dealId],
    queryFn: () => dealsApi.getById(dealId),
    enabled: !!dealId,
  });
}

// Get deal stats
export function useDealStats() {
  return useQuery({
    queryKey: ["deals", "stats"],
    queryFn: () => dealsApi.getStats(),
  });
}

// Get creator-specific deal stats
export function useCreatorDealStats(creatorId: string) {
  return useQuery({
    queryKey: ["deals", "stats", creatorId],
    queryFn: () => dealsApi.getCreatorStats(creatorId),
    enabled: !!creatorId,
  });
}

// Create deal
export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDealInput) => dealsApi.create(input),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", "creator", deal.creator_id] });
      queryClient.invalidateQueries({ queryKey: ["deals", "stats"] });
    },
  });
}

// Update deal
export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealId, input }: { dealId: string; input: UpdateDealInput }) =>
      dealsApi.update(dealId, input),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", deal.id] });
      queryClient.invalidateQueries({ queryKey: ["deals", "creator", deal.creator_id] });
      queryClient.invalidateQueries({ queryKey: ["deals", "stats"] });
    },
  });
}

// Advance deal stage
export function useAdvanceDealStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dealId: string) => dealsApi.advanceStage(dealId),
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", deal.id] });
      queryClient.invalidateQueries({ queryKey: ["deals", "creator", deal.creator_id] });
      queryClient.invalidateQueries({ queryKey: ["deals", "stats"] });
    },
  });
}

// Delete deal
export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dealId: string) => dealsApi.delete(dealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", "stats"] });
    },
  });
}
