<?= view('partials/header', ['title' => 'DAPPMC - About Us']) ?>
    <main>
      
      <!-- History / About Us Section -->
      <section class="py-5 bg-white" id="history">
        <div class="container my-4">
          <h1 class="about-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">
            About Us
          </h1>

          <div class="history-content text-dark">
            <div class="history-img-wrapper">
              <div class="position-relative overflow-hidden rounded-4 shadow-sm scroll-animate animate-left">
                <img
                  src="<?= base_url('assets/images/dappmc-bg.png') ?>"
                  alt="Dr. Arturo P. Pingoy Medical Center Building"
                  class="img-fluid rounded-4 history-img w-100"
                />
              </div>
            </div>

            <p class="mb-4 scroll-animate animate-bottom delay-1">
              The Hospital was established by spouses Arturo P. Pingoy, MD and
              Amparo Y. Pingoy, MD on May 12, 1961.
            </p>

            <ul class="list-unstyled history-list ms-2 mb-4 scroll-animate animate-bottom delay-1">
              <li class="d-flex align-items-start mb-3 scroll-animate">
                <i class="bi bi-check-circle fs-5 me-3 flex-shrink-0" style="color: #c6b350"></i>
                <span>In 1971, four private air-conditioned rooms were put up followed by the construction of a two-storey building that housed 8 private rooms and 4 suite rooms in 1974.</span>
              </li>
              <li class="d-flex align-items-start mb-3">
                <i class="bi bi-check-circle fs-5 me-3 flex-shrink-0" style="color: #c6b350"></i>
                <span>In 1998, the hospital's bed capacity was further expanded to 50 with the construction of 40 private rooms financed by the Land Bank of the Philippines.</span>
              </li>
              <li class="d-flex align-items-start mb-3">
                <i class="bi bi-check-circle fs-5 me-3 flex-shrink-0" style="color: #c6b350"></i>
                <span>In 2005, the Hospital upgraded to a tertiary hospital along with the construction of the Administrative building, making it a 100-bed hospital up to the present.</span>
              </li>
            </ul>

            <p class="mb-0 scroll-animate animate-bottom delay-2">
              In May 2012, construction of a new building started. The expansion
              will make the hospital a premier and largest hospital with its
              3-storey building.
            </p>
            <p class="mb-3 scroll-animate animate-bottom delay-2">
              It will house patient rooms, doctors' clinic, commercial spaces,
              and medical arts area. The hospital was granted by Philhealth as a
              Center of Safety and Center of Quality.
            </p>
            <p class="mb-0 scroll-animate animate-bottom delay-2">
              Dr. Arturo P. Pingoy Medical Center (DAPPMC) is a leading
              healthcare institution dedicated to providing exceptional medical
              services with a focus on patient care, innovation, and community
              well-being. Our mission is to deliver world-class healthcare with
              empathy, modern technology, and expert clinical teams.
            </p>
          </div>
        </div>
      </section>

      <section id="vision-mission" class="py-5">
        <div>
          <div>
            <h1 class="vision-mission-title text-center mt-5 scroll-animate animate-bottom delay-1 gold-outline-heading">
              Our Vision and Mission
            </h1>
            <p class="text-center mt-3 mx-auto scroll-animate animate-bottom delay-2" style="max-width: 800px">
              <strong>Vision:</strong> Delivering Exceptional Care with
              Compassion.
            </p>
            <p class="text-center mt-3 mx-auto scroll-animate animate-bottom delay-2" style="max-width: 800px">
              <strong>Mission:</strong> Advancing Life and the Environment
              through Innovation and Responsible Healthcare.
            </p>
          </div>
        </div>
      </section>

      <section id="ims-policy" class="py-5">
        <div>
          <div>
            <h1 class="policy-title text-center mt-5 scroll-animate animate-bottom delay-1 gold-outline-heading">
              IMS Policy
            </h1>
            <p class="text-center mt-3 mx-auto scroll-animate animate-bottom delay-2" style="max-width: 800px">
              We are committed to providing quality healthcare by fulfilling our
              obligations to our interested parties, complying with applicable
              regulatory requirements, continually improving our Integrated
              Management System (IMS), and protecting the environment through
              responsible use of resources and pollution prevention.
            </p>
          </div>
        </div>
      </section>

      <section id="core-values" class="py-5">
        <div>
          <div>
            <h1 class="core-values-title text-center mt-5 scroll-animate animate-bottom delay-1 gold-outline-heading">
              Core Values
            </h1>
            <p class="text-center mt-3 mx-auto scroll-animate animate-bottom delay-2" style="max-width: 800px">
              <strong>Integrity, Compassion, Accountability, Reliability, and Excellence</strong>
            </p>
          </div>
        </div>
      </section>

      <section class="py-5 location-section" id="location">
        <div class="container">
          <h2 class="about-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">
            Visit Us
          </h2>
          <div class="row g-4 align-items-start" id="visit">
            <div class="col-lg-8 scroll-animate animate-bottom">
              <div class="ratio ratio-16x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1982.0641963854737!2d124.8384650079339!3d6.505427124985633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f818f39a953585%3A0xbe8b260dc3b16569!2sDr.%20Arturo%20P.%20Pingoy%20Medical%20Center!5e0!3m2!1sen!2sph!4v1785994775056!5m2!1sen!2sph"
                  style="border: 0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                >
                </iframe>
              </div>
            </div>

            <div class="col-lg-4 scroll-animate animate-bottom">
              <h5 class="fw-bold mb-3">Dr. Arturo P. Pingoy Medical Center</h5>
              <p class="mb-2">
                <i class="bi bi-geo-alt-fill me-2" style="color: #c6b350"></i>
                Gensan Drive, Koronadal, 9506 South Cotabato
              </p>
              <p class="mb-2">
                <i class="bi bi-telephone-fill me-2" style="color: #c6b350"></i>
                <a href="tel:0832282202" class="text-decoration-none text-dark">(083) 228-2202</a>
              </p>
              <p class="mb-2">
                <i class="bi bi-clock-fill me-2" style="color: #c6b350"></i>
                Emergency: 24/7 &nbsp;|&nbsp; Outpatient: Mon&ndash;Sat, 8:00 AM&ndash;6:00 PM
              </p>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=YOUR+HOSPITAL+ADDRESS"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline-primary mt-3"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Accredited HMO Partners Section -->
      <section id="hmo-partners" class="py-5 border-bottom">
        <div class="container text-center mb-4 scroll-animate animate-bottom">
          <div class="info-text mx-auto" style="max-width: 600px">
            <h6 class="text-uppercase fw-bold" style="color: #c6b350">HMO & Insurance Partners</h6>
            <h3 class="fw-bold text-dark">Accredited Healthcare Providers</h3>
          </div>
        </div>

        <div class="marquee-wrapper scroll-animate animate-right">
          <div class="marquee-track">
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
            <div class="marquee-content">
              <?php foreach ($hmoLogos as $logo): ?>
                <img src="<?= base_url('assets/images/' . $logo[0]) ?>" alt="<?= esc($logo[1]) ?>" class="hmo-logo" />
              <?php endforeach; ?>
            </div>
            <div class="marquee-content" aria-hidden="true">
              <?php foreach ($hmoLogos as $logo): ?>
                <img src="<?= base_url('assets/images/' . $logo[0]) ?>" alt="<?= esc($logo[1]) ?>" class="hmo-logo" />
              <?php endforeach; ?>
            </div>
          </div>
        </div>
      </section>
    </main>
<?= view('partials/footer') ?>

