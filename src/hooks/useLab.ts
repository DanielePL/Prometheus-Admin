import { useQuery } from "@tanstack/react-query";
import { labApi } from "@/api/endpoints/lab";
import type { LabExportFilters } from "@/api/types/lab";

// Query Keys
export const labKeys = {
  all: ["lab"] as const,
  stats: () => [...labKeys.all, "stats"] as const,
  athletes: () => [...labKeys.all, "athletes"] as const,
  athlete: (userId: string) => [...labKeys.all, "athlete", userId] as const,
  athleteProfile: (userId: string) =>
    [...labKeys.athlete(userId), "profile"] as const,
  athleteLvpProfiles: (userId: string) =>
    [...labKeys.athlete(userId), "lvp"] as const,
  athleteVelocityHistory: (userId: string, exerciseId?: string) =>
    [...labKeys.athlete(userId), "velocity", exerciseId] as const,
  athleteSessions: (userId: string) =>
    [...labKeys.athlete(userId), "sessions"] as const,
  exercises: () => [...labKeys.all, "exercises"] as const,
  recentRecords: () => [...labKeys.all, "recent"] as const,
  export: (filters: LabExportFilters) =>
    [...labKeys.all, "export", filters] as const,
};

// Dashboard stats
export function useLabStats() {
  return useQuery({
    queryKey: labKeys.stats(),
    queryFn: labApi.getStats,
  });
}

// All athletes with VBT data
export function useLabAthletes() {
  return useQuery({
    queryKey: labKeys.athletes(),
    queryFn: labApi.getAthletes,
  });
}

// Single athlete profile
export function useAthleteProfile(userId: string) {
  return useQuery({
    queryKey: labKeys.athleteProfile(userId),
    queryFn: () => labApi.getAthleteProfile(userId),
    enabled: !!userId,
  });
}

// Athlete LVP profiles
export function useAthleteLvpProfiles(userId: string) {
  return useQuery({
    queryKey: labKeys.athleteLvpProfiles(userId),
    queryFn: () => labApi.getAthleteLvpProfiles(userId),
    enabled: !!userId,
  });
}

// Athlete velocity history
export function useAthleteVelocityHistory(
  userId: string,
  exerciseId?: string,
  limit = 100
) {
  return useQuery({
    queryKey: labKeys.athleteVelocityHistory(userId, exerciseId),
    queryFn: () => labApi.getVelocityHistory(userId, exerciseId, limit),
    enabled: !!userId,
  });
}

// Athlete sessions
export function useAthleteSessions(userId: string, limit = 50) {
  return useQuery({
    queryKey: labKeys.athleteSessions(userId),
    queryFn: () => labApi.getAthleteSessions(userId, limit),
    enabled: !!userId,
  });
}

// Exercises with VBT stats
export function useLabExercises() {
  return useQuery({
    queryKey: labKeys.exercises(),
    queryFn: labApi.getExercisesWithStats,
  });
}

// Recent velocity records
export function useRecentVelocityRecords(limit = 10) {
  return useQuery({
    queryKey: labKeys.recentRecords(),
    queryFn: () => labApi.getRecentRecords(limit),
  });
}

// Export data (only fetches when enabled)
export function useExportVelocityData(
  filters: LabExportFilters,
  enabled = false
) {
  return useQuery({
    queryKey: labKeys.export(filters),
    queryFn: () => labApi.exportVelocityData(filters),
    enabled,
  });
}
