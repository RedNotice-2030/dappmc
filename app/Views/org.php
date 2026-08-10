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
              'title' => 'Chief Executive Officer',
              'badge' => 'bg-warning-subtle text-warning-emphasis',
              'badgeText' => 'Executive',
              'dept' => 'Office of the CEO',
              'highlight' => true
            ],
            [
              'icon' => 'bi-clipboard2-pulse-fill',
              'title' => 'Hospital Administrator',
              'badge' => 'bg-primary-subtle text-primary',
              'badgeText' => 'Administration',
              'dept' => 'Administration Office'
            ],
            [
              'icon' => 'bi-cash-coin',
              'title' => 'Finance Manager',
              'badge' => 'bg-success-subtle text-success',
              'badgeText' => 'Finance',
              'dept' => 'Finance Department'
            ]
          ];

          $clinical = [
            [
              'icon' => 'bi-heart-pulse-fill',
              'title' => 'Chief of Clinics',
              'badge' => 'bg-danger-subtle text-danger',
              'badgeText' => 'Clinical Services',
              'dept' => 'Clinical Affairs Office'
            ],
            [
              'icon' => 'bi-people-fill',
              'title' => 'Human Resource Officer',
              'badge' => 'bg-info-subtle text-info-emphasis',
              'badgeText' => 'Human Resources',
              'dept' => 'HR Department'
            ],
            [
              'icon' => 'bi-activity',
              'title' => 'Head Nursing Service',
              'badge' => 'bg-teal-subtle text-teal',
              'badgeText' => 'Nursing Service',
              'dept' => 'Nursing Administration'
            ],
            [
              'icon' => 'bi-eyedropper',
              'title' => 'Head Laboratory',
              'badge' => 'bg-purple-subtle text-purple',
              'badgeText' => 'Laboratory Services',
              'dept' => 'Clinical Laboratory'
            ],
            [
              'icon' => 'bi-x-ray',
              'title' => 'Head Radiology',
              'badge' => 'bg-cyan-subtle text-cyan',
              'badgeText' => 'Radiology Services',
              'dept' => 'Radiology & Imaging'
            ],
            [
              'icon' => 'bi-capsule',
              'title' => 'Head Pharmacy',
              'badge' => 'bg-orange-subtle text-orange',
              'badgeText' => 'Pharmacy Services',
              'dept' => 'Hospital Pharmacy'
            ],
            [
              'icon' => 'bi-person-wheelchair',
              'title' => 'Head Physical Medicine & Rehabilitation',
              'badge' => 'bg-blue-subtle text-blue',
              'badgeText' => 'Rehabilitative Services',
              'dept' => 'Physical Medicine & Rehab'
            ],
            [
              'icon' => 'bi-egg-fried',
              'title' => 'Head Nutrition & Dietetics',
              'badge' => 'bg-pink-subtle text-pink',
              'badgeText' => 'Nutrition Services',
              'dept' => 'Nutrition & Dietetics Dept.'
            ],
            [
              'icon' => 'bi-shield-check',
              'title' => 'Head CSSG',
              'badge' => 'bg-dark-subtle text-dark',
              'badgeText' => 'Central Sterile Supply',
              'dept' => 'CSSG Department'
            ],
            [
              'icon' => 'bi-heart-fill',
              'title' => 'Medical Social Worker',
              'badge' => 'bg-red-subtle text-red',
              'badgeText' => 'Social Services',
              'dept' => 'Medical Social Services'
            ],
            [
              'icon' => 'bi-display-fill',
              'title' => 'Head Hospital Information System',
              'badge' => 'bg-violet-subtle text-violet',
              'badgeText' => 'Information Technology',
              'dept' => 'HIS / IT Department'
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
                  <div class="dept-avatar-circle mb-3">
                    <i class="<?= esc($member['icon']) ?>"></i>
                  </div>
                  <h5 class="fw-bold mb-1" style="color: #002c6d">
                    <?= esc($member['title']) ?>
                  </h5>
                  <span class="badge <?= esc($member['badge']) ?> fw-semibold px-3 py-2 rounded-pill mb-2">
                    <?php if (!empty($member['badgeText'])): ?><i class="bi bi-star-fill me-1"></i><?php endif; ?><?= esc($member['badgeText']) ?>
                  </span>
                  <p class="text-muted small mb-0">
                    <i class="bi bi-building me-1"></i><?= esc($member['dept']) ?>
                  </p>
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
                  <div class="dept-avatar-circle mb-3">
                    <i class="<?= esc($member['icon']) ?>"></i>
                  </div>
                  <h5 class="fw-bold mb-1" style="color: #002c6d">
                    <?= esc($member['title']) ?>
                  </h5>
                  <span class="badge <?= esc($member['badge']) ?> fw-semibold px-3 py-2 rounded-pill mb-2">
                    <?= esc($member['badgeText']) ?>
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

