/* Meikai — ortak efekt katmanı. Hata verirse site çalışmaya devam eder. */
(function () {
  'use strict';
  var de = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var raf = window.requestAnimationFrame.bind(window);

  /* 1) Kaydırma çubuğu */
  (function () {
    var bar = document.createElement('div');
    bar.id = 'fx-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var tick = false;
    function upd() {
      var h = de.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
      tick = false;
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; raf(upd); } }, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  })();

  /* 2) Kaydır ipucu (yalnızca ana sayfa hero) */
  (function () {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var c = document.createElement('div');
    c.className = 'fx-scroll';
    c.setAttribute('aria-hidden', 'true');
    c.innerHTML = '<span>Scroll</span><i></i>';
    hero.appendChild(c);
    window.addEventListener('scroll', function () { c.classList.toggle('gone', window.scrollY > 60); }, { passive: true });
  })();

  /* 3) Hero kor parçacıkları */
  (function () {
    if (reduce) return;
    var host = document.querySelector('.hero, .s-hero, .shop-hero');
    if (!host) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var cv = document.createElement('canvas');
    cv.id = 'fx-embers';
    cv.setAttribute('aria-hidden', 'true');
    host.insertBefore(cv, host.firstChild);
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5), ps = [], visible = true;
    var N = window.innerWidth < 640 ? 22 : 42;
    function size() {
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function mk(initial) {
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 10,
        r: Math.random() * 1.8 + .4,
        vy: Math.random() * .35 + .12,
        vx: (Math.random() - .5) * .18,
        ph: Math.random() * 6.28,
        a: Math.random() * .6 + .25
      };
    }
    size();
    for (var i = 0; i < N; i++) ps.push(mk(true));
    window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(host);
    }
    var t = 0;
    (function frame() {
      raf(frame);
      if (!visible || document.hidden) return;
      t += .016;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        p.y -= p.vy; p.x += p.vx + Math.sin(t + p.ph) * .12;
        if (p.y < -10) ps[i] = p = mk(false);
        var fade = Math.min(1, (H - p.y) / (H * .25), p.y / (H * .3) + .2);
        var al = Math.max(0, p.a * fade * (.6 + .4 * Math.sin(t * 2 + p.ph)));
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, 'rgba(255,90,100,' + al + ')');
        g.addColorStop(1, 'rgba(179,33,43,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, 6.283); ctx.fill();
      }
    })();
  })();

  /* 4) İmleç halkası + hero ışığı/paralaks */
  if (finePointer && !reduce) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.id = 'fx-dot'; ring.id = 'fx-ring';
    dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring); document.body.appendChild(dot);
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    var glow = document.querySelector('.hero-glow') || null;
    var logo = document.querySelector('.hero-logo');
    var hot = 'a, button, [role="button"], .shot, .zoom, .thumb, .size, summary, input, select, label, .card .stage';
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      de.classList.add('fx-mouse');
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      var t = e.target;
      ring.classList.toggle('hot', !!(t && t.closest && t.closest(hot)));
      if (glow && window.scrollY < innerHeight) {
        var dx = (mx / innerWidth - .5), dy = (my / innerHeight - .5);
        glow.style.transform = 'translate(calc(-50% + ' + (dx * 120) + 'px), calc(-50% + ' + (dy * 90) + 'px))';
        if (logo) logo.style.transform = 'translate(' + (dx * -10) + 'px,' + (dy * -8) + 'px)';
      }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { de.classList.remove('fx-mouse'); });
    window.addEventListener('mousedown', function () { ring.classList.add('down'); });
    window.addEventListener('mouseup', function () { ring.classList.remove('down'); });
    (function loop() {
      raf(loop);
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
    })();
  }

  /* 5) Kartlarda fare ışığı (+ fine pointer'da eğim) */
  (function () {
    var spot = document.querySelectorAll('.services li, .project, .card');
    function bindSpot(el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    }
    Array.prototype.forEach.call(spot, bindSpot);

    if (!finePointer || reduce) return;
    function bindTilt(el, max) {
      el.classList.add('fx-tilt');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transition = 'transform .12s linear';
        el.style.transform = 'perspective(900px) rotateX(' + (-py * max) + 'deg) rotateY(' + (px * max) + 'deg) scale(1.015)';
      }, { passive: true });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
      });
    }
    // .reveal animasyonu transform'u kapladığı için eğim iç öğelere uygulanır
    Array.prototype.forEach.call(document.querySelectorAll('.project'), function (el) { bindTilt(el, 5); });
    Array.prototype.forEach.call(document.querySelectorAll('.shot'), function (el) { bindTilt(el, 6); });
    // Mağaza kartları JS ile sonradan çiziliyor: gözlemle
    var shop = document.getElementById('collections');
    if (shop) {
      var bindShop = function () {
        Array.prototype.forEach.call(shop.querySelectorAll('.card'), function (c) {
          if (!c.__fx) { c.__fx = 1; bindSpot(c); }
          var st = c.querySelector('.stage');
          if (st && !st.__fx) { st.__fx = 1; bindTilt(st, 5); }
        });
      };
      bindShop();
      new MutationObserver(bindShop).observe(shop, { childList: true });
    }
  })();

  /* 6) Manyetik butonlar */
  (function () {
    if (!finePointer || reduce) return;
    Array.prototype.forEach.call(document.querySelectorAll('.cta, .about-link'), function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * .22, y = (e.clientY - (r.top + r.height / 2)) * .3;
        el.style.translate = x + 'px ' + y + 'px';
      }, { passive: true });
      el.addEventListener('mouseleave', function () { el.style.translate = ''; });
    });
  })();

  /* 7) Sayfa geçişi (iç bağlantılar) */
  (function () {
    function internalPage(a) {
      if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download')) return false;
      var u;
      try { u = new URL(a.href, location.href); } catch (e) { return false; }
      if (u.origin !== location.origin) return false;
      if (u.pathname === location.pathname) return false; // aynı sayfa / çapa
      return true;
    }
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a');
      if (!internalPage(a)) return;
      e.preventDefault();
      de.classList.add('fx-leave');
      setTimeout(function () { location.href = a.href; }, 230);
    });
    window.addEventListener('pageshow', function () { de.classList.remove('fx-leave'); });
  })();
  /* 7) Büyük başlıklar ekrana sığsın: telefonda yazı boyutu büyütülünce (erişilebilirlik / sayfa yakınlaştırma)
        uzun kelimeler kenardan taşıyordu. Taşan başlığın yazısı sığana kadar küçültülür. */
  (function () {
    var SEL = '.section h2, .s-hero h1, .shop-hero h1, .info h2, .cta-band h2, .disc h3, .hero h1, .about-foot, .contact .email';
    function fit() {
      var els = document.querySelectorAll(SEL);
      for (var i = 0; i < els.length; i++) {
        var el = els[i], box = el.parentElement;
        el.style.fontSize = '';
        for (var n = 0; n < 3; n++) {
          var cs = getComputedStyle(box);
          var avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
          var need = Math.max(el.scrollWidth, el.getBoundingClientRect().width);
          if (!avail || need <= avail + 1) break;
          el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * avail / need * 0.98) + 'px';
        }
      }
    }
    var t;
    function later() { clearTimeout(t); t = setTimeout(fit, 120); }
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    window.addEventListener('load', fit);
    window.addEventListener('resize', later);
    window.addEventListener('orientationchange', later);
    var lb = document.getElementById('lang-toggle'); /* dil değişince metin uzunluğu değişir */
    if (lb) lb.addEventListener('click', later);
  })();
})();
