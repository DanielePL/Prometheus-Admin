import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { influencersApi } from "@/api/endpoints/influencers";
import type {
  CreateInfluencerInput,
  UpdateInfluencerInput,
  InfluencerStatus,
} from "@/api/types/influencers";

export const influencerKeys = {
  all: ["influencers"] as const,
  list: () => [...influencerKeys.all, "list"] as const,
  detail: (id: string) => [...influencerKeys.all, "detail", id] as const,
  byStatus: (status: InfluencerStatus) =>
    [...influencerKeys.all, "status", status] as const,
  byContactPerson: (person: string) =>
    [...influencerKeys.all, "contact", person] as const,
};

export function useInfluencers() {
  return useQuery({
    queryKey: influencerKeys.list(),
    queryFn: influencersApi.getAll,
  });
}

export function useInfluencer(id: string) {
  return useQuery({
    queryKey: influencerKeys.detail(id),
    queryFn: () => influencersApi.getById(id),
    enabled: !!id,
  });
}

export function useInfluencersByStatus(status: InfluencerStatus) {
  return useQuery({
    queryKey: influencerKeys.byStatus(status),
    queryFn: () => influencersApi.getByStatus(status),
  });
}

export function useInfluencersByContactPerson(contactPerson: string) {
  return useQuery({
    queryKey: influencerKeys.byContactPerson(contactPerson),
    queryFn: () => influencersApi.getByContactPerson(contactPerson),
    enabled: !!contactPerson,
  });
}

export function useCreateInfluencer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInfluencerInput) => influencersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.all });
    },
  });
}

export function useUpdateInfluencer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInfluencerInput }) =>
      influencersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.all });
    },
  });
}

export function useUpdateInfluencerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InfluencerStatus }) =>
      influencersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.all });
    },
  });
}

export function useDeleteInfluencer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => influencersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: influencerKeys.all });
    },
  });
}
