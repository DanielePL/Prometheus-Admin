import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Lock,
  Unlock,
  Smartphone,
  Dumbbell,
  Camera,
  Activity,
  CheckCircle,
  XCircle,
  Archive,
} from "lucide-react";
import {
  useTrackingError,
  useUpdateReviewStatus,
} from "@/hooks/useTrackingErrors";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import type { ReviewStatus } from "@/api/types/trackingErrors";

const severityColors: Record<string, string> = {
  low: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  medium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  critical: "bg-red-700/20 text-red-300 border-red-700/30",
};

export function TrackingErrorDetailPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const { data: video, isLoading } = useTrackingError(videoId || "");
  const updateReview = useUpdateReviewStatus();
  const [reviewNotes, setReviewNotes] = useState("");

  const handleReview = (status: ReviewStatus) => {
    if (!videoId) return;
    updateReview.mutate({
      id: videoId,
      status,
      notes: reviewNotes || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium">Video not found</p>
        <Link to="/lab/tracking-errors">
          <Button variant="outline" className="mt-4 rounded-xl">
            Back to List
          </Button>
        </Link>
      </div>
    );
  }

  const unlockRatio =
    video.total_frames > 0
      ? ((video.frames_unlocked / video.total_frames) * 100).toFixed(1)
      : "0";

  // Prepare confidence timeline data for chart
  const confidenceData = Array.isArray(video.confidence_timeline)
    ? video.confidence_timeline.map((s) => ({
        frame: s.frame,
        confidence: Math.round(s.confidence * 100),
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/lab/tracking-errors">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold">
              {video.exercise_name || "Unknown Exercise"}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                severityColors[video.error_severity] || ""
              }`}
            >
              {video.error_severity.toUpperCase()}
            </span>
          </div>
          <p className="text-muted-foreground">
            {format(parseISO(video.created_at), "MMM d, yyyy HH:mm")}
            {video.weight_kg ? ` • ${video.weight_kg}kg` : ""}
          </p>
        </div>
      </div>

      {/* Video Player */}
      {video.video_url && (
        <div className="glass rounded-2xl overflow-hidden">
          <video
            src={video.video_url}
            controls
            className="w-full max-h-[500px] bg-black"
            playsInline
          />
        </div>
      )}

      {/* Error Summary + Context Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Error Summary */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Error Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Lock Losses</p>
              <p className="text-xl font-bold">{video.lock_loss_count}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">YOLO Reinits</p>
              <p className="text-xl font-bold">{video.yolo_reinit_count}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Unlock Ratio</p>
              <p className="text-xl font-bold">{unlockRatio}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
              <p className="text-xl font-bold">
                {video.avg_confidence
                  ? `${(video.avg_confidence * 100).toFixed(0)}%`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Min Confidence</p>
              <p className="text-xl font-bold">
                {video.min_confidence
                  ? `${(video.min_confidence * 100).toFixed(0)}%`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Jump</p>
              <p className="text-xl font-bold">
                {video.max_tracking_jump_px
                  ? `${Math.round(video.max_tracking_jump_px)}px`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Drift</p>
              <p className="text-xl font-bold">
                {video.max_bar_path_drift
                  ? `${video.max_bar_path_drift.toFixed(1)}%`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Frames</p>
              <p className="text-xl font-bold">
                {video.total_frames}
                <span className="text-xs text-muted-foreground ml-1">
                  ({Math.round(video.total_frames / 30)}s)
                </span>
              </p>
            </div>
          </div>

          {/* Error Types */}
          {video.error_types.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-muted-foreground mb-2">Error Types</p>
              <div className="flex flex-wrap gap-2">
                {video.error_types.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs"
                  >
                    {type.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Context Card */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            Context
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Dumbbell className="w-4 h-4" />
                <span className="text-sm">Exercise</span>
              </div>
              <span className="text-sm font-medium">
                {video.exercise_name || "Unknown"}
              </span>
            </div>
            {video.weight_kg && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Weight</span>
                </div>
                <span className="text-sm font-medium">{video.weight_kg}kg</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm">Device</span>
              </div>
              <span className="text-sm font-medium">
                {video.device_model || "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Android</span>
              <span className="text-sm font-medium">
                {video.android_version || "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Camera className="w-4 h-4" />
                <span className="text-sm">Camera</span>
              </div>
              <span className="text-sm font-medium">
                {video.camera_direction || "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Recording Mode
              </span>
              <span className="text-sm font-medium">
                {video.recording_mode || "Unknown"}
              </span>
            </div>
            {video.video_size_bytes && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">File Size</span>
                <span className="text-sm font-medium">
                  {(video.video_size_bytes / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
            )}
          </div>

          {/* Lock/Unlock bars */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <Lock className="w-3 h-3 text-green-400" />
                <span>Locked: {video.frames_locked}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Unlock className="w-3 h-3 text-red-400" />
                <span>Unlocked: {video.frames_unlocked}</span>
              </div>
            </div>
            <div className="w-full h-3 bg-background/50 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-green-500/60"
                style={{
                  width: `${
                    video.total_frames > 0
                      ? (video.frames_locked / video.total_frames) * 100
                      : 0
                  }%`,
                }}
              />
              <div
                className="h-full bg-red-500/60"
                style={{
                  width: `${
                    video.total_frames > 0
                      ? (video.frames_unlocked / video.total_frames) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Timeline Chart */}
      {confidenceData.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Confidence Timeline</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={confidenceData}>
              <XAxis
                dataKey="frame"
                stroke="#666"
                fontSize={12}
                label={{
                  value: "Frame",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                domain={[0, 100]}
                label={{
                  value: "Confidence %",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                }}
                labelFormatter={(frame) => `Frame ${frame}`}
                formatter={(value: number | undefined) => [`${value ?? 0}%`, "Confidence"]}
              />
              <ReferenceLine
                y={30}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{ value: "Low threshold", fill: "#ef4444", fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Review Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Review</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">
            Current status:
          </span>
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-sm font-medium">
            {video.review_status.replace("_", " ")}
          </span>
        </div>

        <textarea
          className="w-full bg-background/50 border border-white/10 rounded-xl p-3 text-sm mb-4 min-h-[80px] resize-y"
          placeholder="Review notes (optional)..."
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
        />

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-green-500/30 text-green-400 hover:bg-green-500/10"
            onClick={() => handleReview("useful")}
            disabled={updateReview.isPending}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Useful
          </Button>
          <Button
            variant="outline"
            className="rounded-xl border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
            onClick={() => handleReview("not_useful")}
            disabled={updateReview.isPending}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Not Useful
          </Button>
          <Button
            variant="outline"
            className="rounded-xl border-gray-700/30 text-gray-500 hover:bg-gray-500/10"
            onClick={() => handleReview("archived")}
            disabled={updateReview.isPending}
          >
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </Button>
        </div>

        {video.reviewer_notes && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-muted-foreground mb-1">
              Previous Notes
            </p>
            <p className="text-sm">{video.reviewer_notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
