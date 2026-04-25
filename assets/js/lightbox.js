(function () {
  'use strict';

  var overlay, img, caption, close, prev, next, currentItems, currentCaptions, currentIndex;

  function buildLightbox() {
    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image lightbox');

    img = document.createElement('img');
    img.className = 'lb-img';
    img.alt = '';

    close = document.createElement('button');
    close.className = 'lb-close';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '&times;';

    prev = document.createElement('button');
    prev.className = 'lb-nav lb-prev';
    prev.setAttribute('aria-label', 'Previous image');
    prev.innerHTML = '&#8249;';

    next = document.createElement('button');
    next.className = 'lb-nav lb-next';
    next.setAttribute('aria-label', 'Next image');
    next.innerHTML = '&#8250;';

    caption = document.createElement('p');
    caption.className = 'lb-caption';

    var wrap = document.createElement('div');
    wrap.className = 'lb-wrap';
    wrap.appendChild(img);
    wrap.appendChild(caption);

    overlay.appendChild(wrap);
    overlay.appendChild(close);
    overlay.appendChild(prev);
    overlay.appendChild(next);
    document.body.appendChild(overlay);

    close.addEventListener('click', hideLightbox);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hideLightbox();
    });
    prev.addEventListener('click', function () { navigate(-1); });
    next.addEventListener('click', function () { navigate(1); });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('lb-active')) return;
      if (e.key === 'Escape') hideLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  function showLightbox(items, captions, index) {
    currentItems = items;
    currentCaptions = captions;
    currentIndex = index;
    updateImage();
    overlay.classList.add('lb-active');
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  function hideLightbox() {
    overlay.classList.remove('lb-active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + currentItems.length) % currentItems.length;
    updateImage();
  }

  function updateImage() {
    img.classList.remove('lb-img--loaded');
    img.src = currentItems[currentIndex];
    img.onload = function () { img.classList.add('lb-img--loaded'); };
    caption.textContent = currentCaptions[currentIndex] || '';
    prev.style.display = currentItems.length > 1 ? '' : 'none';
    next.style.display = currentItems.length > 1 ? '' : 'none';
  }

  function initGalleries() {
    var galleries = document.querySelectorAll('.photo-gallery');
    galleries.forEach(function (gallery) {
      var triggers = gallery.querySelectorAll('.lb-trigger');
      var srcs = Array.prototype.map.call(triggers, function (t) { return t.dataset.src; });
      var captions = Array.prototype.map.call(triggers, function (t) { return t.dataset.caption || ''; });
      triggers.forEach(function (trigger, i) {
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          showLightbox(srcs, captions, i);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildLightbox();
    initGalleries();
  });
})();
