<?= view('partials/header', ['title' => 'DAPPMC - HMO Partners']) ?>
    <main>
      <section class="py-5">
        <div class="container my-4">
          <h1 class="hmo-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">
            HMO & Insurance Partners
          </h1>
          <p class="text-center text-muted mb-5 scroll-animate animate-bottom">
            We are accredited with the following HMO and insurance providers to serve you better.
          </p>

          <div class="row g-4 justify-content-center">
            <?php $hmoLogos = [
              ['1coophealth.png', '1Coop Health'],
              ['amaphil-logo.png', 'Amaphil'],
              ['avega.png', 'Avega'],
              ['benlife.png', 'BenLife'],
              ['cocolife.png', 'Cocolife'],
              ['etiqa.jpg', 'Etiqa'],
              ['forticare.png', 'Forticare'],
              ['generali.png', 'Generali'],
              ['getwell health.png', 'Getwell Health'],
              ['health-plan.png', 'Hive Health'],
              ['inlife health care.jpg', 'InLife'],
              ['intellicare.png', 'Intellicare'],
              ['lifeandhealth.jpg', 'Life & Health'],
              ['maxicare.jpg', 'Maxicare'],
              ['medasia.png', 'Medasia'],
              ['medilink-logo.png', 'Medilink'],
              ['medocare.png', 'Medocare'],
              ['pacificcross.png', 'Pacific Cross'],
              ['philcare-new-logo.jpg', 'PhilCare'],
              ['sunlife.png', 'SunLife GREPA'],
              ['valucare.png', 'ValuCare'],
              ['wellcare.png', 'WellCare'],
            ]; ?>
            <?php foreach ($hmoLogos as $logo): ?>
            <div class="col-6 col-md-4 col-lg-3 scroll-animate animate-bottom">
              <div class="card h-100 shadow-sm border-0 p-3 d-flex align-items-center justify-content-center" style="min-height: 120px;">
                <img src="<?= base_url('assets/images/' . $logo[0]) ?>" alt="<?= esc($logo[1]) ?>" class="img-fluid hmo-logo" style="max-height: 60px; width: auto;" />
              </div>
            </div>
            <?php endforeach; ?>
          </div>
        </div>
      </section>
      
    </main>
<?= view('partials/footer') ?>

