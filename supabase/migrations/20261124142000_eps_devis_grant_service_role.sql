-- 24/11/2026 : la fonction eps-send-devis-pdf (clé service) doit pouvoir lire le devis et passer son statut à « envoyé ».
grant select, update on table public.eps_devis to service_role;
