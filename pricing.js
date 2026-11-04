// Tarifs indicatifs EPS TTC : à confirmer avant paiement ou attribution.
// Toute tarification définitive doit être recalculée côté serveur.
(function () {
  'use strict';
  const fares = {
    'cannes|nice': { 'Business Class': 130, 'Business Van': 160, 'First Class': 200 },
    'cannes|cannes-mandelieu-airport': { 'Business Class': 95, 'Business Van': 115, 'First Class': 120 },
    'cannes|monaco': { 'Business Class': 230, 'Business Van': 260, 'First Class': 330 },
    // 03/11/2026 : van Monaco 260 → 230 et Saint-Tropez 360 → 320 (écart van/berline ramené vers +35 %) ; ajout aéroport de Nice ↔ Monaco.
    'monaco|nice': { 'Business Class': 150, 'Business Van': 195, 'First Class': 240 },
    'cannes|saint-tropez': { 'Business Class': 320, 'Business Van': 370, 'First Class': 460 }
  };
  // Relevés Blacklane transmis le 26/09/2026. Références de marché, pas tarifs EPS validés.
  // Les trajets aéroport sont directionnels : les prix retour restent à confirmer.
  const airportReferences = {
    'saint-jean-cap-ferrat': { 'Business Class': 99, 'Business Van': 120, 'First Class': 152 },
    'antibes': { 'Business Class': 131, 'Business Van': 173, 'First Class': 200 },
    'cannes': { 'Business Class': 138, 'Business Van': 184, 'First Class': 213 },
    'mandelieu': { 'Business Class': 157, 'Business Van': 218, 'First Class': 251 },
    'monaco': { 'Business Class': 160, 'Business Van': 225, 'First Class': 259 },
    'theoule': { 'Business Class': 182, 'Business Van': 265, 'First Class': 316 },
    'saint-tropez': { 'Business Class': 413, 'Business Van': 425, 'First Class': 472 }
  };
  // Périodes majorées (clients directs). Source de vérité : table Supabase pricing_events,
  // chargée au démarrage via eps-pricing-config ; cette liste ne sert qu'en secours.
  // On applique la PLUS FORTE majoration (salon, saison ou dernière minute), sans cumul.
  // Les partenaires (code agence) ont le tarif de base toute l'année, sans aucune majoration.
  let events = [
    { name: 'MIPIM 2027', start: '2027-03-15', end: '2027-03-19', percent: 20 },
    { name: 'Festival de Cannes 2027', start: '2027-05-11', end: '2027-05-22', percent: 25 },
    { name: 'Grand Prix de Monaco 2027', start: '2027-06-03', end: '2027-06-07', percent: 25 },
    { name: 'Cannes Lions 2027', start: '2027-06-21', end: '2027-06-25', percent: 20 },
    { name: 'Haute saison été 2027', start: '2027-07-01', end: '2027-08-31', percent: 15, kind: 'saison' },
    { name: 'Cannes Yachting Festival 2027', start: '2027-09-07', end: '2027-09-12', percent: 15 }
  ];
  const CONFIG_URL = 'https://lrtuztxjngdvrnjuwxfr.supabase.co/functions/v1/eps-pricing-config';
  let partnerCode = '';
  try {
    const q = new URLSearchParams(location.search);
    const fromUrl = (q.get('partenaire') || q.get('partner') || '').toUpperCase().trim();
    if (/^[A-Z0-9-]{3,24}$/.test(fromUrl)) { partnerCode = fromUrl; localStorage.setItem('eps_partner', fromUrl); }
    else partnerCode = (localStorage.getItem('eps_partner') || '').toUpperCase();
  } catch (_) {}
  window.epsPartner = null;
  window.epsPricingReady = fetch(CONFIG_URL + (partnerCode ? '?partner=' + encodeURIComponent(partnerCode) : ''), { cache: 'no-store' })
    .then(r => r.ok ? r.json() : null)
    .then(cfg => {
      if (!cfg) return;
      if (Array.isArray(cfg.events)) events = cfg.events;
      if (cfg.partner && cfg.partner.code) window.epsPartner = cfg.partner;
      else if (partnerCode) { try { localStorage.removeItem('eps_partner'); } catch (_) {} }
    })
    .catch(() => {});
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  function city(value) {
    const v = normalize(value);
    if (v.includes('mandelieu') && /aeroport|airport|aerodrome/.test(v)) return 'cannes-mandelieu-airport';
    if (/\bsaint tropez\b/.test(v)) return 'saint-tropez';
    if (/\bmonaco\b|\bmonte carlo\b/.test(v)) return 'monaco';
    if (/\bcannes\b/.test(v) && !/mandelieu/.test(v)) return 'cannes';
    if (/\bnice\b/.test(v)) return 'nice';
    return null;
  }
  function isNiceAirport(value) {
    const v = normalize(value);
    return (/\bnice\b|\bnce\b/.test(v)) &&
      /\baeroport\b|\bairport\b|\bnce\b|\bcote d azur\b/.test(v);
  }
  // Outil de comparaison interne : ne pas afficher ces relevés comme un devis EPS.
  window.epsMarketReference = function (request) {
    if (request.type !== 'Transfert' || !isNiceAirport(request.departure)) return null;
    const destination = city(request.destination);
    const price = airportReferences[destination]?.[request.vehicle];
    return price ? { amount: price, provider: 'Blacklane', recordedOn: '2026-09-26',
      direction: 'Nice Aéroport → ' + destination, indicative: true } : null;
  };
  // Indicative client preview for tightly defined known zones only.
  // Browser estimates never authorize a payment or confirm a reservation.
  function knownZone(value) {
    const v = normalize(value);
    if ((/\bnice\b/.test(v) || /\bnce\b/.test(v)) &&
        /\baeroport\b|\bairport\b|\bnce\b/.test(v)) return 'nice-airport';
    if (/\bmandelieu\b/.test(v) && /\baeroport\b|\bairport\b|\baerodrome\b/.test(v)) return 'mandelieu-airport';
    if (/^cannes(?: france| 06400| 06400 france)?$/.test(v) ||
        (/\bcannes\b/.test(v) && /\b06400\b/.test(v) && !/\b(?:mandelieu|bocca|le cannet)\b/.test(v)) ||
        /^cannes(?: alpes maritimes)?(?: provence alpes cote d azur)? france$/.test(v)) return 'cannes-centre';
    if (/^monaco(?: france)?$/.test(v)) return 'monaco';
    if (/^saint tropez(?: france)?$/.test(v)) return 'saint-tropez';
    return null;
  }
  function pickupParis(date, time) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !/^\d{2}:\d{2}$/.test(time || '')) return NaN;
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    if (hour > 23 || minute > 59) return NaN;
    const utc = Date.UTC(year, month - 1, day, hour, minute);
    const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    let instant = utc;
    for (let i = 0; i < 3; i++) {
      const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(part => [part.type, part.value]));
      const represented = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
      instant += utc - represented;
    }
    return instant;
  }
  window.epsEstimatePrice = function (request) {
    if (request.type !== 'Transfert') return null;
    const from = knownZone(request.departure), to = knownZone(request.destination);
    const pair = [from, to].sort().join('|');
    const routes = {
      'cannes-centre|nice-airport': 'cannes|nice',
      'cannes-centre|mandelieu-airport': 'cannes|cannes-mandelieu-airport',
      'cannes-centre|monaco': 'cannes|monaco',
      'cannes-centre|saint-tropez': 'cannes|saint-tropez',
      'monaco|nice-airport': 'monaco|nice'
    };
    const base = fares[routes[pair]]?.[request.vehicle];
    if (!base || !request.date || !request.time) return null;
    const hours = (pickupParis(request.date, request.time) - Date.now()) / 3600000;
    if (!Number.isFinite(hours) || hours < 2) return null;
    const partner = window.epsPartner && request.partnerCode && request.partnerCode === window.epsPartner.code ? window.epsPartner : null;
    if (partner) return { amount: base, base, event: null, urgency: 0, percent: 0, partner: partner.name, indicative: true };
    const event = events.filter(item => request.date >= item.start && request.date <= item.end)
      .sort((a, b) => b.percent - a.percent)[0];
    const urgency = hours <= 6 ? 30 : hours <= 24 ? 20 : hours <= 48 ? 10 : 0;
    const percent = Math.max(event?.percent || 0, urgency);
    const applied = (event && (event.percent || 0) >= urgency) ? event : null;
    return { amount: Math.ceil(base * (1 + percent / 100) / 5) * 5,
      base, event: applied?.name || null, season: applied?.kind === 'saison', urgency, percent, indicative: true };
  };
  Object.defineProperty(window, 'epsPricingConfig', { get: () => ({ fares, events, airportReferences }) });
})();
