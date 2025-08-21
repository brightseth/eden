-- Follow and Notifications System Schema

-- User follows relationship
CREATE TABLE IF NOT EXISTS user_follows (
  user_id TEXT NOT NULL,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  followed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, agent_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS user_follows_agent ON user_follows(agent_id);
CREATE INDEX IF NOT EXISTS user_follows_user ON user_follows(user_id);

-- Notifications queue/inbox
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT NOT NULL,  -- agent.update | mint.created | curation.verdict | sale.executed | follow.added
  agent_id TEXT,
  payload JSONB NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS notifications_user_ts ON notifications(user_id, ts DESC);
CREATE INDEX IF NOT EXISTS notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS notifications_type ON notifications(type);

-- User preferences for notifications
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id TEXT PRIMARY KEY,
  email_enabled BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  digest_enabled BOOLEAN DEFAULT TRUE,
  digest_hour INT DEFAULT 8, -- Hour of day for daily digest (0-23)
  
  -- Granular preferences per event type
  notify_curation_verdict BOOLEAN DEFAULT TRUE,
  notify_sale_executed BOOLEAN DEFAULT TRUE,
  notify_mint_created BOOLEAN DEFAULT TRUE,
  notify_follow_added BOOLEAN DEFAULT FALSE,
  notify_agent_update BOOLEAN DEFAULT TRUE,
  
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Daily digest tracking
CREATE TABLE IF NOT EXISTS digest_sent (
  user_id TEXT NOT NULL,
  sent_date DATE NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notification_count INT DEFAULT 0,
  PRIMARY KEY (user_id, sent_date)
);

-- Function to fan out notifications to followers
CREATE OR REPLACE FUNCTION fanout_to_followers(
  p_agent_id TEXT,
  p_event_type TEXT,
  p_event_payload JSONB
)
RETURNS void AS $$
DECLARE
  follower RECORD;
BEGIN
  -- Get all followers of this agent
  FOR follower IN 
    SELECT user_id 
    FROM user_follows 
    WHERE agent_id = p_agent_id
  LOOP
    -- Check user preferences for this event type
    IF EXISTS (
      SELECT 1 FROM notification_preferences
      WHERE user_id = follower.user_id
      AND (
        (p_event_type = 'CURATION_VERDICT' AND notify_curation_verdict = TRUE) OR
        (p_event_type = 'SALE_EXECUTED' AND notify_sale_executed = TRUE) OR
        (p_event_type = 'MINT_CREATED' AND notify_mint_created = TRUE) OR
        (p_event_type = 'FOLLOW_ADDED' AND notify_follow_added = TRUE) OR
        (p_event_type = 'AGENT_UPDATE' AND notify_agent_update = TRUE)
      )
    ) OR NOT EXISTS (
      SELECT 1 FROM notification_preferences WHERE user_id = follower.user_id
    ) THEN
      -- Insert notification
      INSERT INTO notifications (user_id, type, agent_id, payload)
      VALUES (follower.user_id, p_event_type, p_agent_id, p_event_payload);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-fanout on agent events
CREATE OR REPLACE FUNCTION trigger_fanout_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fanout for specific event types
  IF NEW.type IN ('CURATION_VERDICT', 'SALE_EXECUTED', 'MINT_CREATED', 'AGENT_UPDATE') THEN
    PERFORM fanout_to_followers(NEW.agent_id, NEW.type, NEW.payload);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on agent_events table
DROP TRIGGER IF EXISTS fanout_notifications_trigger ON agent_events;
CREATE TRIGGER fanout_notifications_trigger
  AFTER INSERT ON agent_events
  FOR EACH ROW
  EXECUTE FUNCTION trigger_fanout_notifications();

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_count(p_user_id TEXT)
RETURNS INT AS $$
  SELECT COUNT(*)::INT 
  FROM notifications 
  WHERE user_id = p_user_id AND read = FALSE;
$$ LANGUAGE sql;

-- Function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_read(
  p_user_id TEXT,
  p_notification_ids UUID[]
)
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET read = TRUE, read_at = now()
  WHERE user_id = p_user_id 
  AND id = ANY(p_notification_ids)
  AND read = FALSE;
END;
$$ LANGUAGE plpgsql;