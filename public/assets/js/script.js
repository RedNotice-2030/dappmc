emailjs.init("oZfpOAxc3EJRG_Vjb");

// Configure Toastr Options
toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "timeOut": "4000"
};

// --- Contact Us Modal ---
function initContactModal() {
  const modalElement = document.getElementById("contact-us-modal");
  if (!modalElement || !window.bootstrap?.Modal) {
    return;
  }

  const btnSendMessage = document.getElementById("btn-send-message");
  if (!btnSendMessage || btnSendMessage.dataset.bound === "true") {
    return;
  }

  btnSendMessage.dataset.bound = "true";
  btnSendMessage.addEventListener("click", function () {
    const nameInput = document.getElementById("your-name").value.trim();
    const contactInput = document.getElementById("your-email-no").value.trim();
    const messageInput = document.getElementById("message-text").value.trim();

    if (!nameInput || !contactInput || !messageInput) {
      toastr.warning("Please fill out all fields before sending.", "Validation Warning");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+\d\s()-]{7,15}$/;
    const isEmail = emailPattern.test(contactInput);
    const isPhone = phonePattern.test(contactInput);

    if (!isEmail && !isPhone) {
      toastr.warning("Please enter a valid email address or phone number.", "Validation Warning");
      return;
    }

    btnSendMessage.disabled = true;
    toastr.info("Sending your message...", "Please wait");

    const templateParams = {
      name: nameInput,
      email: contactInput,
      message: messageInput
    };

    emailjs.send("dappmctest", "template_khde6m6", templateParams)
      .then(function () {
        toastr.clear();
        toastr.success("Your message has been sent!", "Success");
        document.getElementById("your-name").value = "";
        document.getElementById("your-email-no").value = "";
        document.getElementById("message-text").value = "";

        const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modalInstance.hide();
      })
      .catch(function (error) {
        toastr.clear();
        toastr.error("Failed to send email. Please try again.", "Error");
        console.error("EmailJS Error:", error);
      })
      .finally(function () {
        btnSendMessage.disabled = false;
      });
  });
}

initContactModal();
document.addEventListener("header-footer-loaded", initContactModal);

// --- Careers Apply Modal ---
const applyModalEl = document.getElementById('apply-modal');
if (applyModalEl) {
  applyModalEl.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const jobTitle = button ? button.getAttribute('data-job-title') : 'Application';
    document.getElementById('apply-job-title').textContent = jobTitle;
  });
}

const btnSendApplication = document.getElementById('btn-send-application');
if (btnSendApplication) {
  btnSendApplication.addEventListener('click', function (event) {
    event.preventDefault();
    const jobTitle = document.getElementById('apply-job-title').textContent;
    const nameInput = document.getElementById('applicant-name').value.trim();
    const contactInput = document.getElementById('applicant-contact').value.trim();
    const resumeInput = document.getElementById('applicant-resume').value.trim();
    const messageInput = document.getElementById('applicant-message').value.trim();

    const namePattern = /^[A-Za-zÀ-ž'\- ]{2,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+\d\s()-]{7,20}$/;

    if (!nameInput) {
      toastr.warning('Please enter your full name.', 'Validation Warning');
      return;
    }

    if (!namePattern.test(nameInput)) {
      toastr.warning('Name must contain only letters, spaces, apostrophes, or hyphens.', 'Validation Warning');
      return;
    }

    if (!contactInput) {
      toastr.warning('Please enter a valid email address or contact number.', 'Validation Warning');
      return;
    }

    const isEmail = emailPattern.test(contactInput);
    const isPhone = phonePattern.test(contactInput);

    if (!isEmail && !isPhone) {
      toastr.warning('Please enter a valid email address or phone number.', 'Validation Warning');
      return;
    }

    if (resumeInput) {
      try {
        const resumeUrl = new URL(resumeInput);
        const allowedHosts = ['drive.google.com', 'docs.google.com', 'www.drive.google.com', 'www.docs.google.com'];
        if (!allowedHosts.includes(resumeUrl.hostname)) {
          toastr.warning('Please provide a valid Google Drive link for your files.', 'Validation Warning');
          return;
        }
      } catch (error) {
        toastr.warning('Please enter a correct URL for your Google Drive file.', 'Validation Warning');
        return;
      }
    }

    btnSendApplication.disabled = true;
    toastr.info('Submitting your application...', 'Please wait');

    const templateParams = {
      job_title: jobTitle,
      applicant_name: nameInput,
      applicant_contact: contactInput,
      applicant_resume: resumeInput || 'Not provided',
      applicant_message: messageInput || 'No additional message'
    };

    emailjs.send('dappmctest', 'template_pdm6zka', templateParams)
      .then(function (response) {
        toastr.clear();
        toastr.success('Your application has been submitted!', 'Success');
        document.getElementById('applicant-name').value = '';
        document.getElementById('applicant-contact').value = '';
        document.getElementById('applicant-resume').value = '';
        document.getElementById('applicant-message').value = '';

        if (applyModalEl) {
          const modalInstance = bootstrap.Modal.getOrCreateInstance(applyModalEl);
          modalInstance.hide();
        }
      })
      .catch(function (error) {
        toastr.clear();
        toastr.error('Failed to submit application. Please try again.', 'Error');
        console.error('EmailJS Error:', error);
      })
      .finally(function () {
        btnSendApplication.disabled = false;
      });
  });
}

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
    window.location.href = new URL("cms", window.location.origin + window.location.pathname);
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
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
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