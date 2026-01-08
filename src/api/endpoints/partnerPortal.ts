import { partnerApi, setPartnerAuth, clearPartnerAuth } from "../partnerClient";
import type {
  PartnerProfile,
  PartnerStats,
  ReferralLink,
  PartnerReferralView,
  PayoutRequest,
  CreatePayoutRequestInput,
  UpdatePayoutDetailsInput,
  EarningsDataPoint,
} from "../types/partnerPortal";

export const partnerPortalApi = {
  // Authentication
  login: async (email: string, code: string): Promise<{ token: string; partner: PartnerProfile }> => {
    const response = await partnerApi.post("/auth/login", { email, referral_code: code });
    const { token, partner } = response.data;
    setPartnerAuth(token, partner.id);
    return response.data;
  },

  logout: (): void => {
    clearPartnerAuth();
  },

  // Profile
  getProfile: async (): Promise<PartnerProfile> => {
    const response = await partnerApi.get("/profile");
    return response.data;
  },

  updatePayoutDetails: async (data: UpdatePayoutDetailsInput): Promise<PartnerProfile> => {
    const response = await partnerApi.patch("/profile/payout", data);
    return response.data;
  },

  // Stats
  getStats: async (): Promise<PartnerStats> => {
    const response = await partnerApi.get("/stats");
    return response.data;
  },

  getEarningsChart: async (months?: number): Promise<EarningsDataPoint[]> => {
    const response = await partnerApi.get("/stats/earnings", {
      params: { months: months || 12 },
    });
    return response.data;
  },

  // Referral Links
  getReferralLinks: async (): Promise<ReferralLink[]> => {
    const response = await partnerApi.get("/referral-links");
    return response.data;
  },

  createReferralLink: async (code?: string): Promise<ReferralLink> => {
    const response = await partnerApi.post("/referral-links", { code });
    return response.data;
  },

  // Referrals
  getReferrals: async (status?: string): Promise<PartnerReferralView[]> => {
    const response = await partnerApi.get("/referrals", {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  // Payouts
  getPayoutHistory: async (): Promise<PayoutRequest[]> => {
    const response = await partnerApi.get("/payouts");
    return response.data;
  },

  requestPayout: async (data: CreatePayoutRequestInput): Promise<PayoutRequest> => {
    const response = await partnerApi.post("/payouts/request", data);
    return response.data;
  },

  getPayoutEligibility: async (): Promise<{
    eligible: boolean;
    available_amount: number;
    minimum_payout: number;
    missing_payout_info: boolean;
  }> => {
    const response = await partnerApi.get("/payouts/eligibility");
    return response.data;
  },
};
