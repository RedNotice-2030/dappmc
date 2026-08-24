<?= view('partials/header', ['title' => 'DAPPMC - Organization']) ?>
    <main>
      <section class="py-5">
        <div class="container my-4">
          <h1 class="team-title fw-bold text-center mb-2 gold-outline-heading scroll-animate animate-bottom">
            Meet the team
          </h1>
          <p class="text-center text-muted mb-5 scroll-animate animate-bottom">
            The dedicated leaders guiding DAPPMC toward excellence in healthcare.
          </p>

          <?php
          $executiveTeam = [
            [
              'icon' => 'bi-person-badge-fill',
              'name' => 'Nanette P. Franco, MD, FPARM, MSHSM',
              'title' => 'Chief Executive Officer',
              'image' => 'assets/images/heads/CEO.png',
              'badge' => 'bg-warning-subtle text-warning-emphasis',
              'badgeText' => 'Chief Executive Officer',
              'dept' => 'Office of the CEO',
              'highlight' => true
            ],
            [
              'icon' => 'bi-clipboard2-pulse-fill',
              'name' => 'Moses B. Billanes, PTRP, RPT, MSHSM, DIPHLM',
              'title' => 'Hospital Administrator',
              'image' => 'assets/images/heads/ADMIN.png',
              'badge' => 'bg-primary-subtle text-primary',
              'badgeText' => 'Administration',
              'dept' => 'Administration Office'
            ],
            [
              'icon' => 'bi-heart-pulse-fill',
              'name' => 'Virginia M. Sulit, MD, FPCCP',
              'title' => 'Chief of Clinics',
              'image' => 'assets/images/heads/CHIEF OF CLINICS.png',
              'badge' => 'bg-danger-subtle text-danger',
              'badgeText' => 'Clinical Services',
              'dept' => 'Clinical Affairs Office'
            ],
            [
              'icon' => 'bi-cash-coin',
              'name' => 'John Yrick C. Era, CPA, MBA',
              'title' => 'Finance Manager',
              'image' => 'assets/images/heads/FINANCE MANAGER.png',
              'badge' => 'bg-success-subtle text-success',
              'badgeText' => 'Finance',
              'dept' => 'Finance Department'
            ],
            [
              'icon' => 'bi-people-fill',
              'name' => 'Nelia C. Baldostamon, RN',
              'title' => 'Human Resource Officer',
              'image' => 'assets/images/heads/HR.png',
              'badge' => 'bg-info-subtle text-info-emphasis',
              'badgeText' => 'Human Resources',
              'dept' => 'HR Department'
            ],
          ];

          $clinical = [
            [
              'icon' => 'bi-activity',
              'name' => 'Maria Laarni A. Venegas, RN, MAN',
              'title' => 'Head Nursing Service',
              'image' => 'assets/images/heads/NS.png',
              'badge' => 'bg-teal-subtle text-teal',
              'badgeText' => 'Nursing Service',
              'dept' => 'Nursing Administration'
            ],
            [
              'icon' => 'bi-eyedropper',
              'name' => 'Rubelyn C. Munar, RMT, MSMT',
              'title' => 'Head Laboratory',
              'image' => 'assets/images/heads/LAB.png',
              'badge' => 'bg-purple-subtle text-purple',
              'badgeText' => 'Laboratory Services',
              'dept' => 'Clinical Laboratory'
            ],
            [
              'icon' => 'bi-x-ray',
              'name' => 'Anthony Jay T. Frio, RRT',
              'title' => 'Head Radiology',
              'image' => 'assets/images/heads/RADTECH.png',
              'badge' => 'bg-cyan-subtle text-cyan',
              'badgeText' => 'Radiology Services',
              'dept' => 'Radiology & Imaging'
            ],
            [
              'icon' => 'bi-capsule',
              'name' => 'Eileen L. Flores, RPH, MSHSM',
              'title' => 'Head Pharmacy',
              'image' => 'assets/images/heads/PHARMA.png',
              'badge' => 'bg-orange-subtle text-orange',
              'badgeText' => 'Pharmacy Services',
              'dept' => 'Hospital Pharmacy'
            ],
            [
              'icon' => 'bi-person-wheelchair',
              'name' => 'Rosane Dawn A. Quimba, PTRP',
              'title' => 'Head Physical Medicine & Rehabilitation',
              'image' => 'assets/images/heads/REHAB.png',
              'badge' => 'bg-blue-subtle text-blue',
              'badgeText' => 'Rehabilitative Services',
              'dept' => 'Physical Medicine & Rehab'
            ],
            [
              'icon' => 'bi-egg-fried',
              'name' => 'Rhea B. Guindang, RND',
              'title' => 'Head Nutrition & Dietetics',
              'image' => 'assets/images/heads/NUTRI.png',
              'badge' => 'bg-pink-subtle text-pink',
              'badgeText' => 'Nutrition Services',
              'dept' => 'Nutrition & Dietetics Dept.'
            ],
            [
              'icon' => 'bi-shield-check',
              'name' => 'Jeffry I. Libona',
              'title' => 'Head CSSG',
              'image' => 'assets/images/heads/CSSG.png',
              'badge' => 'bg-dark-subtle text-dark',
              'badgeText' => 'Central Sterile Supply',
              'dept' => 'CSSG Department'
            ],
            [
              'icon' => 'bi-heart-fill',
              'name' => 'Blady C. Ramos, RSW',
              'title' => 'Medical Social Worker',
              'image' => 'assets/images/heads/MSW.png',
              'badge' => 'bg-red-subtle text-red',
              'badgeText' => 'Social Services',
              'dept' => 'Medical Social Services'
            ],
            [
              'icon' => 'bi-display-fill',
              'name' => 'Mizhelle D. Dela Cruz, MIT, DBMIS',
              'title' => 'Head Hospital Information System',
              'image' => 'assets/images/heads/MIS.png',
              'badge' => 'bg-violet-subtle text-violet',
              'badgeText' => 'Information Technology',
              'dept' => 'HIS / MIS Department'
            ]
          ];
          ?>

          <!-- Executive Leadership -->
          <div class="row g-4 justify-content-center">
            <?php foreach ($executiveTeam as $member): ?>
            <div class="col-md-6 col-lg-4 scroll-animate animate-bottom">
              <div class="card dept-card <?= !empty($member['highlight']) ? 'executive-card-highlight' : '' ?> h-100 shadow-sm">
                <div class="dept-card-header-accent"></div>
                <div class="card-body text-center p-4">
                  <div class="dept-avatar-square mb-3">
                    <?php if (!empty($member['image'])): ?>
                      <img src="<?= base_url($member['image']) ?>" alt="<?= esc($member['name'] ?? $member['title']) ?>" class="dept-avatar-img">
                    <?php else: ?>
                      <i class="<?= esc($member['icon']) ?>"></i>
                    <?php endif; ?>
                  </div>
                  <br>
                  <?php if (!empty($member['name'])): ?>
                    <h5 class="fw-bold mb-0" style="color: #002c6d"><?= esc($member['name']) ?></h5>
                    <br>
                    <span class="badge <?= esc($member['badge']) ?> fw-semibold px-3 py-2 rounded-pill mb-2">
                    <?= esc($member['title']) ?>
                    </span>
                    <p class="text-muted small mb-0">
                      <i class="bi bi-building me-1"></i><?= esc($member['dept']) ?>
                    </p>
                  <?php endif; ?>
                </div>
              </div>
            </div>
            <?php endforeach; ?>
          </div>

          <!-- Medical & Clinical Leadership -->
          <h2 class="team-title fw-bold text-center my-5 scroll-animate animate-bottom" style="color: #002c6d">
            Medical & Clinical Leadership
          </h2>
          <div class="row g-4">
            <?php foreach ($clinical as $member): ?>
            <div class="col-md-6 col-lg-4 scroll-animate animate-bottom">
              <div class="card dept-card h-100 shadow-sm">
                <div class="dept-card-header-accent"></div>
                <div class="card-body text-center p-4">
                  <div class="dept-avatar-square mb-3">
                    <?php if (!empty($member['image'])): ?>
                      <img src="<?= base_url($member['image']) ?>" alt="<?= esc($member['name'] ?? $member['title']) ?>" class="dept-avatar-img">
                    <?php else: ?>
                      <i class="<?= esc($member['icon']) ?>"></i>
                    <?php endif; ?>
                  </div>
                  <br>
                  <?php if (!empty($member['name'])): ?>
                    <h5 class="fw-bold mb-0" style="color: #002c6d"><?= esc($member['name']) ?></h5>
                    <br>
                  <?php endif; ?>
                  <span class="badge <?= esc($member['badge']) ?> fw-semibold px-3 py-2 rounded-pill mb-2">
                    <?= esc($member['title']) ?>
                  </span>
                  <p class="text-muted small mb-0">
                    <i class="bi bi-building me-1"></i><?= esc($member['dept']) ?>
                  </p>
                </div>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
        </div>
      </section>
      
    </main>
<?= view('partials/footer') ?>

