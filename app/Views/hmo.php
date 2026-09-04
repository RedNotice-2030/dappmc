<?= view('partials/header', ['title' => 'DAPPMC - HMO Partners']) ?>
    <main class="bg-white">
      <section class="py-5 bg-white">
        <div class="container my-4">
          <h1 class="hmo-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">
            HMO & Insurance Partners
          </h1>
          <p class="text-center text-muted mb-5 scroll-animate animate-bottom">
            We are accredited with the following HMO and insurance providers to serve you better.
          </p>

          <div class="row g-4 justify-content-center">
            <?php $hmoLogos = [
              ['amaphil-logo.png', 'Advance Medical Access'],
              ['intellicare.png', 'Asalus Corporation/Intellicare'],
              ['avega.png', 'Avega Managed Care, Inc.'],
              ['benlife.png', 'Beneficial Life Insurance Company, Inc.'],
              ['carewell.png', 'Carewell Health System, Inc.'],
              ['cocolife.png', 'COCOLIFE'],
              ['1coophealth.png', 'Cooperative Health Management Federation'],
              ['etiqa.jpg', 'Etiqa Life and General Assurance Philippines, Inc.'],
              ['forticare.png', 'Foreticare Health System International. Inc.'],
              ['flexicare.png', 'Health Delivery System, Inc. ( Flexicare)'],
              ['health-plan.png', 'Health Plan Philippines, Inc. (HPPI)'],
              ['ims.png', 'IMS WELLTH CARE, INC.'],
              ['inlife health care.jpg', 'InLife Benefits Insurance Company, Inc.'],
              ['icare.png', 'Inlife Care Insular health Care'],
              ['lacson-lacson.png', 'LACSON & LACSON'],
              ['lifeandhealth.jpg', 'LIFE AND HEALTH HMP, INC'],
              ['maxicare.jpg', 'MAXICARE'],
              ['medasia.png', 'Medasia Philippines, Inc.'],
              ['medicard.png', 'MEDICARD Philippines'],
              ['medilink-logo.png', 'Medilink Network, Inc.'],
              ['medocare.png', 'Medocare Health System'],
              ['mihealth.jpg', 'Mi Healthcare Inc. (MHI)'],
              ['pacificcross.png', 'Pacific Cross'],
              ['philcare-new-logo.jpg', 'Philhealthcare, INC.,'],
              ['sunlife.png', 'Sunlife Grepa Financial, Inc.'],
              ['trade.png', 'Trade Union Workers Health Organization, Inc.'],
              ['valucare.png', 'Value Care Health Systeam, Inc.'],
              ['wellcare.png', 'Welcare Health Maintenance Inc.'],
            ]; ?>
            <?php foreach ($hmoLogos as $logo): ?>
            <div class="col-6 col-md-4 col-lg-3 scroll-animate animate-bottom">
              <div class="card h-100 shadow-sm border-0 p-3 d-flex flex-column align-items-center justify-content-center text-center" style="min-height: 140px;">
                <img src="<?= base_url('assets/images/hmo/' . $logo[0]) ?>" alt="<?= esc($logo[1]) ?>" class="img-fluid hmo-logo mb-2" style="max-height: 60px; width: auto;" />
                <span class="small fw-semibold text-dark mt-auto"><?= esc($logo[1]) ?></span>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
        </div>
      </section>
      
    </main>
<?= view('partials/footer') ?>

