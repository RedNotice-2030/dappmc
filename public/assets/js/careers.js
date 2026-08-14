(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var applyModal = document.getElementById('apply-modal');
    if (!applyModal) return;

    // Fill in the job title when the modal opens (triggered via data-bs-toggle on job cards)
    applyModal.addEventListener('show.bs.modal', function (event) {
      var button = event.relatedTarget;
      var jobTitle = button ? button.getAttribute('data-job-title') : '';
      document.getElementById('apply-job-title').textContent = jobTitle || '';
      document.getElementById('apply-form').dataset.jobTitle = jobTitle || '';

      // Reset the form each time it opens
      document.getElementById('apply-form').reset();
      var errEl = document.getElementById('apply-error');
      errEl.classList.add('d-none');
      errEl.textContent = '';
    });

    document.getElementById('btn-send-application').addEventListener('click', function () {
      var name = document.getElementById('applicant-name').value.trim();
      var contact = document.getElementById('applicant-contact').value.trim();
      var message = document.getElementById('applicant-message').value.trim();
      var resumeFile = document.getElementById('applicant-resume-file').files[0];
      var letterFile = document.getElementById('applicant-letter-file').files[0];
      var jobTitle = document.getElementById('apply-form').dataset.jobTitle || '';
      var errEl = document.getElementById('apply-error');

      errEl.classList.add('d-none');
      errEl.textContent = '';

      if (!name || !contact) {
        errEl.textContent = 'Please fill in your name and email/contact number.';
        errEl.classList.remove('d-none');
        return;
      }
      if (!resumeFile) {
        errEl.textContent = 'Please attach your resume (PDF).';
        errEl.classList.remove('d-none');
        return;
      }

      var formData = new FormData();
      formData.append('job_title', jobTitle);
      formData.append('name', name);
      formData.append('contact', contact);
      formData.append('message', message);
      formData.append('resume', resumeFile);
      if (letterFile) {
        formData.append('letter', letterFile);
      }

      var submitBtn = document.getElementById('btn-send-application');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch('careers/apply', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Application';

          if (result.ok && result.data.success) {
            var modal = bootstrap.Modal.getInstance(applyModal);
            if (modal) modal.hide();
            if (window.toastr) {
              toastr.success(result.data.message || 'Application submitted!', 'Success');
            } else {
              alert(result.data.message || 'Application submitted!');
            }
          } else {
            errEl.textContent = result.data.message || 'Failed to submit application.';
            errEl.classList.remove('d-none');
          }
        })
        .catch(function (err) {
          console.error(err);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Application';
          errEl.textContent = 'Something went wrong. Please try again.';
          errEl.classList.remove('d-none');
        });
    });
  });
})();