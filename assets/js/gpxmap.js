(function () {
  function parseGPX(xmlText) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlText, 'application/xml');
    var pts = doc.getElementsByTagName('trkpt');
    return Array.from(pts).map(function (pt) {
      return [parseFloat(pt.getAttribute('lat')), parseFloat(pt.getAttribute('lon'))];
    });
  }

  function addPhotoMarkers(map, el) {
    var raw = el.dataset.photos;
    if (!raw || typeof exifr === 'undefined') return;
    var urls = raw.split('|').filter(Boolean);
    urls.forEach(function (url, i) {
      exifr.gps(url).then(function (gps) {
        if (!gps || !gps.latitude || !gps.longitude) return;
        var filename = url.split('/').pop();
        var caption = filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
        var num = i + 1;
        var marker = L.marker([gps.latitude, gps.longitude], {
          icon: L.divIcon({
            className: 'photo-marker',
            html: '<span class="photo-marker-label">' + num + '</span>',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          })
        }).addTo(map);
        marker.bindTooltip(caption, { direction: 'top', offset: [0, -14] });
        marker.on('click', function () {
          var triggers = document.querySelectorAll('.lb-trigger');
          for (var j = 0; j < triggers.length; j++) {
            try {
              if (decodeURIComponent(triggers[j].dataset.src) === decodeURIComponent(url)) {
                triggers[j].click();
                break;
              }
            } catch (e) { /* malformed URI — skip */ }
          }
        });
      }).catch(function () { /* no GPS data — skip silently */ });
    });
  }

  function initMap(el) {
    var raw = el.dataset.gpxFiles;
    if (!raw) return;
    var urls = raw.split('|').filter(Boolean);
    if (!urls.length) return;

    var map = L.map(el);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    var colors = ['#2563eb', '#dc2626'];
    var bounds = L.latLngBounds();
    var pending = urls.length;

    addPhotoMarkers(map, el);

    urls.forEach(function (url, i) {
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
