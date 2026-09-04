(function (window) {
  'use strict';

  var observer = null;

  function initObserver() {
    if (observer) return;
    observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }

  function reveal(root) {
    initObserver();
    var scope = root || document;
    var elements = scope.querySelectorAll('.scroll-animate:not(.visible)');
    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    reveal(document);
  });

  window.ContentAnimations = {
    reveal: reveal
  };
})(window);