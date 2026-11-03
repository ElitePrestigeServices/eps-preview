-- Bons de commande VTC (justificatif de réservation préalable), réservés à l'admin EPS.
create sequence if not exists public.eps_order_form_seq;
create table if not exists public.eps_order_forms (
  id uuid primary key default gen_random_uuid(),
  number text unique not null default ('BC-' || to_char(now() at time zone 'Europe/Paris','YYYY') || '-' || lpad(nextval('public.eps_order_form_seq')::text, 4, '0')),
  reservation_id uuid references public.eps_reservations(id) on delete set null,
  booked_at timestamptz not null default now(),
  customer_name text not null check (length(customer_name) between 2 and 120),
  customer_phone text not null check (length(customer_phone) between 6 and 30),
  customer_email text,
  service_type text not null default 'Transfert',
  pickup_date date not null,
  pickup_time time not null,
  pickup_place text not null check (length(pickup_place) between 2 and 200),
  destination text, duration_hours numeric, passengers int check (passengers between 1 and 8),
  flight_number text, vehicle text, plate text, driver_name text,
  price_cents int check (price_cents is null or price_cents >= 0), payment_method text, partner_code text, notes text,
  cancelled_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists eps_order_forms_pickup_idx on public.eps_order_forms (pickup_date desc);
create index if not exists eps_order_forms_res_idx on public.eps_order_forms (reservation_id);
alter table public.eps_order_forms enable row level security;
drop policy if exists eps_admin_only on public.eps_order_forms;
create policy eps_admin_only on public.eps_order_forms for all to authenticated using ((select public.eps_is_admin())) with check ((select public.eps_is_admin()));
revoke all on public.eps_order_forms from anon;
grant select, insert, update on public.eps_order_forms to authenticated;
grant all on public.eps_order_forms to service_role;
grant usage on sequence public.eps_order_form_seq to authenticated, service_role;
