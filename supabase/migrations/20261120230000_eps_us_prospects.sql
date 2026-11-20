-- Prospection USA d'EPS (20/11/2026, validée par Anthony) : table séparée du CRM.
-- Le robot français (eps-crm-prospecting) et ses campagnes ne lisent jamais cette table.
create table if not exists public.eps_us_prospects (
  id uuid primary key default gen_random_uuid(),
  company text not null check (char_length(company) between 2 and 160),
  first_name text,
  email text not null check (email ~* '^[^@\s<>]+@[^@\s<>]+\.[a-z]{2,}$'),
  segment text not null check (segment in ('travel_advisor','tour_operator','lions','wedding')),
  website text,
  city text,
  source text,
  status text not null default 'à valider' check (status in ('à valider','prêt','envoyé','relancé','répondu','désinscrit','écarté','erreur')),
  sent_at timestamptz,
  followup_at timestamptz,
  replied_at timestamptz,
  last_error text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- jamais de concurrents : VTC, limousine, taxi, chauffeurs, EDEN CAB, frenchriviera-tours.com
  constraint eps_us_no_competitors check (
    lower(company || ' ' || coalesce(website,'') || ' ' || email)
      !~ '(limo|limousine|chauffeur|taxi|\mvtc\M|\mcab\M|eden ?cab|edencab|frenchriviera-tours|black ?car|car service|blacklane|uber)'
  )
);
create unique index if not exists eps_us_prospects_email_uq on public.eps_us_prospects (lower(email));
create index if not exists eps_us_prospects_status_idx on public.eps_us_prospects (status);
alter table public.eps_us_prospects enable row level security;
create policy eps_us_prospects_admin on public.eps_us_prospects for all to authenticated
  using ((select public.eps_is_admin())) with check ((select public.eps_is_admin()));
revoke all on public.eps_us_prospects from anon;
grant select, insert, update, delete on public.eps_us_prospects to authenticated;

-- Réglages : les envois restent coupés tant qu'Anthony n'a pas donné son feu vert final.
create table if not exists public.eps_us_outreach_settings (
  id int primary key default 1 check (id = 1),
  sending_enabled boolean not null default false,
  daily_limit int not null default 15 check (daily_limit between 1 and 40),
  updated_at timestamptz not null default now()
);
insert into public.eps_us_outreach_settings (id) values (1) on conflict (id) do nothing;
alter table public.eps_us_outreach_settings enable row level security;
create policy eps_us_outreach_settings_admin on public.eps_us_outreach_settings for all to authenticated
  using ((select public.eps_is_admin())) with check ((select public.eps_is_admin()));
revoke all on public.eps_us_outreach_settings from anon;
grant select, update on public.eps_us_outreach_settings to authenticated;

-- Clé du déclencheur automatique, rangée dans le coffre (jamais dans le dépôt).
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'eps_us_outreach_cron_key') then
    perform vault.create_secret(encode(extensions.gen_random_bytes(24),'hex'), 'eps_us_outreach_cron_key');
  end if;
end $$;

-- Toutes les 20 minutes, du lundi au vendredi, de 13 h à 16 h UTC (14 h–17 h Paris l'hiver) ;
-- la fonction vérifie elle-même la fenêtre 15 h–17 h heure de Paris et le feu vert.
select cron.schedule('eps-us-outreach', '*/20 13-16 * * 1-5', $c$
  select net.http_post(
    url := 'https://lrtuztxjngdvrnjuwxfr.supabase.co/functions/v1/eps-us-outreach',
    headers := jsonb_build_object('Content-Type','application/json',
      'x-eps-cron', (select decrypted_secret from vault.decrypted_secrets where name='eps_us_outreach_cron_key')),
    body := '{}'::jsonb);
$c$);
