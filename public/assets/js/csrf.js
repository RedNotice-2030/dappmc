(function (window) {
  'use strict';
  var nameMeta = document.querySelector('meta[name="csrf-token-name"]');
  var valueMeta = document.querySelector('meta[name="csrf-token-value"]');

  window.CSRF = {
    headerName: 'X-CSRF-TOKEN',
    tokenValue: valueMeta ? valueMeta.getAttribute('content') : ''
  };
})(window);