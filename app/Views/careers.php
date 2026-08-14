<?= view('partials/header', ['title' => 'DAPPMC - Careers']) ?>
    <main>
      <section class="py-5">
        <div class="container my-4">
          <h1 class="careers-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">
            Join Our Team
          </h1>
          <div class="text-center text-muted scroll-animate animate-bottom">
            At Dr. Arturo P. Pingoy Medical Center, we're driven by a shared
            commitment to service, compassion, and excellence in patient care.
            We're always looking for dedicated professionals &mdash; from clinical
            staff to administrative support &mdash; who share our passion for making a
            difference in the lives of our patients and community. Explore our
            current openings below and take the next step in your healthcare
            career with us.
          </div>
        </div>
      </section>

      <section class="py-5">
        <div class="container">
          <h2 class="careers-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">
            Open Positions
          </h2>
          <div class="row g-4" data-jobs-render></div>
        </div>
      </section>

      <!-- modal for applying jobs -->
      <div class="modal fade" id="apply-modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                Apply for <span id="apply-job-title"></span>
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="apply-form" enctype="multipart/form-data">
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="applicant-name" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email / Contact No.</label>
                  <input type="text" class="form-control" id="applicant-contact" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Resume <span class="text-danger">*</span></label>
                  <input type="file" class="form-control" id="applicant-resume-file" accept=".pdf,application/pdf" required />
                  <div class="form-text text-muted">PDF only, max 10MB.</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Application Letter</label>
                  <input type="file" class="form-control" id="applicant-letter-file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                  <div class="form-text text-muted">Word document (.doc or .docx) only, max 10MB. Optional.</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Cover Message (optional)</label>
                  <textarea class="form-control" id="applicant-message" rows="3"></textarea>
                </div>
                <div class="alert alert-danger d-none" id="apply-error"></div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">
                Cancel
              </button>
              <button type="button" class="btn btn-primary" id="btn-send-application">
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </main>
<?= view('partials/footer', ['extraScripts' => '
    <script src="' . base_url('assets/js/cms.js') . '"></script>
    <script src="' . base_url('assets/js/animations.js') . '"></script>
    <script src="' . base_url('assets/js/content-renderer.js') . '"></script>
    <script src="' . base_url('assets/js/careers.js') . '"></script>
']) ?>

