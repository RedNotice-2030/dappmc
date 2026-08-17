// --- Hero background preload ---
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
  const bgImage = new Image();
  bgImage.src = 'assets/images/dappmc-bgc.png';
  bgImage.onload = function () {
    heroSection.classList.add('bg-loaded');
  };
}

document.addEventListener('DOMContentLoaded', function () {
  const privacyModalEl = document.getElementById('privacy-policy-modal');
  const agreeBtn = document.getElementById('btn-agree-privacy');

  if (privacyModalEl && agreeBtn) {
    // Only show if the visitor hasn't already agreed before
    const hasAgreed = localStorage.getItem('dappmc-privacy-agreed');

    if (!hasAgreed) {
      const privacyModal = new bootstrap.Modal(privacyModalEl);
      privacyModal.show();

      agreeBtn.addEventListener('click', function () {
        localStorage.setItem('dappmc-privacy-agreed', 'true');
        privacyModal.hide();
      });
    }
  }
});

// Secret Key Combo (e.g., typing "admin" anywhere on the page)
let secretCode = "";
const targetCode = "dappmc";

document.addEventListener("keydown", (e) => {
  secretCode += e.key.toLowerCase();
  
  // Keep string length capped
  if (secretCode.length > targetCode.length) {
    secretCode = secretCode.slice(-targetCode.length);
  }

  // If match found, trigger login redirect
  if (secretCode === targetCode) {
    // Resolve "cms" relative to the current page so it works no matter
    // which folder the app is served from (e.g. /dappmc/cms or /cms).
    window.location.href = new URL("staff-portal-2026", window.location.origin + window.location.pathname);
  }
});

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var contactModal = document.getElementById('contact-us-modal');
    if (!contactModal) return;

    contactModal.addEventListener('show.bs.modal', function () {
      document.getElementById('contact-form').reset();
    });

    document.getElementById('btn-send-message').addEventListener('click', function () {
      var name = document.getElementById('your-name').value.trim();
      var contact = document.getElementById('your-email-no').value.trim();
      var message = document.getElementById('message-text').value.trim();

      if (!name || !contact || !message) {
        if (window.toastr) {
          toastr.warning('Please fill in all fields.', 'Validation');
        } else {
          alert('Please fill in all fields.');
        }
        return;
      }

      var submitBtn = document.getElementById('btn-send-message');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      var params = new URLSearchParams();
      params.append('name', name);
      params.append('contact', contact);
      params.append('message', message);

      fetch('contact/send', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-CSRF-TOKEN': CSRF.tokenValue
        },
        body: params.toString()
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';

          if (result.ok && result.data.success) {
            var modal = bootstrap.Modal.getInstance(contactModal);
            if (modal) modal.hide();
            if (window.toastr) {
              toastr.success(result.data.message || 'Message sent!', 'Success');
            } else {
              alert(result.data.message || 'Message sent!');
            }
          } else {
            if (window.toastr) {
              toastr.error(result.data.message || 'Failed to send message.', 'Error');
            } else {
              alert(result.data.message || 'Failed to send message.');
            }
          }
        })
        .catch(function (err) {
          console.error(err);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';
          if (window.toastr) {
            toastr.error('Something went wrong. Please try again.', 'Error');
          }
        });
    });
  });
})();