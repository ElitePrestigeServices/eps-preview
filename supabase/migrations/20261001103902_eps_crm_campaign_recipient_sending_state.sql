alter table public.eps_crm_campaign_recipients
  drop constraint if exists eps_crm_campaign_recipients_status_check;

alter table public.eps_crm_campaign_recipients
  add constraint eps_crm_campaign_recipients_status_check
  check (status = any (array[
    'à contacter'::text,
    'en cours'::text,
    'envoyé'::text,
    'échec'::text,
    'désinscrit'::text
  ]));
