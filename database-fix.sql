-- Fix foreign key relationship between simulation_runs and profiles
-- This script should be run in your Supabase SQL editor

-- First, drop the existing foreign key constraint
ALTER TABLE simulation_runs 
DROP CONSTRAINT IF EXISTS simulation_runs_user_id_fkey;

-- Add the correct foreign key constraint to reference profiles table
ALTER TABLE simulation_runs 
ADD CONSTRAINT simulation_runs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update any existing simulation_runs records to ensure they reference valid profile IDs
-- (This assumes all users in auth.users have corresponding profiles)
-- If there are orphaned records, you may need to handle them separately

-- Verify the relationship works
-- SELECT sr.*, p.full_name, p.email 
-- FROM simulation_runs sr 
-- JOIN profiles p ON sr.user_id = p.id 
-- LIMIT 5;