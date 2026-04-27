(function () {
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
    try { markers = raw ? JSON.parse(raw) : []; } catch (e) {}

    var photoBounds = L.latLngBounds();
    markers.forEach(function (m, i) {
      var marker = L.marker([m.lat, m.lng], {
        icon: L.divIcon({
          className: 'photo-marker',
          html: '<span class="photo-marker-label">' + (i + 1) + '</span>',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        })
      }).addTo(map);
      photoBounds.extend([m.lat, m.lng]);
      marker.bindTooltip(m.caption, { direction: 'top', offset: [0, -14] });
      marker.on('click', function () {
        var triggers = document.querySelectorAll('.lb-trigger');
        for (var j = 0; j < triggers.length; j++) {
          try {
            if (decodeURIComponent(triggers[j].dataset.src) === decodeURIComponent(m.url)) {
              triggers[j].click();
              break;
            }
          } catch (e) { /* malformed URI — skip */ }
        }
      });
    });

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
