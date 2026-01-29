import { Link } from "react-router-dom";
import {
  Users,
  Search,
  ArrowUpDown,
  ChevronRight,
  Activity,
  Dumbbell,
} from "lucide-react";
import { useLabAthletes } from "@/hooks/useLab";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";

type SortField = "name" | "records" | "sessions" | "exercises" | "technique" | "last_activity";
type SortDirection = "asc" | "desc";

export function AthletesListPage() {
  const { data: athletes, isLoading } = useLabAthletes();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("records");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedAthletes = useMemo(() => {
    if (!athletes) return [];

    let result = [...athletes];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name?.toLowerCase().includes(query) ||
          a.email?.toLowerCase().includes(query) ||
          a.primary_sport?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "");
          break;
        case "records":
          comparison = a.total_velocity_records - b.total_velocity_records;
          break;
        case "sessions":
          comparison = a.total_sessions - b.total_sessions;
          break;
        case "exercises":
          comparison = a.exercises_tracked - b.exercises_tracked;
          break;
        case "technique":
          comparison = (a.avg_technique_score || 0) - (b.avg_technique_score || 0);
          break;
        case "last_activity":
          if (!a.last_activity) return sortDirection === "asc" ? 1 : -1;
          if (!b.last_activity) return sortDirection === "asc" ? -1 : 1;
          comparison =
            new Date(a.last_activity).getTime() - new Date(b.last_activity).getTime();
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [athletes, searchQuery, sortField, sortDirection]);

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 text-xs font-medium transition-colors ${
        sortField === field ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Athletes</h1>
          <p className="text-muted-foreground text-lg">
            All athletes with VBT data
          </p>
        </div>
        <Link to="/lab">
          <Button variant="outline" className="rounded-xl">
            Back to Lab
          </Button>
        </Link>
      </div>

      {/* Search & Stats Bar */}
      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{filteredAndSortedAthletes.length} athletes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Athletes Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-background/30">
          <div className="col-span-4">
            <SortButton field="name">Athlete</SortButton>
          </div>
          <div className="col-span-2 text-center">
            <SortButton field="records">Records</SortButton>
          </div>
          <div className="col-span-1 text-center hidden lg:block">
            <SortButton field="sessions">Sessions</SortButton>
          </div>
          <div className="col-span-1 text-center hidden lg:block">
            <SortButton field="exercises">Exercises</SortButton>
          </div>
          <div className="col-span-2 text-center">
            <SortButton field="technique">Technique</SortButton>
          </div>
          <div className="col-span-2 text-right">
            <SortButton field="last_activity">Last Active</SortButton>
          </div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : filteredAndSortedAthletes.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredAndSortedAthletes.map((athlete) => (
              <Link
                key={athlete.user_id}
                to={`/lab/athletes/${athlete.user_id}`}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-background/50 transition-smooth group"
              >
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {athlete.name || "Unknown Athlete"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {athlete.primary_sport || "No sport"} • {athlete.experience_level || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="font-bold">{athlete.total_velocity_records}</span>
                  </div>
                </div>

                <div className="col-span-1 text-center hidden lg:block">
                  <span className="text-sm">{athlete.total_sessions}</span>
                </div>

                <div className="col-span-1 text-center hidden lg:block">
                  <div className="flex items-center justify-center gap-1">
                    <Dumbbell className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm">{athlete.exercises_tracked}</span>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  {athlete.avg_technique_score !== null ? (
                    <span
                      className={`font-bold ${
                        athlete.avg_technique_score >= 80
                          ? "text-green-500"
                          : athlete.avg_technique_score >= 60
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {athlete.avg_technique_score.toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>

                <div className="col-span-2 text-right flex items-center justify-end gap-2">
                  <div className="text-right">
                    {athlete.last_activity ? (
                      <>
                        <p className="text-sm">
                          {format(parseISO(athlete.last_activity), "MMM d")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(athlete.last_activity), "HH:mm")}
                        </p>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Never</span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-1">No athletes found</p>
            <p className="text-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "No athletes have VBT data yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
