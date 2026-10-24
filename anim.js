/* Meikai — animasyon katmanı (anim.css ile). Hata verirse site çalışmaya devam eder. */
(function () {
  'use strict';
  var de = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce) return;
  de.classList.add('anim');
  var raf = window.requestAnimationFrame.bind(window);
  var introPlaying = !de.classList.contains('skip-intro') && !!document.querySelector('.intro');
  var isEn = function () { return (de.lang || 'tr').slice(0, 2) === 'en'; };
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  /* 1) Yazı karıştırma (katakana → gerçek metin) */
  var GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロ冥界魂技作';
  function scramble(el) {
    if (el.__scr || el.children.length) return;
    var orig = el.textContent;
    if (!orig.trim()) return;
    el.__scr = 1;
    var r = el.getBoundingClientRect();
    var keep = { w: el.style.width, d: el.style.display, ws: el.style.whiteSpace, o: el.style.overflow };
    if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
    el.style.width = r.width + 'px'; el.style.whiteSpace = 'nowrap'; el.style.overflow = 'hidden';
    var len = orig.length, frame = 0, total = Math.min(16, 6 + len);
    (function step() {
      // Dil değişirse karıştırmayı bırak
      if (el.textContent.length !== len && frame > 0) { done(); return; }
      var out = '';
      for (var i = 0; i < len; i++) {
        var c = orig.charAt(i);
        out += (c === ' ' || i < (frame / total) * len) ? c : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
      }
      el.textContent = out;
      if (++frame <= total) setTimeout(step, 30); else { el.textContent = orig; done(); }
    })();
    function done() { el.style.width = keep.w; el.style.display = keep.d; el.style.whiteSpace = keep.ws; el.style.overflow = keep.o; el.__scr = 0; }
  }
  if (finePointer) {
    each('nav ul a, .drawer-links a > span, .cta > span, .cta-ghost, .btn > span, .btn-ghost, .about-link > span, .chip, .menu-btn > span, .f-links a:not(.f-ig), .project-meta span:first-child, .instagram', function (el) {
      var host = el.closest('a, button') || el;
      host.addEventListener('mouseenter', function () { scramble(el); });
    });
  }

  /* 2) Tıklama: mürekkep patlaması */
  var KANJI = ['冥', '界', '魂', '炎', '影', '鬼'];
  document.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    var b = document.createElement('span');
    b.className = 'fx-burst';
    b.setAttribute('aria-hidden', 'true');
    b.style.left = e.clientX + 'px'; b.style.top = e.clientY + 'px';
    var h = '<b></b>';
    for (var i = 0; i < 9; i++) h += '<i style="--a:' + (i * 40 + Math.random() * 20) + 'deg;--r:' + (26 + Math.random() * 30) + 'px"></i>';
    if (e.target.closest && e.target.closest('a, button')) h += '<s>' + KANJI[(Math.random() * KANJI.length) | 0] + '</s>';
    b.innerHTML = h;
    document.body.appendChild(b);
    setTimeout(function () { b.remove(); }, 800);
  }, { passive: true });

  /* 3) İmleç: kıvılcım izi + "AÇ / VIEW" etiketi */
  if (finePointer) {
    var cv = document.createElement('canvas');
    cv.id = 'fx-trail'; cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 1.5), sparks = [], running = false, lx = -1, ly = -1;
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); window.addEventListener('resize', size);
    function loop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = sparks.length - 1; i >= 0; i--) {
        var p = sparks[i];
        p.l -= .028; p.x += p.vx; p.y += p.vy; p.vy -= .02;
        if (p.l <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = p.l;
        ctx.fillStyle = p.l > .6 ? '#ff6b74' : '#b3212b';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.l + .3, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (sparks.length) raf(loop); else running = false;
    }
    window.addEventListener('mousemove', function (e) {
      var dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      var n = Math.min(3, (Math.abs(dx) + Math.abs(dy)) / 14);
      for (var i = 0; i < n && sparks.length < 90; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - .5) * .8, vy: (Math.random() - .2) * .6, r: Math.random() * 1.6 + .6, l: 1 });
      }
      if (!running && sparks.length) { running = true; raf(loop); }
    }, { passive: true });

    var ring = document.getElementById('fx-ring');
    if (ring) {
      window.addEventListener('mouseover', function (e) {
        var t = e.target.closest && e.target.closest('.project-link, .shot, .card .stage, .coll-logo');
        if (t) { ring.setAttribute('data-label', isEn() ? 'VIEW' : 'AÇ'); ring.classList.add('label'); }
        else ring.classList.remove('label');
      }, { passive: true });
    }
  }

  /* 4) Hero: fare paralaksı + harf glitch + sayaç */
  var hero = document.querySelector('.pg-home .hero');
  if (hero) {
    if (finePointer) {
      window.addEventListener('mousemove', function (e) {
        if (window.scrollY > innerHeight) return;
        var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
        hero.style.setProperty('--mx1', (x * -18) + 'px'); hero.style.setProperty('--my1', (y * -10) + 'px');
        hero.style.setProperty('--mx2', (x * 40) + 'px'); hero.style.setProperty('--my2', (y * 30) + 'px');
        hero.style.setProperty('--mx3', (x * 70) + 'px'); hero.style.setProperty('--my3', (y * 45) + 'px');
      }, { passive: true });
    }
    var word = hero.querySelector('.hero-word');
    if (word) setTimeout(function () { word.classList.add('ready'); }, introPlaying ? 4000 : 1500);
    var letters = hero.querySelectorAll('.hero-word span');
    var glitchStart = introPlaying ? 4200 : 2000;
    setTimeout(function tick() {
      if (!document.hidden && window.scrollY < innerHeight && letters.length) {
        var l = letters[(Math.random() * letters.length) | 0];
        l.classList.remove('glitch'); void l.offsetWidth; l.classList.add('glitch');
        setTimeout(function () { l.classList.remove('glitch'); }, 500);
      }
      setTimeout(tick, 2600 + Math.random() * 3200);
    }, glitchStart);
    setTimeout(function () {
      each('.hero-stats b', function (b) {
        var to = parseInt(b.textContent, 10) || 0, t0 = performance.now(), dur = 1300;
        (function f(now) {
          var k = Math.min(1, (now - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
          b.textContent = (v < 10 ? '0' : '') + v;
          if (k < 1) raf(f);
        })(t0);
      });
    }, introPlaying ? 2900 : 500);
  }

  /* 5) Kaydırma: paralaks + bant eğilmesi */
  var marquees = document.querySelectorAll('.fx-marquee');
  var kanjis = document.querySelectorAll('.sec-kanji, .page-kanji');
  var lastY = window.scrollY, sk = 0, ticking = false;
  function onFrame() {
    var y = window.scrollY, v = y - lastY; lastY = y;
    sk += (Math.max(-14, Math.min(14, v * -.6)) - sk) * .25;
    if (Math.abs(sk) < .05) sk = 0;
    for (var i = 0; i < marquees.length; i++) marquees[i].style.setProperty('--sk', sk.toFixed(2) + 'deg');
    if (hero && y < innerHeight * 1.2) { hero.style.setProperty('--sy', (y * .35) + 'px'); hero.style.setProperty('--sy2', (y * .55) + 'px'); }
    for (var j = 0; j < kanjis.length; j++) {
      var r = kanjis[j].getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      kanjis[j].style.setProperty('--ky', ((r.top + r.height / 2 - innerHeight / 2) * -.18).toFixed(1) + 'px');
    }
    if (sk !== 0) raf(onFrame); else ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; raf(onFrame); } }, { passive: true });
  raf(onFrame);

  /* 6) Görününce tetiklenenler */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('lit'); io.unobserve(e.target); }
      });
    }, { threshold: .2 });
    each('.sec-kanji, .project-media, .torii', function (el) { io.observe(el); });
  } else {
    each('.sec-kanji, .project-media, .torii', function (el) { el.classList.add('lit'); });
  }

  /* 7) Sayfa geçişi: kırmızı perde (fx.js'in fx-leave sınıfıyla) */
  var cur = document.createElement('div');
  cur.id = 'fx-curtain'; cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<span>冥</span>';
  var arrived = false;
  try { arrived = sessionStorage.getItem('fxNav') === '1'; sessionStorage.removeItem('fxNav'); } catch (e) {}
  if (arrived) cur.className = 'hold';
  document.body.appendChild(cur);
  if (arrived) raf(function () { raf(function () { cur.className = 'out'; }); });
  new MutationObserver(function () {
    if (de.classList.contains('fx-leave')) { cur.className = ''; try { sessionStorage.setItem('fxNav', '1'); } catch (e) {} }
  }).observe(de, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('pageshow', function (e) { if (e.persisted) cur.className = 'out'; });
})();
