import { Link } from "react-router-dom";
import {
  Users,
  Activity,
  Gauge,
  TrendingUp,
  ArrowRight,
  Dumbbell,
  Clock,
  BarChart3,
} from "lucide-react";
import { useLabStats, useLabAthletes, useRecentVelocityRecords } from "@/hooks/useLab";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import { useMemo } from "react";

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

function formatVelocity(v: number | null): string {
  if (v === null) return "-";
  return `${v.toFixed(2)} m/s`;
}

function formatScore(s: number | null): string {
  if (s === null) return "-";
  return `${s.toFixed(0)}%`;
}

export function LabDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useLabStats();
  const { data: athletes, isLoading: athletesLoading } = useLabAthletes();
  const { data: recentRecords, isLoading: recentLoading } = useRecentVelocityRecords(20);

  // Prepare chart data - records over last 14 days
  const recordsChartData = useMemo(() => {
    if (!recentRecords) return [];

    const dayMap = new Map<string, number>();
    const now = new Date();

    // Initialize last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = format(subDays(now, i), "yyyy-MM-dd");
      dayMap.set(date, 0);
    }

    // Count records per day
    for (const record of recentRecords) {
      const date = format(parseISO(record.recorded_at), "yyyy-MM-dd");
      if (dayMap.has(date)) {
        dayMap.set(date, (dayMap.get(date) || 0) + 1);
      }
    }

    return Array.from(dayMap.entries()).map(([date, count]) => ({
      date: format(parseISO(date), "MMM d"),
      records: count,
    }));
  }, [recentRecords]);

  // Top athletes by records
  const topAthletes = useMemo(() => {
    if (!athletes) return [];
    return [...athletes]
      .sort((a, b) => b.total_velocity_records - a.total_velocity_records)
      .slice(0, 5);
  }, [athletes]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Prometheus Lab</h1>
        <p className="text-muted-foreground text-lg">
          VBT Analytics & Research Dashboard
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/lab/athletes"
          className="glass rounded-2xl p-5 transition-smooth hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] group"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-500/20 text-blue-500">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Athletes
              </p>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-smooth">
                  {formatNumber(stats?.total_athletes || 0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">With VBT data</p>
            </div>
          </div>
        </Link>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500/20 text-green-500">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Velocity Records
              </p>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  {formatNumber(stats?.total_velocity_records || 0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.records_this_week || 0} this week
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Avg MPV
              </p>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  {formatVelocity(stats?.avg_mpv || null)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Mean Propulsive Velocity
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-yellow-500/20 text-yellow-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Avg Technique
              </p>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  {formatScore(stats?.avg_technique_score || null)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Technique Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Records Over Time */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold">VBT Activity</h2>
                <p className="text-sm text-muted-foreground">Records per day</p>
              </div>
            </div>
          </div>

          {recentLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recordsChartData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recordsChartData}>
                  <defs>
                    <linearGradient id="colorRecords" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(23, 87%, 55%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(23, 87%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                    formatter={(value) => [value, "Records"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="records"
                    stroke="hsl(23, 87%, 55%)"
                    strokeWidth={2}
                    fill="url(#colorRecords)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <p>No data available</p>
            </div>
          )}
        </div>

        {/* Top Athletes */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Top Athletes</h2>
                <p className="text-sm text-muted-foreground">By velocity records</p>
              </div>
            </div>
            <Link to="/lab/athletes">
              <Button variant="ghost" size="sm" className="rounded-xl">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {athletesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : topAthletes.length > 0 ? (
            <div className="space-y-2">
              {topAthletes.map((athlete, index) => (
                <Link
                  key={athlete.user_id}
                  to={`/lab/athletes/${athlete.user_id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-background/50 hover:bg-background/70 transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-500/20 text-yellow-500"
                          : index === 1
                          ? "bg-gray-400/20 text-gray-400"
                          : index === 2
                          ? "bg-amber-600/20 text-amber-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {athlete.name || "Unknown Athlete"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {athlete.primary_sport || "No sport set"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">
                      {athlete.total_velocity_records}
                    </p>
                    <p className="text-xs text-muted-foreground">records</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
              <Users className="w-10 h-10 mb-2 opacity-50" />
              <p>No athletes with VBT data</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Recent VBT Records</h2>
              <p className="text-sm text-muted-foreground">Latest velocity measurements</p>
            </div>
          </div>
        </div>

        {recentLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : recentRecords && recentRecords.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recentRecords.slice(0, 9).map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-xl bg-background/50 border border-white/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {record.exercise_id}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      record.set_type === "warmup"
                        ? "bg-blue-500/20 text-blue-500"
                        : record.set_type === "topset"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-green-500/20 text-green-500"
                    }`}
                  >
                    {record.set_type}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Load</p>
                    <p className="text-sm font-bold">{record.load_kg}kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">MPV</p>
                    <p className="text-sm font-bold text-primary">
                      {record.mpv?.toFixed(2) || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tech</p>
                    <p className="text-sm font-bold">
                      {record.technique_score?.toFixed(0) || "-"}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {format(parseISO(record.recorded_at), "MMM d, HH:mm")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
            <Activity className="w-10 h-10 mb-2 opacity-50" />
            <p>No velocity records yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/lab/athletes">
            <Button variant="outline" className="rounded-xl">
              <Users className="w-4 h-4 mr-2" />
              View All Athletes
            </Button>
          </Link>
          <Link to="/lab/exercises">
            <Button variant="outline" className="rounded-xl">
              <Dumbbell className="w-4 h-4 mr-2" />
              Exercise Analysis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
