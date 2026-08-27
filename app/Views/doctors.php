<?= view('partials/header', ['title' => 'DAPPMC - Doctors & Specialists']) ?>
    <main class="bg-white">
      

      <section id="doctors" class="py-5 bg-white">
        <div class="container">
          <div class="text-center mb-5">
            <h6 class="text-uppercase fw-bold" style="color: #c6b350">
              Our Medical Experts
            </h6>
            <h2 class="fw-bold" style="color: #002c6d">Find a Specialist</h2>
            <p class="text-muted">
              Click on a doctor's card to view their clinic hours and
              availability.
            </p>
          </div>

          <div class="row g-4 position-relative">
            <div class="col-lg-3">
              <div class="card shadow-sm border-0 sticky-sidebar">
                <div class="card-header bg-primary text-white py-3" style="background-color: #002c6d !important">
                  <h6 class="mb-0 fw-bold">
                    <i class="bi bi-funnel-fill me-2"></i>Specializations
                  </h6>
                </div>
                <div class="list-group list-group-flush doctor-filter-list">
                  <button class="list-group-item list-group-item-action active d-flex justify-content-between align-items-center" data-filter="all">
                    All Doctors
                    <span class="badge bg-secondary rounded-pill" data-count-for="all">0</span>
                  </button>
                  <?php $specs = [
                    'cardiology' => 'Cardiology',
                    'pediatrics' => 'Pediatrics',
                    'radiology' => 'Radiology',
                    'internal-medicine' => 'Internal Medicine',
                    'physiology' => 'Physiology',
                    'anesthesiology' => 'Anesthesiology',
                    'nephrology' => 'Nephrology',
                    'urology' => 'Urology',
                    'orthopedics' => 'Orthopedics',
                    'pulmonology' => 'Pulmonology',
                    'ent' => 'ENT',
                    'general-surgery' => 'General Surgery',
                    'ob-gynecology' => 'OB-Gynecology',
                    'neurology' => 'Neurology',
                  ]; ?>
                  <?php foreach ($specs as $key => $label): ?>
                  <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" data-filter="<?= esc($key) ?>">
                    <?= esc($label) ?>
                    <span class="badge bg-light text-dark rounded-pill" data-count-for="<?= esc($key) ?>">0</span>
                  </button>
                  <?php endforeach; ?>
                </div>
              </div>
            </div>

            <div class="col-lg-9">
              <div class="row g-4" id="doctor-cards-container" data-doctors-render>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
<?= view('partials/footer', ['extraScripts' => '
    <script src="' . base_url('assets/js/cms.js') . '"></script>
    <script src="' . base_url('assets/js/animations.js') . '"></script>
    <script src="' . base_url('assets/js/content-renderer.js') . '"></script>
']) ?>

