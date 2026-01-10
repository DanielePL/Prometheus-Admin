export const CURRENCY = "CHF";

// Influencer Profile
export interface InfluencerProfile {
  id: string;
  name: string;
  email: string;
  instagram_handle: string;
  tiktok_handle?: string;
  youtube_handle?: string;
  followers: number;
  category: string;
  commission_rate: number;
  status: "active" | "pending" | "inactive";
  joined_date: string;
  profile_image?: string;
}

// Performance Stats
export interface InfluencerStats {
  total_earnings: number;
  pending_earnings: number;
  total_conversions: number;
  this_month_conversions: number;
  conversion_rate: number;
  total_clicks: number;
  active_campaigns: number;
}

// Campaign
export interface InfluencerCampaign {
  id: string;
  name: string;
  brand?: string;
  start_date: string;
  end_date?: string;
  status: "active" | "completed" | "upcoming";
  commission_type: "fixed" | "percentage";
  commission_value: number;
  conversions: number;
  earnings: number;
  tracking_link: string;
}

// Earnings Entry
export interface EarningsEntry {
  id: string;
  campaign_id: string;
  campaign_name: string;
  date: string;
  amount: number;
  type: "conversion" | "bonus" | "adjustment";
  status: "pending" | "approved" | "paid";
  description?: string;
}

// Payout
export interface InfluencerPayout {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  request_date: string;
  process_date?: string;
  payment_method: string;
  reference?: string;
}

// Chart data
export interface EarningsChartData {
  month: string;
  earnings: number;
  conversions: number;
}

// Payout details input
export interface UpdateInfluencerPayoutDetailsInput {
  payment_method: "bank_transfer" | "paypal";
  bank_name?: string;
  iban?: string;
  account_holder?: string;
  paypal_email?: string;
}
