// Influencer status pipeline
export type InfluencerStatus = "pending" | "contacted" | "approved" | "rejected";

// Team members who can be assigned as contact persons
export const TEAM_MEMBERS = [
  "Sjoerd",
  "Valerie",
  "Karin",
  "Daniele",
] as const;

export type TeamMember = (typeof TEAM_MEMBERS)[number];

// Influencer categories
export const INFLUENCER_CATEGORIES = [
  "fitness",
  "nutrition",
  "lifestyle",
  "athlete",
  "coach",
  "wellness",
  "crossfit",
  "bodybuilding",
  "yoga",
  "other",
] as const;

export type InfluencerCategory = (typeof INFLUENCER_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<InfluencerCategory, string> = {
  fitness: "Fitness",
  nutrition: "Nutrition",
  lifestyle: "Lifestyle",
  athlete: "Athlete",
  coach: "Coach",
  wellness: "Wellness",
  crossfit: "CrossFit",
  bodybuilding: "Bodybuilding",
  yoga: "Yoga",
  other: "Other",
};

export interface Influencer {
  id: string;
  instagram_handle: string;
  full_name: string;
  email: string | null;
  follower_count: number;
  engagement_rate: number; // percentage, e.g., 3.5 means 3.5%
  category: InfluencerCategory;
  status: InfluencerStatus;
  contact_person: TeamMember | null;
  notes: string | null;
  promo_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInfluencerInput {
  instagram_handle: string;
  full_name: string;
  email?: string;
  follower_count: number;
  engagement_rate: number;
  category: InfluencerCategory;
  contact_person?: TeamMember;
  notes?: string;
  promo_code?: string;
}

export interface UpdateInfluencerInput {
  instagram_handle?: string;
  full_name?: string;
  email?: string | null;
  follower_count?: number;
  engagement_rate?: number;
  category?: InfluencerCategory;
  status?: InfluencerStatus;
  contact_person?: TeamMember | null;
  notes?: string | null;
  promo_code?: string | null;
}

// Calculate estimated reach based on followers and engagement
export function calculatePromoReach(
  followerCount: number,
  engagementRate: number
): number {
  return Math.round(followerCount * (engagementRate / 100));
}

// Status configuration for UI
export const STATUS_CONFIG: Record<
  InfluencerStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-blue-500" },
  contacted: { label: "Contacted", color: "bg-yellow-500" },
  approved: { label: "Approved", color: "bg-green-500" },
  rejected: { label: "Rejected", color: "bg-red-500" },
};
