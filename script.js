// Une demande n'est confirmée qu'après vérification par Elite Prestige Services.
const form = document.querySelector('#reservation-form');
const review = document.querySelector('#booking-review');
const details = document.querySelector('#review-details');
const sendButton = document.querySelector('#send-request');
const sendStatus = document.querySelector('#send-status');
const result = document.querySelector('#form-result');
let type = 'Transfert';
let currentRequest = null;
let sentResult = null;
const T = value => window.epsTranslate ? window.epsTranslate(value) : value;
const phoneField = form.elements.customer_phone;
const phoneCountryCode = form.elements.phone_country_code;
phoneField.placeholder = '+33 6 12 34 56 78 / +1 212 555 0123';
const validPhone = value => {
  const normalized = value.trim().replace(/[\s().-]/g, '');
  return /^\+?[0-9]{7,15}$/.test(normalized);
};
function validatePhone() {
  const value = phoneField.value.trim();
  phoneField.setCustomValidity(!value || validPhone(value) ? '' :
    (window.epsLanguage?.() === 'en'
      ? 'Enter a valid phone number, with country code for international numbers.'
      : 'Saisissez un numéro de téléphone valide, avec l’indicatif pays pour les numéros internationaux.'));
}
phoneField.addEventListener('input', validatePhone);
phoneField.addEventListener('change', validatePhone);
let sendingState = 'initial';

const hourSelect = document.querySelector('#eps-hour');
const minuteSelect = document.querySelector('#eps-minute');
const timeValue = document.querySelector('#eps-time-value');
function syncTimeValue(){
  if(!hourSelect || !minuteSelect || !timeValue) return;
  timeValue.value = hourSelect.value && minuteSelect.value ? hourSelect.value + ':' + minuteSelect.value : '';
}
hourSelect?.addEventListener('change', syncTimeValue);
minuteSelect?.addEventListener('change', syncTimeValue);

const airportMentioned = value => /\b(?:aeroport|airport|aerodrome|aeroporto|aeropuerto|flughafen|heliport|jet center|nce|lfmn|lfmd|cdg|ory|lbg|mrs|tln|gva|mxp|lhr)\b/i.test(value.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
function updateFlightField() {
  const needed = airportMentioned(form.elements.departure.value) || (type === 'Transfert' && airportMentioned(form.elements.destination.value));
  form.elements.flight_number.required = needed;
  form.elements.flight_number.closest('label').hidden = !needed;
}
form.elements.departure.addEventListener('input', updateFlightField);
form.elements.destination.addEventListener('input', updateFlightField);


function clearReview() {
  review.hidden = true;
  currentRequest = null;
  sentResult = null;
  sendStatus.textContent = '';
  result.hidden = true;
  sendingState = 'initial';
}
form.addEventListener('input', clearReview);
form.addEventListener('change', clearReview);

document.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click', () => {
  type = button.dataset.type;
  document.querySelectorAll('[data-type]').forEach(item => {
    item.classList.toggle('selected', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  const destination = form.elements.destination;
  destination.required = type === 'Transfert';
  destination.closest('label').hidden = type !== 'Transfert';
  const duration = form.elements.duration_hours;
  duration.required = type === 'Mise à disposition';
  duration.closest('label').hidden = type !== 'Mise à disposition';
  updateFlightField();
  clearReview();
}));
updateFlightField();
form.elements.date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function addDetail(label, value) {
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.textContent = T(label);
  dd.textContent = value;
  details.append(dt, dd);
}

async function checkSendingAvailability() {
  sendingState = 'checking';
  sendButton.disabled = true;
  sendButton.textContent = T('Vérification de l’envoi…');
  try {
    const response = await fetch('https://lrtuztxjngdvrnjuwxfr.supabase.co/functions/v1/eps-reservation', { cache: 'no-store' });
    const state = await response.json();
    if (!response.ok || !state.ready) throw new Error('not configured');
    sendButton.disabled = false;
    sendingState = 'ready';
    sendButton.textContent = T('Envoyer ma demande');
    sendStatus.textContent = '';
  } catch {
    sendingState = 'unavailable';
    sendButton.textContent = T('Envoi en cours d’activation');
    sendStatus.textContent = T('L’envoi n’est pas encore disponible. Vos coordonnées n’ont pas été transmises.');
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  updateFlightField();
  validatePhone();
  syncTimeValue();
  if (!form.reportValidity()) return;
  if (!timeValue?.value) {
    hourSelect?.reportValidity();
    minuteSelect?.reportValidity();
    return;
  }
  const data = new FormData(form);
  currentRequest = {
    requestId: crypto.randomUUID(),
    type,
    departure: String(data.get('departure') || '').trim(),
    destination: type === 'Transfert' ? String(data.get('destination') || '').trim() : '',
    flightNumber: form.elements.flight_number.required ? String(data.get('flight_number') || '').trim() : '',
    date: String(data.get('date') || ''),
    time: timeValue?.value || String(data.get('time') || ''),
    durationHours: type === 'Mise à disposition' ? String(data.get('duration_hours') || '') : '',
    passengers: String(data.get('passengers') || ''),
    luggage: String(data.get('luggage') || ''),
    childSeat: String(data.get('child_seat') || ''),
    vehicle: String(data.get('vehicle') || ''),
    customerName: String(data.get('customer_name') || '').trim(),
    customerEmail: String(data.get('customer_email') || '').trim(),
    customerPhone: ((String(data.get('phone_country_code') || '').trim() + ' ' + String(data.get('customer_phone') || '').trim()).trim()),
    notes: String(data.get('notes') || '').trim(),
    language: window.epsLanguage?.() === 'en' ? 'en' : 'fr',
    website: String(data.get('website') || '')
  };
  currentRequest.estimate = window.epsEstimatePrice?.(currentRequest) || null;
  renderReview();
  review.hidden = false;
  review.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  checkSendingAvailability();
});

function renderReview() {
  if (!currentRequest) return;
  details.replaceChildren();
  addDetail('Prestation', T(currentRequest.type));
  addDetail('Départ', currentRequest.departure);
  if (currentRequest.destination) addDetail('Arrivée', currentRequest.destination);
  if (currentRequest.flightNumber) addDetail('Numéro de vol', currentRequest.flightNumber);
  addDetail('Date et heure', currentRequest.date.split('-').reverse().join('/') + (window.epsLanguage?.() === 'en' ? ' at ' : ' à ') + currentRequest.time);
  if (currentRequest.durationHours) addDetail('Durée', currentRequest.durationHours + (window.epsLanguage?.() === 'en' ? ' hours' : ' h'));
  addDetail('Passagers / bagages', currentRequest.passengers + ' / ' + currentRequest.luggage);
  addDetail('Siège enfant', T(currentRequest.childSeat === 'none' ? 'Aucun' : currentRequest.childSeat === 'to_confirm' ? 'À préciser' : currentRequest.childSeat));
  addDetail('Véhicule', T(currentRequest.vehicle));
  addDetail('Client', currentRequest.customerName);
  addDetail('E-mail', currentRequest.customerEmail);
  addDetail('Téléphone', currentRequest.customerPhone);
  if (currentRequest.estimate) addDetail('Tarif indicatif TTC', currentRequest.estimate.amount.toLocaleString('fr-FR', {style:'currency',currency:'EUR'}) + (currentRequest.estimate.event ? ' — tarif événementiel' : ''));
  else addDetail('Tarif', 'Sur devis après étude du trajet');
  if (currentRequest.notes) addDetail('Informations utiles', currentRequest.notes);
  if (currentRequest.type === 'Transfert' && currentRequest.departure && currentRequest.destination) {
    // Google Maps directions URL: no Maps API key, subscription or billing.
    // This is a route preview only, not a verified fare or distance.
    const mapUrl = new URL('https://www.google.com/maps/dir/');
    mapUrl.searchParams.set('api', '1');
    mapUrl.searchParams.set('origin', currentRequest.departure);
    mapUrl.searchParams.set('destination', currentRequest.destination);
    mapUrl.searchParams.set('travelmode', 'driving');
    const row = document.createElement('div');
    row.style.cssText = 'grid-column:1/-1;margin:16px 0;text-align:center';
    const link = document.createElement('a');
    link.href = mapUrl.toString();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.cssText = 'display:inline-block;padding:12px 20px;border:1px solid #d5b476;border-radius:999px;color:#e3c889;text-decoration:none;font-weight:600';
    link.textContent = window.epsLanguage?.() === 'en' ? 'Preview route on Google Maps ↗' : 'Aperçu de l’itinéraire sur Google Maps ↗';
    const note = document.createElement('p');
    note.style.cssText = 'font-size:11px;color:#aaa;margin:8px 0 0';
    note.textContent = window.epsLanguage?.() === 'en' ? 'Route preview only; fare confirmed by EPS.' : 'Aperçu uniquement ; tarif confirmé par EPS.';
    const map = document.createElement('iframe');
    map.title = window.epsLanguage?.() === 'en' ? 'Map of departure and arrival' : 'Carte du départ et de l’arrivée';
    map.loading = 'lazy';
    map.referrerPolicy = 'no-referrer';
    map.style.cssText = 'display:none;width:100%;height:270px;border:1px solid #8c7852;border-radius:12px;margin:0 0 14px';
    row.append(map, link, note);
    details.append(row);
    const requestId = currentRequest.requestId;
    fetch('/api/map-preview?from=' + encodeURIComponent(currentRequest.departure) +
      '&to=' + encodeURIComponent(currentRequest.destination), { cache: 'no-store' })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (!data?.ok || currentRequest?.requestId !== requestId || !row.isConnected) return;
        const a = data.departure, b = data.arrival;
        const margin = 0.045;
        const west = Math.min(a.lon, b.lon) - margin;
        const east = Math.max(a.lon, b.lon) + margin;
        const south = Math.min(a.lat, b.lat) - margin;
        const north = Math.max(a.lat, b.lat) + margin;
        const osm = new URL('https://www.openstreetmap.org/export/embed.html');
        osm.searchParams.set('bbox', [west, south, east, north].join(','));
        osm.searchParams.set('layer', 'mapnik');
        osm.searchParams.set('marker', a.lat + ',' + a.lon);
        map.src = osm.toString();
        map.style.display = 'block';
        note.textContent = window.epsLanguage?.() === 'en'
          ? 'Map shows the pickup area. Open Google Maps for the actual driving route; EPS confirms the fare.'
          : 'La carte situe le départ. Ouvrir Google Maps pour voir le trajet routier ; EPS confirme le tarif.';
      }).catch(() => {});

  }
}

function renderSent() {
  if (!sentResult) return;
  sendButton.textContent = T('Demande envoyée');
  sendStatus.textContent = T('Votre demande a été transmise. Référence : ') + sentResult.reference + T('. Elle reste soumise à confirmation.') + ' ' +
    T(sentResult.receiptSent ? 'Un récapitulatif vous a été envoyé par e-mail.' : 'Le récapitulatif par e-mail n’a pas pu être envoyé. Votre demande nous est bien parvenue.');
  result.hidden = false;
  result.textContent = sendStatus.textContent;
}

window.epsRefreshBooking = () => {
  validatePhone();
  if (currentRequest) renderReview();
  if (sendingState === 'checking') sendButton.textContent = T('Vérification de l’envoi…');
  if (sendingState === 'ready') sendButton.textContent = T('Envoyer ma demande');
  if (sendingState === 'sending') sendStatus.textContent = T('Envoi de votre demande…');
  if (sendingState === 'failed') sendStatus.textContent = T('L’envoi a échoué. Vous pouvez réessayer ; aucune réservation n’a été confirmée.');
  if (sendingState === 'sent') renderSent();
  if (sendingState === 'unavailable') {
    sendButton.textContent = T('Envoi en cours d’activation');
    sendStatus.textContent = T('L’envoi n’est pas encore disponible. Vos coordonnées n’ont pas été transmises.');
  }
};

sendButton.addEventListener('click', async () => {
  if (!currentRequest || sendButton.disabled) return;
  sendButton.disabled = true;
  sendingState = 'sending';
  sendStatus.textContent = T('Envoi de votre demande…');
  try {
    const response = await fetch('https://lrtuztxjngdvrnjuwxfr.supabase.co/functions/v1/eps-reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentRequest)
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error('send failed');
    sendingState = 'sent';
    sentResult = { reference: data.reference, receiptSent: data.receiptSent === true };
    if (Number.isFinite(data.indicativeFare) && data.indicativeFare > 0) currentRequest.estimate = { amount: data.indicativeFare, indicative: true };
    renderReview();
    renderSent();
  } catch {
    sendButton.disabled = false;
    sendingState = 'failed';
    sendStatus.textContent = T('L’envoi a échoué. Vous pouvez réessayer ; aucune réservation n’a été confirmée.');
  }
});

/* Suggestions de villes internationales ; la saisie libre reste possible. */
const localLocations = [...document.querySelectorAll('#eps-locations option')].map(option => option.value);
const normalizePlace = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
document.querySelectorAll('#reservation-form [name="departure"], #reservation-form [name="destination"]').forEach(input => {
  const list = document.getElementById(input.name + '-suggestions');
  let timer, controller, items = [], selected = -1;
  const hide = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    selected = -1;
  };
  const choose = value => {
    clearTimeout(timer);
    controller?.abort();
    input.value = value;
    updateFlightField();
    clearReview();
    hide();
    input.focus();
  };
  const highlight = index => {
    selected = index;
    [...list.children].forEach((item, i) => item.classList.toggle('active', i === selected));
    if (selected >= 0) {
      input.setAttribute('aria-activedescendant', list.children[selected].id);
      list.children[selected].scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  };
  const render = values => {
    items = [...new Set(values)].slice(0, 8);
    list.replaceChildren(...items.map((value, index) => {
      const item = document.createElement('li');
      item.id = input.name + '-suggestion-' + index;
      item.role = 'option';
      item.textContent = value;
      item.addEventListener('mousedown', event => event.preventDefault());
      item.addEventListener('click', () => choose(value));
      return item;
    }));
    list.hidden = !items.length;
    input.setAttribute('aria-expanded', String(Boolean(items.length)));
    highlight(-1);
  };
  const suggest = () => {
    clearTimeout(timer);
    controller?.abort();
    const query = input.value.trim();
    if (query.length < 2 || query.length > 70) { hide(); return; }
    const match = normalizePlace(query);
    const nearby = localLocations.filter(name => normalizePlace(name).includes(match)).slice(0, 6);
    render(nearby);
    if (query.length < 3) return;
    controller = new AbortController();
    const requestController = controller;
    timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          format: 'jsonv2',
          q: query,
          limit: '10',
          addressdetails: '1',
          'accept-language': document.documentElement.lang === 'en' ? 'en,fr' : 'fr,en'
        });
        // Worldwide search, with French results promoted to the top.
        const response = await fetch('https://nominatim.openstreetmap.org/search?' + params.toString(), {
          signal: requestController.signal,
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) return;
        const data = await response.json();
        if (input.value.trim() !== query || document.activeElement !== input) return;
        const places = (Array.isArray(data) ? data : [])
          .filter(item => item && typeof item.display_name === 'string')
          .sort((a, b) => (b.address?.country_code === 'fr') - (a.address?.country_code === 'fr'))
          .map(item => item.display_name);
        render([...nearby, ...places]);
      } catch {}
    }, 450);
  };
  input.addEventListener('input', suggest);
  input.addEventListener('focus', () => { if (input.value.trim().length >= 2) suggest(); });
  input.addEventListener('keydown', event => {
    if (list.hidden || !items.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      highlight((selected + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length);
    } else if (event.key === 'Enter' && selected >= 0) {
      event.preventDefault();
      choose(items[selected]);
    } else if (event.key === 'Escape') hide();
  });
  input.addEventListener('blur', () => setTimeout(hide, 150));
});
