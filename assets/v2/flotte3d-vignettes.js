/* Elite Prestige Services — la flotte en 3D (20/11/2026, demande d'Anthony : « dans la vignette, elle tourne toute seule »).
   Chaque vignette de « Nos véhicules » fait tourner son véhicule en boucle, sans défilement.
   - 60 images WebP par véhicule (assets/v2/flotte3d/<véhicule>/m/NN.webp, 720 px), découpées des vidéos fournies ;
   - les vidéos ne reviennent pas exactement au point de départ : on joue l'aller puis le retour, pour une boucle sans saut ;
   - chargement progressif : une vignette ne télécharge ses images que lorsqu'elle approche de l'écran
     (1 sur 6, puis 1 sur 3, puis toutes) ; la photo d'origine reste affichée tant que ce n'est pas prêt ;
   - l'animation s'arrête quand la vignette sort de l'écran ou que l'onglet est masqué ;
   - mouvement réduit demandé : rien ne bouge, la photo d'origine reste. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const MAP = { 'Business Class': 'business', 'Business Van': 'van', 'Electric Class': 'electric', 'First Class': 'first' };
  const N = 60, FPS = 12;
  const cards = [];
  document.querySelectorAll('.fleet .car').forEach((car, idx) => {
    const name = MAP[car.querySelector('[data-vehicle]')?.dataset.vehicle];
    const img = car.querySelector('img');
    if (!name || !img) return;
    const cv = document.createElement('canvas');
    const ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return;
    cv.className = 'f3d-cv';
    cv.setAttribute('aria-hidden', 'true');
    img.after(cv);
    cards.push({ car, name, cv, ctx, imgs: new Array(N).fill(null), started: false, visible: false, count: 0, phase: idx * 17 });
  });
  if (!cards.length) return;

  function load(c) {
    if (c.started) return;
    c.started = true;
    const q = [], seen = new Set();
    for (const step of [6, 3, 1]) for (let k = 0; k < N; k += step) if (!seen.has(k)) { seen.add(k); q.push(k); }
    let i = 0, active = 0;
    const next = () => {
      while (active < 4 && i < q.length) {
        const k = q[i++];
        active++;
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => { c.imgs[k] = im; c.count++; if (c.count >= 10) c.car.classList.add('f3d-ok'); fin(); };
        im.onerror = fin;
        im.src = `assets/v2/flotte3d/${c.name}/m/${String(k).padStart(2, '0')}.webp`;
      }
    };
    const fin = () => { active--; next(); tick(); };
    next();
  }
  function nearest(c, k) {
    for (let d = 0; d < N; d++) {
      if (k - d >= 0 && c.imgs[k - d]) return c.imgs[k - d];
      if (k + d < N && c.imgs[k + d]) return c.imgs[k + d];
    }
    return null;
  }
  function draw(c, t) {
    const r = c.cv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    if (c.cv.width !== W || c.cv.height !== H) { c.cv.width = W; c.cv.height = H; }
    const cycle = 2 * (N - 1);
    const p = Math.floor(t * FPS + c.phase) % cycle;
    const k = p < N ? p : cycle - p;
    const im = nearest(c, k);
    if (!im) return;
    const s = Math.min(W / im.naturalWidth, H / im.naturalHeight);
    const dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    c.ctx.fillStyle = '#000';
    c.ctx.fillRect(0, 0, W, H);
    c.ctx.drawImage(im, Math.round((W - dw) / 2), Math.round((H - dh) / 2), Math.round(dw), Math.round(dh));
  }
  let raf = 0, last = 0;
  function loop(now) {
    raf = 0;
    if (document.hidden) return;
    const on = cards.filter((c) => c.visible && c.count);
    if (!on.length) return;
    if (now - last >= 1000 / FPS - 2) { last = now; on.forEach((c) => draw(c, now / 1000)); }
    raf = requestAnimationFrame(loop);
  }
  const tick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  document.addEventListener('visibilitychange', tick);
  addEventListener('resize', tick);
  if ('IntersectionObserver' in window) {
    const ob = new IntersectionObserver((es) => es.forEach((e) => {
      const c = cards.find((x) => x.car === e.target);
      if (!c) return;
      c.visible = e.isIntersecting;
      if (e.isIntersecting) { load(c); tick(); }
    }), { rootMargin: '300px 300px' });
    cards.forEach((c) => ob.observe(c.car));
  } else cards.forEach((c) => { c.visible = true; load(c); tick(); });
})();
