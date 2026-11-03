/* Menu mobile du site EPS */
(function () {
  var b = document.querySelector('.menu-btn'), n = document.getElementById('main-nav');
  if (!b || !n) return;
  b.addEventListener('click', function () { var o = n.classList.toggle('open'); b.setAttribute('aria-expanded', String(o)); });
  n.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { n.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); }); });
})();
