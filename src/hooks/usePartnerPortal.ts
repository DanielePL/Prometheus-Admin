import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { partnerPortalApi } from "@/api/endpoints/partnerPortal";
import type {
  CreatePayoutRequestInput,
  UpdatePayoutDetailsInput,
} from "@/api/types/partnerPortal";

// Query Keys
export const partnerPortalKeys = {
  all: ["partnerPortal"] as const,
  profile: () => [...partnerPortalKeys.all, "profile"] as const,
  stats: () => [...partnerPortalKeys.all, "stats"] as const,
  earningsChart: (months?: number) => [...partnerPortalKeys.all, "earnings", months] as const,
  referralLinks: () => [...partnerPortalKeys.all, "referralLinks"] as const,
  referrals: (status?: string) => [...partnerPortalKeys.all, "referrals", status] as const,
  payouts: () => [...partnerPortalKeys.all, "payouts"] as const,
  payoutEligibility: () => [...partnerPortalKeys.all, "payoutEligibility"] as const,
};

// Profile
export function usePartnerProfile() {
  return useQuery({
    queryKey: partnerPortalKeys.profile(),
    queryFn: partnerPortalApi.getProfile,
  });
}

export function useUpdatePayoutDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePayoutDetailsInput) =>
      partnerPortalApi.updatePayoutDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerPortalKeys.profile() });
      queryClient.invalidateQueries({ queryKey: partnerPortalKeys.payoutEligibility() });
    },
  });
}

// Stats
export function usePartnerStats() {
  return useQuery({
    queryKey: partnerPortalKeys.stats(),
    queryFn: partnerPortalApi.getStats,
  });
}

export function useEarningsChart(months?: number) {
  return useQuery({
    queryKey: partnerPortalKeys.earningsChart(months),
    queryFn: () => partnerPortalApi.getEarningsChart(months),
  });
}

// Referral Links
export function useReferralLinks() {
  return useQuery({
    queryKey: partnerPortalKeys.referralLinks(),
    queryFn: partnerPortalApi.getReferralLinks,
  });
}

export function useCreateReferralLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code?: string) => partnerPortalApi.createReferralLink(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerPortalKeys.referralLinks() });
    },
  });
}

// Referrals
export function usePartnerReferrals(status?: string) {
  return useQuery({
    queryKey: partnerPortalKeys.referrals(status),
    queryFn: () => partnerPortalApi.getReferrals(status),
  });
}

// Payouts
export function usePayoutHistory() {
  return useQuery({
    queryKey: partnerPortalKeys.payouts(),
    queryFn: partnerPortalApi.getPayoutHistory,
  });
}

export function usePayoutEligibility() {
  return useQuery({
    queryKey: partnerPortalKeys.payoutEligibility(),
    queryFn: partnerPortalApi.getPayoutEligibility,
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePayoutRequestInput) =>
      partnerPortalApi.requestPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerPortalKeys.payouts() });
      queryClient.invalidateQueries({ queryKey: partnerPortalKeys.payoutEligibility() });
      queryClient.invalidateQueries({ queryKey: partnerPortalKeys.stats() });
    },
  });
}

// Auth
export function usePartnerLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      partnerPortalApi.login(email, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerPortalKeys.all });
    },
  });
}

export function usePartnerLogout() {
  const queryClient = useQueryClient();

  return () => {
    partnerPortalApi.logout();
    queryClient.clear();
  };
}
