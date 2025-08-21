-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic admin policy
drop policy if exists "profiles_admin_select_all" on public.profiles;

-- Create a simpler admin policy that doesn't cause recursion
-- Admins can be identified by checking auth.jwt() claims or using a different approach
create policy "profiles_admin_select_all"
  on public.profiles for select
  using (
    (auth.jwt() ->> 'role')::text = 'admin' OR
    auth.uid() = id
  );

-- Allow admins to update any profile
create policy "profiles_admin_update_all"
  on public.profiles for update
  using (
    (auth.jwt() ->> 'role')::text = 'admin' OR
    auth.uid() = id
  );

-- Allow admins to insert profiles for others
create policy "profiles_admin_insert_all"
  on public.profiles for insert
  with check (
    (auth.jwt() ->> 'role')::text = 'admin' OR
    auth.uid() = id
  );
