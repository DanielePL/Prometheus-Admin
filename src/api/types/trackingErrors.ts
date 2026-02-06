// Tracking Error Video from tracking_error_videos table
export interface TrackingErrorVideo {
  id: string;
  created_at: string;

  // User/Session Context
  user_id: string;
  session_id: string | null;
  set_id: string | null;

  // Video
  storage_path: string;
  video_url: string | null;
  video_duration_ms: number | null;
  video_size_bytes: number | null;

  // Exercise Context
  exercise_name: string | null;
  weight_kg: number | null;

  // Device Context
  device_model: string | null;
  android_version: string | null;
  camera_direction: "front" | "back" | null;
  recording_mode: string | null;

  // Error Classification
  error_severity: "low" | "medium" | "high" | "critical";
  error_types: string[];

  // Tracking Metrics (JSONB)
  confidence_timeline: ConfidenceSample[];
  lock_events: LockEvent[];
  tracking_jumps: TrackingJump[];

  // Aggregate Stats
  total_frames: number;
  frames_locked: number;
  frames_unlocked: number;
  lock_loss_count: number;
  yolo_reinit_count: number;
  avg_confidence: number | null;
  min_confidence: number | null;
  max_bar_path_drift: number | null;
  max_tracking_jump_px: number | null;

  // Review
  review_status: ReviewStatus;
  reviewer_notes: string | null;
}

export type ReviewStatus =
  | "pending"
  | "reviewed"
  | "useful"
  | "not_useful"
  | "archived";

export interface ConfidenceSample {
  frame: number;
  confidence: number;
}

export interface LockEvent {
  frame: number;
  type: "lock" | "unlock";
  confidence: number;
}

export interface TrackingJump {
  frame: number;
  jump_px: number;
  from_x: number;
  from_y: number;
  to_x: number;
  to_y: number;
}

export interface TrackingErrorFilters {
  severity?: string;
  exercise_name?: string;
  device_model?: string;
  review_status?: string;
  start_date?: string;
  end_date?: string;
}

export interface TrackingErrorStats {
  total: number;
  pending_review: number;
  by_severity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}