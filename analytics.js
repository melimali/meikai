/* Meikai — GA4 + çerez onayı
 * Tek yapman gereken: aşağıdaki GA_ID'ye Measurement ID'ni yaz (örn. 'G-ABC123XYZ9').
 * Boş bırakırsan hiçbir şey yüklenmez ve çerez bandı görünmez. */
(function () {
  var GA_ID = '';   // <-- G-XXXXXXXXXX

  if (!GA_ID) { window.meikaiTrack = function () {}; return; }

  var KEY = 'meikaiConsent';
  var T = {
    tr: { text: 'Siteyi geliştirmek için anonim ziyaret istatistikleri (Google Analytics) kullanıyoruz. Onay verirsen çerezler kullanılır.', yes: 'Kabul et', no: 'Reddet', prefs: 'Çerez tercihleri' },
    en: { text: 'We use anonymous visit statistics (Google Analytics) to improve the site. Cookies are only used if you accept.', yes: 'Accept', no: 'Decline', prefs: 'Cookie preferences' }
  };
  function lang() { return (document.documentElement.lang || 'tr').slice(0, 2) === 'en' ? 'en' : 'tr'; }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  var loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }
  function grant() { gtag('consent', 'update', { analytics_storage: 'granted' }); load(); }
  function deny() {
    gtag('consent', 'update', { analytics_storage: 'denied' });
  }

  /* Dışarıdan çağrılan olay fonksiyonu (onay yoksa hiçbir şey göndermez) */
  window.meikaiTrack = function (name, params) {
    if (get() !== 'granted') return;
    gtag('event', name, params || {});
  };

  /* Çerez bandı */
  var css = '.ck{position:fixed;left:1rem;right:1rem;bottom:calc(1rem + env(safe-area-inset-bottom,0px));z-index:900;max-width:30rem;margin:0 auto;display:flex;flex-direction:column;gap:.85rem;padding:1rem 1.1rem;border:1px solid rgb(255 255 255/.1);border-radius:.85rem;background:rgb(18 18 18/.96);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 20px 50px rgb(0 0 0/.55);font:400 .8rem/1.55 Inter,ui-sans-serif,system-ui,sans-serif;color:#bdbdbd}' +
    '.ck[hidden]{display:none}.ck-b{display:flex;gap:.6rem}.ck button{flex:1;font:500 .8rem Inter,ui-sans-serif,system-ui,sans-serif;padding:.6rem 1rem;border-radius:999px;cursor:pointer;border:1px solid rgb(255 255 255/.12);background:transparent;color:#ededed}' +
    '.ck button:hover{border-color:#b3212b}.ck .ck-y{background:#b3212b;border-color:#b3212b;color:#fff}.ck button:focus-visible{outline:2px solid #b3212b;outline-offset:3px}' +
    '.ck-prefs{background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;text-decoration:underline;text-underline-offset:3px}.ck-prefs:hover{color:#ededed}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var bar = document.createElement('div');
  bar.className = 'ck'; bar.hidden = true; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-live', 'polite');
  bar.innerHTML = '<p class="ck-t"></p><div class="ck-b"><button type="button" class="ck-n"></button><button type="button" class="ck-y"></button></div>';
  function paint() {
    var d = T[lang()];
    bar.setAttribute('aria-label', d.prefs);
    bar.querySelector('.ck-t').textContent = d.text;
    bar.querySelector('.ck-n').textContent = d.no;
    bar.querySelector('.ck-y').textContent = d.yes;
    document.querySelectorAll('.ck-prefs').forEach(function (b) { b.textContent = d.prefs; });
  }
  function close() { bar.hidden = true; }
  bar.querySelector('.ck-y').addEventListener('click', function () { set('granted'); grant(); close(); });
  bar.querySelector('.ck-n').addEventListener('click', function () { set('denied'); deny(); close(); });

  function init() {
    document.body.appendChild(bar);
    var f = document.querySelector('footer .f-links');
    if (f) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'ck-prefs';
      b.addEventListener('click', function () { bar.hidden = false; });
      f.appendChild(b);
    }
    paint();
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    var c = get();
    if (c === 'granted') grant(); else if (c !== 'denied') bar.hidden = false;

    /* Sosyal ve e-posta tıklamaları */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
      var h = a.getAttribute('href') || '';
      var where = a.closest('footer') ? 'footer' : a.closest('.drawer') ? 'menu' : a.closest('.contact, #iletisim') ? 'contact' : 'page';
      if (h.indexOf('instagram.com') > -1) window.meikaiTrack('social_click', { network: 'instagram', location: where, page: location.pathname });
      else if (h.indexOf('mailto:') === 0) window.meikaiTrack('email_click', { location: where, page: location.pathname });
      else if (h.indexOf('play.google.com') > -1) window.meikaiTrack('app_click', { location: where, page: location.pathname });
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
