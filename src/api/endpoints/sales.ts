import { supabase, isSupabaseConfigured } from "../supabaseClient";
import type {
  SalesLead,
  CreateLeadInput,
  UpdateLeadInput,
  PipelineStats,
  SalesNote,
  DealStatus,
} from "../types/sales";

const LEADS_TABLE = "sales_leads";
const NOTES_TABLE = "sales_notes";

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase not configured");
  }
  return supabase;
}

export const salesEndpoints = {
  // Get all leads with optional filters, including notes
  getLeads: async (status?: DealStatus, assignedTo?: string): Promise<SalesLead[]> => {
    if (!isSupabaseConfigured) return [];
    const client = requireSupabase();

    let query = client
      .from(LEADS_TABLE)
      .select("*, notes:sales_notes(*)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (assignedTo) {
      query = query.eq("assigned_to", assignedTo);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Ensure notes is always an array
    return (data || []).map((lead) => ({
      ...lead,
      notes: lead.notes || [],
    }));
  },

  // Get single lead by ID
  getLead: async (id: string): Promise<SalesLead> => {
    const client = requireSupabase();
    const { data, error } = await client
      .from(LEADS_TABLE)
      .select("*, notes:sales_notes(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return { ...data, notes: data.notes || [] };
  },

  // Create a new lead
  createLead: async (input: CreateLeadInput): Promise<{ success: boolean; id: string; lead: SalesLead }> => {
    const client = requireSupabase();

    // Insert lead (without the notes string field)
    const { notes: initialNote, ...leadData } = input;
    const { data: lead, error } = await client
      .from(LEADS_TABLE)
      .insert({
        ...leadData,
        status: "new",
      })
      .select()
      .single();
    if (error) throw error;

    // If an initial note was provided, insert it
    if (initialNote && initialNote.trim()) {
      await client.from(NOTES_TABLE).insert({
        lead_id: lead.id,
        content: initialNote.trim(),
        created_by: "Admin",
      });
    }

    // Re-fetch with notes
    const fullLead = await salesEndpoints.getLead(lead.id);
    return { success: true, id: lead.id, lead: fullLead };
  },

  // Update a lead
  updateLead: async (id: string, data: UpdateLeadInput): Promise<{ success: boolean; lead: SalesLead }> => {
    const client = requireSupabase();
    const { data: lead, error } = await client
      .from(LEADS_TABLE)
      .update(data)
      .eq("id", id)
      .select("*, notes:sales_notes(*)")
      .single();
    if (error) throw error;
    return { success: true, lead: { ...lead, notes: lead.notes || [] } };
  },

  // Delete a lead (notes cascade-deleted via FK)
  deleteLead: async (id: string): Promise<{ success: boolean }> => {
    const client = requireSupabase();
    const { error } = await client.from(LEADS_TABLE).delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  },

  // Add a note to a lead
  addNote: async (leadId: string, content: string): Promise<{ success: boolean; note: SalesNote }> => {
    const client = requireSupabase();
    const { data: note, error } = await client
      .from(NOTES_TABLE)
      .insert({
        lead_id: leadId,
        content,
        created_by: "Admin",
      })
      .select()
      .single();
    if (error) throw error;
    return { success: true, note };
  },

  // Delete a note
  deleteNote: async (noteId: string): Promise<{ success: boolean }> => {
    const client = requireSupabase();
    const { error } = await client.from(NOTES_TABLE).delete().eq("id", noteId);
    if (error) throw error;
    return { success: true };
  },

  // Pipeline stats computed from leads
  getPipelineStats: async (): Promise<PipelineStats> => {
    if (!isSupabaseConfigured) {
      return {
        total_leads: 0,
        by_status: { new: 0, contacted: 0, demo: 0, negotiation: 0, won: 0, lost: 0 },
        total_pipeline_value: 0,
        won_value: 0,
        founding_partners: 0,
      };
    }
    const client = requireSupabase();
    const { data, error } = await client
      .from(LEADS_TABLE)
      .select("status, pricing_quoted, founding_partner");
    if (error) throw error;

    const leads = data || [];
    const byStatus: Record<DealStatus, number> = {
      new: 0, contacted: 0, demo: 0, negotiation: 0, won: 0, lost: 0,
    };
    let totalPipelineValue = 0;
    let wonValue = 0;
    let foundingPartners = 0;

    for (const lead of leads) {
      byStatus[lead.status as DealStatus]++;
      totalPipelineValue += Number(lead.pricing_quoted) || 0;
      if (lead.status === "won") wonValue += Number(lead.pricing_quoted) || 0;
      if (lead.founding_partner) foundingPartners++;
    }

    return {
      total_leads: leads.length,
      by_status: byStatus,
      total_pipeline_value: totalPipelineValue,
      won_value: wonValue,
      founding_partners: foundingPartners,
    };
  },
};
