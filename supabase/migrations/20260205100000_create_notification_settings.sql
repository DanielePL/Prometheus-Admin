-- ============================================================================
-- Notification Settings Table
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one setting per user per notification type
  UNIQUE(user_email, notification_type)
);

-- Disable RLS for admin access
ALTER TABLE notification_settings DISABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_settings_user
  ON notification_settings(user_email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notification_settings_updated_at ON notification_settings;
CREATE TRIGGER notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_settings_updated_at();

-- Insert default settings for all notification types
-- This is a helper function to initialize settings for a new user
CREATE OR REPLACE FUNCTION initialize_notification_settings(p_user_email TEXT)
RETURNS void AS $$
DECLARE
  notification_types TEXT[] := ARRAY[
    'new_creator',
    'creator_inactive',
    'creator_milestone',
    'contract_expiring',
    'payout_request',
    'payout_threshold',
    'revenue_milestone',
    'new_user',
    'beta_feedback',
    'crash_spike',
    'login_failed',
    'new_device'
  ];
  default_email BOOLEAN[] := ARRAY[
    true,   -- new_creator
    true,   -- creator_inactive
    false,  -- creator_milestone
    true,   -- contract_expiring
    true,   -- payout_request
    true,   -- payout_threshold
    false,  -- revenue_milestone
    false,  -- new_user
    true,   -- beta_feedback
    true,   -- crash_spike
    true,   -- login_failed
    true    -- new_device
  ];
  default_push BOOLEAN[] := ARRAY[
    true,   -- new_creator
    false,  -- creator_inactive
    true,   -- creator_milestone
    true,   -- contract_expiring
    true,   -- payout_request
    false,  -- payout_threshold
    true,   -- revenue_milestone
    false,  -- new_user
    true,   -- beta_feedback
    true,   -- crash_spike
    true,   -- login_failed
    false   -- new_device
  ];
  i INT;
BEGIN
  FOR i IN 1..array_length(notification_types, 1) LOOP
    INSERT INTO notification_settings (user_email, notification_type, email_enabled, push_enabled)
    VALUES (p_user_email, notification_types[i], default_email[i], default_push[i])
    ON CONFLICT (user_email, notification_type) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Comment on table
COMMENT ON TABLE notification_settings IS 'Stores notification preferences for admin users';
