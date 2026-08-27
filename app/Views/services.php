<?= view('partials/header', ['title' => 'DAPPMC - Services']) ?>
    
    <main class="bg-white">
      <section class="py-5 packages-section bg-white" id="packages">
        <div class="container my-4">
          <h1 class="specialties-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Health Packages</h1>
          <div class="row g-4" data-packages-render></div>
        </div>
      </section>
      <section class="py-5 specialties-section bg-white" id="specialties">
        <div class="container my-4">
          <h1 class="specialties-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Medical Specialties</h1>
        </div>
        
      </section>
      <section class="py-5 diagnostic-section bg-white" id="lab">
        <div class="container my-4">
          <h1 class="diagnostic-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Diagnostic Services</h1>
        </div>
        <div class="container my-4">
          <div class="row g-4 diagnostic-card-container">
            <!-- CARD CONTAINTERS -->
            <div class="col-md-6 col-lg-4">
              <div class="card diagnostic-card h-100 scroll-animate animate-bottom">
                <div class="card-body">
                  <h5 class="card-title service-card-title fw-bold">HEART STATION</h5>
                  <ul>
                    <li>2D-ECHOGRAPHY (Transthoracic with Doppler Studies)
                      <ul>
                        <li>ADULT</li>
                        <li>PEDIA</li>
                      </ul>
                    </li>
                    <li>24-HOUR HOLTER MONITORING</li>
                    <li>TREADMILL STRESS TESTING</li>
                    <li>24-HOUR AMBULATORY BLOOD PRESSURE MONITORING</li>
                    <li>VASCULAR STUDIES
                      <ul>
                        <li>CAROTID DUPLEX SCAN</li>
                        <li>VENOUS DUPLEX SCAN</li>
                        <li>ARTERIAL DUPLEX SCAN</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- END CARD CONTAINER -->
            <!-- CARD CONTAINTERS -->
            <div class="col-md-6 col-lg-4">
              <div class="card diagnostic-card h-100 scroll-animate animate-bottom">
                <div class="card-body">
                  <h5 class="card-title service-card-title fw-bold">LABORATORY DEPARTMENT</h5>
                  <ul>
                    <li>HEMATOLOGY</li>
                    <li>CLINICAL CHEMISTRY</li>
                    <li>BLOOD BANK</li>
                    <li>IMMUNOLOGY & SEROLOGY</li>
                    <li>CLINICAL MICROSCOPY</li>
                    <li>MICROBIOLOGY</li>
                    <li>SURGICAL PATHOLOGY</li>
                    <li>TB CULTURE LABORATORY</li>
                    <li>DRUG TESTING</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- END CARD CONTAINER -->
            <!-- CARD CONTAINTERS -->
            <div class="col-md-6 col-lg-4">
              <div class="card diagnostic-card h-100 scroll-animate animate-bottom">
                <div class="card-body">
                  <h5 class="card-title service-card-title fw-bold">PULMONARY SERVICES</h5>
                  <ul>
                    <li>ARTERIAL BLOOD GAS</li>
                    <li>PULMONARY FUNCTION TEST</li>
                    <li>OXYGEN THERAPY</li>
                    <li>AEROSOL THERAPY (NEBULIZATION)</li>
                    <li>PEAK EXPIRATORY FLOW RATE (PEFR) DETERMINATION</li>
                    <li>MECHANICAL VENTILATION</li>
                    <li>CARDIAC MONITORING</li>
                    <li>PULSE OXIMETER MONITORING</li>
                    <li>CHEST PHYSIOTHERAPY (CPT)</li>
                    <li>INCENTIVE SPIROMETRY</li>
                    <li>CONTINUOUS POSITIVE AIRWAY PRESSURE (CPAP/BIPAP)</li>
                    <li>SPONTANEOUS BREATHING PARAMETER (SBP) DETERMINATION</li>
                    <li>WEANING</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- END CARD CONTAINER -->
            <!-- CARD CONTAINTERS -->
            <div class="col-md-6 col-lg-4">
              <div class="card diagnostic-card h-100 scroll-animate animate-bottom">
                <div class="card-body">
                  <h5 class="card-title service-card-title fw-bold">RADIOLOGY DEPARTMENT</h5>
                  <ul>
                    <li>DIAGNOSTIC X-RAY (FILMLESS)</li>
                    <li>ULTRASOUND</li>
                    <li>CT SCAN</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- END CARD CONTAINER -->
            <!-- CARD CONTAINTERS -->
            <div class="col-md-6 col-lg-4">
              <div class="card diagnostic-card h-100 scroll-animate animate-bottom">
                <div class="card-body">
                  <h5 class="card-title service-card-title fw-bold">PHISICAL MEDICINE AND REHABILITATION</h5>
                  <ul>
                    <li>PHYSICAL THERAPY</li>
                    <li>OCCUPATIONAL THERAPY</li>
                    <li>BEHAVIORAL MANAGEMENT</li>
                    <li>SPEECH THERAPY (By Appointment)</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- END CARD CONTAINER -->
            <!-- CARD CONTAINTERS -->
            <div class="col-md-6 col-lg-4">
              <div class="card diagnostic-card h-100 scroll-animate animate-bottom">
                <div class="card-body">
                  <h5 class="card-title service-card-title fw-bold">AMBULATORY CARE UNIT</h5>
                  <ul>
                    <li>ENDOSCOPY</li>
                    <li>COLONOSCOPY</li>
                    <li>LAPAROSCOPY</li>
                    <li>COLPOSCOPY</li>
                    <li>BRONCHOSCOPY</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- END CARD CONTAINER -->
            <!-- CARD CONTAINTERS -->
            <div class="col-md-6 col-lg-4">
              <div class="card diagnostic-card h-100 scroll-animate animate-bottom">
                <div class="card-body">
                  <h5 class="card-title service-card-title fw-bold">ADDITIONAL SERVICES</h5>
                  <ul>
                    <li>Z-PACKAGE FOR PREMATURE OR SMALL BABIES PACKAGE</li>
                    <li>PHILHEALTH PHYSICAL MEDICINE, REHABILITAION AND ASSISTIVE MOBILITY DEVICES BENEFIT PACKAGE</li>
                    <li>PHILHEALTH OUTPATIENT EMERGENCY CARE BENEFIT PACKAGE</li>
                    <li>PHILHEALTH YAKAP CENTER</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- END CARD CONTAINER -->
            <!-- CARD CONTAINTERS -->
            <div class="col-md-6 col-lg-4">
              <div class="card diagnostic-card h-100 scroll-animate animate-bottom">
                <div class="card-body">
                  <h5 class="card-title service-card-title fw-bold">SERVICES AND FACILITIES</h5>
                  <ul>
                    <li>24-HOUR EMERGENCY DEPARTMENT</li>
                    <li>OUT PATIENT DEPARTMENT
                      <ul>
                        <li>ANIMAL BITE</li>
                        <li>TB DOTS</li>
                        <li>HIV TREATMENT HUB</li>
                        <li>LABORATORY AT HOME</li>
                      </ul>
                    </li>
                    <li>ACUTE STROKE UNIT</li>
                    <li>OPERATING ROOM & DELIVERY ROOM</li>
                    <li>INTENSIVE CARE UNIT</li>
                    <li>NEONATAL INTENSIVE CARE</li>
                    <li>PEDIATRIC INTENSIVE CARE UNIT</li>
                    <li>PERITONEAL & HEMODIALYSIS</li>
                    <li>24-HOUR AMBULANCE SERVICES</li>
                    <li>NUTRITION AND DIETARY COUNSELING</li>
                    <li>MEDICAL SOCIAL SERVICES</li>
                    <li>MEREXPRESS DRUGSTORE</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- END CARD CONTAINER -->
            <!-- CARD CONTAINTERS -->
            <div class="col-md-6 col-lg-4">
              <div class="card diagnostic-card h-100 scroll-animate animate-bottom">
                <div class="card-body">
                  <h5 class="card-title service-card-title fw-bold">ACCOMMODATIONS</h5>
                  <ul>
                    <li>SUITE ROOMS</li>
                    <li>PRIVATE ROOMS</li>
                    <li>WARD</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- END CARD CONTAINER -->
          </div>
        </div>
      </section>
      <!-- <section class="py-5 emergency-section">
        <div class="container my-4">
          <h1 class="emergency-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Emergency Room Information</h1>
        </div>
      </section> -->
    </main>
<?= view('partials/footer', ['extraScripts' => '
    <script src="' . base_url('assets/js/cms.js') . '"></script>
    <script src="' . base_url('assets/js/animations.js') . '"></script>
    <script src="' . base_url('assets/js/content-renderer.js') . '"></script>
    <script src="' . base_url('assets/js/packages-interactions.js') . '"></script>
']) ?>

