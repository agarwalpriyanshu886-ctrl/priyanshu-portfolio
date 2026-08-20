-- ============================================================
-- 0003_functions.sql — Database Stored Procedures & Helper RPCs
-- ============================================================

-- Function: log_audit_event
create or replace function public.log_audit_event(
  p_action text,
  p_module text,
  p_record_id text default '',
  p_metadata jsonb default '{}'
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_log_id uuid;
  v_admin_email text := '';
begin
  if auth.uid() is not null then
    select email into v_admin_email from public.profiles where id = auth.uid();
  end if;

  insert into public.audit_logs (admin_id, admin_email, action, module, record_id, metadata)
  values (auth.uid(), coalesce(v_admin_email, ''), p_action, p_module, p_record_id, p_metadata)
  returning id into v_log_id;

  return v_log_id;
end;
$$;

-- Function: record_content_revision
create or replace function public.record_content_revision(
  p_entity_type text,
  p_record_id uuid,
  p_snapshot jsonb
)
returns integer
language plpgsql
security definer
as $$
declare
  v_next_version integer;
begin
  select coalesce(max(version_number), 0) + 1 into v_next_version
  from public.content_revisions
  where entity_type = p_entity_type and record_id = p_record_id;

  insert into public.content_revisions (entity_type, record_id, version_number, snapshot, created_by)
  values (p_entity_type, p_record_id, v_next_version, p_snapshot, auth.uid());

  return v_next_version;
end;
$$;

-- Function: check_media_usage
create or replace function public.check_media_usage(p_media_id uuid)
returns table (
  usage_id uuid,
  entity_type text,
  entity_id uuid,
  field_name text
)
language sql
security definer
as $$
  select id as usage_id, entity_type, entity_id, field_name
  from public.media_usage
  where media_id = p_media_id;
$$;
