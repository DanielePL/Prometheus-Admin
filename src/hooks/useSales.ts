import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesEndpoints } from "@/api/endpoints/sales";
import type { CreateLeadInput, UpdateLeadInput, DealStatus } from "@/api/types/sales";

// Query Keys
export const salesKeys = {
  all: ["sales"] as const,
  leads: () => [...salesKeys.all, "leads"] as const,
  leadsList: (filters?: { status?: DealStatus; assignedTo?: string }) =>
    [...salesKeys.leads(), filters] as const,
  lead: (id: string) => [...salesKeys.leads(), id] as const,
  pipelineStats: () => [...salesKeys.all, "pipeline-stats"] as const,
};

// Get all leads
export function useLeads(status?: DealStatus, assignedTo?: string) {
  return useQuery({
    queryKey: salesKeys.leadsList({ status, assignedTo }),
    queryFn: () => salesEndpoints.getLeads(status, assignedTo),
  });
}

// Get single lead
export function useLead(id: string) {
  return useQuery({
    queryKey: salesKeys.lead(id),
    queryFn: () => salesEndpoints.getLead(id),
    enabled: !!id,
  });
}

// Get pipeline stats
export function usePipelineStats() {
  return useQuery({
    queryKey: salesKeys.pipelineStats(),
    queryFn: salesEndpoints.getPipelineStats,
  });
}

// Create lead
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadInput) => salesEndpoints.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.leads() });
      queryClient.invalidateQueries({ queryKey: salesKeys.pipelineStats() });
    },
  });
}

// Update lead
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadInput }) =>
      salesEndpoints.updateLead(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.leads() });
      queryClient.invalidateQueries({ queryKey: salesKeys.lead(id) });
      queryClient.invalidateQueries({ queryKey: salesKeys.pipelineStats() });
    },
  });
}

// Delete lead
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => salesEndpoints.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.leads() });
      queryClient.invalidateQueries({ queryKey: salesKeys.pipelineStats() });
    },
  });
}

// Add note
export function useAddNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, content }: { leadId: string; content: string }) =>
      salesEndpoints.addNote(leadId, content),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lead(leadId) });
      queryClient.invalidateQueries({ queryKey: salesKeys.leads() });
    },
  });
}

// Delete note
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => salesEndpoints.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.leads() });
    },
  });
}

// Update lead status (convenience hook)
export function useUpdateLeadStatus() {
  const updateLead = useUpdateLead();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DealStatus }) =>
      updateLead.mutateAsync({ id, data: { status } }),
  });
}
