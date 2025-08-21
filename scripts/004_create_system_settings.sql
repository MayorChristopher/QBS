-- Create system_settings table for admin configuration
create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value jsonb not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.system_settings enable row level security;

-- Only admins can manage system settings
create policy "system_settings_admin_only"
  on public.system_settings for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert default settings
insert into public.system_settings (setting_key, setting_value, description) values
  ('max_simulation_duration', '1440', 'Maximum simulation duration in minutes (24 hours)'),
  ('max_servers', '20', 'Maximum number of servers allowed in a simulation'),
  ('default_arrival_rate', '5.0', 'Default arrival rate (customers per minute)'),
  ('default_service_rate', '6.0', 'Default service rate (customers per minute per server)')
on conflict (setting_key) do nothing;
