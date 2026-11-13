/* Statistiques maison EPS (13/11/2026) — anonymes, sans cookie.
   Envoie les pages vues et quelques actions (formulaire de réservation, WhatsApp) à Supabase EPS
   via la fonction eps_track. Interrupteur pour Anthony : lien secret sur son nom dans les mentions
   légales, ou adresses #nostats (ne plus compter cet appareil) et #stats (recompter). */
(function () {
  var ENDPOINT = 'https://lrtuztxjngdvrnjuwxfr.supabase.co/rest/v1/rpc/eps_track';
  var KEY = 'sb_publishable_GeaRT-N3IE03M19HCB4MVg_RQwbSnYu';
  var FLAG = 'eps_nostats';

  function store(fn) { try { return fn(); } catch (e) { return null; } }
  function excluded() { return store(function () { return localStorage.getItem(FLAG) === '1'; }) === true; }

  function toast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.setAttribute('role', 'status'); t.id = 'eps-stats-toast';
    t.style.cssText = 'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:99999;' +
      'background:#111;color:#f2ede4;border:1px solid #c9a35b;border-radius:10px;padding:12px 18px;' +
      'font:600 15px/1.3 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4);max-width:90vw;text-align:center';
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3500);
  }

  function setExcluded(on) {
    store(function () { on ? localStorage.setItem(FLAG, '1') : localStorage.removeItem(FLAG); });
    toast(on ? '✓ Cet appareil n’est plus compté dans les statistiques' : 'Cet appareil est de nouveau compté');
  }

  function fromHash() {
    var h = (location.hash || '').toLowerCase();
    if (h !== '#nostats' && h !== '#stats') return;
    setExcluded(h === '#nostats');
    store(function () { history.replaceState(null, '', location.pathname + location.search); });
  }

  function sid() {
    var s = store(function () { return sessionStorage.getItem('eps_sid'); });
    if (!s) {
      s = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
      store(function () { sessionStorage.setItem('eps_sid', s); });
    }
    return s;
  }

  function device() {
    var w = Math.min(screen.width || 0, window.innerWidth || 9999);
    return w < 700 ? 'mobile' : (w < 1100 ? 'tablette' : 'ordinateur');
  }

  function bot() { return /bot|crawl|spider|slurp|lighthouse|headless|preview/i.test(navigator.userAgent || ''); }

  function send(event) {
    if (excluded() || bot()) return;
    if (!/(^|\.)elite-prestige-services\.fr$/.test(location.hostname)) return;
    var ref = '';
    try {
      var r = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : '';
      ref = (r && r !== 'elite-prestige-services.fr') ? r : '';
    } catch (e) {}
    var q = new URLSearchParams(location.search);
    var body = JSON.stringify({
      p_event: event,
      p_path: location.pathname,
      p_ref: ref || null,
      p_utm: q.get('utm_source') || null,
      p_lang: (document.documentElement.lang || navigator.language || '').slice(0, 12),
      p_device: device(),
      p_w: screen.width || null,
      p_tz: store(function () { return Intl.DateTimeFormat().resolvedOptions().timeZone; }),
      p_sid: sid()
    });
    try {
      fetch(ENDPOINT, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + KEY }, body: body });
    } catch (e) {}
  }

  function init() {
    fromHash();
    window.addEventListener('hashchange', fromHash);

    var me = document.querySelector('[data-eps-stats-toggle]');
    if (me) me.addEventListener('click', function (e) { e.preventDefault(); setExcluded(!excluded()); });

    send('pageview');

    var opened = false;
    var form = document.getElementById('reservation-form');
    if (form) {
      form.addEventListener('focusin', function () { if (!opened) { opened = true; send('reservation_open'); } });
      form.addEventListener('submit', function () { send('reservation_submit'); }, true);
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var h = a.getAttribute('href') || '';
      if (/wa\.me|whatsapp/i.test(h)) send('whatsapp_click');
      else if (/\/devis\//.test(h)) send('quote_click');
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
