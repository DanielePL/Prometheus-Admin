-- ============================================================================
-- Notification System - Logs & Triggers
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. Create notification_log table to track sent notifications
CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  subject TEXT,
  status TEXT DEFAULT 'pending', -- pending, sent, failed, skipped
  email_id TEXT, -- ID from email provider (Resend)
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notification_log DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_notification_log_recipient
  ON notification_log(recipient_email);
CREATE INDEX IF NOT EXISTS idx_notification_log_type
  ON notification_log(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_log_created
  ON notification_log(created_at DESC);

-- 2. Add assignee fields to tasks table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE tasks ADD COLUMN assigned_to TEXT;
    ALTER TABLE tasks ADD COLUMN assigned_by TEXT;
    ALTER TABLE tasks ADD COLUMN assigned_at TIMESTAMPTZ;
  END IF;
END $$;

-- 3. Team members lookup table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;

-- Insert team members
INSERT INTO team_members (email, name, role) VALUES
  ('management@prometheus.coach', 'Daniele', 'super_admin'),
  ('admin@prometheus.coach', 'Karin', 'admin'),
  ('campus@prometheus.coach', 'Sjoerd', 'campus'),
  ('partners@prometheus.coach', 'Valerie', 'partner_manager'),
  ('lab@prometheus.coach', 'Basil', 'lab')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- 4. Function to send notification via Edge Function
-- This can be called from triggers or manually
CREATE OR REPLACE FUNCTION send_notification(
  p_to_email TEXT,
  p_notification_type TEXT,
  p_subject TEXT DEFAULT NULL,
  p_data JSONB DEFAULT '{}'
)
RETURNS void AS $$
DECLARE
  v_to_name TEXT;
BEGIN
  -- Get recipient name
  SELECT name INTO v_to_name
  FROM team_members
  WHERE email = p_to_email;

  -- Insert into notification queue (Edge Function will pick this up)
  -- Or you can call the Edge Function directly via pg_net extension
  INSERT INTO notification_log (
    recipient_email,
    notification_type,
    subject,
    status,
    metadata
  ) VALUES (
    p_to_email,
    p_notification_type,
    p_subject,
    'pending',
    jsonb_build_object(
      'to_name', v_to_name,
      'data', p_data
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger function for task assignment notifications
CREATE OR REPLACE FUNCTION notify_task_assigned()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify if assigned_to changed and is not null
  IF (TG_OP = 'UPDATE' AND NEW.assigned_to IS NOT NULL AND
      (OLD.assigned_to IS NULL OR OLD.assigned_to != NEW.assigned_to))
     OR (TG_OP = 'INSERT' AND NEW.assigned_to IS NOT NULL) THEN

    PERFORM send_notification(
      NEW.assigned_to,
      'task_assigned',
      'Task assigned: ' || COALESCE(NEW.title, 'New Task'),
      jsonb_build_object(
        'task_id', NEW.id,
        'task_title', NEW.title,
        'task_description', NEW.description,
        'assigned_by', NEW.assigned_by,
        'due_date', NEW.due_date,
        'task_url', 'https://admin.prometheus.coach/tasks'
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger on tasks table (if tasks table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks') THEN
    DROP TRIGGER IF EXISTS task_assigned_notification ON tasks;
    CREATE TRIGGER task_assigned_notification
      AFTER INSERT OR UPDATE OF assigned_to ON tasks
      FOR EACH ROW
      EXECUTE FUNCTION notify_task_assigned();
  END IF;
END $$;

-- 7. Comments
COMMENT ON TABLE notification_log IS 'Tracks all sent notifications';
COMMENT ON TABLE team_members IS 'Team members who can receive notifications';
COMMENT ON FUNCTION send_notification IS 'Queue a notification to be sent';
