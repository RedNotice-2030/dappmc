<?= view('partials/header', ['title' => 'DAPPMC - Services']) ?>
    
    <main>
      <section class="py-5 packages-section" id="packages">
        <div class="container my-4">
          <h1 class="specialties-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Health Packages</h1>
          <div class="row g-4" data-packages-render></div>
        </div>
      </section>
      <section class="py-5 specialties-section" id="specialties">
        <div class="container my-4">
          <h1 class="specialties-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Medical Specialties</h1>
        </div>
      </section>
      <section class="py-5 diagnostic-section" id="lab">
        <div class="container my-4">
          <h1 class="diagnostic-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Diagnostic Services</h1>
        </div>
      </section>
      <section class="py-5 emergency-section">
        <div class="container my-4">
          <h1 class="emergency-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Emergency Room Information</h1>
        </div>
      </section>
    </main>
<?= view('partials/footer', ['extraScripts' => '
    <script src="' . base_url('assets/js/cms.js') . '"></script>
    <script src="' . base_url('assets/js/animations.js') . '"></script>
    <script src="' . base_url('assets/js/content-renderer.js') . '"></script>
    <script src="' . base_url('assets/js/packages-interactions.js') . '"></script>
']) ?>

