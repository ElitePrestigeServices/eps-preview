-- Carnet de clients de l'admin EPS (remplit les devis et bons de commande)
create table if not exists public.eps_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 120),
  company text,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.eps_clients enable row level security;
create policy eps_admin_only on public.eps_clients for all to authenticated
  using ((select public.eps_is_admin())) with check ((select public.eps_is_admin()));
create index if not exists eps_clients_name_idx on public.eps_clients (lower(name));

-- Reprise des clients déjà saisis dans les devis et bons de commande (un par nom + téléphone)
insert into public.eps_clients (name, company, phone, email, created_at)
select distinct on (lower(trim(name)), coalesce(nullif(regexp_replace(phone, '\D', '', 'g'), ''), lower(coalesce(email, ''))))
       trim(name), company, phone, email, created_at
from (
  select customer_name name, customer_company company, customer_phone phone, customer_email email, created_at from public.eps_devis
  union all
  select customer_name, null, customer_phone, customer_email, created_at from public.eps_order_forms where cancelled_at is null
) s
where length(trim(coalesce(name, ''))) >= 2
order by lower(trim(name)), coalesce(nullif(regexp_replace(phone, '\D', '', 'g'), ''), lower(coalesce(email, ''))), created_at desc;
