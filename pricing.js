// Tarifs indicatifs EPS TTC : à confirmer avant paiement ou attribution.
// Toute tarification définitive doit être recalculée côté serveur.
(function () {
  'use strict';
  const fares = {
    'cannes|nice': { 'Business Class': 130, 'Business Van': 160, 'First Class': 200 },
    'cannes|cannes-mandelieu-airport': { 'Business Class': 95, 'Business Van': 115, 'First Class': 120 },
    'cannes|monaco': { 'Business Class': 170, 'Business Van': 260, 'First Class': 330 },
    'cannes|saint-tropez': { 'Business Class': 230, 'Business Van': 360, 'First Class': 450 }
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
  // Majorations de test : modifiables avant activation définitive.
  const events = [
    { name: 'TFWA', start: '2026-09-27', end: '2026-10-01', percent: 25 },
    { name: 'MIPCOM', start: '2026-10-12', end: '2026-10-15', percent: 25 }
  ];
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
      'cannes-centre|saint-tropez': 'cannes|saint-tropez'
    };
    const base = fares[routes[pair]]?.[request.vehicle];
    if (!base || !request.date || !request.time) return null;
    const hours = (pickupParis(request.date, request.time) - Date.now()) / 3600000;
    if (!Number.isFinite(hours) || hours < 2) return null;
    const event = events.filter(item => request.date >= item.start && request.date <= item.end)
      .sort((a, b) => b.percent - a.percent)[0];
    const urgency = hours <= 6 ? 30 : hours <= 24 ? 20 : hours <= 48 ? 10 : 0;
    const percent = Math.max(event?.percent || 0, urgency);
    return { amount: Math.ceil(base * (1 + percent / 100) / 5) * 5,
      base, event: event?.name || null, urgency, percent, indicative: true };
  };
  window.epsPricingConfig = { fares, events, airportReferences };
})();
