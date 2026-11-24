-- 24/11/2026 : numéro de devis daté (DV-AAMM-JJHHMI, heure de Paris) au lieu d'un compteur DV-AAAA-0001.
alter table public.eps_devis alter column number set default ('DV-' || to_char(now() at time zone 'Europe/Paris', 'YYMM-DDHH24MI'));
update public.eps_devis set number = 'DV-' || to_char(created_at at time zone 'Europe/Paris', 'YYMM-DDHH24MI') where number = 'DV-2026-0001';
