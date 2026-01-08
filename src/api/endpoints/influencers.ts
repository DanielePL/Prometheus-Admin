import { adminApi } from "../client";
import type {
  Influencer,
  CreateInfluencerInput,
  UpdateInfluencerInput,
  InfluencerStatus,
} from "../types/influencers";

export const influencersApi = {
  getAll: async (): Promise<Influencer[]> => {
    const response = await adminApi.get("/influencers");
    return response.data;
  },

  getById: async (id: string): Promise<Influencer> => {
    const response = await adminApi.get(`/influencers/${id}`);
    return response.data;
  },

  create: async (data: CreateInfluencerInput): Promise<Influencer> => {
    const response = await adminApi.post("/influencers", data);
    return response.data;
  },

  update: async (id: string, data: UpdateInfluencerInput): Promise<Influencer> => {
    const response = await adminApi.patch(`/influencers/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: InfluencerStatus): Promise<Influencer> => {
    const response = await adminApi.patch(`/influencers/${id}`, { status });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await adminApi.delete(`/influencers/${id}`);
  },

  // Get influencers by status for pipeline view
  getByStatus: async (status: InfluencerStatus): Promise<Influencer[]> => {
    const response = await adminApi.get(`/influencers?status=${status}`);
    return response.data;
  },

  // Get influencers assigned to a team member
  getByContactPerson: async (contactPerson: string): Promise<Influencer[]> => {
    const response = await adminApi.get(`/influencers?contact_person=${contactPerson}`);
    return response.data;
  },
};
