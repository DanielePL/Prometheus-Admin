// Partner Portal Types - Self-service portal for partners

export interface PartnerProfile {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  commission_percent: number;
  instagram_handle?: string;
  payout_method?: "revolut" | "bank_transfer";
  payout_details?: {
    revolut_email?: string;
    iban?: string;
    bic?: string;
    bank_country?: string;
  };
  status: "active" | "inactive" | "terminated";
  created_at: string;
}

export interface PartnerStats {
  total_referrals: number;
  confirmed_referrals: number;
  pending_referrals: number;
  total_earned: number;
  total_paid: number;
  pending_payout: number;
  referrals_this_month: number;
  earnings_this_month: number;
  conversion_rate: number; // percentage of clicks that became referrals
}

export interface ReferralLink {
  id: string;
  code: string;
  url: string;
  clicks: number;
  conversions: number;
  created_at: string;
}

export interface PartnerReferralView {
  id: string;
  user_email: string;
  subscription_type: string;
  revenue: number;
  commission: number;
  status: "pending" | "confirmed" | "paid";
  referral_date: string;
  paid_at?: string;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "rejected";
  payout_method: "revolut" | "bank_transfer";
  referral_count: number;
  period_start: string;
  period_end: string;
  requested_at: string;
  processed_at?: string;
  rejection_reason?: string;
}

export interface CreatePayoutRequestInput {
  amount: number;
  payout_method: "revolut" | "bank_transfer";
}

export interface UpdatePayoutDetailsInput {
  payout_method: "revolut" | "bank_transfer";
  revolut_email?: string;
  iban?: string;
  bic?: string;
  bank_country?: string;
}

// Earnings chart data
export interface EarningsDataPoint {
  month: string; // "2024-01"
  referrals: number;
  earnings: number;
}

// Minimum payout threshold
export const MINIMUM_PAYOUT = 50; // CHF
export const CURRENCY = "CHF";
