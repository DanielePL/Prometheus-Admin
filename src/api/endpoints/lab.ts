import { supabase } from "@/api/supabaseClient";
import type {
  VelocityRecord,
  AthleteLvpProfile,
  LabAthlete,
  LabStats,
  LabExercise,
  LabUserProfile,
  WorkoutSession,
  LabExportFilters,
} from "@/api/types/lab";

export const labApi = {
  // Get dashboard stats
  getStats: async (): Promise<LabStats> => {
    if (!supabase) throw new Error("Supabase not configured");

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all velocity records for calculations
    const { data: velocityData, error: velocityError } = await supabase
      .from("velocity_history")
      .select("user_id, technique_score, mpv, recorded_at");

    if (velocityError) throw velocityError;

    // Get unique athletes
    const uniqueAthletes = new Set(velocityData?.map((r) => r.user_id) || []);

    // Get session count
    const { count: sessionCount } = await supabase
      .from("workout_sessions")
      .select("*", { count: "exact", head: true });

    // Calculate stats
    const records = velocityData || [];
    const techniqueScores = records
      .map((r) => r.technique_score)
      .filter((s): s is number => s !== null);
    const mpvValues = records
      .map((r) => r.mpv)
      .filter((v): v is number => v !== null);

    const avgTechniqueScore =
      techniqueScores.length > 0
        ? techniqueScores.reduce((a, b) => a + b, 0) / techniqueScores.length
        : null;

    const avgMpv =
      mpvValues.length > 0
        ? mpvValues.reduce((a, b) => a + b, 0) / mpvValues.length
        : null;

    const recordsThisWeek = records.filter(
      (r) => new Date(r.recorded_at) >= weekAgo
    ).length;

    const recordsThisMonth = records.filter(
      (r) => new Date(r.recorded_at) >= monthAgo
    ).length;

    return {
      total_athletes: uniqueAthletes.size,
      total_velocity_records: records.length,
      total_sessions: sessionCount || 0,
      avg_technique_score: avgTechniqueScore,
      avg_mpv: avgMpv,
      records_this_week: recordsThisWeek,
      records_this_month: recordsThisMonth,
    };
  },

  // Get all athletes with VBT data
  getAthletes: async (): Promise<LabAthlete[]> => {
    if (!supabase) throw new Error("Supabase not configured");

    // Get velocity records grouped by user
    const { data: velocityData, error: velocityError } = await supabase
      .from("velocity_history")
      .select("user_id, exercise_id, technique_score, recorded_at");

    if (velocityError) throw velocityError;

    // Get user profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("user_profiles")
      .select("id, name, email, primary_sport, experience_level");

    if (profilesError) throw profilesError;

    // Get session counts per user
    const { data: sessionsData, error: sessionsError } = await supabase
      .from("workout_sessions")
      .select("user_id");

    if (sessionsError) throw sessionsError;

    // Group velocity data by user
    const userVelocityMap = new Map<
      string,
      {
        records: number;
        exercises: Set<string>;
        techniqueScores: number[];
        lastActivity: string | null;
      }
    >();

    for (const record of velocityData || []) {
      const existing = userVelocityMap.get(record.user_id) || {
        records: 0,
        exercises: new Set<string>(),
        techniqueScores: [],
        lastActivity: null,
      };

      existing.records++;
      existing.exercises.add(record.exercise_id);
      if (record.technique_score !== null) {
        existing.techniqueScores.push(record.technique_score);
      }
      if (
        !existing.lastActivity ||
        record.recorded_at > existing.lastActivity
      ) {
        existing.lastActivity = record.recorded_at;
      }

      userVelocityMap.set(record.user_id, existing);
    }

    // Count sessions per user
    const sessionCountMap = new Map<string, number>();
    for (const session of sessionsData || []) {
      sessionCountMap.set(
        session.user_id,
        (sessionCountMap.get(session.user_id) || 0) + 1
      );
    }

    // Create profiles map
    const profilesMap = new Map<string, (typeof profilesData)[0]>();
    for (const profile of profilesData || []) {
      profilesMap.set(profile.id, profile);
    }

    // Build athlete list
    const athletes: LabAthlete[] = [];
    for (const [userId, data] of userVelocityMap) {
      const profile = profilesMap.get(userId);
      const avgTechnique =
        data.techniqueScores.length > 0
          ? data.techniqueScores.reduce((a, b) => a + b, 0) /
            data.techniqueScores.length
          : null;

      athletes.push({
        user_id: userId,
        name: profile?.name || null,
        email: profile?.email || null,
        primary_sport: profile?.primary_sport || null,
        experience_level: profile?.experience_level || null,
        total_sessions: sessionCountMap.get(userId) || 0,
        total_velocity_records: data.records,
        exercises_tracked: data.exercises.size,
        avg_technique_score: avgTechnique,
        last_activity: data.lastActivity,
      });
    }

    // Sort by last activity (most recent first)
    athletes.sort((a, b) => {
      if (!a.last_activity) return 1;
      if (!b.last_activity) return -1;
      return (
        new Date(b.last_activity).getTime() -
        new Date(a.last_activity).getTime()
      );
    });

    return athletes;
  },

  // Get single athlete profile
  getAthleteProfile: async (userId: string): Promise<LabUserProfile | null> => {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, name, email, primary_sport, experience_level, gender, weight, height, created_at")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }

    return data;
  },

  // Get athlete's LVP profiles
  getAthleteLvpProfiles: async (userId: string): Promise<AthleteLvpProfile[]> => {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("athlete_lvp_profiles")
      .select("*")
      .eq("user_id", userId)
      .order("last_updated", { ascending: false });

    if (error) throw error;

    // Get exercise names
    const exerciseIds = [...new Set(data?.map((p) => p.exercise_id) || [])];

    if (exerciseIds.length === 0) return data || [];

    const { data: exercisesData } = await supabase
      .from("exercises")
      .select("id, name, main_muscle_group")
      .in("id", exerciseIds);

    const exerciseMap = new Map(
      exercisesData?.map((e) => [e.id, e]) || []
    );

    return (data || []).map((profile) => ({
      ...profile,
      exercise: exerciseMap.get(profile.exercise_id) || undefined,
    }));
  },

  // Get velocity history for athlete (optionally filtered by exercise)
  getVelocityHistory: async (
    userId: string,
    exerciseId?: string,
    limit = 100
  ): Promise<VelocityRecord[]> => {
    if (!supabase) throw new Error("Supabase not configured");

    let query = supabase
      .from("velocity_history")
      .select("*")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: false })
      .limit(limit);

    if (exerciseId) {
      query = query.eq("exercise_id", exerciseId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const records = data || [];
    return labApi._resolveExerciseNames(records);
  },

  // Get athlete's workout sessions
  getAthleteSessions: async (
    userId: string,
    limit = 50
  ): Promise<WorkoutSession[]> => {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  },

  // Get exercises with VBT usage stats
  getExercisesWithStats: async (): Promise<LabExercise[]> => {
    if (!supabase) throw new Error("Supabase not configured");

    // Get VBT-enabled exercises
    const { data: exercisesData, error: exercisesError } = await supabase
      .from("exercises")
      .select("id, name, main_muscle_group, vbt_enabled")
      .eq("vbt_enabled", true);

    if (exercisesError) throw exercisesError;

    // Get velocity records grouped by exercise
    const { data: velocityData, error: velocityError } = await supabase
      .from("velocity_history")
      .select("exercise_id, user_id");

    if (velocityError) throw velocityError;

    // Count records and unique athletes per exercise
    const exerciseStatsMap = new Map<
      string,
      { records: number; athletes: Set<string> }
    >();

    for (const record of velocityData || []) {
      const existing = exerciseStatsMap.get(record.exercise_id) || {
        records: 0,
        athletes: new Set<string>(),
      };
      existing.records++;
      existing.athletes.add(record.user_id);
      exerciseStatsMap.set(record.exercise_id, existing);
    }

    return (exercisesData || []).map((exercise) => {
      const stats = exerciseStatsMap.get(exercise.id);
      return {
        id: exercise.id,
        name: exercise.name,
        main_muscle_group: exercise.main_muscle_group,
        vbt_enabled: exercise.vbt_enabled,
        total_records: stats?.records || 0,
        athletes_count: stats?.athletes.size || 0,
      };
    });
  },

  // Get recent velocity records for dashboard
  getRecentRecords: async (limit = 10): Promise<VelocityRecord[]> => {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("velocity_history")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const records = data || [];
    return labApi._resolveExerciseNames(records);
  },

  // Export velocity data as array (for CSV conversion)
  exportVelocityData: async (
    filters: LabExportFilters
  ): Promise<VelocityRecord[]> => {
    if (!supabase) throw new Error("Supabase not configured");

    let query = supabase
      .from("velocity_history")
      .select("*")
      .order("recorded_at", { ascending: false });

    if (filters.user_id) {
      query = query.eq("user_id", filters.user_id);
    }
    if (filters.exercise_id) {
      query = query.eq("exercise_id", filters.exercise_id);
    }
    if (filters.start_date) {
      query = query.gte("recorded_at", filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte("recorded_at", filters.end_date);
    }
    if (filters.set_type) {
      query = query.eq("set_type", filters.set_type);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  },

  // Internal helper: resolve exercise_id → exercise_name for velocity records
  _resolveExerciseNames: async (
    records: VelocityRecord[]
  ): Promise<VelocityRecord[]> => {
    if (!supabase || records.length === 0) return records;

    const exerciseIds = [...new Set(records.map((r) => r.exercise_id))];
    const { data: exercisesData } = await supabase
      .from("exercises")
      .select("id, name")
      .in("id", exerciseIds);

    const nameMap = new Map(
      exercisesData?.map((e) => [e.id, e.name]) || []
    );

    return records.map((r) => ({
      ...r,
      exercise_name: nameMap.get(r.exercise_id),
    }));
  },
};
