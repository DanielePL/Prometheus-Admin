import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Search,
  ChevronRight,
  Video,
  Clock,
  Filter,
  Smartphone,
} from "lucide-react";
import {
  useTrackingErrors,
  useTrackingErrorStats,
} from "@/hooks/useTrackingErrors";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import type { TrackingErrorFilters } from "@/api/types/trackingErrors";

const severityColors: Record<string, string> = {
  low: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  medium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  critical: "bg-red-700/20 text-red-300 border-red-700/30",
};

const reviewStatusColors: Record<string, string> = {
  pending: "bg-gray-500/20 text-gray-400",
  reviewed: "bg-blue-500/20 text-blue-400",
  useful: "bg-green-500/20 text-green-400",
  not_useful: "bg-gray-500/20 text-gray-500",
  archived: "bg-gray-700/20 text-gray-600",
};

export function TrackingErrorsPage() {
  const [filters, setFilters] = useState<TrackingErrorFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: errors, isLoading } = useTrackingErrors(filters);
  const { data: stats } = useTrackingErrorStats();

  const filteredErrors = useMemo(() => {
    if (!errors) return [];
    if (!searchQuery) return errors;
    const query = searchQuery.toLowerCase();
    return errors.filter(
      (e) =>
        e.exercise_name?.toLowerCase().includes(query) ||
        e.device_model?.toLowerCase().includes(query) ||
        e.error_types.some((t) => t.toLowerCase().includes(query))
    );
  }, [errors, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Tracking Errors
          </h1>
          <p className="text-muted-foreground text-lg">
            VBT tracking error videos collected from the field
          </p>
        </div>
        <Link to="/lab">
          <Button variant="outline" className="rounded-xl">
            Back to Lab
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-400">
              {stats.pending_review}
            </p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-red-400">
              {stats.by_severity.critical}
            </p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-muted-foreground">High</p>
            <p className="text-2xl font-bold text-orange-400">
              {stats.by_severity.high}
            </p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-muted-foreground">Medium / Low</p>
            <p className="text-2xl font-bold text-yellow-400">
              {stats.by_severity.medium + stats.by_severity.low}
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search exercise, device, error type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="w-4 h-4" />
              <span>{filteredErrors.length} videos</span>
            </div>
          </div>
        </div>

        {/* Filter Row */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/10">
            <select
              className="bg-background/50 border border-white/10 rounded-xl px-3 py-1.5 text-sm"
              value={filters.severity || ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  severity: e.target.value || undefined,
                }))
              }
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="bg-background/50 border border-white/10 rounded-xl px-3 py-1.5 text-sm"
              value={filters.review_status || ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  review_status: e.target.value || undefined,
                }))
              }
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="useful">Useful</option>
              <option value="not_useful">Not Useful</option>
              <option value="archived">Archived</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs"
              onClick={() => setFilters({})}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-background/30">
          <div className="col-span-3 text-xs font-medium text-muted-foreground">
            Date
          </div>
          <div className="col-span-2 text-xs font-medium text-muted-foreground">
            Exercise
          </div>
          <div className="col-span-2 text-xs font-medium text-muted-foreground">
            Device
          </div>
          <div className="col-span-1 text-xs font-medium text-muted-foreground text-center">
            Severity
          </div>
          <div className="col-span-1 text-xs font-medium text-muted-foreground text-center">
            Lock Losses
          </div>
          <div className="col-span-1 text-xs font-medium text-muted-foreground text-center hidden lg:block">
            Duration
          </div>
          <div className="col-span-2 text-xs font-medium text-muted-foreground text-right">
            Status
          </div>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : filteredErrors.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredErrors.map((error) => (
              <Link
                key={error.id}
                to={`/lab/tracking-errors/${error.id}`}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-background/50 transition-smooth group"
              >
                <div className="col-span-3">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {format(parseISO(error.created_at), "MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(error.created_at), "HH:mm")}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm truncate">
                    {error.exercise_name || "Unknown"}
                  </p>
                  {error.weight_kg && (
                    <p className="text-xs text-muted-foreground">
                      {error.weight_kg}kg
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs truncate">
                      {error.device_model || "Unknown"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {error.camera_direction || ""}{" "}
                    {error.recording_mode || ""}
                  </p>
                </div>

                <div className="col-span-1 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                      severityColors[error.error_severity] || ""
                    }`}
                  >
                    {error.error_severity}
                  </span>
                </div>

                <div className="col-span-1 text-center">
                  <span className="font-bold text-sm">
                    {error.lock_loss_count}
                  </span>
                </div>

                <div className="col-span-1 text-center hidden lg:block">
                  {error.total_frames > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">
                        {Math.round(error.total_frames / 30)}s
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>

                <div className="col-span-2 text-right flex items-center justify-end gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      reviewStatusColors[error.review_status] || ""
                    }`}
                  >
                    {error.review_status.replace("_", " ")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-1">No tracking errors found</p>
            <p className="text-sm">
              {searchQuery || Object.keys(filters).length > 0
                ? "Try adjusting your search or filters"
                : "No error videos have been collected yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
