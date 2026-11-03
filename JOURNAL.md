# Journal EPS

## 03/11/2026 — Claude — Reprise de la gestion technique + SEO technique

- Anthony confie la gestion technique complète d’EPS à Claude (site, Supabase EPS, Stripe EPS, CRM). ChatGPT n’intervient plus sauf urgence.
- Fiche « entreprise » structurée (LocalBusiness + TaxiService : adresse 34 rue Borniol Cannes, 24 h/24, zones desservies, langues) ajoutée sur les 74 pages publiques ; l’ancien bloc TaxiService incomplet de l’accueil est remplacé.
- Liens de langue hreflang FR/EN/IT + x-default ajoutés, réciproques, sur les 11 trios de pages traduites (33 pages) ; accueil en fr + x-default.
- Accueil : le nom de la marque dans la bannière devient le titre H1 (rendu visuel identique) avec la mention « Chauffeur privé à Cannes, Nice, Monaco et Saint-Tropez » pour les lecteurs d’écran et Google.
- Vérifié : scripts/prepare_production_seo.py passe (68 URL publiques, pages privées noindex), JSON-LD valide.
- Robot de prospection (Supabase, fonction eps-crm-prospecting v11) : envoi par lots de 20 (la v8 était coupée à 150 s), jours ouvrés seulement, 2 essais max par adresse, rapport quotidien et alerte « token Gmail » par e-mail. Le GMAIL_REFRESH_TOKEN reste à renouveler (expiré).
- Ajout sur les 74 pages : barre fixe mobile « Réserver » + « WhatsApp » et bouton WhatsApp flottant sur ordinateur (wa.me/33745495321, message prérempli avec la page). Choix d’Anthony : WhatsApp seulement, pas d’appel. Téléphone ajouté dans la fiche entreprise structurée.
- BUG corrigé : les liens internes « /eps-preview/… » (144 liens, 53 pages) donnaient une 404 sur le vrai domaine (constaté par Anthony). scripts/prepare_production_seo.py les réécrit désormais en « /… » dans la copie publiée, et la vérification bloque la publication s’il en reste un.
- Reste à faire, enrichir les pages (67/74 sous 400 mots), titres trop longs, demande d’avis Google après course.

## 26/10/2026 — ChatGPT — Correction SEO de publication

- Autorisation d’Anthony : « Corrige les ! », après audit des alertes Search Console du 25/10.
- `scripts/prepare_production_seo.py` transforme uniquement la copie de publication o2switch : supprime les directives contradictoires/noindex des 68 URL commerciales déjà présentes dans les deux sitemaps ; fixe les canoniques et les liens GitHub de préproduction ; retire les anciennes mentions de réservations inactives de ces pages.
- Les deux sitemaps de la copie publiée sont alignés sur les mêmes URL canoniques ; le sitemap principal ne se limite plus à 11 pages. Espaces privés et tests restent noindex et hors sitemap. Les fichiers HTML sources de prévisualisation restent inchangés.
- Le workflow prépare et vérifie cette copie avant le transfert, puis contrôle l’accueil, une page aviation, une page EN et le sitemap sur le vrai domaine. Aucun identifiant, dossier FTP ou réglage de réservation/CRM/Supabase n’est changé.
- Validation locale : génération complète et vérification des 68 pages ; contrôle des exclusions privées ; tests de rejet d’une régression noindex et d’une canonique incorrecte.
- La réussite GitHub seule ne prouve pas une publication effective : se reporter au contrôle HTTP final du workflow. Google devra ensuite explorer de nouveau les pages.

- Première publication arrêtée avant transfert : lftp refusait la chaîne du certificat FTPS (« issuer unknown »). Configuration explicite du magasin CA système et rafraîchissement des CA, sans désactiver la vérification TLS.

- Le magasin système seul ne suffit pas pour la chaîne YR1 présentée par le serveur. Ajout dans le bundle FTPS des certificats officiels Let’s Encrypt YR1 et Root YR croisée par X1, uniquement après validation OpenSSL contre les racines Ubuntu existantes. Source : https://letsencrypt.org/certificates/. La validation du certificat et du nom d’hôte reste active.

- **Publication confirmée le 26/10/2026** : workflow 40323323230 réussi (commit c4201aba85de0ff0cb8aa103b027e0dddd4b759b). Contrôle HTTP indépendant après publication : **68/68 URL publiques en 200, une canonique correcte, aucune directive noindex/nofollow et aucun lien vers la préproduction**. Les deux sitemaps servis sont identiques. Vérification publique des exclusions /admin/ et /client/ également réussie. Le résultat n'est pas une confirmation de réindexation par Google, qui nécessite une nouvelle exploration.

## 26/10/2026 — ChatGPT — Traduction anglaise accueil

- Correction de `locale.js` : ajout des traductions manquantes des cartes/pastilles Services et Flotte, modèles Mercedes, capacités passagers/bagages, boutons RÉSERVER / EN SAVOIR PLUS et libellés/accessibilité associés.
- Aucun tarif, réservation, CRM, Supabase ou contenu SEO structurel modifié.
