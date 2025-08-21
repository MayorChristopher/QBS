-- Disable email confirmation for Supabase auth
-- This allows users to sign up without email verification

-- Update auth configuration to disable email confirmation
UPDATE auth.config 
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'),
  '{enable_confirmations}',
  'false'
)
WHERE instance_id = '00000000-0000-0000-0000-000000000000';

-- Alternative approach: Update the auth settings directly
-- Note: This may need to be done via Supabase dashboard or API
-- INSERT INTO auth.config (instance_id, raw_app_meta_data) 
-- VALUES ('00000000-0000-0000-0000-000000000000', '{"enable_confirmations": false}')
-- ON CONFLICT (instance_id) DO UPDATE SET 
-- raw_app_meta_data = jsonb_set(
--   COALESCE(auth.config.raw_app_meta_data, '{}'),
--   '{enable_confirmations}',
--   'false'
-- );
