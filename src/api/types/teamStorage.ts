import type { TeamMember } from "./influencers";

// File category based on MIME type
export type FileCategory = "image" | "document" | "spreadsheet" | "other";

// Team file record from the database
export interface TeamFile {
  id: string;
  file_name: string;           // sanitized storage name
  original_name: string;       // original upload name
  storage_path: string;        // path in Supabase bucket
  mime_type: string;
  file_size: number;           // bytes
  file_category: FileCategory;
  uploaded_by: TeamMember;     // from TEAM_MEMBERS
  description: string | null;
  tags: string[];
  public_url: string;
  created_at: string;
  updated_at: string;
}

// Input for uploading a new file
export interface TeamFileCreate {
  file: File;
  uploaded_by: TeamMember;
  description?: string;
  tags?: string[];
}

// Input for updating a file record
export interface TeamFileUpdate {
  description?: string;
  tags?: string[];
}

// Filters for listing files
export interface TeamFileFilters {
  category?: FileCategory;
  uploaded_by?: TeamMember;
  search?: string;
}

// Stats summary
export interface TeamFileStats {
  total: number;
  images: number;
  documents: number;
  spreadsheets: number;
  other: number;
  totalSize: number; // bytes
}

// --- Helpers ---

/** Format bytes into human-readable string */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Determine file category from MIME type */
export function getFileCategoryFromMime(mime: string): FileCategory {
  if (mime.startsWith("image/")) return "image";
  if (
    mime === "application/pdf" ||
    mime === "application/msword" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mime === "text/plain"
  ) {
    return "document";
  }
  if (
    mime === "application/vnd.ms-excel" ||
    mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mime === "text/csv"
  ) {
    return "spreadsheet";
  }
  return "other";
}

/** Check if MIME type is an image */
export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}
