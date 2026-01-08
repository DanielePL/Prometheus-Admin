import { salesApi } from "../salesClient";
import type {
  SalesLead,
  CreateLeadInput,
  UpdateLeadInput,
  PipelineStats,
  SalesNote,
  DealStatus,
} from "../types/sales";

export const salesEndpoints = {
  // Leads
  getLeads: async (status?: DealStatus, assignedTo?: string): Promise<SalesLead[]> => {
    const response = await salesApi.get("/leads", {
      params: { status, assigned_to: assignedTo },
    });
    return response.data;
  },

  getLead: async (id: string): Promise<SalesLead> => {
    const response = await salesApi.get(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: CreateLeadInput): Promise<{ success: boolean; id: string; lead: SalesLead }> => {
    const response = await salesApi.post("/leads", data);
    return response.data;
  },

  updateLead: async (id: string, data: UpdateLeadInput): Promise<{ success: boolean; lead: SalesLead }> => {
    const response = await salesApi.put(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string): Promise<{ success: boolean }> => {
    const response = await salesApi.delete(`/leads/${id}`);
    return response.data;
  },

  // Notes
  addNote: async (leadId: string, content: string): Promise<{ success: boolean; note: SalesNote }> => {
    const response = await salesApi.post(`/leads/${leadId}/notes`, { content });
    return response.data;
  },

  deleteNote: async (noteId: string): Promise<{ success: boolean }> => {
    const response = await salesApi.delete(`/notes/${noteId}`);
    return response.data;
  },

  // Pipeline Stats
  getPipelineStats: async (): Promise<PipelineStats> => {
    const response = await salesApi.get("/pipeline-stats");
    return response.data;
  },
};
