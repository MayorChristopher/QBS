-- Create trigger function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger to auto-create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Add updated_at triggers to relevant tables
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger simulation_runs_updated_at
  before update on public.simulation_runs
  for each row
  execute function public.handle_updated_at();

create trigger system_settings_updated_at
  before update on public.system_settings
  for each row
  execute function public.handle_updated_at();
