-- Create simulation_runs table to store simulation parameters and results
create table if not exists public.simulation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  
  -- Simulation parameters
  arrival_rate numeric(10,4) not null check (arrival_rate > 0), -- customers per minute
  service_rate numeric(10,4) not null check (service_rate > 0), -- customers per minute per server
  num_servers integer not null check (num_servers > 0),
  simulation_duration integer not null check (simulation_duration > 0), -- minutes
  
  -- Results
  total_customers integer,
  avg_wait_time numeric(10,4),
  avg_queue_length numeric(10,4),
  max_queue_length integer,
  server_utilization numeric(5,4),
  
  -- Status and timestamps
  status text default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.simulation_runs enable row level security;

-- Create policies for simulation_runs
create policy "simulation_runs_select_own"
  on public.simulation_runs for select
  using (auth.uid() = user_id);

create policy "simulation_runs_insert_own"
  on public.simulation_runs for insert
  with check (auth.uid() = user_id);

create policy "simulation_runs_update_own"
  on public.simulation_runs for update
  using (auth.uid() = user_id);

create policy "simulation_runs_delete_own"
  on public.simulation_runs for delete
  using (auth.uid() = user_id);

-- Allow admins to view all simulation runs
create policy "simulation_runs_admin_select_all"
  on public.simulation_runs for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
