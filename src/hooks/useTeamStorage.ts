import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamStorageApi } from "@/api/endpoints/teamStorage";
import type { TeamFileFilters, TeamFileUpdate } from "@/api/types/teamStorage";
import type { TeamMember } from "@/api/types/influencers";

// Query Keys
export const teamStorageKeys = {
  all: ["teamStorage"] as const,
  list: (filters?: TeamFileFilters) => [...teamStorageKeys.all, "list", filters] as const,
  stats: () => [...teamStorageKeys.all, "stats"] as const,
};

// List files with optional filters
export function useTeamFiles(filters?: TeamFileFilters) {
  return useQuery({
    queryKey: teamStorageKeys.list(filters),
    queryFn: () => teamStorageApi.getAll(filters),
  });
}

// Upload a file
export function useUploadTeamFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      uploadedBy,
      description,
      tags,
    }: {
      file: File;
      uploadedBy: TeamMember;
      description?: string;
      tags?: string[];
    }) => teamStorageApi.upload(file, uploadedBy, description, tags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamStorageKeys.all });
    },
  });
}

// Update file metadata
export function useUpdateTeamFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TeamFileUpdate }) =>
      teamStorageApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamStorageKeys.all });
    },
  });
}

// Delete a file
export function useDeleteTeamFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teamStorageApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamStorageKeys.all });
    },
  });
}

// Get file stats
export function useTeamFileStats() {
  return useQuery({
    queryKey: teamStorageKeys.stats(),
    queryFn: teamStorageApi.getStats,
  });
}
