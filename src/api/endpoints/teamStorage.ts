import { supabase, isSupabaseConfigured } from "../supabaseClient";
import type {
  TeamFile,
  TeamFileFilters,
  TeamFileStats,
  TeamFileUpdate,
} from "../types/teamStorage";
import { getFileCategoryFromMime } from "../types/teamStorage";
import type { TeamMember } from "../types/influencers";

const TABLE = "team_files";
const BUCKET = "team-storage";

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase not configured");
  }
  return supabase;
}

export const teamStorageApi = {
  // List files with optional filters
  getAll: async (filters?: TeamFileFilters): Promise<TeamFile[]> => {
    if (!isSupabaseConfigured) return [];
    const client = requireSupabase();

    let query = client
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("file_category", filters.category);
    }
    if (filters?.uploaded_by) {
      query = query.eq("uploaded_by", filters.uploaded_by);
    }
    if (filters?.search) {
      query = query.or(
        `original_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Upload a file to storage + create DB record
  upload: async (
    file: File,
    uploadedBy: TeamMember,
    description?: string,
    tags?: string[]
  ): Promise<TeamFile> => {
    const client = requireSupabase();

    // Build a sanitized file name with timestamp to avoid collisions
    const timestamp = Date.now();
    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageName = `${timestamp}_${sanitized}`;
    const storagePath = `${uploadedBy.toLowerCase()}/${storageName}`;

    // Upload to storage
    const { error: uploadError } = await client.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });
    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = client.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const category = getFileCategoryFromMime(file.type);

    // Create DB record
    const { data, error } = await client
      .from(TABLE)
      .insert({
        file_name: storageName,
        original_name: file.name,
        storage_path: storagePath,
        mime_type: file.type || "application/octet-stream",
        file_size: file.size,
        file_category: category,
        uploaded_by: uploadedBy,
        description: description || null,
        tags: tags || [],
        public_url: urlData.publicUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update description / tags
  update: async (id: string, updates: TeamFileUpdate): Promise<TeamFile> => {
    const client = requireSupabase();
    const { data, error } = await client
      .from(TABLE)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Delete from storage + DB
  delete: async (id: string): Promise<{ success: boolean }> => {
    const client = requireSupabase();

    // Fetch the record to get the storage path
    const { data: file } = await client
      .from(TABLE)
      .select("storage_path")
      .eq("id", id)
      .single();

    if (file) {
      await client.storage.from(BUCKET).remove([file.storage_path]);
    }

    const { error } = await client.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  },

  // Get stats: count by category + total size
  getStats: async (): Promise<TeamFileStats> => {
    if (!isSupabaseConfigured) {
      return { total: 0, images: 0, documents: 0, spreadsheets: 0, other: 0, totalSize: 0 };
    }
    const client = requireSupabase();
    const { data, error } = await client
      .from(TABLE)
      .select("file_category, file_size");
    if (error) throw error;

    const files = data || [];
    return {
      total: files.length,
      images: files.filter((f) => f.file_category === "image").length,
      documents: files.filter((f) => f.file_category === "document").length,
      spreadsheets: files.filter((f) => f.file_category === "spreadsheet").length,
      other: files.filter((f) => f.file_category === "other").length,
      totalSize: files.reduce((sum, f) => sum + (f.file_size || 0), 0),
    };
  },
};
