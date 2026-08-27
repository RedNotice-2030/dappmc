<?= view('partials/header', ['title' => 'DAPPMC - FAQs']) ?>
    <main class="bg-white">
      <section class="py-5 bg-white">
        <div class="container my-4">
          <h1
            class="faqs-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom"
          >
            Frequently Asked Questions
          </h1>
          <p class="faq-intro text-center scroll-animate animate-bottom delay-1">
            Find answers to common questions about DAPPMC services, appointments, HMO/insurance, careers, and more.
          </p>
        </div>
      </section>

      <section class="py-5 bg-white">
        <div class="container">
          <div class="faq-search-container scroll-animate animate-bottom delay-1">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control" id="faq-search" placeholder="Search FAQs..." />
            </div>
          </div>

          <div id="faq-content">
            <!-- General / About DAPPMC -->
            <div class="faq-category scroll-animate animate-bottom delay-2">
              <h3 class="faq-category-title">About DAPPMC</h3>
              <div class="accordion" id="faq-about">
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq-about-1">
                      When was DAPPMC established?
                    </button>
                  </h2>
                  <div id="faq-about-1" class="accordion-collapse collapse show" data-bs-parent="#faq-about">
                    <div class="accordion-body faq-answer">
                      DAPPMC was established on <strong>May 12, 1961</strong> by spouses Arturo P. Pingoy, MD and Amparo Y. Pingoy, MD. It has since grown from a small clinic into a 100-bed tertiary hospital.
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-about-2">
                      What are DAPPMC's core values?
                    </button>
                  </h2>
                  <div id="faq-about-2" class="accordion-collapse collapse" data-bs-parent="#faq-about">
                    <div class="accordion-body faq-answer">
                      Our core values are <strong>Integrity, Compassion, Accountability, Reliability, and Excellence</strong>. These guide every aspect of our patient care and operations.
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-about-3">
                      Is DAPPMC accredited?
                    </button>
                  </h2>
                  <div id="faq-about-3" class="accordion-collapse collapse" data-bs-parent="#faq-about">
                    <div class="accordion-body faq-answer">
                      Yes. DAPPMC is accredited by <strong>PhilHealth</strong> as a Center of Safety and Center of Quality. We have also been awarded <strong>ISO 9001:2015 certification</strong> for our quality management systems.
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-about-4">
                      What is DAPPMC's vision and mission?
                    </button>
                  </h2>
                  <div id="faq-about-4" class="accordion-collapse collapse" data-bs-parent="#faq-about">
                    <div class="accordion-body faq-answer">
                      <strong>Vision:</strong> Delivering Exceptional Care with Compassion.<br>
                      <strong>Mission:</strong> Advancing Life and the Environment through Innovation and Responsible Healthcare.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Visiting Hours & Location -->
            <div class="faq-category scroll-animate animate-bottom delay-2">
              <h3 class="faq-category-title">Visiting Hours & Location</h3>
              <div class="accordion" id="faq-visiting">
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-visit-1">
                      What are the hospital's operating hours?
                    </button>
                  </h2>
                  <div id="faq-visit-1" class="accordion-collapse collapse" data-bs-parent="#faq-visiting">
                    <div class="accordion-body faq-answer">
                      <strong>Emergency Room:</strong> Open 24/7<br>
                      <strong>Outpatient Clinic:</strong> Monday to Saturday, 8:00 AM to 6:00 PM
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-visit-2">
                      Where is DAPPMC located?
                    </button>
                  </h2>
                  <div id="faq-visit-2" class="accordion-collapse collapse" data-bs-parent="#faq-visiting">
                    <div class="accordion-body faq-answer">
                      DAPPMC is located at <strong>Gensan Drive, Koronadal, 9506 South Cotabato</strong>. You can view our location on <a href="<?= base_url('about#location') ?>">Google Maps</a> or get directions from the footer of any page.
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-visit-3">
                      What is the contact number?
                    </button>
                  </h2>
                  <div id="faq-visit-3" class="accordion-collapse collapse" data-bs-parent="#faq-visiting">
                    <div class="accordion-body faq-answer">
                      <strong>Emergency:</strong> Call <a href="tel:911">911</a> or <a href="tel:0832282202">(083) 228-2202</a><br>
                      <strong>Helpline:</strong> <a href="tel:0832282202">(083) 228-2202</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Doctors & Specialties -->
            <div class="faq-category scroll-animate animate-bottom delay-2">
              <h3 class="faq-category-title">Doctors & Specialties</h3>
              <div class="accordion" id="faq-doctors">
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-doc-1">
                      How can I find a doctor at DAPPMC?
                    </button>
                  </h2>
                  <div id="faq-doc-1" class="accordion-collapse collapse" data-bs-parent="#faq-doctors">
                    <div class="accordion-body faq-answer">
                      Visit our <a href="<?= base_url('doctors') ?>">Doctors & Specialists</a> page to browse our medical team. You can filter by specialization and view clinic schedules. Click on any doctor's card to see their availability.
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-doc-2">
                      What specialties are available?
                    </button>
                  </h2>
                  <div id="faq-doc-2" class="accordion-collapse collapse" data-bs-parent="#faq-doctors">
                    <div class="accordion-body faq-answer">
                      DAPPMC offers a wide range of specialties including:
                      <ul>
                        <li>Cardiology</li>
                        <li>Pediatrics</li>
                        <li>Radiology</li>
                        <li>Internal Medicine</li>
                        <li>Physiology</li>
                        <li>Anesthesiology</li>
                        <li>Nephrology</li>
                        <li>Urology</li>
                        <li>Orthopedics</li>
                        <li>Pulmonology</li>
                        <li>ENT (Otolaryngology)</li>
                        <li>General Surgery</li>
                        <li>OB-Gynecology</li>
                        <li>Neurology</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-doc-3">
                      Do I need an appointment to see a doctor?
                    </button>
                  </h2>
                  <div id="faq-doc-3" class="accordion-collapse collapse" data-bs-parent="#faq-doctors">
                    <div class="accordion-body faq-answer">
                      While walk-ins are accepted for certain services, we highly recommend scheduling an appointment to ensure availability and minimize waiting time. You can contact our information desk at <strong>(083) 228-2202</strong> to book a consultation.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Services & Facilities -->
            <div class="faq-category scroll-animate animate-bottom delay-2">
              <h3 class="faq-category-title">Services & Facilities</h3>
              <div class="accordion" id="faq-services">
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-svc-1">
                      What diagnostic services are available?
                    </button>
                  </h2>
                  <div id="faq-svc-1" class="accordion-collapse collapse" data-bs-parent="#faq-services">
                    <div class="accordion-body faq-answer">
                      DAPPMC provides comprehensive diagnostic services including:
                      <ul>
                        <li><strong>Laboratory:</strong> Blood tests, urinalysis, and more</li>
                        <li><strong>Heart Station:</strong> ECG, echocardiograms</li>
                        <li><strong>Pulmonary Services:</strong> Respiratory care and testing</li>
                        <li><strong>Radiology:</strong> X-ray, CT scan, ultrasound</li>
                        <li><strong>Physical Medicine & Rehabilitation:</strong> Physical therapy</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-svc-2">
                      Does DAPPMC have emergency services?
                    </button>
                  </h2>
                  <div id="faq-svc-2" class="accordion-collapse collapse" data-bs-parent="#faq-services">
                    <div class="accordion-body faq-answer">
                      Yes. Our <strong>Emergency Room is open 24/7</strong> and is staffed to handle all types of medical emergencies. For emergencies, call <a href="tel:911">911</a> or <a href="tel:0832282202">(083) 228-2202</a> immediately.
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-svc-3">
                      What health packages are available?
                    </button>
                  </h2>
                  <div id="faq-svc-3" class="accordion-collapse collapse" data-bs-parent="#faq-services">
                    <div class="accordion-body faq-answer">
                      We offer various health packages, including:
                      <ul>
                        <li><strong>Women's Health Package</strong> – Lipid Profile, Urinalysis, Pap Smear, ECG, Breast Ultrasound</li>
                        <li><strong>Thyroid Health Package</strong> – Neck Ultrasound, TSH, T3, T4</li>
                        <li><strong>Prostate Cancer Awareness Package</strong> – PSA, Ultrasound of Prostate</li>
                      </ul>
                      Visit our <a href="<?= base_url('services#packages') ?>">Health Packages</a> page for current promos and details.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- HMO & Insurance -->
            <div class="faq-category scroll-animate animate-bottom delay-2">
              <h3 class="faq-category-title">HMO & Insurance</h3>
              <div class="accordion" id="faq-hmo">
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-hmo-1">
                      Is DAPPMC accredited with HMOs?
                    </button>
                  </h2>
                  <div id="faq-hmo-1" class="accordion-collapse collapse" data-bs-parent="#faq-hmo">
                    <div class="accordion-body faq-answer">
                      Yes. DAPPMC is accredited with over <strong>20 HMO and insurance providers</strong>, including:
                      <ul>
                        <li>PhilCare, Intellicare, Maxicare, Medilink</li>
                        <li>Pacific Cross, SunLife GREPA, InLife</li>
                        <li>ValuCare, WellCare, Cocolife, BenLife</li>
                        <li>And many more</li>
                      </ul>
                      View the full list on our <a href="<?= base_url('hmo') ?>">HMO Partners</a> page.
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-hmo-2">
                      How do I use my HMO benefits at DAPPMC?
                    </button>
                  </h2>
                  <div id="faq-hmo-2" class="accordion-collapse collapse" data-bs-parent="#faq-hmo">
                    <div class="accordion-body faq-answer">
                      Present your <strong>HMO card or membership ID</strong> during admission or consultation. Our billing department will coordinate with your provider. Please ensure your HMO coverage is active and that the service you need is within your plan's benefits.
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-hmo-3">
                      What payment options are available?
                    </button>
                  </h2>
                  <div id="faq-hmo-3" class="accordion-collapse collapse" data-bs-parent="#faq-hmo">
                    <div class="accordion-body faq-answer">
                      We accept the following payment methods:
                      <ul>
                        <li>Cash</li>
                        <li>Online banking</li>
                        <li>GCash / PayMaya</li>
                        <li>HMO / Insurance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admissions & Billing -->
            <div class="faq-category scroll-animate animate-bottom delay-2">
              <h3 class="faq-category-title">Admissions & Billing</h3>
              <div class="accordion" id="faq-admissions">
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-adm-1">
                      How do I avail of health packages?
                    </button>
                  </h2>
                  <div id="faq-adm-1" class="accordion-collapse collapse" data-bs-parent="#faq-admissions">
                    <div class="accordion-body faq-answer">
                      To avail of a health package:
                      <ol>
                        <li>Contact DAPPMC Information at <strong>(083) 228-2202</strong> or <strong>0949-994-6474</strong>.</li>
                        <li>Our staff will assist with scheduling and booking.</li>
                        <li>Preparation guidelines will be provided. Please bring a PWD or Senior Citizen ID if applicable.</li>
                      </ol>
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-adm-2">
                      What should I bring for admission?
                    </button>
                  </h2>
                  <div id="faq-adm-2" class="accordion-collapse collapse" data-bs-parent="#faq-admissions">
                    <div class="accordion-body faq-answer">
                      Please bring the following:
                      <ul>
                        <li>Valid ID</li>
                        <li>HMO card / insurance details (if applicable)</li>
                        <li>Doctor's referral or request (if applicable)</li>
                        <li>Any previous medical records or test results</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-adm-3">
                      Are senior citizens and PWDs accommodated?
                    </button>
                  </h2>
                  <div id="faq-adm-3" class="accordion-collapse collapse" data-bs-parent="#faq-admissions">
                    <div class="accordion-body faq-answer">
                      Yes. DAPPMC honors <strong>senior citizen and PWD discounts</strong> as required by law. Please present your <strong>official ID</strong> during billing or when availing of packages.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Careers -->
            <div class="faq-category scroll-animate animate-bottom delay-2">
              <h3 class="faq-category-title">Careers</h3>
              <div class="accordion" id="faq-careers">
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-career-1">
                      How can I apply for a job at DAPPMC?
                    </button>
                  </h2>
                  <div id="faq-career-1" class="accordion-collapse collapse" data-bs-parent="#faq-careers">
                    <div class="accordion-body faq-answer">
                      Visit our <a href="<?= base_url('careers') ?>">Careers</a> page to view current openings. Click "Apply" on the position you're interested in and submit your application through the online form. You can also email your resume to our HR department.
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-career-2">
                      What documents do I need to submit?
                    </button>
                  </h2>
                  <div id="faq-career-2" class="accordion-collapse collapse" data-bs-parent="#faq-careers">
                    <div class="accordion-body faq-answer">
                      Prepare the following:
                      <ul>
                        <li>Updated resume / CV</li>
                        <li>Copy of valid ID</li>
                        <li>Transcript of records / diplomas</li>
                        <li>Professional licenses / certificates (if applicable)</li>
                        <li>Medical certificate</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-career-3">
                      Does DAPPMC offer benefits to employees?
                    </button>
                  </h2>
                  <div id="faq-career-3" class="accordion-collapse collapse" data-bs-parent="#faq-careers">
                    <div class="accordion-body faq-answer">
                      Yes. DAPPMC provides a <strong>competitive salary and comprehensive benefits package</strong>, a supportive work environment, and opportunities for professional development and continuous learning.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact & Feedback -->
            <div class="faq-category scroll-animate animate-bottom delay-2">
              <h3 class="faq-category-title">Contact & Feedback</h3>
              <div class="accordion" id="faq-contact">
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-contact-1">
                      How can I contact DAPPMC?
                    </button>
                  </h2>
                  <div id="faq-contact-1" class="accordion-collapse collapse" data-bs-parent="#faq-contact">
                    <div class="accordion-body faq-answer">
                      You can reach us through:
                      <ul>
                        <li><strong>Phone:</strong> <a href="tel:0832282202">(083) 228-2202</a></li>
                        <li><strong>Emergency:</strong> <a href="tel:911">911</a></li>
                        <li><strong>Email:</strong> Use the <a href="#" data-bs-toggle="modal" data-bs-target="#contact-us-modal">Contact Us</a> form on this page</li>
                        <li><strong>Visit:</strong> Gensan Drive, Koronadal, 9506 South Cotabato</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="faq-accordion-item accordion-item">
                  <h2 class="accordion-header">
                    <button class="faq-accordion-button accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-contact-2">
                      How can I send feedback or suggestions?
                    </button>
                  </h2>
                  <div id="faq-contact-2" class="accordion-collapse collapse" data-bs-parent="#faq-contact">
                    <div class="accordion-body faq-answer">
                      We value your feedback. Please use the <a href="#" data-bs-toggle="modal" data-bs-target="#contact-us-modal">Contact Us</a> modal on this page to send us your comments, suggestions, or concerns. Our team will review and respond as soon as possible.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="faq-cta-section scroll-animate animate-bottom delay-2">
            <h4>Still have questions?</h4>
            <p>Our team is ready to help you with any concerns.</p>
            <a href="#" class="btn btn-lg" data-bs-toggle="modal" data-bs-target="#contact-us-modal">Contact Us</a>
          </div>
        </div>
      </section>
    </main>

    <script>
      // FAQ Search Functionality
      document.addEventListener("DOMContentLoaded", function () {
        const searchInput = document.getElementById("faq-search");
        const faqContent = document.getElementById("faq-content");
        const categories = document.querySelectorAll(".faq-category");
        
        if (!searchInput) return;

        searchInput.addEventListener("input", function () {
          const query = searchInput.value.toLowerCase().trim();
          let anyVisible = false;

          // Remove existing no-results message if any
          const existingNoResults = document.querySelector(".faq-no-results");
          if (existingNoResults) {
            existingNoResults.remove();
          }

          categories.forEach(function (category) {
            const items = category.querySelectorAll(".faq-accordion-item");
            let categoryHasVisibleItems = false;

            items.forEach(function (item) {
              const button = item.querySelector(".faq-accordion-button");
              const body = item.querySelector(".faq-answer");
              const text = (button.textContent + " " + body.textContent).toLowerCase();

              if (text.includes(query)) {
                item.style.display = "";
                categoryHasVisibleItems = true;
                anyVisible = true;
              } else {
                item.style.display = "none";
              }
            });

            // Show or hide the category section based on whether it has matching items
            if (categoryHasVisibleItems) {
              category.style.display = "";
            } else {
              category.style.display = "none";
            }
          });

          // Show 'No results' message if absolutely nothing matched
          if (!anyVisible) {
            const noResultsHTML = `
              <div class="faq-no-results scroll-animate animate-bottom visible">
                <i class="bi bi-search-heart"></i>
                <h5>No matching questions found</h5>
                <p>Try searching for keywords like "HMO", "appointment", "established", or "visiting".</p>
              </div>
            `;
            faqContent.insertAdjacentHTML("afterend", noResultsHTML);
          }
        });
      });
    </script>
<?= view('partials/footer') ?>
