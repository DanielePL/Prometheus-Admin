// VBT Velocity Record from velocity_history table
export interface VelocityRecord {
  id: string;
  user_id: string;
  exercise_id: string;
  load_kg: number;
  peak_velocity: number | null;
  mean_velocity: number | null;
  mpv: number | null;
  set_type: "warmup" | "working" | "topset" | "backoff";
  set_number: number | null;
  reps: number | null;
  rpe: number | null;
  velocity_drop: number | null;
  technique_score: number | null;
  session_id: string | null;
  workout_set_id: string | null;
  load_percent_1rm: number | null;
  recorded_at: string;
  created_at: string;
}

// Load-Velocity Profile from athlete_lvp_profiles table
export interface AthleteLvpProfile {
  id: string;
  user_id: string;
  exercise_id: string;
  sport_type: string | null;
  velocity_metric: "mpv" | "mean_velocity" | "peak_velocity";
  slope: number | null;
  y_intercept: number | null;
  r_squared: number | null;
  mvt: number;
  estimated_1rm: number | null;
  velocity_by_load: Record<string, number>;
  data_points: number;
  warmup_data_points: number;
  last_updated: string;
  created_at: string;
  // Joined data
  exercise?: {
    name: string;
    main_muscle_group: string;
  };
}

// Workout Session from workout_sessions table
export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_name: string;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number | null;
  notes: string | null;
  coach_id: string | null;
  client_id: string | null;
  status: string;
  mood_rating: number | null;
  energy_rating: number | null;
  created_at: string;
}

// User Profile from user_profiles table
export interface LabUserProfile {
  id: string;
  name: string | null;
  email: string | null;
  primary_sport: string | null;
  experience_level: string | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
  created_at: string;
}

// Aggregated athlete data for the list view
export interface LabAthlete {
  user_id: string;
  name: string | null;
  email: string | null;
  primary_sport: string | null;
  experience_level: string | null;
  total_sessions: number;
  total_velocity_records: number;
  exercises_tracked: number;
  avg_technique_score: number | null;
  last_activity: string | null;
}

// Dashboard stats
export interface LabStats {
  total_athletes: number;
  total_velocity_records: number;
  total_sessions: number;
  avg_technique_score: number | null;
  avg_mpv: number | null;
  records_this_week: number;
  records_this_month: number;
}

// Exercise with VBT data
export interface LabExercise {
  id: string;
  name: string;
  main_muscle_group: string;
  vbt_enabled: boolean;
  total_records: number;
  athletes_count: number;
}

// For charts - velocity over time
export interface VelocityTrendPoint {
  date: string;
  mean_velocity: number | null;
  peak_velocity: number | null;
  mpv: number | null;
  load_kg: number;
}

// For charts - load-velocity scatter
export interface LoadVelocityPoint {
  load_kg: number;
  velocity: number;
  set_type: string;
  recorded_at: string;
}

// Export filters
export interface LabExportFilters {
  user_id?: string;
  exercise_id?: string;
  start_date?: string;
  end_date?: string;
  set_type?: string;
}
