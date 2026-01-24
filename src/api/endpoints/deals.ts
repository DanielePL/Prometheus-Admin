import type { EnterpriseDeal, DealStage, EnterpriseTier } from "../types/partners";

// ============================================
// ENTERPRISE DEALS API
// ============================================

export interface CreateDealInput {
  creator_id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  company_type?: string;
  location?: string;
  tier: EnterpriseTier;
  billing_cycle: "monthly" | "yearly";
  expected_close_date?: string;
  notes?: string;
}

export interface UpdateDealInput {
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  company_type?: string;
  location?: string;
  stage?: DealStage;
  tier?: EnterpriseTier;
  billing_cycle?: "monthly" | "yearly";
  demo_date?: string;
  expected_close_date?: string;
  notes?: string;
  loss_reason?: string;
}

export interface DealStats {
  total_deals: number;
  open_deals: number;
  won_deals: number;
  lost_deals: number;
  total_pipeline_value: number;
  total_won_value: number;
  avg_deal_size: number;
  conversion_rate: number;
  deals_by_stage: Record<DealStage, number>;
}

// Mock data for development
const mockDeals: EnterpriseDeal[] = [];

export const dealsApi = {
  // Get all deals
  async getAll(): Promise<EnterpriseDeal[]> {
    // TODO: Replace with actual Supabase call
    // const { data, error } = await supabase
    //   .from('enterprise_deals')
    //   .select('*, creators(name)')
    //   .order('created_at', { ascending: false });
    return mockDeals;
  },

  // Get deals by creator
  async getByCreator(creatorId: string): Promise<EnterpriseDeal[]> {
    // TODO: Replace with actual Supabase call
    return mockDeals.filter(d => d.creator_id === creatorId);
  },

  // Get deal by ID
  async getById(dealId: string): Promise<EnterpriseDeal | null> {
    // TODO: Replace with actual Supabase call
    return mockDeals.find(d => d.id === dealId) || null;
  },

  // Create new deal
  async create(input: CreateDealInput): Promise<EnterpriseDeal> {
    const { ENTERPRISE_TIERS, DEFAULT_COMMISSIONS } = await import("../types/partners");

    const tier = ENTERPRISE_TIERS[input.tier];
    const dealValue = input.billing_cycle === "monthly"
      ? tier.monthlyPrice
      : tier.yearlyPrice;
    const commissionAmount = dealValue * (DEFAULT_COMMISSIONS.enterprise / 100);

    const deal: EnterpriseDeal = {
      id: crypto.randomUUID(),
      creator_id: input.creator_id,
      company_name: input.company_name,
      contact_name: input.contact_name,
      contact_email: input.contact_email,
      contact_phone: input.contact_phone,
      company_type: input.company_type,
      location: input.location,
      stage: "lead",
      tier: input.tier,
      billing_cycle: input.billing_cycle,
      deal_value: dealValue,
      commission_amount: commissionAmount,
      created_at: new Date().toISOString(),
      expected_close_date: input.expected_close_date,
      notes: input.notes,
    };

    mockDeals.push(deal);
    return deal;
  },

  // Update deal
  async update(dealId: string, input: UpdateDealInput): Promise<EnterpriseDeal> {
    const index = mockDeals.findIndex(d => d.id === dealId);
    if (index === -1) throw new Error("Deal not found");

    const deal = mockDeals[index];

    // Recalculate deal value if tier or billing cycle changed
    if (input.tier || input.billing_cycle) {
      const { ENTERPRISE_TIERS, DEFAULT_COMMISSIONS } = await import("../types/partners");
      const tier = ENTERPRISE_TIERS[input.tier || deal.tier];
      const cycle = input.billing_cycle || deal.billing_cycle;
      deal.deal_value = cycle === "monthly" ? tier.monthlyPrice : tier.yearlyPrice;
      deal.commission_amount = deal.deal_value * (DEFAULT_COMMISSIONS.enterprise / 100);
    }

    // Handle stage changes
    if (input.stage) {
      deal.stage = input.stage;
      deal.last_activity_at = new Date().toISOString();

      if (input.stage === "closed_won" || input.stage === "closed_lost") {
        deal.closed_at = new Date().toISOString();
      }
    }

    // Apply other updates
    Object.assign(deal, {
      ...input,
      last_activity_at: new Date().toISOString(),
    });

    mockDeals[index] = deal;
    return deal;
  },

  // Move deal to next stage
  async advanceStage(dealId: string): Promise<EnterpriseDeal> {
    const { DEAL_STAGES } = await import("../types/partners");
    const deal = mockDeals.find(d => d.id === dealId);
    if (!deal) throw new Error("Deal not found");

    const currentOrder = DEAL_STAGES[deal.stage].order;
    const stages = Object.entries(DEAL_STAGES)
      .sort((a, b) => a[1].order - b[1].order);

    const nextStage = stages.find(([_, config]) => config.order === currentOrder + 1);
    if (nextStage && nextStage[0] !== "closed_lost") {
      deal.stage = nextStage[0] as DealStage;
      deal.last_activity_at = new Date().toISOString();

      if (deal.stage === "closed_won") {
        deal.closed_at = new Date().toISOString();
      }
    }

    return deal;
  },

  // Delete deal
  async delete(dealId: string): Promise<void> {
    const index = mockDeals.findIndex(d => d.id === dealId);
    if (index !== -1) {
      mockDeals.splice(index, 1);
    }
  },

  // Get deal statistics
  async getStats(): Promise<DealStats> {
    const { DEAL_STAGES } = await import("../types/partners");

    const openStages: DealStage[] = ["lead", "contacted", "demo_scheduled", "demo_done", "proposal_sent", "negotiation"];

    const openDeals = mockDeals.filter(d => openStages.includes(d.stage));
    const wonDeals = mockDeals.filter(d => d.stage === "closed_won");
    const lostDeals = mockDeals.filter(d => d.stage === "closed_lost");
    const closedDeals = wonDeals.length + lostDeals.length;

    const dealsByStage = Object.keys(DEAL_STAGES).reduce((acc, stage) => {
      acc[stage as DealStage] = mockDeals.filter(d => d.stage === stage).length;
      return acc;
    }, {} as Record<DealStage, number>);

    return {
      total_deals: mockDeals.length,
      open_deals: openDeals.length,
      won_deals: wonDeals.length,
      lost_deals: lostDeals.length,
      total_pipeline_value: openDeals.reduce((sum, d) => sum + d.deal_value, 0),
      total_won_value: wonDeals.reduce((sum, d) => sum + d.deal_value, 0),
      avg_deal_size: mockDeals.length > 0
        ? mockDeals.reduce((sum, d) => sum + d.deal_value, 0) / mockDeals.length
        : 0,
      conversion_rate: closedDeals > 0 ? (wonDeals.length / closedDeals) * 100 : 0,
      deals_by_stage: dealsByStage,
    };
  },

  // Get stats for a specific creator
  async getCreatorStats(creatorId: string): Promise<DealStats> {
    const creatorDeals = mockDeals.filter(d => d.creator_id === creatorId);
    const { DEAL_STAGES } = await import("../types/partners");

    const openStages: DealStage[] = ["lead", "contacted", "demo_scheduled", "demo_done", "proposal_sent", "negotiation"];

    const openDeals = creatorDeals.filter(d => openStages.includes(d.stage));
    const wonDeals = creatorDeals.filter(d => d.stage === "closed_won");
    const lostDeals = creatorDeals.filter(d => d.stage === "closed_lost");
    const closedDeals = wonDeals.length + lostDeals.length;

    const dealsByStage = Object.keys(DEAL_STAGES).reduce((acc, stage) => {
      acc[stage as DealStage] = creatorDeals.filter(d => d.stage === stage).length;
      return acc;
    }, {} as Record<DealStage, number>);

    return {
      total_deals: creatorDeals.length,
      open_deals: openDeals.length,
      won_deals: wonDeals.length,
      lost_deals: lostDeals.length,
      total_pipeline_value: openDeals.reduce((sum, d) => sum + d.deal_value, 0),
      total_won_value: wonDeals.reduce((sum, d) => sum + d.deal_value, 0),
      avg_deal_size: creatorDeals.length > 0
        ? creatorDeals.reduce((sum, d) => sum + d.deal_value, 0) / creatorDeals.length
        : 0,
      conversion_rate: closedDeals > 0 ? (wonDeals.length / closedDeals) * 100 : 0,
      deals_by_stage: dealsByStage,
    };
  },
};
