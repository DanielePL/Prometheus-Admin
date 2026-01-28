import { useState, useMemo, useCallback, useRef } from "react";
import {
  FolderOpen,
  Upload,
  Image,
  FileText,
  Table2,
  File,
  Trash2,
  Eye,
  Download,
  X,
  Filter,
  Search,
  HardDrive,
  Flame,
} from "lucide-react";
import {
  useTeamFiles,
  useUploadTeamFile,
  useDeleteTeamFile,
  useTeamFileStats,
} from "@/hooks/useTeamStorage";
import { TEAM_MEMBERS, type TeamMember } from "@/api/types/influencers";
import type { FileCategory } from "@/api/types/teamStorage";
import { formatFileSize, isImageMime } from "@/api/types/teamStorage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type FilterCategory = "all" | FileCategory;

const CATEGORY_CONFIG: Record<FileCategory, { label: string; Icon: typeof FileText; color: string; bg: string }> = {
  image: { label: "Images", Icon: Image, color: "text-blue-500", bg: "bg-blue-500/20" },
  document: { label: "Documents", Icon: FileText, color: "text-green-500", bg: "bg-green-500/20" },
  spreadsheet: { label: "Spreadsheets", Icon: Table2, color: "text-purple-500", bg: "bg-purple-500/20" },
  other: { label: "Other", Icon: File, color: "text-gray-500", bg: "bg-gray-500/20" },
};

function getCategoryIcon(category: FileCategory) {
  return CATEGORY_CONFIG[category]?.Icon ?? File;
}

export function TeamStoragePage() {
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");
  const [uploaderFilter, setUploaderFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Build filters for query
  const filters = useMemo(() => {
    const f: Record<string, string | undefined> = {};
    if (categoryFilter !== "all") f.category = categoryFilter;
    if (uploaderFilter) f.uploaded_by = uploaderFilter;
    if (searchQuery.trim()) f.search = searchQuery.trim();
    return Object.keys(f).length > 0 ? f : undefined;
  }, [categoryFilter, uploaderFilter, searchQuery]) as Parameters<typeof useTeamFiles>[0];

  const { data: files, isLoading } = useTeamFiles(filters);
  const { data: stats, isLoading: statsLoading } = useTeamFileStats();
  const deleteMutation = useDeleteTeamFile();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handlePreview = (url: string, mime: string) => {
    if (isImageMime(mime)) {
      setPreviewUrl(url);
    } else {
      window.open(url, "_blank", "noopener");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/25">
            <FolderOpen className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-1">Team Storage</h1>
            <p className="text-muted-foreground">
              Shared files, images and documents for the team
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-lg shadow-primary/25"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={FolderOpen}
          label="Total Files"
          value={stats?.total}
          loading={statsLoading}
          borderColor="border-primary/10"
          iconBg="from-primary/20 to-orange-500/10"
          iconColor="text-primary"
        />
        <StatCard
          icon={Image}
          label="Images"
          value={stats?.images}
          loading={statsLoading}
          borderColor="border-blue-500/10"
          iconBg="from-blue-500/20 to-blue-500/5"
          iconColor="text-blue-500"
        />
        <StatCard
          icon={FileText}
          label="Documents"
          value={stats?.documents}
          loading={statsLoading}
          borderColor="border-green-500/10"
          iconBg="from-green-500/20 to-green-500/5"
          iconColor="text-green-500"
        />
        <StatCard
          icon={HardDrive}
          label="Total Size"
          value={stats ? formatFileSize(stats.totalSize) : undefined}
          loading={statsLoading}
          borderColor="border-muted/20"
          iconBg="from-muted/30 to-muted/10"
          iconColor="text-muted-foreground"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />

        {/* Category tabs */}
        <button
          onClick={() => setCategoryFilter("all")}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
            categoryFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-card/80 text-muted-foreground"
          )}
        >
          All
        </button>
        {(Object.keys(CATEGORY_CONFIG) as FileCategory[]).map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-card/80 text-muted-foreground"
              )}
            >
              <config.Icon className="w-3.5 h-3.5" />
              {config.label}
            </button>
          );
        })}

        {/* Uploader dropdown */}
        <select
          value={uploaderFilter}
          onChange={(e) => setUploaderFilter(e.target.value)}
          className="h-9 px-3 rounded-xl bg-card border border-muted/20 text-sm text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        >
          <option value="">All Members</option>
          {TEAM_MEMBERS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 pr-3 w-56 rounded-xl bg-card border border-muted/20 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* File Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : files && files.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => {
            const catConfig = CATEGORY_CONFIG[file.file_category] || CATEGORY_CONFIG.other;
            const CatIcon = getCategoryIcon(file.file_category);
            const isImage = isImageMime(file.mime_type);

            return (
              <div
                key={file.id}
                className="glass rounded-2xl overflow-hidden transition-smooth hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] group"
              >
                {/* Thumbnail / Icon */}
                <div
                  className="h-36 flex items-center justify-center bg-background/50 cursor-pointer relative"
                  onClick={() => handlePreview(file.public_url, file.mime_type)}
                >
                  {isImage ? (
                    <img
                      src={file.public_url}
                      alt={file.original_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center", catConfig.bg)}>
                      <CatIcon className={cn("w-8 h-8", catConfig.color)} />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <p className="font-medium text-sm truncate" title={file.original_name}>
                    {file.original_name}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn("px-1.5 py-0.5 rounded-md text-xs font-medium", catConfig.bg, catConfig.color)}>
                      {catConfig.label}
                    </span>
                    <span>{formatFileSize(file.file_size)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{file.uploaded_by}</span>
                    <span>{format(parseISO(file.created_at), "MMM d, yyyy")}</span>
                  </div>

                  {file.description && (
                    <p className="text-xs text-muted-foreground truncate" title={file.description}>
                      {file.description}
                    </p>
                  )}

                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-8 w-8"
                      onClick={() => handlePreview(file.public_url, file.mime_type)}
                      title="Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <a
                      href={file.public_url}
                      download={file.original_name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8" title="Download">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-8 w-8 text-destructive hover:text-destructive ml-auto"
                      onClick={() => handleDelete(file.id, file.original_name)}
                      disabled={deleteMutation.isPending}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center border border-primary/10">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center mx-auto mb-4">
            <Flame className="w-10 h-10 text-primary/50" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Files Found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {categoryFilter === "all" && !uploaderFilter && !searchQuery
              ? "Upload your first file to get started with the shared team storage."
              : "No files match the current filters. Try adjusting your search."}
          </p>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-lg shadow-primary/25"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload First File
          </Button>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 rounded-xl text-white hover:bg-white/10"
              onClick={() => setPreviewUrl(null)}
            >
              <X className="w-5 h-5" />
            </Button>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

// ---- Stat Card ----

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  borderColor,
  iconBg,
  iconColor,
}: {
  icon: typeof FolderOpen;
  label: string;
  value?: number | string;
  loading: boolean;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className={cn("glass rounded-2xl p-5 border", borderColor)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
            iconBg,
            iconColor
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="h-7 w-12 mt-1" />
          ) : (
            <p className="text-2xl font-bold">{value ?? 0}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Upload Modal ----

function UploadModal({ onClose }: { onClose: () => void }) {
  const uploadMutation = useUploadTeamFile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedBy, setUploadedBy] = useState<TeamMember | "">("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadedBy) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        uploadedBy,
        description: description || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-primary/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Upload File</h3>
              <p className="text-sm text-muted-foreground">Add a file to team storage</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
              dragOver
                ? "border-primary bg-primary/5"
                : selectedFile
                  ? "border-green-500/40 bg-green-500/5"
                  : "border-muted/30 hover:border-primary/40"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
            {selectedFile ? (
              <div className="space-y-1">
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop a file here or click to browse
                </p>
              </div>
            )}
          </div>

          {/* Uploaded By (required) */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Uploaded By <span className="text-destructive">*</span>
            </label>
            <select
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value as TeamMember)}
              className="w-full h-11 px-4 rounded-xl bg-background border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              required
            >
              <option value="">Select team member</option>
              {TEAM_MEMBERS.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          {/* Description (optional) */}
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional file description..."
              className="w-full h-11 px-4 rounded-xl bg-background border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Tags (optional) */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Comma separated, e.g. logo, brand, 2026"
              className="w-full h-11 px-4 rounded-xl bg-background border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-muted/20">
            <Button variant="ghost" className="rounded-xl" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-lg shadow-primary/25"
              onClick={handleUpload}
              disabled={!selectedFile || !uploadedBy || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
