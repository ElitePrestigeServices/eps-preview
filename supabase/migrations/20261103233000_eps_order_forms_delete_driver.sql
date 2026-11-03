grant delete on public.eps_order_forms to authenticated;
-- Bons de commande visibles par le chauffeur qui a accepté la course (sans le prix client).
create or replace function public.eps_driver_order_forms()
returns table(id uuid, number text, reservation_id uuid, booked_at timestamptz, customer_name text, customer_phone text, service_type text,
  pickup_date date, pickup_time time, pickup_place text, destination text, duration_hours numeric, passengers int, flight_number text, vehicle text, notes text, created_at timestamptz)
language sql stable security definer set search_path to ''
as $$
  select o.id, o.number, o.reservation_id, o.booked_at, o.customer_name, o.customer_phone, o.service_type, o.pickup_date, o.pickup_time, o.pickup_place,
         o.destination, o.duration_hours, o.passengers, o.flight_number, o.vehicle, o.notes, o.created_at
  from public.eps_order_forms o
  join public.eps_chauffeur_missions m on m.reservation_id = o.reservation_id and m.status = 'acceptée'
  join public.eps_chauffeur_profiles p on lower(p.email) = lower(m.chauffeur_email)
  where p.user_id = auth.uid() and p.status = 'approved' and o.cancelled_at is null
$$;
revoke all on function public.eps_driver_order_forms() from public, anon;
grant execute on function public.eps_driver_order_forms() to authenticated;
