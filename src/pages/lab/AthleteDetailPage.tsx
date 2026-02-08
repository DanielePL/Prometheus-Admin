import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  Dumbbell,
  Calendar,
  TrendingUp,
  Gauge,
  Target,
  ChevronDown,
  Download,
} from "lucide-react";
import {
  useAthleteProfile,
  useAthleteLvpProfiles,
  useAthleteVelocityHistory,
  useAthleteSessions,
} from "@/hooks/useLab";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useState, useMemo } from "react";
import type { AthleteLvpProfile } from "@/api/types/lab";

export function AthleteDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: profile, isLoading: profileLoading } = useAthleteProfile(userId || "");
  const { data: lvpProfiles, isLoading: lvpLoading } = useAthleteLvpProfiles(userId || "");
  const { data: velocityHistory, isLoading: velocityLoading } = useAthleteVelocityHistory(
    userId || "",
    undefined,
    200
  );
  const { data: sessions, isLoading: sessionsLoading } = useAthleteSessions(userId || "");

  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [showAllProfiles, setShowAllProfiles] = useState(false);

  // Get unique exercises from velocity history
  const exercises = useMemo(() => {
    if (!velocityHistory) return [];
    const exerciseMap = new Map<string, { count: number; name?: string }>();
    for (const record of velocityHistory) {
      const existing = exerciseMap.get(record.exercise_id);
      exerciseMap.set(record.exercise_id, {
        count: (existing?.count || 0) + 1,
        name: existing?.name || record.exercise_name,
      });
    }
    return Array.from(exerciseMap.entries())
      .map(([id, { count, name }]) => ({ id, count, name }))
      .sort((a, b) => b.count - a.count);
  }, [velocityHistory]);

  // Filter velocity history by selected exercise
  const filteredVelocityHistory = useMemo(() => {
    if (!velocityHistory) return [];
    if (!selectedExercise) return velocityHistory;
    return velocityHistory.filter((r) => r.exercise_id === selectedExercise);
  }, [velocityHistory, selectedExercise]);

  // Prepare load-velocity scatter data
  const loadVelocityData = useMemo(() => {
    return filteredVelocityHistory.map((record) => ({
      load: record.load_kg,
      velocity: record.mpv || record.mean_velocity || 0,
      setType: record.set_type,
      date: record.recorded_at,
    }));
  }, [filteredVelocityHistory]);

  // Get LVP for selected exercise
  const selectedLvp = useMemo(() => {
    if (!lvpProfiles || !selectedExercise) return null;
    return lvpProfiles.find((p) => p.exercise_id === selectedExercise);
  }, [lvpProfiles, selectedExercise]);

  // Prepare velocity trend data (last 30 records)
  const velocityTrendData = useMemo(() => {
    const data = filteredVelocityHistory.slice(0, 30).reverse();
    return data.map((record, index) => ({
      index,
      date: format(parseISO(record.recorded_at), "MMM d"),
      mpv: record.mpv,
      meanVelocity: record.mean_velocity,
      peakVelocity: record.peak_velocity,
      load: record.load_kg,
    }));
  }, [filteredVelocityHistory]);

  // Display LVP profiles (limited or all)
  const displayedProfiles = showAllProfiles
    ? lvpProfiles
    : lvpProfiles?.slice(0, 6);

  // CSV Export function
  const handleExport = () => {
    if (!filteredVelocityHistory.length) return;

    const headers = [
      "recorded_at",
      "exercise_name",
      "exercise_id",
      "load_kg",
      "mean_velocity",
      "peak_velocity",
      "mpv",
      "rpe",
      "technique_score",
      "set_type",
      "reps",
    ];

    const rows = filteredVelocityHistory.map((r) =>
      [
        r.recorded_at,
        r.exercise_name || "",
        r.exercise_id,
        r.load_kg,
        r.mean_velocity,
        r.peak_velocity,
        r.mpv,
        r.rpe,
        r.technique_score,
        r.set_type,
        r.reps,
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `velocity_data_${userId}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Invalid athlete ID</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/lab/athletes">
            <Button variant="outline" size="icon" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold">
              {profileLoading ? (
                <Skeleton className="h-10 w-48" />
              ) : (
                profile?.name || "Unknown Athlete"
              )}
            </h1>
            <p className="text-muted-foreground">
              {profile?.primary_sport || "No sport"} • {profile?.experience_level || "N/A"}
            </p>
          </div>
        </div>
        <Button onClick={handleExport} variant="outline" className="rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Velocity Records</p>
              <p className="text-2xl font-bold">{velocityHistory?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-2xl font-bold">{sessions?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Exercises</p>
              <p className="text-2xl font-bold">{exercises.length}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">LVP Profiles</p>
              <p className="text-2xl font-bold">{lvpProfiles?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Filter */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Filter by Exercise:</span>
          <Button
            variant={selectedExercise === null ? "default" : "outline"}
            size="sm"
            className="rounded-xl"
            onClick={() => setSelectedExercise(null)}
          >
            All ({velocityHistory?.length || 0})
          </Button>
          {exercises.slice(0, 8).map((ex) => (
            <Button
              key={ex.id}
              variant={selectedExercise === ex.id ? "default" : "outline"}
              size="sm"
              className="rounded-xl"
              onClick={() => setSelectedExercise(ex.id)}
            >
              {ex.name || ex.id.slice(0, 8)} ({ex.count})
            </Button>
          ))}
          {exercises.length > 8 && (
            <span className="text-xs text-muted-foreground">
              +{exercises.length - 8} more
            </span>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Load-Velocity Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Gauge className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Load-Velocity Profile</h2>
              <p className="text-sm text-muted-foreground">
                {selectedExercise ? "Selected exercise" : "All exercises"}
              </p>
            </div>
          </div>

          {velocityLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : loadVelocityData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                  <XAxis
                    type="number"
                    dataKey="load"
                    name="Load"
                    unit="kg"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                  />
                  <YAxis
                    type="number"
                    dataKey="velocity"
                    name="Velocity"
                    unit=" m/s"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                    formatter={(value, name) => [
                      name === "velocity" ? `${Number(value).toFixed(2)} m/s` : `${value} kg`,
                      name === "velocity" ? "Velocity" : "Load",
                    ]}
                  />
                  {selectedLvp && selectedLvp.mvt && (
                    <ReferenceLine
                      y={selectedLvp.mvt}
                      stroke="hsl(0, 70%, 50%)"
                      strokeDasharray="5 5"
                      label={{ value: "MVT", fill: "hsl(0, 70%, 50%)", fontSize: 10 }}
                    />
                  )}
                  <Scatter
                    data={loadVelocityData}
                    fill="hsl(23, 87%, 55%)"
                    shape="circle"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>No velocity data available</p>
            </div>
          )}

          {/* LVP Stats for selected exercise */}
          {selectedLvp && (
            <div className="mt-4 p-4 rounded-xl bg-background/50 grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">e1RM</p>
                <p className="text-lg font-bold text-primary">
                  {selectedLvp.estimated_1rm?.toFixed(1) || "-"} kg
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">MVT</p>
                <p className="text-lg font-bold">{selectedLvp.mvt?.toFixed(2)} m/s</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">R²</p>
                <p className="text-lg font-bold">
                  {selectedLvp.r_squared?.toFixed(3) || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Data Points</p>
                <p className="text-lg font-bold">{selectedLvp.data_points}</p>
              </div>
            </div>
          )}
        </div>

        {/* Velocity Trend Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Velocity Trend</h2>
              <p className="text-sm text-muted-foreground">Last 30 records</p>
            </div>
          </div>

          {velocityLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : velocityTrendData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityTrendData}>
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                    formatter={(value) => [`${Number(value).toFixed(2)} m/s`]}
                  />
                  <Line
                    type="monotone"
                    dataKey="mpv"
                    stroke="hsl(23, 87%, 55%)"
                    strokeWidth={2}
                    dot={false}
                    name="MPV"
                  />
                  <Line
                    type="monotone"
                    dataKey="peakVelocity"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={2}
                    dot={false}
                    name="Peak"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>No velocity data available</p>
            </div>
          )}
        </div>
      </div>

      {/* LVP Profiles Grid */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Load-Velocity Profiles</h2>
              <p className="text-sm text-muted-foreground">
                {lvpProfiles?.length || 0} exercises tracked
              </p>
            </div>
          </div>
        </div>

        {lvpLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : displayedProfiles && displayedProfiles.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayedProfiles.map((profile) => (
                <LvpProfileCard
                  key={profile.id}
                  profile={profile}
                  onClick={() => setSelectedExercise(profile.exercise_id)}
                  isSelected={selectedExercise === profile.exercise_id}
                />
              ))}
            </div>
            {lvpProfiles && lvpProfiles.length > 6 && !showAllProfiles && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setShowAllProfiles(true)}
                >
                  Show All ({lvpProfiles.length})
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No LVP profiles yet</p>
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Recent Sessions</h2>
            <p className="text-sm text-muted-foreground">Last 10 workouts</p>
          </div>
        </div>

        {sessionsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.slice(0, 10).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-xl bg-background/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      session.status === "completed"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{session.workout_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(session.started_at), "MMM d, yyyy • HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {session.duration_minutes ? `${session.duration_minutes} min` : "-"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{session.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No sessions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// LVP Profile Card Component
function LvpProfileCard({
  profile,
  onClick,
  isSelected,
}: {
  profile: AthleteLvpProfile;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-smooth ${
        isSelected
          ? "bg-primary/20 border-2 border-primary"
          : "bg-background/50 border border-white/5 hover:bg-background/70"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="font-medium truncate">
            {profile.exercise?.name || profile.exercise_id}
          </p>
          <p className="text-xs text-muted-foreground">
            {profile.exercise?.main_muscle_group || "Unknown"}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            (profile.r_squared || 0) >= 0.9
              ? "bg-green-500/20 text-green-500"
              : (profile.r_squared || 0) >= 0.7
              ? "bg-yellow-500/20 text-yellow-500"
              : "bg-red-500/20 text-red-500"
          }`}
        >
          R² {profile.r_squared?.toFixed(2) || "-"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-muted-foreground">e1RM</p>
          <p className="text-sm font-bold text-primary">
            {profile.estimated_1rm?.toFixed(0) || "-"} kg
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">MVT</p>
          <p className="text-sm font-bold">{profile.mvt?.toFixed(2) || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Points</p>
          <p className="text-sm font-bold">{profile.data_points}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-right">
        Updated {format(parseISO(profile.last_updated), "MMM d")}
      </p>
    </button>
  );
}
