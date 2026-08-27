<?= view('partials/header', ['title' => 'DAPPMC - News & Announcements']) ?>
    <main class="bg-white">
      <section class="py-5 news-section bg-white" id="news">
        <div class="container my-4">
          <h1 class="news-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">News & Announcements</h1>
          <div class="row g-4 news-card-container">
            <?php if (!empty($newsItems)): ?>
              <?php foreach ($newsItems as $item): ?>
                <?php if ($item['category'] === 'news'): ?>
                  <?= renderNewsCard($item) ?>
                <?php endif; ?>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </section>
      <section class="py-5 health-advisories-section bg-white" id="advisories">
        <div class="container my-4">
          <h1 class="health-advisories-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Health Advisories</h1>
          <div class="row g-4 news-card-container">
            <?php if (!empty($newsItems)): ?>
              <?php foreach ($newsItems as $item): ?>
                <?php if ($item['category'] === 'advisories'): ?>
                  <?= renderNewsCard($item) ?>
                <?php endif; ?>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </section>
      <section class="py-5 events-section bg-white" id="events">
        <div class="container my-4">
          <h1 class="events-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Hospital Events</h1>
          <div class="row g-4 news-card-container">
            <?php if (!empty($newsItems)): ?>
              <?php foreach ($newsItems as $item): ?>
                <?php if ($item['category'] === 'events'): ?>
                  <?= renderNewsCard($item) ?>
                <?php endif; ?>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </section>
      <section class="py-5 drives-section bg-white" id="drives">
        <div class="container my-4">
          <h1 class="drives-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">Health Drives</h1>
          <div class="row g-4 news-card-container">
            <?php if (!empty($newsItems)): ?>
              <?php foreach ($newsItems as $item): ?>
                <?php if ($item['category'] === 'drives'): ?>
                  <?= renderNewsCard($item) ?>
                <?php endif; ?>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </section>
      <section class="py-5 covid-section bg-white" id="alerts">
        <div class="container my-4">
          <h1 class="covid-title fw-bold text-center mb-4 gold-outline-heading scroll-animate animate-bottom">COVID Alerts</h1>
          <div class="row g-4 news-card-container">
            <?php if (!empty($newsItems)): ?>
              <?php foreach ($newsItems as $item): ?>
                <?php if ($item['category'] === 'alerts'): ?>
                  <?= renderNewsCard($item) ?>
                <?php endif; ?>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </section>

      <!-- News Read More Modal -->
      <div class="modal fade" id="news-read-modal" tabindex="-1" aria-labelledby="newsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <div>
                <h1 class="modal-title fs-5" id="news-modal-title">News Title</h1>
                <div class="small text-white-50">
                  <span id="news-modal-category" class="me-2"></span>
                  <span id="news-modal-date"></span>
                </div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="news-modal-body"></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      
    </main>
<?= view('partials/footer', ['extraScripts' => '
    <script src="' . base_url('assets/js/cms.js') . '"></script>
    <script src="' . base_url('assets/js/animations.js') . '"></script>
    <script src="' . base_url('assets/js/content-renderer.js') . '"></script>
']) ?>

<?php
function renderNewsCard(array $item): string
{
    $categoryMeta = [
        'news'       => ['title' => 'News & Announcements', 'icon' => 'bi-newspaper', 'badge' => 'bg-primary-subtle text-primary'],
        'advisories' => ['title' => 'Health Advisories',     'icon' => 'bi-exclamation-triangle', 'badge' => 'bg-warning-subtle text-warning-emphasis'],
        'events'     => ['title' => 'Hospital Events',       'icon' => 'bi-calendar-event', 'badge' => 'bg-info-subtle text-info-emphasis'],
        'drives'     => ['title' => 'Health Drives',         'icon' => 'bi-heart-pulse', 'badge' => 'bg-success-subtle text-success'],
        'alerts'     => ['title' => 'COVID Alerts',          'icon' => 'bi-virus', 'badge' => 'bg-danger-subtle text-danger'],
    ];

    $cat = $item['category'] ?? 'news';
    $meta = $categoryMeta[$cat] ?? $categoryMeta['news'];

    $dateLabel = '';
    if (!empty($item['date'])) {
        $dateLabel = date('F j, Y', strtotime($item['date']));
    }

    $imageHtml = '';
    if (!empty($item['image'])) {
        $imageHtml = '<img src="' . esc($item['image']) . '" class="card-img-top" style="height:180px;object-fit:cover" alt="' . esc($item['title']) . '">';
    } else {
        $imageHtml = '<div class="card-img-top d-flex align-items-center justify-content-center" style="height:180px;background:linear-gradient(135deg,#002c6d,#c6b350)">' .
                     '  <i class="bi ' . $meta['icon'] . '" style="font-size:4rem;color:#fff"></i>' .
                     '</div>';
    }

    $excerpt = esc($item['excerpt'] ?? '');
    $content = esc($item['content'] ?? $item['excerpt'] ?? '');
    $title = esc($item['title'] ?? '');

    return '<div class="col-md-6 col-lg-4 scroll-animate animate-bottom">' .
           '  <div class="card dept-card h-100 shadow-sm">' .
           '    <div class="dept-card-header-accent"></div>' .
           $imageHtml .
           '    <div class="card-body p-4">' .
           '      <div class="d-flex align-items-center justify-content-between mb-2">' .
           '        <span class="badge ' . $meta['badge'] . ' fw-semibold px-3 py-2 rounded-pill">' .
           '          <i class="bi ' . $meta['icon'] . ' me-1"></i>' . $meta['title'] .
           '        </span>' .
           '        <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>' . $dateLabel . '</small>' .
           '      </div>' .
           '      <h5 class="fw-bold mb-2" style="color:#002c6d">' . $title . '</h5>' .
           '      <p class="text-muted small mb-3">' . $excerpt . '</p>' .
           '      <button class="btn btn-outline-primary btn-sm mt-auto news-read-more" ' .
           '              data-title="' . $title . '" ' .
           '              data-content="' . $content . '" ' .
           '              data-category="' . $meta['title'] . '" ' .
           '              data-date="' . $dateLabel . '">' .
           '        Read More <i class="bi bi-arrow-right ms-1"></i>' .
           '      </button>' .
           '    </div>' .
           '  </div>' .
           '</div>';
}
?>