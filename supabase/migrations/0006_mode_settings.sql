-- 0006_mode_settings.sql — Dual-mode portfolio settings

create table if not exists public.mode_settings (
  id text primary key,
  default_mode text not null default 'DEVELOPER'
    check (default_mode in ('DEVELOPER', 'CREATIVE')),
  enable_mode_persistence boolean not null default true,
  intro_mode text not null default 'FIRST_VISIT'
    check (intro_mode in ('DISABLED', 'FIRST_VISIT', 'ALWAYS')),
  transition_duration_ms integer not null default 1000
    check (transition_duration_ms between 0 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.mode_settings (id)
values ('default')
on conflict (id) do nothing;

alter table public.mode_settings enable row level security;

drop policy if exists "Anyone can read mode settings" on public.mode_settings;
create policy "Anyone can read mode settings"
  on public.mode_settings for select
  using (true);

drop policy if exists "Authenticated users can manage mode settings" on public.mode_settings;
create policy "Authenticated users can manage mode settings"
  on public.mode_settings for all
  to authenticated
  using (true)
  with check (true);

drop trigger if exists mode_settings_updated_at on public.mode_settings;
create trigger mode_settings_updated_at
  before update on public.mode_settings
  for each row execute function public.set_updated_at();