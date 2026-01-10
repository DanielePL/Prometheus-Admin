import { influencerPortalApi, setInfluencerAuth, clearInfluencerAuth } from "../influencerClient";
import type {
  InfluencerProfile,
  InfluencerStats,
  InfluencerCampaign,
  EarningsEntry,
  InfluencerPayout,
  EarningsChartData,
  UpdateInfluencerPayoutDetailsInput,
} from "../types/influencerPortal";

export const influencerPortalEndpoints = {
  // Auth
  async login(email: string, code: string): Promise<void> {
    const response = await influencerPortalApi.post("/auth/login", { email, code });
    const { token, influencer } = response.data;
    setInfluencerAuth(token, influencer);
  },

  logout(): void {
    clearInfluencerAuth();
  },

  // Profile
  async getProfile(): Promise<InfluencerProfile> {
    const response = await influencerPortalApi.get("/profile");
    return response.data;
  },

  async updatePayoutDetails(data: UpdateInfluencerPayoutDetailsInput): Promise<InfluencerProfile> {
    const response = await influencerPortalApi.patch("/profile/payout-details", data);
    return response.data;
  },

  // Stats
  async getStats(): Promise<InfluencerStats> {
    const response = await influencerPortalApi.get("/stats");
    return response.data;
  },

  async getEarningsChart(months?: number): Promise<EarningsChartData[]> {
    const response = await influencerPortalApi.get("/stats/earnings-chart", {
      params: { months },
    });
    return response.data;
  },

  // Campaigns
  async getCampaigns(status?: string): Promise<InfluencerCampaign[]> {
    const response = await influencerPortalApi.get("/campaigns", {
      params: { status },
    });
    return response.data;
  },

  async getCampaign(id: string): Promise<InfluencerCampaign> {
    const response = await influencerPortalApi.get(`/campaigns/${id}`);
    return response.data;
  },

  // Earnings
  async getEarnings(status?: string): Promise<EarningsEntry[]> {
    const response = await influencerPortalApi.get("/earnings", {
      params: { status },
    });
    return response.data;
  },

  // Payouts
  async getPayoutHistory(): Promise<InfluencerPayout[]> {
    const response = await influencerPortalApi.get("/payouts");
    return response.data;
  },

  async requestPayout(amount: number): Promise<InfluencerPayout> {
    const response = await influencerPortalApi.post("/payouts/request", { amount });
    return response.data;
  },
};
