import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { influencerPortalEndpoints } from "@/api/endpoints/influencerPortal";
import type { UpdateInfluencerPayoutDetailsInput } from "@/api/types/influencerPortal";

// Query Keys
export const influencerPortalKeys = {
  all: ["influencerPortal"] as const,
  profile: () => [...influencerPortalKeys.all, "profile"] as const,
  stats: () => [...influencerPortalKeys.all, "stats"] as const,
  earningsChart: (months?: number) => [...influencerPortalKeys.all, "earningsChart", months] as const,
  campaigns: (status?: string) => [...influencerPortalKeys.all, "campaigns", status] as const,
  campaign: (id: string) => [...influencerPortalKeys.all, "campaign", id] as const,
  earnings: (status?: string) => [...influencerPortalKeys.all, "earnings", status] as const,
  payouts: () => [...influencerPortalKeys.all, "payouts"] as const,
};

// Profile
export function useInfluencerProfile() {
  return useQuery({
    queryKey: influencerPortalKeys.profile(),
    queryFn: influencerPortalEndpoints.getProfile,
  });
}

export function useUpdateInfluencerPayoutDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInfluencerPayoutDetailsInput) =>
      influencerPortalEndpoints.updatePayoutDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerPortalKeys.profile() });
    },
  });
}

// Stats
export function useInfluencerStats() {
  return useQuery({
    queryKey: influencerPortalKeys.stats(),
    queryFn: influencerPortalEndpoints.getStats,
  });
}

export function useInfluencerEarningsChart(months?: number) {
  return useQuery({
    queryKey: influencerPortalKeys.earningsChart(months),
    queryFn: () => influencerPortalEndpoints.getEarningsChart(months),
  });
}

// Campaigns
export function useInfluencerCampaigns(status?: string) {
  return useQuery({
    queryKey: influencerPortalKeys.campaigns(status),
    queryFn: () => influencerPortalEndpoints.getCampaigns(status),
  });
}

export function useInfluencerCampaign(id: string) {
  return useQuery({
    queryKey: influencerPortalKeys.campaign(id),
    queryFn: () => influencerPortalEndpoints.getCampaign(id),
    enabled: !!id,
  });
}

// Earnings
export function useInfluencerEarnings(status?: string) {
  return useQuery({
    queryKey: influencerPortalKeys.earnings(status),
    queryFn: () => influencerPortalEndpoints.getEarnings(status),
  });
}

// Payouts
export function useInfluencerPayoutHistory() {
  return useQuery({
    queryKey: influencerPortalKeys.payouts(),
    queryFn: influencerPortalEndpoints.getPayoutHistory,
  });
}

export function useRequestInfluencerPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => influencerPortalEndpoints.requestPayout(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerPortalKeys.payouts() });
      queryClient.invalidateQueries({ queryKey: influencerPortalKeys.stats() });
    },
  });
}
