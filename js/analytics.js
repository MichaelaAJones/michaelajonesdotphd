/*
  Site analytics (GoatCounter — free, no cookies, no consent banner needed).

  SETUP: sign up at https://www.goatcounter.com/signup, pick a site code
  (e.g. "michaelajones"), and put it below. Until then this file does nothing.
  Your dashboard will be at https://<code>.goatcounter.com

  What gets recorded:
    - every page view (page, referrer, country, browser/device size)
    - clicks on outbound links, email links and downloads, shown in the
      dashboard as paths starting with "click/" (e.g. click/doi.org/10.1038/...)
*/
(function () {
  var CODE = 'michaelajones';

  if (!CODE || CODE === 'YOUR-GOATCOUNTER-CODE') return;
  // Don't count your own visits while previewing locally.
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:') return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + CODE + '.goatcounter.com/count');
  document.head.appendChild(s);

  var DOWNLOAD = /\.(pdf|zip|docx?|pptx?|xlsx?|png|jpe?g)$/i;

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !window.goatcounter || !window.goatcounter.count) return;

    var href = a.getAttribute('href');
    var path;
    if (href.indexOf('mailto:') === 0) {
      path = 'click/email';
    } else {
      var url;
      try { url = new URL(href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) {
        path = 'click/' + url.hostname.replace(/^www\./, '') + url.pathname;
      } else if (DOWNLOAD.test(url.pathname)) {
        path = 'click/download' + url.pathname;
      } else {
        return; // internal page links are already counted as page views
      }
    }

    var label = (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    window.goatcounter.count({
      path: path,
      title: label + ' (from ' + (location.pathname.split('/').pop() || 'index.html') + ')',
      event: true
    });
  });
})();
