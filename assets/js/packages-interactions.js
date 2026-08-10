/**
 * DAPPMC Package Flip-Card Interactions
 * Rebinds flip card click handlers for dynamically rendered content.
 */
(function (window) {
  'use strict';

  var currentFlipped = null;

  function closeCurrent() {
    if (currentFlipped) {
      currentFlipped.classList.remove('is-flipped');
      currentFlipped = null;
    }
  }

  function bindFlipCards(root) {
    var scope = root || document;
    var flipBtns = scope.querySelectorAll('.btn-flip');

    flipBtns.forEach(function (btn) {
      if (btn.dataset.flipBound === 'true') return;
      btn.dataset.flipBound = 'true';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var col = e.currentTarget.closest('.col-md-6, .col, .col-lg-4');
        if (!col) return;
        var inner = col.querySelector('.flip-card-inner');
        if (!inner) return;

        if (currentFlipped && currentFlipped !== inner) {
          currentFlipped.classList.remove('is-flipped');
        }

        var nowFlipped = inner.classList.toggle('is-flipped');
        currentFlipped = nowFlipped ? inner : null;
      });
    });

    // Close buttons (rebind after content refresh)
    var closeBtns = scope.querySelectorAll('.btn-close-back');
    closeBtns.forEach(function (btn) {
      if (btn.dataset.closeBound === 'true') return;
      btn.dataset.closeBound = 'true';
      btn.addEventListener('click', function (e) {
        if (e.target.matches('.btn-close-back')) {
          var inner = e.target.closest('.flip-card-inner');
          if (inner) {
            inner.classList.remove('is-flipped');
            if (currentFlipped === inner) currentFlipped = null;
          }
        }
      });
    });
  }

  function init() {
    bindFlipCards(document);
  }

  // Bind once on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('header-footer-loaded', init);

  window.PackageInteractions = {
    init: init,
    bindFlipCards: bindFlipCards
  };
})(window);