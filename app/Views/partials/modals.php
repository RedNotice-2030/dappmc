<?php /** @var \CodeIgniter\View\View $this */ ?>
<!-- Contact Us Modal (available globally via footer) -->
<div class="modal fade" id="contact-us-modal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <img class="logo-nav img-fluid modal-logo" src="<?= base_url('assets/images/dappmc-logo.png') ?>" alt="" />
        <h1 class="modal-title fs-5" id="contactModalLabel">Contact Us</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="contact-form">
          <div class="mb-3">
            <label for="your-name" class="col-form-label">Your Name:</label>
            <input type="text" class="form-control" id="your-name" required />
          </div>
          <div class="mb-3">
            <label for="your-email-no" class="col-form-label">Your Email/Contact No. :</label>
            <input type="text" class="form-control" id="your-email-no" required />
          </div>
          <div class="mb-3">
            <label for="message-text" class="col-form-label">Message:</label>
            <textarea class="form-control" id="message-text" required></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="btn-send-message">Send message</button>
      </div>
    </div>
  </div>
</div>

<!-- Privacy Policy Modal (available globally via footer) -->
<div class="modal fade" id="privacy-policy-modal" tabindex="-1"
    aria-labelledby="privacyModalLabel" aria-hidden="true"
    data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <img class="logo-nav img-fluid modal-logo" src="<?= base_url('assets/images/dappmc-logo.png') ?>" alt="" />
        <h5 class="modal-title" id="privacyModalLabel">Data Privacy Policy</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

        <p class="small text-muted">
          Dr. Arturo P. Pingoy Medical Center is committed to protecting your personal data in accordance with the
          <strong>Data Privacy Act of 2012 (RA 10173)</strong> and its Implementing Rules and Regulations.
        </p>

        <h6 class="fw-bold mt-4">What Information We Collect</h6>
        <p class="small text-muted">
          We may collect personal information such as your name, contact details, and medical records,
          as well as sensitive personal information (e.g., health status, treatment history) necessary to provide you with proper medical care.
        </p>

        <h6 class="fw-bold mt-4">Why We Collect It</h6>
        <p class="small text-muted">
          Your information is collected and processed to: provide medical care and treatment, process appointments and billing,
          respond to inquiries, coordinate with HMOs/insurance providers, and comply with legal and regulatory requirements.
        </p>

        <h6 class="fw-bold mt-4">How We Protect Your Data</h6>
        <p class="small text-muted">
          We implement physical, technical, and organizational safeguards — including restricted access, secure storage,
          and confidentiality protocols — to protect your data from unauthorized access, alteration, or disclosure.
        </p>

        <h6 class="fw-bold mt-4">Your Rights</h6>
        <p class="small text-muted">As a data subject, you have the right to:</p>
        <ul class="small text-muted">
          <li>Be informed of how your data is processed</li>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate or incomplete data</li>
          <li>Object to or withdraw consent for processing (where applicable)</li>
          <li>Request erasure or blocking of data, subject to legal and medical record-keeping requirements</li>
        </ul>

        <h6 class="fw-bold mt-4">Data Sharing</h6>
        <p class="small text-muted">
          Your data may be shared with accredited HMOs, insurance providers, or regulatory bodies only as necessary
          to deliver services or comply with legal obligations. All third parties handling your data are required to
          uphold the same privacy and security standards.
        </p>

        <h6 class="fw-bold mt-4">Data Retention</h6>
        <p class="small text-muted">
          Your personal data is retained only for as long as necessary to fulfill the purposes stated above,
          or as required by applicable laws and medical record-keeping regulations.
        </p>

        <h6 class="fw-bold mt-4">Contact Us</h6>
        <p class="small text-muted">
          For questions, concerns, or to exercise your data privacy rights, please contact our Data Protection Officer
          at <a href="mailto:tdchi.1961@gmail.com">tdchi.1961@gmail.com</a> or call (083) 228-2202.
        </p>

        <p class="small text-muted fst-italic mt-4">
          This is a summary of our full Data Privacy and Protection Policy. The complete policy is available upon request
          from our Data Protection Officer.
        </p>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="btn-agree-privacy">I Agree</button>
      </div>
        </div>
  </div>
</div>