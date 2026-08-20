-- ============================================================
-- 0002_rls.sql — Row Level Security policies
-- Run after 0001_schema.sql
-- ============================================================

-- ---------- role helper functions ----------
-- SECURITY DEFINER functions run as the table owner, so reading
-- admin_users here does not recurse into the policies below.

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and role = 'SUPER_ADMIN' and is_active
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and role in ('SUPER_ADMIN', 'ADMIN') and is_active
  );
$$;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and role in ('SUPER_ADMIN', 'ADMIN', 'EDITOR') and is_active
  );
$$;

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.admin_users where id = auth.uid();
$$;

-- ---------- enable RLS ----------

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.about enable row level security;
alter table public.about_stats enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.achievements enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.media enable row level security;
alter table public.navigation_items enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_messages enable row level security;
alter table public.analytics_events enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- ============================================================
-- PUBLIC (anonymous) policies — read published content only
-- ============================================================

create policy "Public read settings" on public.site_settings
  for select to anon, authenticated using (true);

create policy "Public read visible homepage sections" on public.homepage_sections
  for select to anon, authenticated using (is_visible = true);

create policy "Public read about" on public.about
  for select to anon, authenticated using (true);

create policy "Public read about stats" on public.about_stats
  for select to anon, authenticated using (true);

create policy "Public read skill categories" on public.skill_categories
  for select to anon, authenticated using (true);

create policy "Public read published skills" on public.skills
  for select to anon, authenticated using (status = 'PUBLISHED');

create policy "Public read published projects" on public.projects
  for select to anon, authenticated
  using (status = 'PUBLISHED' and (published_at is null or published_at <= now()));

create policy "Public read project images" on public.project_images
  for select to anon, authenticated using (true);

create policy "Public read published experience" on public.experience
  for select to anon, authenticated using (status = 'PUBLISHED');

create policy "Public read published education" on public.education
  for select to anon, authenticated using (status = 'PUBLISHED');

create policy "Public read published certifications" on public.certifications
  for select to anon, authenticated using (status = 'PUBLISHED');

create policy "Public read published achievements" on public.achievements
  for select to anon, authenticated using (status = 'PUBLISHED');

create policy "Public read published services" on public.services
  for select to anon, authenticated using (status = 'PUBLISHED');

create policy "Public read approved testimonials" on public.testimonials
  for select to anon, authenticated
  using (status = 'PUBLISHED' and moderation = 'APPROVED');

create policy "Public read published blog posts" on public.blog_posts
  for select to anon, authenticated
  using (
    status = 'PUBLISHED'
    and (scheduled_for is null or scheduled_for <= now())
    and (published_at is null or published_at <= now())
  );

create policy "Public read blog categories" on public.blog_categories
  for select to anon, authenticated using (true);

create policy "Public read blog tags" on public.blog_tags
  for select to anon, authenticated using (true);

create policy "Public read visible navigation" on public.navigation_items
  for select to anon, authenticated using (is_visible = true);

create policy "Public read active social links" on public.social_links
  for select to anon, authenticated using (is_active = true);

-- ---------- anonymous inserts (form submissions & tracking) ----------

create policy "Visitors can submit contact messages"
  on public.contact_messages for insert to anon, authenticated
  with check (
    status = 'UNREAD'
    and char_length(name) between 1 and 120
    and char_length(email) between 3 and 254
    and char_length(subject) between 1 and 200
    and char_length(message) between 1 and 10000
  );

create policy "Track page views (anon)"
  on public.analytics_events for insert to anon, authenticated
  with check (
    event_type in ('page_view', 'project_view', 'blog_view', 'contact_submission')
    and char_length(coalesce(path, '')) < 500
    and char_length(coalesce(user_agent, '')) < 400
    and char_length(coalesce(referrer, '')) < 500
  );

-- ============================================================
-- AUTHENTICATED / admin policies
-- ============================================================

-- profiles: user manages own, admins read all
create policy "Users manage own profile" on public.profiles
  for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "Admins read profiles" on public.profiles
  for select to authenticated using (public.is_admin());

-- admin_users: super admin manages, any admin reads own
create policy "Admin reads own role" on public.admin_users
  for select to authenticated using (id = auth.uid());

create policy "Super admin manages admins" on public.admin_users
  for all to authenticated
  using (public.is_super_admin()) with check (public.is_super_admin());

-- content tables: editors and above can manage everything
do $$
declare t text;
begin
  foreach t in array array[
    'homepage_sections', 'about', 'about_stats', 'skill_categories', 'skills',
    'projects', 'project_images', 'experience', 'education', 'certifications',
    'achievements', 'services', 'testimonials', 'blog_categories', 'blog_tags',
    'blog_posts', 'navigation_items', 'social_links', 'media'
  ]
  loop
    execute format(
      'create policy "Editors manage %I" on public.%I for all to authenticated using (public.is_editor()) with check (public.is_editor());',
      t, t
    );
  end loop;
end;
$$;

-- site_settings: admins manage
create policy "Admins manage settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- contact messages: admins manage (visitors insert above)
create policy "Admins manage messages" on public.contact_messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- analytics: admins read, no delete (retention handled in-app)
create policy "Admins read analytics" on public.analytics_events
  for select to authenticated using (public.is_admin());

-- notifications: admins read + update (mark read)
create policy "Admins read notifications" on public.notifications
  for select to authenticated using (public.is_admin());

create policy "Admins update notifications" on public.notifications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- audit logs: admins read only; writes happen via security-definer trigger
create policy "Admins read audit logs" on public.audit_logs
  for select to authenticated using (public.is_admin());

-- ============================================================
-- STORAGE
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public read media" on storage.objects
  for select using (bucket_id = 'media');

create policy "Editors upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_editor());

create policy "Editors update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_editor())
  with check (bucket_id = 'media');

create policy "Editors delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_editor());

-- ============================================================
-- Grants
-- ============================================================

grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon;
grant insert on public.contact_messages, public.analytics_events to anon;
grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;
