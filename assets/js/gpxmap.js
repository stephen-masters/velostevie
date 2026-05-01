(function () {
  var HOVER_IN_DELAY = 80;
  var HOVER_OUT_DELAY = 200;
  var TOOLTIP_W = 200;
  var TOOLTIP_GAP = 12;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c];
    });
  }

  function parseGPX(xmlText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlText, 'application/xml');
    var pts = doc.getElementsByTagName('trkpt');
    return Array.from(pts).map(function (pt) {
      return [parseFloat(pt.getAttribute('lat')), parseFloat(pt.getAttribute('lon'))];
    });
  }

  function addPhotoMarkers(map, el, onBoundsReady) {
    var raw = el.dataset.photoMarkers;
    var markers = [];
    try { markers = raw ? JSON.parse(raw) : []; } catch { /* malformed JSON — leave markers empty */ }

    var photoBounds = L.latLngBounds();

    // Shared hover preview tooltip (one element, repositioned per marker)
    var tip = document.createElement('div');
    tip.className = 'velo-preview';
    tip.setAttribute('aria-hidden', 'true');
    tip.innerHTML =
      '<img class="velo-preview__img" alt="" />' +
      '<div class="velo-preview__body">' +
      '<div class="velo-preview__index"></div>' +
      '<div class="velo-preview__caption"></div>' +
      '</div>';
    map.getContainer().appendChild(tip);
    var tipImg = tip.querySelector('.velo-preview__img');
    var tipIndex = tip.querySelector('.velo-preview__index');
    var tipCaption = tip.querySelector('.velo-preview__caption');

    // Prefetch thumbs to avoid a blank flash on first hover
    markers.forEach(function (m) {
      if (m.thumb) { var img = new Image(); img.src = m.thumb; }
    });

    var hoverInTimer = null;
    var hoverOutTimer = null;
    var activeUrl = null;

    function showFor(m, btnEl, index) {
      activeUrl = m.url;
      document.querySelectorAll('.photo-marker-label.is-active')
        .forEach(function (e) { e.classList.remove('is-active'); });
      btnEl.classList.add('is-active');

      if (m.thumb) { tipImg.src = m.thumb; }
      tipImg.alt = m.caption;
      tipIndex.textContent = 'Photo ' + (index + 1);
      tipCaption.textContent = m.caption;

      // Edge-flip positioning: prefer above-right of marker, flip near edges
      var containerRect = map.getContainer().getBoundingClientRect();
      var btnRect = btnEl.getBoundingClientRect();
      var mx = btnRect.left - containerRect.left + btnRect.width / 2;
      var my = btnRect.top - containerRect.top + btnRect.height / 2;

      // Measure tooltip height while hidden
      tip.style.visibility = 'hidden';
      tip.classList.add('is-visible');
      var th = tip.offsetHeight || 168;
      tip.classList.remove('is-visible');
      tip.style.visibility = '';

      var W = containerRect.width;
      var H = containerRect.height;
      var tx = mx + 14;
      var ty = my - th - TOOLTIP_GAP;
      if (tx + TOOLTIP_W > W - 8) { tx = mx - TOOLTIP_W - 14; } // flip left
      if (ty < 8) { ty = my + 14; } // flip below
      tx = Math.max(8, Math.min(W - TOOLTIP_W - 8, tx));
      ty = Math.max(8, Math.min(H - th - 8, ty));

      tip.style.left = tx + 'px';
      tip.style.top = ty + 'px';
      tip.classList.add('is-visible');
      tip.setAttribute('aria-hidden', 'false');
    }

    function hide() {
      activeUrl = null;
      clearTimeout(hoverInTimer);
      clearTimeout(hoverOutTimer);
      tip.classList.remove('is-visible');
      tip.setAttribute('aria-hidden', 'true');
      document.querySelectorAll('.photo-marker-label.is-active')
        .forEach(function (e) { e.classList.remove('is-active'); });
    }

    function scheduleShow(m, btnEl, index) {
      clearTimeout(hoverOutTimer);
      clearTimeout(hoverInTimer);
      // If something is already showing, swap immediately (no in-delay)
      if (activeUrl !== null) {
        showFor(m, btnEl, index);
      } else {
        hoverInTimer = setTimeout(function () { showFor(m, btnEl, index); }, HOVER_IN_DELAY);
      }
    }

    function scheduleHide() {
      clearTimeout(hoverInTimer);
      clearTimeout(hoverOutTimer);
      hoverOutTimer = setTimeout(hide, HOVER_OUT_DELAY);
    }

    function openLightbox(url) {
      hide(); // dismiss preview before lightbox opens
      var triggers = document.querySelectorAll('.lb-trigger');
      for (var j = 0; j < triggers.length; j++) {
        try {
          if (decodeURIComponent(triggers[j].dataset.src) === decodeURIComponent(url)) {
            triggers[j].click();
            break;
          }
        } catch (e) { /* malformed URI — skip */ }
      }
    }

    markers.forEach(function (m, i) {
      var marker = L.marker([m.lat, m.lng], {
        icon: L.divIcon({
          className: 'photo-marker',
          html: '<button class="photo-marker-label" type="button" aria-label="Photo ' + (i + 1) + ': ' + escapeHtml(m.caption) + '">' + (i + 1) + '</button>',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        })
      }).addTo(map);
      photoBounds.extend([m.lat, m.lng]);

      marker.on('add', function () {
        var btnEl = marker.getElement() && marker.getElement().querySelector('.photo-marker-label');
        if (!btnEl) return;

        btnEl.addEventListener('mouseenter', function () { scheduleShow(m, btnEl, i); });
        btnEl.addEventListener('mouseleave', function () { scheduleHide(); });
        btnEl.addEventListener('focus', function () { scheduleShow(m, btnEl, i); });
        btnEl.addEventListener('blur', function () { scheduleHide(); });
        btnEl.addEventListener('click', function () { openLightbox(m.url); });
      });
    });

    // Hide preview on pan/zoom or tap on empty map
    map.on('movestart zoomstart', hide);
    map.on('click', hide);

    if (onBoundsReady) onBoundsReady(photoBounds.isValid() ? photoBounds : L.latLngBounds());
  }

  function initMap(el) {
    var map = L.map(el);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    var gpxRaw = el.dataset.gpxFiles;
    var gpxUrls = gpxRaw ? gpxRaw.split('|').filter(Boolean) : [];

    if (gpxUrls.length === 0) {
      // Photo-markers-only mode: fit map to photo GPS bounds
      addPhotoMarkers(map, el, function (photoBounds) {
        if (photoBounds && photoBounds.isValid()) {
          map.fitBounds(photoBounds, { padding: [40, 40] });
        }
      });
      return;
    }

    var colors = ['#2563eb', '#dc2626'];
    var bounds = L.latLngBounds();
    var pending = gpxUrls.length;

    addPhotoMarkers(map, el, null);

    gpxUrls.forEach(function (url, i) {
      fetch(url)
        .then(function (res) { return res.text(); })
        .then(function (text) {
          var coords = parseGPX(text);
          if (coords.length) {
            var poly = L.polyline(coords, {
              color: colors[i % colors.length],
              weight: 3,
              opacity: 0.85
            }).addTo(map);
            bounds.extend(poly.getBounds());
          }
        })
        .catch(function (e) {
          console.error('GPX load error:', url, e);
        })
        .finally(function () {
          pending--;
          if (pending === 0 && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [20, 20] });
          }
        });
    });
  }

  if (typeof L !== 'undefined') {
    document.querySelectorAll('.gpx-map').forEach(initMap);
  }
})();
