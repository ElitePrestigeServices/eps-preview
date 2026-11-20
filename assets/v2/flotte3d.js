/* Elite Prestige Services — la flotte en 3D (20/11/2026, demande d'Anthony).
   Les 4 vidéos de véhicules sont découpées en 60 images WebP chacune (assets/v2/flotte3d/<véhicule>/d|m/NN.webp),
   dessinées dans un canvas selon le défilement, comme la démo Signature de MyCreativeSite.
   - d = ordinateur (1200 px), m = téléphone (720 px) ;
   - chargement progressif : rien n'est téléchargé avant que la section approche, puis 1 image sur 12, 1 sur 6, 1 sur 3, puis toutes,
     en commençant par le véhicule affiché ; pendant ce temps, on dessine l'image chargée la plus proche ;
   - mouvement réduit demandé ou pas de canvas : la section reste masquée et les cartes classiques suffisent. */
(() => {
  const root = document.querySelector('[data-f3d]');
  if (!root) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = root.querySelector('canvas');
  const ctx = cv && cv.getContext && cv.getContext('2d');
  if (reduce || !ctx) return;
  root.classList.add('on');

  const CARS = ['business', 'van', 'electric', 'first'];
  const N = 60;
  const stage = root.querySelector('.f3d-stage');
  const items = [...root.querySelectorAll('.f3d-item')];
  const dots = [...root.querySelectorAll('.f3d-dots button')];
  const bar = root.querySelector('.f3d-load b');
  const size = () => (Math.min(innerWidth, screen.width || innerWidth) <= 820 ? 'm' : 'd');
  let set = size();
  const imgs = CARS.map(() => new Array(N).fill(null));
  const ok = CARS.map(() => new Array(N).fill(false));
  let loaded = 0, started = false, cur = -1, want = 0, raf = 0;

  // ordre de chargement : image 0 de chaque véhicule, puis pas de 12, 6, 3, 1 ; le véhicule courant d'abord
  function order(first) {
    const out = [], seen = new Set();
    const cars = [first, ...CARS.map((_, i) => i).filter((i) => i !== first)];
    const push = (c, k) => { const key = c * N + k; if (!seen.has(key)) { seen.add(key); out.push([c, k]); } };
    cars.forEach((c) => push(c, 0));
    for (const step of [12, 6, 3, 1]) for (const c of cars) for (let k = 0; k < N; k += step) push(c, k);
    return out;
  }
  function start() {
    if (started) return;
    started = true;
    const q = order(Math.max(0, want));
    let i = 0, active = 0;
    const next = () => {
      while (active < 6 && i < q.length) {
        const [c, k] = q[i++];
        if (ok[c][k]) continue;
        active++;
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => { ok[c][k] = true; imgs[c][k] = im; done(); if (c === cur || cur < 0) draw(); };
        im.onerror = done;
        im.src = `assets/v2/flotte3d/${CARS[c]}/${set}/${String(k).padStart(2, '0')}.webp`;
      }
    };
    const done = () => {
      active--; loaded++;
      if (bar) bar.style.transform = `scaleX(${Math.min(1, loaded / (CARS.length * N))})`;
      if (loaded >= CARS.length * N) root.classList.add('ready');
      next();
    };
    next();
  }
  function nearest(c, k) {
    for (let d = 0; d < N; d++) {
      if (k - d >= 0 && ok[c][k - d]) return imgs[c][k - d];
      if (k + d < N && ok[c][k + d]) return imgs[c][k + d];
    }
    return null;
  }
  function fit() {
    const r = stage.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  }
  function progress() {
    const r = root.getBoundingClientRect();
    const span = r.height - innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  }
  function draw() {
    raf = 0;
    fit();
    const t = progress() * CARS.length;
    const c = Math.min(CARS.length - 1, Math.floor(t));
    const local = Math.min(1, t - c);
    const k = Math.min(N - 1, Math.round(local * (N - 1)));
    want = c;
    if (c !== cur) {
      cur = c;
      items.forEach((el, i) => el.classList.toggle('is', i === c));
      dots.forEach((el, i) => el.classList.toggle('is', i === c));
    }
    const W = cv.width, H = cv.height;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    const im = nearest(c, k);
    if (!im) return;
    // fondu au passage d'un véhicule à l'autre
    let a = 1;
    if (c > 0) a = Math.min(a, local / 0.07);
    if (c < CARS.length - 1) a = Math.min(a, (1 - local) / 0.07);
    ctx.globalAlpha = Math.max(0, Math.min(1, a));
    const mobile = W < H * 1.05;
    // téléphone : le véhicule occupe toute la largeur, au-dessus du texte ; ordinateur : centré, un peu à droite du texte
    const boxW = mobile ? W * 1.08 : W * 0.66, boxH = mobile ? H * 0.5 : H * 0.86;
    const s = Math.min(boxW / im.naturalWidth, boxH / im.naturalHeight);
    const dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    const x = mobile ? (W - dw) / 2 : W * 0.62 - dw / 2;
    const y = mobile ? H * 0.36 - dh / 2 : (H - dh) / 2;
    ctx.drawImage(im, Math.round(x), Math.round(y), Math.round(dw), Math.round(dh));
    ctx.globalAlpha = 1;
  }
  const ask = () => { if (!raf) raf = requestAnimationFrame(draw); };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', () => {
    const s = size();
    if (s !== set && loaded === 0) set = s; // on ne recharge pas tout si l'écran tourne en cours de route
    ask();
  });
  dots.forEach((el, i) => el.addEventListener('click', () => {
    const r = root.getBoundingClientRect();
    const span = r.height - innerHeight;
    scrollTo({ top: scrollY + r.top + span * ((i + 0.5) / CARS.length), behavior: 'smooth' });
  }));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es, ob) => { if (es.some((e) => e.isIntersecting)) { start(); ob.disconnect(); } }, { rootMargin: '150% 0px' }).observe(root);
  } else start();
  draw();
})();
