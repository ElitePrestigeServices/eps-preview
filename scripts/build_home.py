form=open('/tmp/claude-0/form.html').read()
cta=open('/tmp/claude-0/cta.html').read()
WA='https://wa.me/33745495321?text=Bonjour%2C%20je%20souhaite%20un%20devis%20pour%20un%20trajet%20avec%20chauffeur'
WASVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2s.2-1.1.1-1.2l-.5-.3Z"/></svg>'
tickets=[('Aéroport de Nice','Cannes','Aéroport de Nice Côte d’Azur','Cannes',130,'Environ 35 min'),
 ('Aéroport de Nice','Monaco','Aéroport de Nice Côte d’Azur','Monaco',150,'Environ 30 min'),
 ('Cannes','Monaco','Cannes','Monaco',230,'Environ 55 min'),
 ('Cannes','Saint-Tropez','Cannes','Saint-Tropez',320,'Environ 1 h 30')]
T=''.join(f'<button type="button" class="ticket" data-dep="{d}" data-dest="{a}"><span class="from">Prix fixe</span><span class="route"><i>{x}</i><i>{y}</i></span><span class="meta">{m} · berline Business</span><span class="perf" aria-hidden="true"></span><span class="price"><span>Réserver ce trajet</span></span></button>' for x,y,d,a,p,m in tickets)
services=[('aviation-privee-aeroport-nice/','aviation','Transferts aéroports','Aéroport Nice Côte d’Azur et Cannes-Mandelieu, vols commerciaux et aviation d’affaires.'),
 ('hotels-conciergeries-cote-dazur/','hotels','Hôtels & conciergeries','Arrivées et départs des hôtels 5 étoiles et palaces de Cannes, Nice et Monaco.'),
 ('yachting-transferts-ports-cote-dazur/','yachting','Yachting','Ports de Cannes, Antibes, Monaco et Saint-Tropez, à l’heure de votre embarquement.'),
 ('chauffeur-evenements-vip-cote-dazur/','evenements','Événements VIP','Festival de Cannes, congrès, galas, mariages et soirées privées.')]
S=''.join(f'<a class="service" href="{u}"><div class="ph"><img src="assets/v2/{i}.webp" alt="" width="900" height="600" loading="lazy" decoding="async"></div><div class="tx"><h3>{t}</h3><p>{d}</p><span class="more">Découvrir</span></div></a>' for u,i,t,d in services)
cars=[('business-class','Business Class','Mercedes Classe E, EQE ou équivalent','3 passagers','3 bagages','130 €'),
 ('business-van','Business Van','Mercedes Classe V Extra-Long ou équivalent','7 passagers','7 bagages','160 €'),
 ('first-class','First Class','Mercedes Classe S, EQS ou équivalent','3 passagers','3 bagages','200 €'),
 ('electric-class','Electric Class','Mercedes EQE, EQS ou équivalent, 100 % électrique','3 passagers','3 bagages','130 €')]
C=''.join(f'<article class="car"><img src="assets/v2/{i}-cadre.webp" alt="{n} — {m}" width="665" height="416" loading="lazy" decoding="async"><div class="tx"><h3>{n}</h3><p class="model">{m}</p><p class="cap"><span>{a}</span><span>{b}</span></p><div class="from"><span>Prix fixe</span><button type="button" data-vehicle="{n}">Choisir</button></div></div></article>' for i,n,m,a,b,p in cars)
agenda=[('agenda-evenements-cote-dazur/#cannes','Cannes',[('Mars','MIPIM'),('Mai','Festival de Cannes'),('Juin','Cannes Lions'),('Octobre','MIPCOM')]),
 ('agenda-evenements-cote-dazur/#monaco','Monaco',[('Avril','Monte-Carlo Masters'),('Mai / juin','Grand Prix'),('Septembre','Monaco Yacht Show')]),
 ('agenda-evenements-cote-dazur/#saint-tropez','Saint-Tropez',[('Mai','Les Bravades'),('Été','Concerts'),('Sept. / oct.','Les Voiles')]),
 ('agenda-evenements-cote-dazur/#antibes','Antibes',[('Printemps','Antibes Art Fair'),('Juillet','Jazz à Juan'),('Été','Concerts et festivals')]),
 ('chauffeur-evenements-nice/','Nice',[('Février','Carnaval de Nice'),('Juin','IRONMAN'),('Juillet','Nice Jazz Fest')]),
 ('chauffeur-prive-frejus-saint-raphael/','Fréjus & Saint-Raphaël',[('Été','Festivals & concerts'),('Septembre','Festival de l’Air'),('Octobre','Roc d’Azur')])]
A=''.join(f'<a href="{u}"><h3>{n}</h3><dl>{"".join(f"<dt>{m}</dt><dd>{e}</dd>" for m,e in ev)}</dl><span class="more">Voir les événements</span></a>' for u,n,ev in agenda)
cta2=cta.replace('href="#reservation"','href="#reservation"')
html=f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>Aperçu du nouveau site | Elite Prestige Services</title>
<meta name="description" content="Aperçu privé de la nouvelle page d’accueil Elite Prestige Services.">
<meta name="theme-color" content="#0f1a16">\n<link rel="icon" href="assets/v2/icon-32.png" sizes="32x32">\n<link rel="apple-touch-icon" href="assets/v2/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="assets/v2/hero.webp" media="(min-width:821px)">
<link rel="stylesheet" href="assets/v2/site.css?v=20261104g">
</head>
<body>
<header class="site-head"><div class="wrap">
  <a class="mark" href="#accueil"><img src="assets/v2/logo-eps-256.webp" alt="" width="38" height="38"><span><b>Elite Prestige Services</b><small>Chauffeur privé · Côte d’Azur</small></span></a>
  <nav class="main-nav" id="main-nav" aria-label="Navigation principale">
    <a href="#trajets">Trajets</a><a href="#services">Services</a><a href="#vehicules">Véhicules</a><a href="#entreprises">Entreprises</a><a href="#agenda">Événements</a>
    <a class="mobile-only" href="#reservation">Réserver</a><a class="mobile-only" href="admin/">Accès admin</a><a class="mobile-only" href="chauffeur/">Accès chauffeur</a>
    <div class="lang-toggle mobile-only nav-lang" role="group" aria-label="Langue / Language" data-no-i18n><button type="button" data-lang="fr" aria-pressed="true" lang="fr">FR</button><button type="button" data-lang="en" aria-pressed="false" lang="en">EN</button><button type="button" data-lang="it" aria-pressed="false" lang="it">IT</button><button type="button" data-lang="es" aria-pressed="false" lang="es">ES</button></div>
  </nav>
  <div class="lang-toggle head-lang" role="group" aria-label="Langue / Language" data-no-i18n><button type="button" data-lang="fr" aria-pressed="true" lang="fr">FR</button><button type="button" data-lang="en" aria-pressed="false" lang="en">EN</button><button type="button" data-lang="it" aria-pressed="false" lang="it">IT</button><button type="button" data-lang="es" aria-pressed="false" lang="es">ES</button></div>
  <a class="btn btn-gold" href="#reservation">Réserver</a>
  <button class="menu-btn" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="main-nav"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
</div></header>

<main id="accueil">
<section class="hero">
  <picture><source media="(max-width:1100px)" srcset="assets/v2/hero-1100.webp"><img class="hero-img" src="assets/v2/hero.webp" alt="" width="1872" height="1056" fetchpriority="high"></picture>
  <div class="hero-body">
    <img class="hero-logo" src="assets/v2/logo-eps-256.webp" alt="Logo Elite Prestige Services" width="120" height="120">
    <h1>Elite Prestige Services<span>Chauffeur privé à Cannes, Nice, Monaco et Saint-Tropez</span></h1>
    <div class="hero-actions"><a class="btn btn-gold" href="#reservation"><span class="hide-m">Réserver un chauffeur</span><span class="hide-d">Réserver</span></a><a class="btn btn-line" href="{WA}" target="_blank" rel="noopener">{WASVG}WhatsApp</a></div>
  </div>
</section>
<ul class="facts wrap"><li>24 h/24, 7 j/7</li><li>Prix confirmé avant la course</li><li>Chauffeur basé à Cannes</li></ul>

<section class="sec" id="trajets" aria-labelledby="trajets-t"><div class="wrap">
  <div class="sec-head"><div><h2 id="trajets-t">Les trajets les plus demandés</h2><p class="lead">Prix TTC par véhicule, pas par personne. Touchez un trajet pour le réserver.</p></div></div>
  <div class="tickets">{T}</div>
  <p class="tickets-note">Prix fixe par véhicule, affiché avant la validation de votre réservation. Berline, van Mercedes Classe V ou First Class sur chaque trajet.</p>
</div></section>

<section class="sec" id="services" aria-labelledby="services-t" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><div><h2 id="services-t">Nos services</h2><p class="lead">Aéroports, hôtels, ports et événements : un chauffeur privé pour chaque déplacement sur la Côte d’Azur.</p></div></div>
  <div class="services">{S}</div>
</div></section>

<section class="sec" id="vehicules" aria-labelledby="vehicules-t" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><div><h2 id="vehicules-t">Nos véhicules</h2><p class="lead">Quatre catégories Mercedes, du trajet en duo au groupe de sept avec bagages.</p></div></div>
  <div class="fleet">{C}</div>
</div></section>

<section class="sec" id="reservation" aria-labelledby="reservation-title" style="padding-top:0"><div class="wrap book">
  <div class="book-copy">
    <h2 id="reservation-title">Réservez votre chauffeur</h2>
    <p class="lead">Indiquez votre trajet et vos coordonnées. Vous recevez un devis au prix fixe avant de confirmer.</p>
    <ol class="how">
      <li><b>Vous envoyez votre demande</b><span>Aucun paiement à cette étape.</span></li>
      <li><b>Vous recevez votre devis par e-mail</b><span>Prix TTC fixe, chauffeur et véhicule confirmés.</span></li>
      <li><b>Vous confirmez en ligne</b><span>Paiement sécurisé par carte, sans surprise le jour J.</span></li>
    </ol>
    <div class="book-contact"><a class="btn btn-line" href="{WA}" target="_blank" rel="noopener">{WASVG}Écrire sur WhatsApp</a></div>
  </div>
  {form}
</div></section>

<section class="sec" id="entreprises" aria-labelledby="pro-t" style="padding-top:0"><div class="wrap"><div class="pro">
  <div>
    <h2 id="pro-t">Entreprises, agences et hôtels</h2>
    <p class="lead" style="margin-top:14px">Un chauffeur de confiance pour vos clients et vos équipes, avec un interlocuteur unique.</p>
    <ul>
      <li><span><b>Tarif fixe toute l’année</b>.</span></li>
      <li><span><b>Lien de réservation à votre nom</b> pour vos clients, suivi de chaque course.</span></li>
      <li><span><b>Agences événementielles et productions</b> : Festival de Cannes, Lions, MIPIM, plusieurs véhicules, facture société.</span></li>
      <li><span><b>Délégations et congrès</b> : transferts aéroport et mise à disposition.</span></li>
    </ul>
  </div>
  <div class="pro-side">
    <a class="btn btn-gold" href="chauffeur-entreprises-evenements/">Entreprises &amp; événements</a>
    <a class="btn btn-line" href="mailto:contact@elite-prestige-services.fr?subject=Partenariat%20Elite%20Prestige%20Services">Devenir partenaire</a>
    <a class="btn btn-line" href="{WA}" target="_blank" rel="noopener">{WASVG}En parler sur WhatsApp</a>
    <p>contact@elite-prestige-services.fr</p>
  </div>
</div></div></section>

<section class="sec" id="agenda" aria-labelledby="agenda-t" style="padding-top:0"><div class="wrap">
  <div class="sec-head"><div><h2 id="agenda-t">Événements de la Côte d’Azur</h2><p class="lead">Les grands rendez-vous de la Riviera et leurs mois habituels. Réservez tôt : les chauffeurs partent vite.</p></div><a class="btn btn-line" href="agenda-evenements-cote-dazur/">Voir l’agenda complet</a></div>
  <div class="agenda">{A}</div>
  <p class="small-note">Mois indicatifs : vérifiez le calendrier officiel de chaque édition.</p>
</div></section>
</main>

<footer class="site-foot" id="contact"><div class="wrap">
  <div class="foot-grid">
    <div class="foot-brand"><img src="assets/v2/logo-eps-256.webp" alt="" width="56" height="56" loading="lazy" style="margin-bottom:14px"><b>Elite Prestige Services</b><p>Chauffeur privé VTC basé à Cannes. Transferts aéroport, hôtels, ports et événements sur toute la Côte d’Azur.</p></div>
    <div><h3>Destinations</h3><ul><li><a href="chauffeur-prive-cannes/">Cannes</a></li><li><a href="chauffeur-prive-nice/">Nice</a></li><li><a href="chauffeur-prive-monaco/">Monaco</a></li><li><a href="chauffeur-prive-saint-tropez/">Saint-Tropez</a></li><li><a href="destinations/">Toutes les destinations</a></li></ul></div>
    <div><h3>Transferts</h3><ul><li><a href="transfert-aeroport-nice-cannes/">Aéroport de Nice → Cannes</a></li><li><a href="transfert-nice-monaco/">Nice → Monaco</a></li><li><a href="transfert-aeroport-nice-saint-tropez/">Aéroport de Nice → Saint-Tropez</a></li><li><a href="aviation-privee-cannes-mandelieu/">Aéroport de Cannes-Mandelieu</a></li></ul></div>
    <div><h3>Contact</h3><ul><li><a href="{WA}" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="mailto:contact@elite-prestige-services.fr">contact@elite-prestige-services.fr</a></li><li><a href="admin/">Espace admin</a></li><li><a href="chauffeur/">Espace chauffeur</a></li></ul></div>
  </div>
  <div class="foot-legal"><span>© Elite Prestige Services</span><span><a href="mentions-legales/">Mentions légales</a> · <a href="cgv/">CGV</a> · <a href="cgu/">CGU</a> · <a href="confidentialite/">Confidentialité</a></span></div>
</div></footer>
{cta2}
<script src="assets/v2/i18n.js?v=20261103"></script><script src="pricing.js?v=20261103"></script><script src="script.js?v=20261103-tel"></script>
<script>
(function(){{
 const form=document.getElementById('reservation-form');if(!form)return;
 const tabs=[...form.querySelectorAll('.tabs [data-type]')],flight=form.querySelector('.flight-field'),fi=form.querySelector('[name="flight_number"]'),dur=form.querySelector('.duration-field'),di=form.querySelector('[name="duration_hours"]'),dep=form.querySelector('[name="departure"]'),dest=form.querySelector('[name="destination"]');
 const airport=/a[eé]roport|airport|heliport/i;
 function refresh(){{const type=(tabs.find(b=>b.classList.contains('selected'))||tabs[0])?.dataset.type||'Transfert';const dispo=type==='Mise à disposition';
  if(dur){{dur.hidden=!dispo}} if(di){{di.required=dispo;if(!dispo)di.value=''}}
  if(dest){{dest.required=!dispo;const l=dest.closest('label');if(l)l.hidden=dispo}}
  const f=!dispo&&airport.test((dep?.value||'')+' '+(dest?.value||''));if(flight)flight.hidden=!f;if(fi){{fi.required=f;if(!f)fi.value=''}}}}
 tabs.forEach(b=>b.addEventListener('click',()=>setTimeout(refresh,0)));[dep,dest].forEach(x=>x&&['input','change'].forEach(e=>x.addEventListener(e,refresh)));refresh();
 const go=()=>document.getElementById('reservation').scrollIntoView({{behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'}});
 document.querySelectorAll('.ticket').forEach(t=>t.addEventListener('click',()=>{{const tr=tabs.find(b=>b.dataset.type==='Transfert');if(tr&&!tr.classList.contains('selected'))tr.click();dep.value=t.dataset.dep;dest.value=t.dataset.dest;dep.dispatchEvent(new Event('change'));dest.dispatchEvent(new Event('change'));go();setTimeout(()=>form.querySelector('[name="date"]').focus({{preventScroll:true}}),500)}}));
 document.querySelectorAll('[data-vehicle]').forEach(b=>b.addEventListener('click',()=>{{const s=form.querySelector('[name="vehicle"]');s.value=b.dataset.vehicle;s.dispatchEvent(new Event('change'));go()}}));
 const mb=document.querySelector('.menu-btn'),nav=document.getElementById('main-nav');
 mb.addEventListener('click',()=>{{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',String(o))}});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{{nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}}));
}})();
</script>
</body>
</html>
'''
open('/home/claude/eps-preview/apercu-accueil.html','w').write(html)
print(len(html))
