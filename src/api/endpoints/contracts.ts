import { supabase, isSupabaseConfigured } from "../supabaseClient";
import type {
  CreatorContract,
  CreateContractInput,
  SignContractInput,
  ContractStats,
} from "../types/contracts";

const TABLE = "creator_contracts";
const BUCKET = "contracts";

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase not configured");
  }
  return supabase;
}

export const contractsApi = {
  // Get all contracts
  getAll: async (): Promise<CreatorContract[]> => {
    if (!isSupabaseConfigured) return [];
    const client = requireSupabase();
    const { data, error } = await client
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Get contract by ID
  getById: async (id: string): Promise<CreatorContract> => {
    const client = requireSupabase();
    const { data, error } = await client
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  // Get contracts for a specific creator
  getByCreatorId: async (creatorId: string): Promise<CreatorContract[]> => {
    if (!isSupabaseConfigured) return [];
    const client = requireSupabase();
    const { data, error } = await client
      .from(TABLE)
      .select("*")
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Create a new contract
  create: async (
    data: CreateContractInput
  ): Promise<{ success: boolean; contract: CreatorContract }> => {
    const client = requireSupabase();
    const { data: contract, error } = await client
      .from(TABLE)
      .insert({
        creator_id: data.creator_id,
        template_name: data.template_name || undefined,
        pdf_url: data.pdf_url || undefined,
        notes: data.notes || undefined,
        expires_at: data.expires_at || undefined,
        status: "draft",
      })
      .select()
      .single();
    if (error) throw error;
    return { success: true, contract };
  },

  // Upload contract PDF to storage and update record
  uploadPdf: async (
    contractId: string,
    file: File
  ): Promise<{ success: boolean; pdf_url: string }> => {
    const client = requireSupabase();

    // Get contract to find creator_id
    const { data: contract, error: fetchError } = await client
      .from(TABLE)
      .select("creator_id")
      .eq("id", contractId)
      .single();
    if (fetchError) throw fetchError;

    const filePath = `${contract.creator_id}/${contractId}/${file.name}`;

    // Upload file
    const { error: uploadError } = await client.storage
      .from(BUCKET)
      .upload(filePath, file, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = client.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    const pdf_url = urlData.publicUrl;

    // Update contract record
    const { error: updateError } = await client
      .from(TABLE)
      .update({ pdf_url })
      .eq("id", contractId);
    if (updateError) throw updateError;

    return { success: true, pdf_url };
  },

  // Sign a contract (from creator portal)
  sign: async (
    data: SignContractInput
  ): Promise<{ success: boolean; contract: CreatorContract; signed_pdf_url: string }> => {
    const client = requireSupabase();
    const { data: contract, error } = await client
      .from(TABLE)
      .update({
        signature_data: data.signature_data,
        signed_at: new Date().toISOString(),
        status: "signed",
      })
      .eq("id", data.contract_id)
      .select()
      .single();
    if (error) throw error;
    return {
      success: true,
      contract,
      signed_pdf_url: contract.signed_pdf_url || contract.pdf_url || "",
    };
  },

  // Send contract to creator for signing
  sendForSignature: async (
    contractId: string
  ): Promise<{ success: boolean; message: string }> => {
    const client = requireSupabase();
    const { error } = await client
      .from(TABLE)
      .update({ status: "pending_signature" })
      .eq("id", contractId);
    if (error) throw error;
    return { success: true, message: "Contract sent for signature" };
  },

  // Mark contract as expired
  expire: async (
    contractId: string
  ): Promise<{ success: boolean; contract: CreatorContract }> => {
    const client = requireSupabase();
    const { data: contract, error } = await client
      .from(TABLE)
      .update({ status: "expired" })
      .eq("id", contractId)
      .select()
      .single();
    if (error) throw error;
    return { success: true, contract };
  },

  // Delete a contract
  delete: async (id: string): Promise<{ success: boolean }> => {
    const client = requireSupabase();

    // Get contract to clean up storage
    const { data: contract } = await client
      .from(TABLE)
      .select("creator_id")
      .eq("id", id)
      .single();

    // Remove storage files if contract found
    if (contract) {
      const { data: files } = await client.storage
        .from(BUCKET)
        .list(`${contract.creator_id}/${id}`);
      if (files && files.length > 0) {
        const paths = files.map((f) => `${contract.creator_id}/${id}/${f.name}`);
        await client.storage.from(BUCKET).remove(paths);
      }
    }

    // Delete record
    const { error } = await client
      .from(TABLE)
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  },

  // Get contract statistics
  getStats: async (): Promise<ContractStats> => {
    if (!isSupabaseConfigured) {
      return { total: 0, pending_signature: 0, signed: 0, expired: 0 };
    }
    const client = requireSupabase();
    const { data, error } = await client
      .from(TABLE)
      .select("status");
    if (error) throw error;

    const contracts = data || [];
    return {
      total: contracts.length,
      pending_signature: contracts.filter((c) => c.status === "pending_signature").length,
      signed: contracts.filter((c) => c.status === "signed").length,
      expired: contracts.filter((c) => c.status === "expired").length,
    };
  },
};
