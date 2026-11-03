"""Passe les pages intérieures EPS dans le nouveau style (assets/v2/site.css) sans toucher au contenu SEO."""
import re, sys, os
ROOT = '/home/claude/eps-preview'
pages = open('/tmp/claude-0/pages.txt').read().split()
WASVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2s.2-1.1.1-1.2l-.5-.3Z"/></svg>'
T = {
 'fr': dict(sub='Chauffeur privé · Côte d’Azur', nav=[('Tarifs','/#trajets'),('Services','/#services'),('Véhicules','/#vehicules'),('Entreprises','/#entreprises'),('Événements','/agenda-evenements-cote-dazur/')], book='Réserver', menu='Ouvrir le menu', admin='Accès admin', drv='Accès chauffeur', home='/',
   cta_t='Un trajet à organiser ?', cta_p='Envoyez votre demande en deux minutes : vous recevez un devis au prix fixe avant de confirmer.', cta_b='Réserver un chauffeur', cta_w='Écrire sur WhatsApp',
   f_txt='Chauffeur privé VTC basé à Cannes. Transferts aéroport, hôtels, ports et événements sur toute la Côte d’Azur.', f_dest='Destinations', f_all='Toutes les destinations', f_tr='Transferts', f_c='Contact', f_adm='Espace admin', f_drv='Espace chauffeur',
   f_lines=['Aéroport de Nice → Cannes','Nice → Monaco','Aéroport de Nice → Saint-Tropez','Aéroport de Cannes-Mandelieu'], legal=['Mentions légales','CGV','CGU','Confidentialité'], lic='© Elite Prestige Services · VTC EVTC006240319'),
 'en': dict(sub='Private chauffeur · French Riviera', nav=[('Prices','/?lang=en#trajets'),('Services','/?lang=en#services'),('Vehicles','/?lang=en#vehicules'),('Business','/?lang=en#entreprises'),('Events','/en/french-riviera-events-calendar/')], book='Book', menu='Open menu', admin='Admin access', drv='Driver access', home='/?lang=en',
   cta_t='Planning a journey?', cta_p='Send your request in two minutes: you receive a fixed-price quote before confirming.', cta_b='Book a chauffeur', cta_w='Message us on WhatsApp',
   f_txt='Private chauffeur service based in Cannes. Airport, hotel, port and event transfers across the French Riviera.', f_dest='Destinations', f_all='All destinations', f_tr='Transfers', f_c='Contact', f_adm='Admin area', f_drv='Driver area',
   f_lines=['Nice Airport → Cannes','Nice → Monaco','Nice Airport → Saint-Tropez','Cannes-Mandelieu Airport'], legal=['Legal notice','Terms of sale','Terms of use','Privacy'], lic='© Elite Prestige Services · VTC licence EVTC006240319'),
 'it': dict(sub='Autista privato · Costa Azzurra', nav=[('Tariffe','/?lang=it#trajets'),('Servizi','/?lang=it#services'),('Veicoli','/?lang=it#vehicules'),('Aziende','/?lang=it#entreprises'),('Eventi','/it/calendario-eventi-costa-azzurra/')], book='Prenota', menu='Apri il menu', admin='Accesso admin', drv='Accesso autisti', home='/?lang=it',
   cta_t='Un tragitto da organizzare?', cta_p='Invia la tua richiesta in due minuti: ricevi un preventivo a prezzo fisso prima di confermare.', cta_b='Prenota un autista', cta_w='Scrivici su WhatsApp',
   f_txt='Servizio di autista privato con base a Cannes. Transfer da aeroporti, hotel, porti ed eventi in tutta la Costa Azzurra.', f_dest='Destinazioni', f_all='Tutte le destinazioni', f_tr='Transfer', f_c='Contatti', f_adm='Area admin', f_drv='Area autisti',
   f_lines=['Aeroporto di Nizza → Cannes','Nizza → Monaco','Aeroporto di Nizza → Saint-Tropez','Aeroporto di Cannes-Mandelieu'], legal=['Note legali','Condizioni di vendita','Condizioni d’uso','Privacy'], lic='© Elite Prestige Services · licenza VTC EVTC006240319'),
 'es': dict(sub='Chófer privado · Costa Azul', nav=[('Tarifas','/?lang=es#trajets'),('Servicios','/?lang=es#services'),('Vehículos','/?lang=es#vehicules'),('Empresas','/?lang=es#entreprises'),('Eventos','/es/agenda-eventos-costa-azul/')], book='Reservar', menu='Abrir el menú', admin='Acceso admin', drv='Acceso chóferes', home='/?lang=es',
   cta_t='¿Un trayecto que organizar?', cta_p='Envíe su solicitud en dos minutos: recibirá un presupuesto a precio cerrado antes de confirmar.', cta_b='Reservar un chófer', cta_w='Escríbanos por WhatsApp',
   f_txt='Chófer privado con base en Cannes. Traslados de aeropuertos, hoteles, puertos y eventos en toda la Costa Azul.', f_dest='Destinos', f_all='Todos los destinos', f_tr='Traslados', f_c='Contacto', f_adm='Área de administración', f_drv='Área de chóferes',
   f_lines=['Aeropuerto de Niza → Cannes','Niza → Mónaco','Aeropuerto de Niza → Saint-Tropez','Aeropuerto de Cannes-Mandelieu'], legal=['Aviso legal','Condiciones de venta','Condiciones de uso','Privacidad'], lic='© Elite Prestige Services · licencia VTC EVTC006240319'),
}
CITY = {'fr': ['Cannes','Nice','Monaco','Saint-Tropez'], 'en': ['Cannes','Nice','Monaco','Saint-Tropez'], 'it': ['Cannes','Nizza','Monaco','Saint-Tropez'], 'es': ['Cannes','Niza','Mónaco','Saint-Tropez']}
CSSV = '20261104c'

def header(lang, alts, wa):
    t = T[lang]
    nav = ''.join(f'<a href="{u}">{l}</a>' for l, u in t['nav'])
    langs = []
    for code in ['fr', 'en', 'it', 'es']:
        href = alts.get(code)
        if not href: continue
        langs.append(f'<a href="{href}" lang="{code}"{" aria-current=\"page\"" if code == lang else ""} hreflang="{code}">{code.upper()}</a>')
    lt = ('<nav class="lang-toggle{c}" aria-label="Langue / Language">' + ''.join(langs) + '</nav>') if len(langs) > 1 else ''
    return (f'<header class="site-head"><div class="wrap">'
            f'<a class="mark" href="{t["home"]}"><img src="/assets/v2/logo-eps-256.webp" alt="" width="38" height="38"><span><b>Elite Prestige Services</b><small>{t["sub"]}</small></span></a>'
            f'<nav class="main-nav" id="main-nav" aria-label="Navigation principale">{nav}'
            f'<a class="mobile-only" href="/#reservation">{t["book"]}</a><a class="mobile-only" href="/admin/">{t["admin"]}</a><a class="mobile-only" href="/chauffeur/">{t["drv"]}</a>'
            + lt.format(c=' mobile-only nav-lang') + '</nav>'
            + lt.format(c=' head-lang') +
            f'<a class="btn btn-gold" href="/#reservation">{t["book"]}</a>'
            f'<button class="menu-btn" type="button" aria-label="{t["menu"]}" aria-expanded="false" aria-controls="main-nav"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>'
            '</div></header>')

def cta_band(lang, wa):
    t = T[lang]
    return (f'<section class="page-cta wrap" aria-label="{t["book"]}"><div class="pro"><div><h2>{t["cta_t"]}</h2><p class="lead" style="margin-top:12px">{t["cta_p"]}</p></div>'
            f'<div class="pro-side"><a class="btn btn-gold" href="/#reservation">{t["cta_b"]}</a><a class="btn btn-line" href="{wa}" target="_blank" rel="noopener">{WASVG}{t["cta_w"]}</a></div></div></section>')

def footer(lang, wa):
    t = T[lang]; c = CITY[lang]
    dest = [('/chauffeur-prive-cannes/', c[0]), ('/chauffeur-prive-nice/', c[1]), ('/chauffeur-prive-monaco/', c[2]), ('/chauffeur-prive-saint-tropez/', c[3]), ('/destinations/', t['f_all'])]
    tr = list(zip(['/transfert-aeroport-nice-cannes/', '/transfert-nice-monaco/', '/transfert-aeroport-nice-saint-tropez/', '/aviation-privee-cannes-mandelieu/'], t['f_lines']))
    li = lambda xs: ''.join(f'<li><a href="{u}">{l}</a></li>' for u, l in xs)
    lg = t['legal']
    return (f'<footer class="site-foot" id="contact"><div class="wrap"><div class="foot-grid">'
            f'<div class="foot-brand"><img src="/assets/v2/logo-eps-256.webp" alt="" width="56" height="56" loading="lazy" style="margin-bottom:14px"><b>Elite Prestige Services</b><p>{t["f_txt"]}</p></div>'
            f'<div><h3>{t["f_dest"]}</h3><ul>{li(dest)}</ul></div><div><h3>{t["f_tr"]}</h3><ul>{li(tr)}</ul></div>'
            f'<div><h3>{t["f_c"]}</h3><ul><li><a href="{wa}" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="mailto:contact@elite-prestige-services.fr">contact@elite-prestige-services.fr</a></li><li><a href="/admin/">{t["f_adm"]}</a></li><li><a href="/chauffeur/">{t["f_drv"]}</a></li></ul></div>'
            f'</div><div class="foot-legal"><span>{t["lic"]}</span><span><a href="/mentions-legales/">{lg[0]}</a> · <a href="/cgv/">{lg[1]}</a> · <a href="/cgu/">{lg[2]}</a> · <a href="/confidentialite/">{lg[3]}</a></span></div></div></footer>')

HEADLINKS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
             '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
             f'<link rel="stylesheet" href="/assets/v2/site.css?v={CSSV}"><meta name="theme-color" content="#0f1a16">')

def run():
  done = []
  for f in pages:
      p = os.path.join(ROOT, f); t = open(p).read()
      if 'data-eps-v2' in t:
          lang = re.search(r'<html lang="([a-z]+)', t).group(1)
          alts = {m.group(1): re.sub(r'^https://www\.elite-prestige-services\.fr', '', m.group(2)) for m in re.finditer(r'<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)"', t) if m.group(1) in ('fr','en','it','es')}
          if alts and lang not in alts: alts[lang] = None
          m = re.search(r'class="eps-cta-wa" href="([^"]+)"', t); wa = m.group(1) if m else 'https://wa.me/33745495321'
          t2 = re.sub(r'<header class="site-head">.*?</header>', lambda _: header(lang if lang in T else 'fr', alts, wa), t, count=1, flags=re.S)
          if t2 != t: open(p, 'w').write(t2); done.append(f)
          continue
      lang = re.search(r'<html lang="([a-z]+)', t).group(1)
      if lang not in T: lang = 'fr'
      alts = {}
      for m in re.finditer(r'<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)"', t):
          if m.group(1) in ('fr', 'en', 'it', 'es'):
              alts[m.group(1)] = re.sub(r'^https://www\.elite-prestige-services\.fr', '', m.group(2))
      # head : retirer les anciens styles et la couleur de thème, ajouter le nouveau style
      head, body = t[:t.index('<body')], t[t.index('<body'):]
      head = re.sub(r'<style\b.*?</style>', '', head, flags=re.S)
      head = re.sub(r'<meta name="theme-color"[^>]*>', '', head)
      head = re.sub(r'<link rel="stylesheet"[^>]*>', '', head)
      head = head.replace('</head>', HEADLINKS + '</head>')
      # lien WhatsApp propre à la page (déjà personnalisé dans la barre mobile)
      m = re.search(r'class="eps-cta-wa" href="([^"]+)"', body)
      wa = m.group(1) if m else 'https://wa.me/33745495321'
      cta = re.search(r'<!--eps-cta-->.*?<!--/eps-cta-->', body, re.S)
      cta = cta.group(0) if cta else ''
      main = re.search(r'<main([^>]*)>(.*?)</main>', body, re.S)
      attrs, inner = main.group(1), main.group(2)
      inner = re.sub(r'\sstyle="[^"]*"', '', inner)
      inner = re.sub(r'<p>(Independent chauffeur service\. Preview website: bookings are not active\.|Servizio di trasporto indipendente\. Sito di anteprima: prenotazioni non attive\.)</p>', '', inner)
      attrs = re.sub(r'\sclass="[^"]*"', '', attrs)
      scripts = ''.join(re.findall(r'<script\b(?![^>]*ld\+json).*?</script>', body[main.end():], re.S))
      ld = ''.join(re.findall(r'<script type="application/ld\+json".*?</script>', body, re.S))
      newbody = (f'<body data-eps-v2>' + header(lang, alts, wa) +
                 f'<main{attrs} class="page"><div class="wrap page-body">{inner}</div>{cta_band(lang, wa)}</main>' +
                 footer(lang, wa) + cta + ld + scripts + '<script src="/assets/v2/site.js?v=' + CSSV + '" defer></script></body></html>')
      open(p, 'w').write(head + newbody)
      done.append(f)
  print(len(done), "pages")

if __name__ == '__main__': run()
