<?php /** @var \CodeIgniter\View\View $this */ ?>
<?= view('partials/header', ['title' => 'DAPPMC - Home']) ?>
    <main>
      <!-- Hero Section -->
      <section class="hero-section text-white">
        <div class="container text-center text-lg-start">
          <div class="row align-items-center g-4">
            
            <!-- Text Column -->
            <div class="col-lg-8 order-2 order-lg-1">
              <h1 class="company display-4 fw-bold mb-0 hero-animate">
                DR. ARTURO P. PINGOY
              </h1>
              <h1 class="company display-4 fw-bold mb-3 hero-animate delay-1">
                MEDICAL CENTER
              </h1>
              <p class="motto lead mb-4 fw-bold hero-animate delay-2">
                INTEGRITY - COMPASSION - ACCOUNTABILITY - RELIABILITY - EXCELLENCE
              </p>
              <div class="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 hero-animate delay-3">
                <a
                  href="#appointment"
                  class="contact-btn btn btn-light btn-lg rounded-pill px-4 fw-bold"
                  style="color: #3a3a3a" data-bs-toggle="modal" data-bs-target="#contact-us-modal" data-bs-whatever="user@example.com"
                >
                  Contact Us
                </a>
                <a
                  href="#services"
                  class="btn btn-outline-light btn-lg rounded-pill px-4"
                >
                  Our Services
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Action Cards Section -->
      <section class="quick-actions-section bg-light py-4 border-bottom">
        <div class="container">
          <div class="row g-3">
            
            <!-- Card 1: Emergency -->
            <div class="col-md-4">
              <div class="p-3 bg-danger text-white rounded-3 shadow-sm d-flex align-items-center h-100">
                <i class="bi bi-telephone-outbound-fill fs-1 me-3"></i>
                <div>
                  <h6 class="mb-1 text-uppercase fw-bold">24/7 Emergency</h6>
                  <a href="tel:911" class="text-white text-decoration-none fs-5 fw-bold">Call 911 / (083) 228 2202</a>
                </div>
              </div>
            </div>

            <!-- Card 2: Find a Doctor -->
            <div class="col-md-4">
              <div class="p-3 text-white rounded-3 shadow-sm d-flex align-items-center h-100" style="background-color: #002c6d;">
                <i class="bi bi-person-badge fs-1 me-3" style="color: #c6b350;"></i>
                <div>
                  <h6 class="mb-1 text-uppercase fw-bold">Find a Physician</h6>
                  <a href="<?= site_url('doctors') ?>" class="text-white text-decoration-none small">Browse specialists & clinic schedules &rarr;</a>
                </div>
              </div>
            </div>

            <!-- Card 3: Patient Services -->
            <div class="col-md-4">
              <div class="p-3 bg-white text-dark rounded-3 shadow-sm border d-flex align-items-center h-100">
                <i class="bi bi-calendar-check fs-1 me-3 text-primary"></i>
                <div>
                  <h6 class="mb-1 text-uppercase fw-bold">Outpatient Services</h6>
                  <a href="<?= site_url('services') ?>#packages" class="text-primary text-decoration-none small">Explore lab & diagnostic packages &rarr;</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <!-- Banner Carousel Section -->
      <section class="hero-carousel-section scroll-animate animate-bottom">
        <div class="container-fluid p-0">
          <div
            id="dappmcCarousel"
            class="carousel slide carousel-fade"
            data-bs-ride="carousel"
            data-bs-interval="4000">
      
            <!-- Indicators / Dots -->
            <div class="carousel-indicators mb-2">
              <button
                type="button"
                data-bs-target="#dappmcCarousel"
                data-bs-slide-to="0"
                class="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#dappmcCarousel"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#dappmcCarousel"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
              <button
                type="button"
                data-bs-target="#dappmcCarousel"
                data-bs-slide-to="3"
                aria-label="Slide 4"
              ></button>
            </div>

            <div class="carousel-inner">
            <!-- Slide 1 -->
            <div class="carousel-item active">
              <div class="carousel-slide-container">
                                 <img src="<?= base_url('assets/images/dappmc.png') ?>" alt="New 128-Slice CT Scan" class="carousel-img" />
              </div>
            </div>

            <!-- Slide 2 -->
            <div class="carousel-item">
              <div class="carousel-slide-container">
                <img src="<?= base_url('assets/images/ct-scan.png') ?>" alt="Advanced Heart & Pulmonary Station" class="carousel-img" />
              </div>
            </div>

            <!-- Slide 3 -->
            <div class="carousel-item">
              <div class="carousel-slide-container">
                <img src="<?= base_url('assets/images/opd.png') ?>" alt="Modern Patient Accommodations" class="carousel-img" />
              </div>
            </div>

            <!-- Slide 4 -->
            <div class="carousel-item">
              <div class="carousel-slide-container">
                <img src="<?= base_url('assets/images/health.png') ?>" alt="Advanced X-Ray Equipment" class="carousel-img" />
              </div>
            </div>
          </div>

            <!-- Controls -->
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#dappmcCarousel"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#dappmcCarousel"
              data-bs-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="py-5 my-5">
        <div class="container">
          <div
            class="info-text text-center mx-auto mb-5 scroll-animate animate-bottom"
            style="max-width: 600px"
          >
            <h2 class="fw-bold">Comprehensive Medical Care</h2>
          </div>
          <div class="row g-4">
            <div class="col-md-6 col-lg-4">
              <div class="card border-0 shadow-sm h-100 p-4 text-center scroll-animate animate-left">
                <div
                  class="service-icon bg-primary-subtle text-primary fs-2 mx-auto mb-3"
                >
                  <i class="bi bi-droplet-half" style="color: #c6b350;"></i>
                </div>
                <h5 class="fw-bold">Laboratory</h5>
                <p class="text-muted small">
                  Our state-of-the-art laboratory provides fast and accurate
                  results. We prioritize patient care and use advanced equipment
                  to ensure quality services.
                </p>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="card border-0 shadow-sm h-100 p-4 text-center scroll-animate animate-fade">
                <div
                  class="service-icon bg-primary-subtle text-primary fs-2 mx-auto mb-3"
                >
                  <i class="bi bi-heart-pulse-fill" style="color: #c6b350;"></i>
                </div>
                <h5 class="fw-bold">Heart Station</h5>
                <p class="text-muted small">
                  Offers specialized cardiovascular diagnostic tests, including
                  ECGs and echocardiograms, to monitor and evaluate your heart
                  health accurately.
                </p>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="card border-0 shadow-sm h-100 p-4 text-center scroll-animate animate-right">
                <div
                  class="service-icon bg-primary-subtle text-primary fs-2 mx-auto mb-3"
                >
                  <i class="bi bi-lungs-fill" style="color: #c6b350;"></i>
                </div>
                <h5 class="fw-bold">Pulmonary Services</h5>
                <p class="text-muted small">
                  Delivers comprehensive respiratory care and diagnostic testing
                  to help evaluate, treat, and manage lung and breathing
                  conditions.
                </p>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="card border-0 shadow-sm h-100 p-4 text-center scroll-animate animate-left">
                <div
                  class="service-icon bg-primary-subtle text-primary fs-2 mx-auto mb-3"
                >
                  <i class="bi bi-person-walking" style="color: #c6b350;"></i>
                </div>
                <h5 class="fw-bold">Physical Medicine & Rehabilitation</h5>
                <p class="text-muted small">
                  Dedicated to restoring mobility, strength, and function through
                  personalized physical therapy and tailored rehabilitation
                  programs.
                </p>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="card border-0 shadow-sm h-100 p-4 text-center scroll-animate animate-fade">
                <div
                  class="service-icon bg-primary-subtle text-primary fs-2 mx-auto mb-3"
                >
                  <i class="bi bi-building-add" style="color: #c6b350;"></i>
                </div>
                <h5 class="fw-bold">Services and Facilities</h5>
                <p class="text-muted small">
                  Provides modern equipment, emergency care, and specialized
                  medical units to ensure complete, high-quality patient support.
                </p>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="card border-0 shadow-sm h-100 p-4 text-center scroll-animate animate-right">
                <div
                  class="service-icon bg-primary-subtle text-primary fs-2 mx-auto mb-3"
                >
                  <i class="bi bi-hospital" style="color: #c6b350;"></i>
                </div>
                <h5 class="fw-bold">Accommodations</h5>
                <p class="text-muted small">
                  Offers comfortable, clean, and well-equipped patient rooms
                  designed to provide a safe and peaceful environment for
                  recovery.
                </p>
              </div>
            </div>
          </div>
          <div class="row g-4">
            
          </div>
        </div>
      </section>

      <!-- Accredited HMO Partners Section (Continuous Scroll) -->
      <section id="hmo-partners" class="py-5 border-bottom">
        <div class="container text-center mb-4 scroll-animate animate-bottom">
          <div class="info-text mx-auto" style="max-width: 600px">
            <h6 class="text-uppercase fw-bold" style="color: #c6b350;">HMO & Insurance Partners</h6>
            <h3 class="fw-bold text-dark">Accredited Healthcare Providers</h3>
          </div>
        </div>

        <!-- Infinite Scroll Wrapper -->
        <div class="marquee-wrapper scroll-animate animate-bottom">
          <div class="marquee-track">
            
                          <!-- Group 1 -->
            <div class="marquee-content">
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
                <img src="<?= base_url('assets/images/' . $logo[0]) ?>" alt="<?= esc($logo[1]) ?>" class="hmo-logo" />
              <?php endforeach; ?>
            </div>

            <!-- Group 2 (Exact Duplicate for Infinite Loop Effect) -->
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