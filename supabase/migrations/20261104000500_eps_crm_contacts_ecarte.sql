alter table public.eps_crm_contacts drop constraint eps_crm_contacts_contact_type_check;
alter table public.eps_crm_contacts add constraint eps_crm_contacts_contact_type_check check (contact_type = any (array['prospect','client','entreprise','partenaire','écarté']));
-- 04/11/2026 : Anthony ne prospecte plus l'immobilier (agences, locations de villas).
update public.eps_crm_contacts set contact_type='écarté'
where contact_type='prospect' and (coalesce(notes,'')||' '||coalesce(company_name,'')) ~* 'immobili|location|villa'
  and (coalesce(notes,'')||' '||coalesce(company_name,'')) !~* 'h[oô]tel|palace|resort|concierg';
