<?= view('partials/header', ['title' => 'DAPPMC - News & Announcements']) ?>
    <main>
      <section class="py-5 news-section" id="news">
        <div class="container my-4">
          <h1 class="news-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">News & Announcements</h1>
          <div class="row g-4 news-card-container"></div>
        </div>
      </section>
      <section class="py-5 health-advisories-section" id="advisories">
        <div class="container my-4">
          <h1 class="health-advisories-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Health Advisories</h1>
          <div class="row g-4 news-card-container"></div>
        </div>
      </section>
      <section class="py-5 events-section" id="events">
        <div class="container my-4">
          <h1 class="events-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Hospital Events</h1>
          <div class="row g-4 news-card-container"></div>
        </div>
      </section>
      <section class="py-5 drives-section" id="drives">
        <div class="container my-4">
          <h1 class="drives-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Health Drives</h1>
          <div class="row g-4 news-card-container"></div>
        </div>
      </section>
      <section class="py-5 covid-section" id="alerts">
        <div class="container my-4">
          <h1 class="covid-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">COVID Alerts</h1>
          <div class="row g-4 news-card-container"></div>
        </div>
      </section>

      <!-- News Read More Modal -->
      <div class="modal fade" id="news-read-modal" tabindex="-1" aria-labelledby="newsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <div>
                <h1 class="modal-title fs-5" id="news-modal-title">News Title</h1>
                <div class="small text-white-50">
                  <span id="news-modal-category" class="me-2"></span>
                  <span id="news-modal-date"></span>
                </div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="news-modal-body"></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      
    </main>
<?= view('partials/footer', ['extraScripts' => '
    <script src="' . base_url('assets/js/cms.js') . '"></script>
    <script src="' . base_url('assets/js/animations.js') . '"></script>
    <script src="' . base_url('assets/js/content-renderer.js') . '"></script>
']) ?>

