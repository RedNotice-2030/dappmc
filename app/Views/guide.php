<?= view('partials/header', ['title' => 'DAPPMC - Patient & Visitor Guide']) ?>
<main class="bg-white">
  <section class="py-5">
    <div class="container my-4">
      <h1 class="guide-title fw-bold text-center mb-2 gold-outline-heading scroll-animate animate-bottom">
        Patient &amp; Visitor Guide
      </h1>
      <p class="text-center text-muted mb-5 scroll-animate animate-bottom">
        Everything you need to know about admission, discharge, billing, medical records, and your rights as a patient.
      </p>

      <div class="row g-4">
        <!-- Sticky TOC sidebar -->
        <div class="col-lg-3 d-none d-lg-block">
          <div class="sticky-sidebar">
            <div class="list-group guide-toc">
              <a class="list-group-item list-group-item-action" href="#admission"><i class="bi bi-clipboard2-pulse me-2"></i>Admission Procedure</a>
              <a class="list-group-item list-group-item-action" href="#discharge"><i class="bi bi-box-arrow-right me-2"></i>Discharge Procedure</a>
              <a class="list-group-item list-group-item-action" href="#billing"><i class="bi bi-credit-card me-2"></i>Billing &amp; Payment</a>
              <a class="list-group-item list-group-item-action" href="#records"><i class="bi bi-folder2-open me-2"></i>Medical Records</a>
              <a class="list-group-item list-group-item-action" href="#rights"><i class="bi bi-shield-check me-2"></i>Patient Rights &amp; Responsibilities</a>
            </div>
          </div>
        </div>

        <div class="col-lg-9">

          <!-- ================= ADMISSION PROCEDURE ================= -->
          <section id="admission" class="guide-section mb-5">
            <h2 class="guide-section-title fw-bold mb-4 scroll-animate animate-bottom">
              <i class="bi bi-clipboard2-pulse me-2" style="color:#c6b350"></i>Admission Procedure
            </h2>
            <div class="row g-4">
              <?php
              $admissionSteps = [
                ['title' => 'Enter the Emergency Room', 'desc' => 'The Patient or Watcher enters the emergency room. (Only two watchers are allowed in the emergency room to avoid overcrowding.)'],
                ['title' => 'Initial Assessment', 'desc' => 'Emergency Room Nurse shall perform an initial assessment of the patient and instruct the watcher to proceed to the admitting section.'],
                ['title' => 'Proceed to Admitting Section', 'desc' => 'The Watcher shall proceed to the admitting section for encoding of the patient\'s personal information and present the following pertinent documents.'],
                ['title' => 'Gather Admission Data', 'desc' => 'The Admitting Section shall gather admission data.'],
                ['title' => 'Document and Register', 'desc' => 'The Admitting Section shall document and register the patient.'],
                ['title' => 'Forward Admission Data', 'desc' => 'The Admitting Section shall forward and present the admission data to the Emergency Room.'],
              ];
              foreach ($admissionSteps as $i => $step): ?>
                <div class="col-md-6 col-lg-4 scroll-animate animate-bottom">
                  <div class="card step-card h-100 shadow-sm">
                    <div class="card-body p-4">
                      <div class="step-number mb-3"><?= $i + 1 ?></div>
                      <h5 class="fw-bold mb-2" style="color:#002c6d"><?= esc($step['title']) ?></h5>
                      <p class="text-muted small mb-0"><?= esc($step['desc']) ?></p>
                    </div>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          </section>

          <!-- ================= DISCHARGE PROCEDURE ================= -->
          <section id="discharge" class="guide-section mb-5">
            <h2 class="guide-section-title fw-bold mb-4 scroll-animate animate-bottom">
              <i class="bi bi-box-arrow-right me-2" style="color:#c6b350"></i>Discharge Procedure
            </h2>
            <div class="row g-4">
              <?php
              $dischargeSteps = [
                ['title' => 'Order Discharge', 'desc' => 'The Attending Physician orders the patient to be discharged.'],
                ['title' => "Nurse's Duties", 'desc' => "The Nurse-on-duty carries out the Doctor's order, encodes the patient's final diagnosis in the Hospital Information System, prepares the medications and supplies to be returned to the Pharmacy and Central Supply Room; and completes the Home Instruction form (NSG-FR-021) and the Discharge Summary (NSG-FR-041)."],
                ['title' => 'Return Medications', 'desc' => 'The Nurse-on-duty returns the unused medications and medical supplies to the Pharmacy and Central Supply Room respectively.'],
                ['title' => "Submit Patient Chart", 'desc' => "The Nurse-on-duty submits the patient's chart to the Billing Section."],
                ['title' => 'Receive Final Bill', 'desc' => "The Nurse-on-duty receives the final bill claim slip (FIN-FR-041) from the Billing Clerk and presents the form to the patient/watcher."],
                ['title' => 'Present Final Bill', 'desc' => "The patient representative presents the Final bill claim slip (FIN-FR-041) to the Billing Clerk, at the time indicated form and pays the required amount for the patient's discharge."],
                ['title' => 'Receive Discharge Clearance', 'desc' => "The patient's representative receives the Discharge Clearance form (FIN-FR-045) from the Cashier."],
                ['title' => 'Present Discharge Clearance', 'desc' => "The patient's representative presents the Discharge Clearance form (FIN-FR-045) to the Nurse's station."],
                ['title' => "Nurse's Signature", 'desc' => 'The Nurse-on-duty signs the Discharge Clearance form (FIN-FR-045) and communicates the Home Instructions (NSG-FR-021).'],
                ['title' => 'Sign Discharge Summary', 'desc' => "The patient's representative, having fully understood the instructions, signs the Discharge Summary (NSG-FR-041) and the Home Instructions Form (NSG-FR-021)."],
                ['title' => 'Provide Copies', 'desc' => 'The Nurse-on-duty provides a copy of the Discharge Summary (NSG-FR-041) and Home Instruction (NSG-FR-021) form to the watcher along with the Clearance form.'],
              ];
              foreach ($dischargeSteps as $i => $step): ?>
                <div class="col-md-6 col-lg-4 scroll-animate animate-bottom">
                  <div class="card step-card h-100 shadow-sm">
                    <div class="card-body p-4">
                      <div class="step-number mb-3"><?= $i + 1 ?></div>
                      <h5 class="fw-bold mb-2" style="color:#002c6d"><?= esc($step['title']) ?></h5>
                      <p class="text-muted small mb-0"><?= esc($step['desc']) ?></p>
                    </div>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          </section>

          <!-- ================= BILLING & PAYMENT ================= -->
          <section id="billing" class="guide-section mb-5">
            <h2 class="guide-section-title fw-bold mb-4 scroll-animate animate-bottom">
              <i class="bi bi-credit-card me-2" style="color:#c6b350"></i>Billing &amp; Payment
            </h2>
            <p class="text-muted mb-4 scroll-animate animate-bottom">
              At Dr. Arturo P. Pingoy Medical Center, we offer flexible billing and payment options for our patients,
              ensuring convenience and transparency throughout your healthcare journey.
            </p>

            <div class="row g-4">
              <div class="col-md-8 scroll-animate animate-bottom">
                <div class="card h-100 shadow-sm">
                  <div class="card-body p-4">
                    <h5 class="fw-bold mb-3" style="color:#002c6d"><i class="bi bi-cash-coin me-2"></i>Payment Options</h5>
                    <ul class="text-muted mb-3">
                      <li>Pay in cash during the home visit</li>
                      <li>Pay online prior to the scheduled home visit via online banking</li>
                    </ul>
                    <table class="table table-sm table-bordered mb-0">
                      <thead class="table-light">
                        <tr><th>Bank</th><th>Account Name</th><th>Account No.</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>BDO</td><td>The Doctor's Clinic and Hospital Inc.</td><td>33300418767</td></tr>
                        <tr><td>BPI</td><td>The Doctor's Clinic and Hospital Inc.</td><td>1833120375</td></tr>
                        <tr><td>DBP</td><td>The Doctor's Clinic and Hospital Inc.</td><td>0935031175030</td></tr>
                        <tr><td>PBCOM</td><td>The Doctor's Clinic and Hospital Inc.</td><td>289101001946</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="col-md-4 scroll-animate animate-bottom">
                <div class="card h-100 shadow-sm">
                  <div class="card-body p-4">
                    <h5 class="fw-bold mb-3" style="color:#002c6d"><i class="bi bi-wallet2 me-2"></i>Digital Payment Options</h5>
                    <p class="text-muted small mb-3">We also accept the following digital payment methods:</p>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge bg-primary-subtle text-primary badge-category">VISA</span>
                      <span class="badge bg-primary-subtle text-primary badge-category">MASTERCARD</span>
                      <span class="badge bg-info-subtle text-info-emphasis badge-category">GCash</span>
                      <span class="badge bg-success-subtle text-success badge-category">PayMaya</span>
                      <span class="badge bg-warning-subtle text-warning-emphasis badge-category">Jazzy Pay</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ================= MEDICAL RECORDS ================= -->
          <section id="records" class="guide-section mb-5">
            <h2 class="guide-section-title fw-bold mb-4 scroll-animate animate-bottom">
              <i class="bi bi-folder2-open me-2" style="color:#c6b350"></i>Medical Records
            </h2>
            <p class="text-muted mb-4 scroll-animate animate-bottom">Your guide to accessing and managing medical records at DAPPMC.</p>

            <div class="row g-4">
              <div class="col-md-6 scroll-animate animate-bottom">
                <div class="card h-100 shadow-sm">
                  <div class="card-body p-4">
                    <h5 class="fw-bold mb-2" style="color:#002c6d"><i class="bi bi-file-earmark-text me-2"></i>How to Request Medical Records</h5>
                    <p class="text-muted small mb-2">Patients or authorized representatives can request copies of medical records by visiting the Medical Records Department in person or through email.</p>
                    <ul class="text-muted small mb-0">
                      <li>Bring a valid ID for verification.</li>
                      <li>If requesting on behalf of the patient, provide authorization and proof of relationship.</li>
                      <li>Submit a written request, including patient details and specific records needed.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-md-6 scroll-animate animate-bottom">
                <div class="card h-100 shadow-sm">
                  <div class="card-body p-4">
                    <h5 class="fw-bold mb-3" style="color:#002c6d"><i class="bi bi-clock-history me-2"></i>Processing Time</h5>
                    <ul class="text-muted small mb-0">
                      <li><strong>Outpatient records:</strong> 2–3 business days</li>
                      <li><strong>Inpatient records:</strong> 5–7 business days</li>
                      <li><strong>Emergency records:</strong> Available within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-md-6 scroll-animate animate-bottom">
                <div class="card h-100 shadow-sm">
                  <div class="card-body p-4">
                    <h5 class="fw-bold mb-3" style="color:#002c6d"><i class="bi bi-cash-stack me-2"></i>Fees and Charges</h5>
                    <p class="text-muted small mb-2">Depending on the type of medical record requested, there may be minimal charges. Please contact the Medical Records Department for detailed pricing.</p>
                    <ul class="text-muted small mb-0">
                      <li><strong>Standard record request:</strong> ₱50 per page</li>
                      <li><strong>Electronic copies:</strong> ₱100 per file</li>
                      <li><strong>Certified copies:</strong> Additional charges apply</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-md-6 scroll-animate animate-bottom">
                <div class="card h-100 shadow-sm">
                  <div class="card-body p-4">
                    <h5 class="fw-bold mb-3" style="color:#002c6d"><i class="bi bi-shield-lock me-2"></i>Confidentiality and Privacy</h5>
                    <p class="text-muted small mb-2">We value the confidentiality of your medical information. All requests are processed in accordance with the hospital's privacy policy and the Data Privacy Act of 2012 (Republic Act No. 10173).</p>
                    <ul class="text-muted small mb-0">
                      <li>Your records are only released to authorized persons.</li>
                      <li>We ensure secure handling and storage of all medical records.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ================= PATIENT RIGHTS & RESPONSIBILITIES ================= -->
          <section id="rights" class="guide-section mb-5">
            <h2 class="guide-section-title fw-bold mb-4 scroll-animate animate-bottom">
              <i class="bi bi-shield-check me-2" style="color:#c6b350"></i>Patient Rights &amp; Responsibilities
            </h2>
            <p class="text-muted mb-4 scroll-animate animate-bottom">
              At DAPPMC, we are committed to providing compassionate care and respecting your rights while encouraging responsible patient behavior.
            </p>

            <div class="row g-4">
              <div class="col-lg-6 scroll-animate animate-left">
                <div class="card h-100 shadow-sm">
                  <div class="card-body p-4">
                    <h5 class="fw-bold mb-3" style="color:#002c6d"><i class="bi bi-check-circle-fill me-2 text-success"></i>Patient Rights</h5>
                    <?php
                    $rights = [
                      ['title' => 'Access to Care, Transfer, and Continuity of Care', 'desc' => 'You will have access to medical treatment and services available in the hospital. If the necessary care cannot be provided, you will be referred to another facility, and the reason for the transfer will be explained.'],
                      ['title' => 'Respect and Dignity', 'desc' => 'You have the right to compassionate and respectful care that recognizes your dignity and ensures protection from abuse, neglect, and exploitation.'],
                      ['title' => 'Confidentiality', 'desc' => 'Your privacy and confidentiality are protected during treatment, and your medical records cannot be released without your consent.'],
                      ['title' => 'Medical Record', 'desc' => 'Your medical records are confidential and will not be released without your written consent or a court order.'],
                      ['title' => 'Information', 'desc' => 'You have the right to know your attending physician and receive complete and up-to-date information regarding your diagnosis, treatment, and prognosis.'],
                      ['title' => 'Communication', 'desc' => 'You have the right to visitors and to communicate with people outside the hospital, verbally or in writing.'],
                      ['title' => 'Acceptance and Refusal of Treatment', 'desc' => 'You have the right to accept or refuse medical or surgical treatment, including resuscitative services.'],
                      ['title' => 'Access to Protective Services', 'desc' => 'You are entitled to a safe, clean, and secure hospital environment.'],
                    ];
                    foreach ($rights as $item): ?>
                      <div class="guide-list-item mb-3">
                        <h6 class="fw-semibold mb-1" style="color:#002c6d"><?= esc($item['title']) ?></h6>
                        <p class="text-muted small mb-0"><?= esc($item['desc']) ?></p>
                      </div>
                    <?php endforeach; ?>
                  </div>
                </div>
              </div>

              <div class="col-lg-6 scroll-animate animate-right">
                <div class="card h-100 shadow-sm">
                  <div class="card-body p-4">
                    <h5 class="fw-bold mb-3" style="color:#002c6d"><i class="bi bi-clipboard-check-fill me-2 text-primary"></i>Patient Responsibilities</h5>
                    <?php
                    $responsibilities = [
                      ['title' => 'Following Rules and Regulations', 'desc' => 'You are responsible for following hospital rules, including the No Smoking Policy and the policy for children under nine (9) years old.'],
                      ['title' => 'Providing Information', 'desc' => 'You must provide complete and accurate information that may affect your care. You and your family should report any perceived risks or unexpected changes in your condition.'],
                      ['title' => 'Complying with Treatment Plans and Instructions', 'desc' => 'You are responsible for following the treatment plan provided and asking questions if you do not understand the instructions. You bear responsibility for the consequences of not following the prescribed plan.'],
                      ['title' => 'Showing Respect and Consideration', 'desc' => 'You and your family must respect hospital staff, property, and other patients. Avoid bringing alcoholic beverages, drugs, firearms, or other deadly weapons into the hospital premises.'],
                      ['title' => 'Meeting Financial Commitments', 'desc' => 'You are responsible for meeting your financial obligations promptly as agreed with the hospital.'],
                    ];
                    foreach ($responsibilities as $item): ?>
                      <div class="guide-list-item mb-3">
                        <h6 class="fw-semibold mb-1" style="color:#002c6d"><?= esc($item['title']) ?></h6>
                        <p class="text-muted small mb-0"><?= esc($item['desc']) ?></p>
                      </div>
                    <?php endforeach; ?>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  </section>
</main>
<?= view('partials/footer') ?>