-- ============================================================
-- 0001_schema.sql — Portfolio CMS schema
-- PostgreSQL (Supabase). Run in order.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- shared helpers ----------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ---------- profiles ----------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text default '',
  avatar_url text default '',
  role text not null default 'VISITOR'
    check (role in ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VISITOR')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- admin_users ----------

create table public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('SUPER_ADMIN', 'ADMIN', 'EDITOR')),
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger admin_users_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();

-- ---------- site_settings (single row, fixed id) ----------

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text default 'Priyanshu Agarwal',
  site_title text default 'Priyanshu Agarwal — AI/ML Engineer & Full-Stack Developer',
  site_description text default 'Portfolio of Priyanshu Agarwal — building intelligent, scalable and visually impressive digital experiences.',
  owner_name text default 'Priyanshu Agarwal',
  email text default 'priyanshu@example.com',
  phone text default '',
  location text default 'Jaipur, Rajasthan, India',
  timezone text default 'Asia/Kolkata',

  maintenance_mode boolean not null default false,
  maintenance_message text default 'The site is under scheduled maintenance. Please check back soon.',

  seo_title text,
  seo_description text,
  seo_keywords text[] default '{}',
  og_title text,
  og_description text,
  og_image text,
  twitter_handle text default '',
  favicon_url text default '',
  robots text default 'index,follow',

  appearance jsonb not null default '{}',

  github_username text default '',
  github_enabled boolean not null default false,