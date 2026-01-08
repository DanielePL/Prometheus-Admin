// Sales Lead Types
export type PainPoint =
  | "time_waste"
  | "no_overview"
  | "nutrition_chaos"
  | "scaling"
  | "no_vbt"
  | "retention"
  | "burnout"
  | "data_silos";

export type DealStatus =
  | "new"
  | "contacted"
  | "demo"
  | "negotiation"
  | "won"
  | "lost";

export interface SalesNote {
  id: string;
  lead_id: string;
  content: string;
  created_by: string;
  created_at: string;
}

export interface SalesLead {
  id: string;
  gym_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  coaches_count: number;
  clients_count: number;
  pain_points: PainPoint[];
  pricing_quoted: number;
  founding_partner: boolean;
  status: DealStatus;
  assigned_to?: string;
  demo_date?: string;
  closed_date?: string;
  notes: SalesNote[];
  created_at: string;
  updated_at: string;
}

export interface CreateLeadInput {
  gym_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  coaches_count: number;
  clients_count: number;
  pain_points: PainPoint[];
  pricing_quoted: number;
  founding_partner: boolean;
  notes?: string;
}

export interface UpdateLeadInput {
  gym_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  coaches_count?: number;
  clients_count?: number;
  pain_points?: PainPoint[];
  pricing_quoted?: number;
  founding_partner?: boolean;
  status?: DealStatus;
  assigned_to?: string;
}

export interface PipelineStats {
  total_leads: number;
  by_status: Record<DealStatus, number>;
  total_pipeline_value: number;
  won_value: number;
  founding_partners: number;
}

// Pain Point Labels & Icons
export const PAIN_POINTS: Record<PainPoint, { label: string; icon: string }> = {
  time_waste: { label: "Time Waste", icon: "Clock" },
  no_overview: { label: "No Overview", icon: "LayoutDashboard" },
  nutrition_chaos: { label: "Nutrition Chaos", icon: "Utensils" },
  scaling: { label: "Scaling Issues", icon: "TrendingUp" },
  no_vbt: { label: "No VBT", icon: "Zap" },
  retention: { label: "Client Retention", icon: "UserMinus" },
  burnout: { label: "Coach Burnout", icon: "Battery" },
  data_silos: { label: "Data Silos", icon: "Database" },
};

// Simple label map for display
export const PAIN_POINT_LABELS: Record<PainPoint, string> = {
  time_waste: "Time Waste",
  no_overview: "No Overview",
  nutrition_chaos: "Nutrition Chaos",
  scaling: "Scaling Issues",
  no_vbt: "No VBT",
  retention: "Client Retention",
  burnout: "Coach Burnout",
  data_silos: "Data Silos",
};

// Deal Status Colors
export const STATUS_COLORS: Record<DealStatus, { bg: string; text: string }> = {
  new: { bg: "bg-blue-500/20", text: "text-blue-400" },
  contacted: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  demo: { bg: "bg-purple-500/20", text: "text-purple-400" },
  negotiation: { bg: "bg-orange-500/20", text: "text-orange-400" },
  won: { bg: "bg-green-500/20", text: "text-green-400" },
  lost: { bg: "bg-red-500/20", text: "text-red-400" },
};

// Pricing Constants
export const PRICING = {
  GYM_BASE: 150, // CHF/Monat
  COACH_RATE: 25, // CHF/Coach/Monat
  CLIENT_RATE: 5, // CHF/Client/Monat
  FOUNDING_DISCOUNT: 0.5, // 50% Rabatt
} as const;

// Calculate pricing
export function calculatePricing(
  coachesCount: number,
  clientsCount: number,
  isFoundingPartner: boolean
): { monthly: number; yearly: number } {
  const base = PRICING.GYM_BASE;
  const coaches = coachesCount * PRICING.COACH_RATE;
  const clients = clientsCount * PRICING.CLIENT_RATE;
  const total = base + coaches + clients;
  const discount = isFoundingPartner ? PRICING.FOUNDING_DISCOUNT : 0;
  const monthly = total * (1 - discount);
  const yearly = monthly * 12 * 0.85; // 15% yearly discount

  return { monthly, yearly };
}
