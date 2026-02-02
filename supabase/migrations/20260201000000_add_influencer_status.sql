-- Add influencer_status column for influencer outreach workflow
-- Status workflow: pending -> contacted -> approved -> rejected

-- Create enum type for influencer status
DO $$ BEGIN
  CREATE TYPE influencer_status AS ENUM ('pending', 'contacted', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add column to partners table
ALTER TABLE partners
ADD COLUMN IF NOT EXISTS influencer_status influencer_status DEFAULT 'pending';

-- Add index for filtering by status
CREATE INDEX IF NOT EXISTS idx_partners_influencer_status ON partners(influencer_status);

-- Comment for documentation
COMMENT ON COLUMN partners.influencer_status IS 'Outreach status for influencers: pending, contacted, approved, rejected';
