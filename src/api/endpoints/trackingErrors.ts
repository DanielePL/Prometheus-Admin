import { supabase } from "@/api/supabaseClient";
import type {
  TrackingErrorVideo,
  TrackingErrorFilters,
  TrackingErrorStats,
  ReviewStatus,
} from "@/api/types/trackingErrors";

export const trackingErrorsApi = {
  // Get all tracking error videos with optional filters
  getTrackingErrors: async (
    filters?: TrackingErrorFilters
  ): Promise<TrackingErrorVideo[]> => {
    if (!supabase) throw new Error("Supabase not configured");

    let query = supabase
      .from("tracking_error_videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.severity) {
      query = query.eq("error_severity", filters.severity);
    }
    if (filters?.exercise_name) {
      query = query.ilike("exercise_name", `%${filters.exercise_name}%`);
    }
    if (filters?.device_model) {
      query = query.ilike("device_model", `%${filters.device_model}%`);
    }
    if (filters?.review_status) {
      query = query.eq("review_status", filters.review_status);
    }
    if (filters?.start_date) {
      query = query.gte("created_at", filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte("created_at", filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  },

  // Get single tracking error video
  getTrackingError: async (id: string): Promise<TrackingErrorVideo | null> => {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("tracking_error_videos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data;
  },

  // Update review status
  updateReviewStatus: async (
    id: string,
    status: ReviewStatus,
    notes?: string
  ): Promise<void> => {
    if (!supabase) throw new Error("Supabase not configured");

    const update: Record<string, unknown> = { review_status: status };
    if (notes !== undefined) {
      update.reviewer_notes = notes;
    }

    const { error } = await supabase
      .from("tracking_error_videos")
      .update(update)
      .eq("id", id);

    if (error) throw error;
  },

  // Get aggregate stats for dashboard cards
  getStats: async (): Promise<TrackingErrorStats> => {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("tracking_error_videos")
      .select("error_severity, review_status, frames_locked, total_frames");

    if (error) throw error;

    const records = data || [];
    const total = records.length;
    const pendingReview = records.filter(
      (r) => r.review_status === "pending"
    ).length;

    const bySeverity = {
      low: records.filter((r) => r.error_severity === "low").length,
      medium: records.filter((r) => r.error_severity === "medium").length,
      high: records.filter((r) => r.error_severity === "high").length,
      critical: records.filter((r) => r.error_severity === "critical").length,
    };

    const highCriticalCount = bySeverity.high + bySeverity.critical;

    // Calculate average lock ratio across all videos
    const lockRatios = records
      .filter((r) => r.total_frames > 0)
      .map((r) => r.frames_locked / r.total_frames);
    const avgLockRatio =
      lockRatios.length > 0
        ? lockRatios.reduce((a, b) => a + b, 0) / lockRatios.length
        : null;

    return {
      total,
      pending_review: pendingReview,
      high_critical_count: highCriticalCount,
      avg_lock_ratio: avgLockRatio,
      by_severity: bySeverity,
    };
  },
};
