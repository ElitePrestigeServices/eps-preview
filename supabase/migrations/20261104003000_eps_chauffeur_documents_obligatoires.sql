-- 04/11/2026 : dossier chauffeur = 11 pièces obligatoires (ajout permis recto/verso, inscription registre VTC, Kbis/SIRET).
alter table public.eps_chauffeur_documents drop constraint eps_chauffeur_documents_document_type_check;
alter table public.eps_chauffeur_documents add constraint eps_chauffeur_documents_document_type_check check (document_type = any (array['carte_vtc','carte_vtc_verso','permis_recto','permis_verso','rc_pro','assurance_auto','carte_grise','registre_vtc','identite_siret','identite_recto','identite_verso']));
alter table public.eps_chauffeur_documents drop constraint eps_required_document_expiry;
alter table public.eps_chauffeur_documents add constraint eps_required_document_expiry check (document_type <> all (array['carte_vtc','rc_pro','assurance_auto','registre_vtc']) or expires_on is not null);
-- eps_chauffeur_documents_current et eps_review_chauffeur : voir migration appliquée le 04/11/2026 (liste des 11 pièces).
