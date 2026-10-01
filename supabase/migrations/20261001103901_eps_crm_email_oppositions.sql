create table if not exists public.eps_crm_email_oppositions (
  email text primary key check (email = lower(btrim(email))),
  contact_id uuid references public.eps_crm_contacts(id) on delete set null,
  reason text not null default 'Opposition',
  created_at timestamptz not null default now()
);

alter table public.eps_crm_email_oppositions enable row level security;
grant select, insert, update, delete on public.eps_crm_email_oppositions to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'eps_crm_email_oppositions'
      and policyname = 'eps_admin_only'
  ) then
    create policy eps_admin_only
      on public.eps_crm_email_oppositions
      for all
      to authenticated
      using ((select public.eps_is_admin()))
      with check ((select public.eps_is_admin()));
  end if;
end
$$;
