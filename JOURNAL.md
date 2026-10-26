# Journal EPS

## 26/10/2026 — ChatGPT — Correction SEO de publication

- Autorisation d’Anthony : « Corrige les ! », après audit des alertes Search Console du 25/10.
- `scripts/prepare_production_seo.py` transforme uniquement la copie de publication o2switch : supprime les directives contradictoires/noindex des 68 URL commerciales déjà présentes dans les deux sitemaps ; fixe les canoniques et les liens GitHub de préproduction ; retire les anciennes mentions de réservations inactives de ces pages.
- Les deux sitemaps de la copie publiée sont alignés sur les mêmes URL canoniques ; le sitemap principal ne se limite plus à 11 pages. Espaces privés et tests restent noindex et hors sitemap. Les fichiers HTML sources de prévisualisation restent inchangés.
- Le workflow prépare et vérifie cette copie avant le transfert, puis contrôle l’accueil, une page aviation, une page EN et le sitemap sur le vrai domaine. Aucun identifiant, dossier FTP ou réglage de réservation/CRM/Supabase n’est changé.
- Validation locale : génération complète et vérification des 68 pages ; contrôle des exclusions privées ; tests de rejet d’une régression noindex et d’une canonique incorrecte.
- La réussite GitHub seule ne prouve pas une publication effective : se reporter au contrôle HTTP final du workflow. Google devra ensuite explorer de nouveau les pages.
