-- Create queue_events table to store individual customer events during simulation
create table if not exists public.queue_events (
  id uuid primary key default gen_random_uuid(),
  simulation_run_id uuid not null references public.simulation_runs(id) on delete cascade,
  customer_id integer not null,
  event_type text not null check (event_type in ('arrival', 'service_start', 'service_end', 'departure')),
  event_time numeric(10,4) not null, -- time in minutes from simulation start
  server_id integer, -- null for arrival events
  queue_length integer not null default 0,
  wait_time numeric(10,4), -- null until service starts
  service_time numeric(10,4), -- null until service completes
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.queue_events enable row level security;

-- Create policies for queue_events (users can only see events from their own simulations)
create policy "queue_events_select_own"
  on public.queue_events for select
  using (
    exists (
      select 1 from public.simulation_runs sr
      where sr.id = queue_events.simulation_run_id
      and sr.user_id = auth.uid()
    )
  );

create policy "queue_events_insert_own"
  on public.queue_events for insert
  with check (
    exists (
      select 1 from public.simulation_runs sr
      where sr.id = queue_events.simulation_run_id
      and sr.user_id = auth.uid()
    )
  );

-- Allow admins to view all queue events
create policy "queue_events_admin_select_all"
  on public.queue_events for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create index for better performance
create index if not exists idx_queue_events_simulation_run_id on public.queue_events(simulation_run_id);
create index if not exists idx_queue_events_event_time on public.queue_events(event_time);
