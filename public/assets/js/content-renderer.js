/**
 * DAPPMC Content Renderer
 * Dynamically renders news articles and health packages from the CMS data layer.
 */
(function (window, CMS) {
  'use strict';

  var CATEGORY_META = {
    news: {
      title: 'News & Announcements',
      sectionId: 'news',
      badgeClass: 'bg-primary-subtle text-primary',
      icon: 'bi-newspaper'
    },
    advisories: {
      title: 'Health Advisories',
      sectionId: 'advisories',
      badgeClass: 'bg-warning-subtle text-warning-emphasis',
      icon: 'bi-exclamation-triangle'
    },
    events: {
      title: 'Hospital Events',
      sectionId: 'events',
      badgeClass: 'bg-info-subtle text-info-emphasis',
      icon: 'bi-calendar-event'
    },
    drives: {
      title: 'Health Drives',
      sectionId: 'drives',
      badgeClass: 'bg-success-subtle text-success',
      icon: 'bi-heart-pulse'
    },
    alerts: {
      title: 'COVID Alerts',
      sectionId: 'alerts',
      badgeClass: 'bg-danger-subtle text-danger',
      icon: 'bi-virus'
    }
  };

  /**
   * Render all news sections on the page.
   * Each section (news, advisories, events, drives, alerts) renders its own card grid.
   */
  function renderNewsSections() {
    CMS.getItems('news').then(function (items) {
      // Group items by category
      var grouped = {};
      items.forEach(function (item) {
        var cat = item.category || 'news';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
      });

      // Sort each group by date descending
      Object.keys(grouped).forEach(function (cat) {
        grouped[cat].sort(function (a, b) {
          return (b.date || '').localeCompare(a.date || '');
        });
      });

      // Render each section that exists on the page
      Object.keys(CATEGORY_META).forEach(function (category) {
        var meta = CATEGORY_META[category];
        var section = document.getElementById(meta.sectionId);
        if (!section) return;

        var container = section.querySelector('.news-card-container');
        if (!container) return;

        var catItems = grouped[category] || [];
        if (catItems.length === 0) {
          container.innerHTML =
            '<div class="col-12 text-center text-muted py-4">' +
            '  <i class="bi bi-inbox fs-1 d-block mb-2"></i>' +
            '  <p class="mb-0">No ' + meta.title.toLowerCase() + ' available at this time.</p>' +
            '</div>';
          return;
        }

        var html = '';
        catItems.forEach(function (item) {
          html += buildNewsCard(item, meta);
        });
        container.innerHTML = html;

        // Re-trigger scroll animations for newly added elements
        if (window.ContentAnimations && window.ContentAnimations.reveal) {
          window.ContentAnimations.reveal(container);
        }
      });

      // Bind "read more" modal interactions
      bindNewsModal();
    });
  }

  /**
   * Build a single news card HTML string.
   */
  function buildNewsCard(item, meta) {
    var dateLabel = CMS.formatDate(item.date);
    var imageHtml = item.image
      ? '<img src="' + CMS.escapeHtml(item.image) + '" class="card-img-top" style="height:180px;object-fit:cover" alt="' + CMS.escapeHtml(item.title) + '">'
      : '<div class="card-img-top d-flex align-items-center justify-content-center" style="height:180px;background:linear-gradient(135deg,#002c6d,#c6b350)">' +
        '  <i class="bi ' + meta.icon + '" style="font-size:4rem;color:#fff"></i>' +
        '</div>';

    return '' +
      '<div class="col-md-6 col-lg-4 scroll-animate animate-bottom">' +
      '  <div class="card dept-card h-100 shadow-sm">' +
      '    <div class="dept-card-header-accent"></div>' +
      imageHtml +
      '    <div class="card-body p-4">' +
      '      <div class="d-flex align-items-center justify-content-between mb-2">' +
      '        <span class="badge ' + meta.badgeClass + ' fw-semibold px-3 py-2 rounded-pill">' +
      '          <i class="bi ' + meta.icon + ' me-1"></i>' + CMS.escapeHtml(meta.title) +
      '        </span>' +
      '        <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>' + CMS.escapeHtml(dateLabel) + '</small>' +
      '      </div>' +
      '      <h5 class="fw-bold mb-2" style="color:#002c6d">' + CMS.escapeHtml(item.title) + '</h5>' +
      '      <p class="text-muted small mb-3">' + CMS.escapeHtml(item.excerpt) + '</p>' +
      '      <button class="btn btn-outline-primary btn-sm mt-auto news-read-more" ' +
      '              data-title="' + CMS.escapeHtml(item.title) + '" ' +
      '              data-content="' + CMS.escapeHtml(item.content || item.excerpt || '') + '" ' +
      '              data-category="' + CMS.escapeHtml(meta.title) + '" ' +
      '              data-date="' + CMS.escapeHtml(dateLabel) + '">' +
      '        Read More <i class="bi bi-arrow-right ms-1"></i>' +
      '      </button>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  /**
   * Bind the news "Read More" modal.
   */
  function bindNewsModal() {
    var modalEl = document.getElementById('news-read-modal');
    if (!modalEl || !window.bootstrap) return;

    document.querySelectorAll('.news-read-more').forEach(function (btn) {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', function () {
        var title = btn.getAttribute('data-title') || '';
        var content = btn.getAttribute('data-content') || '';
        var category = btn.getAttribute('data-category') || '';
        var date = btn.getAttribute('data-date') || '';

        document.getElementById('news-modal-title').textContent = title;
        document.getElementById('news-modal-category').textContent = category;
        document.getElementById('news-modal-date').textContent = date;
        document.getElementById('news-modal-body').innerHTML =
          '<p>' + content.split('\n').map(function (line) {
            return CMS.escapeHtml(line);
          }).join('</p><p>') + '</p>';

        var modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      });
    });
  }

  /**
   * Render all job openings on the page.
   * @param {string} containerSelector - CSS selector for the jobs container
   */
  function renderJobs(containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    CMS.getItems('jobs').then(function (items) {
      // Sort by sortOrder, filter active
      var activeItems = items
        .filter(function (item) { return item.active !== false; })
        .sort(function (a, b) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

      if (activeItems.length === 0) {
        container.innerHTML =
          '<div class="col-12 text-center text-muted py-4">' +
          '  <i class="bi bi-briefcase fs-1 d-block mb-2"></i>' +
          '  <p class="mb-0">No job openings available at this time.</p>' +
          '</div>';
        return;
      }

      var html = '';
      activeItems.forEach(function (job) {
        html += buildJobCard(job);
      });
      container.innerHTML = html;

      // Re-trigger scroll animations for newly added elements
      if (window.ContentAnimations && window.ContentAnimations.reveal) {
        window.ContentAnimations.reveal(container);
      }
    });
  }

  /**
   * Build a single job card HTML string.
   * @param {Object} job - job data object
   * @returns {string} HTML string
   */
  function buildJobCard(job) {
    var qualificationsHtml = (job.qualifications || []).map(function (q) {
      return '<li>' + CMS.escapeHtml(q) + '</li>';
    }).join('');

    var benefitsHtml = (job.benefits || []).map(function (b) {
      return '<li>' + CMS.escapeHtml(b) + '</li>';
    }).join('');

    return '' +
      '<div class="col-md-6 col-lg-4 scroll-animate animate-bottom">' +
      '  <div class="card border-0 shadow-sm h-100 p-4 d-flex flex-column">' +
      '    <h5 class="fw-bold mb-1">' + CMS.escapeHtml(job.title) + '</h5>' +
      '    <p class="text-muted small mb-3">' +
      '      <i class="bi bi-clock"></i> ' + CMS.escapeHtml(job.type || 'Full-time') +
      '    </p>' +
      '    <p class="small fw-bold mb-1">Qualifications:</p>' +
      '    <ul class="small text-muted mb-3">' + qualificationsHtml + '</ul>' +
      '    <p class="small fw-bold mb-1">What We Offer:</p>' +
      '    <ul class="small text-muted mb-3">' + benefitsHtml + '</ul>' +
      '    <button class="btn btn-outline-primary mt-auto" ' +
      '            data-bs-toggle="modal" data-bs-target="#apply-modal" ' +
      '            data-job-title="' + CMS.escapeHtml(job.title) + '">' +
      '      Apply Now' +
      '    </button>' +
      '  </div>' +
      '</div>';
  }

  /**
   * Bootstrap badge classes for each doctor specialization.
   */
  var DOCTOR_BADGE_CLASSES = {
    cardiology: 'bg-danger-subtle text-danger',
    pediatrics: 'bg-success-subtle text-success',
    radiology: 'bg-warning-subtle text-warning-emphasis',
    'internal-medicine': 'bg-primary-subtle text-primary',
    physiology: 'bg-teal-subtle text-teal',
    anesthesiology: 'bg-indigo-subtle text-indigo',
    nephrology: 'bg-info-subtle text-info-emphasis',
    urology: 'bg-cyan-subtle text-cyan',
    orthopedics: 'bg-orange-subtle text-orange',
    pulmonology: 'bg-blue-subtle text-blue',
    ent: 'bg-purple-subtle text-purple',
    'general-surgery': 'bg-red-subtle text-red',
    'ob-gynecology': 'bg-pink-subtle text-pink',
    neurology: 'bg-violet-subtle text-violet'
  };

  /**
   * Render all active doctors into a container.
   * @param {string} containerSelector - CSS selector for the doctor grid container
   */
  function renderDoctors(containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    CMS.getItems('doctors').then(function (items) {
      // Sort by sortOrder, filter active
      var activeItems = items
        .filter(function (item) { return item.active !== false; })
        .sort(function (a, b) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

      if (activeItems.length === 0) {
        container.innerHTML =
          '<div class="col-12 text-center text-muted py-4">' +
          '  <i class="bi bi-person-x fs-1 d-block mb-2"></i>' +
          '  <p class="mb-0">No doctors available at this time.</p>' +
          '</div>';
        return;
      }

      var html = '';
      activeItems.forEach(function (doc) {
        html += buildDoctorCard(doc);
      });
      container.innerHTML = html;

      // Let style.js handle counts, filtering, and schedule toggle
      if (window.DoctorRenderReady) {
        window.DoctorRenderReady();
      }

      // Re-trigger scroll animations for newly added elements
      if (window.ContentAnimations && window.ContentAnimations.reveal) {
        window.ContentAnimations.reveal(container);
      }
    });
  }

  /**
   * Build a single doctor card HTML string.
   * @param {Object} doc - doctor data object
   * @returns {string} HTML string
   */
  function buildDoctorCard(doc) {
    var badgeClass = DOCTOR_BADGE_CLASSES[doc.specialization] || 'bg-secondary-subtle text-secondary';
    var specLabel = doc.specializationLabel || doc.specialization || 'Specialist';
    var image = doc.image
      ? '<img src="' + CMS.escapeHtml(doc.image) + '" alt="' + CMS.escapeHtml(doc.name) + '" class="doctor-image">'
      : '<div class="d-flex align-items-center justify-content-center h-100" style="width:120px;height:120px;border-radius:50%;background:#e2e8f0">' +
        '  <i class="bi bi-person" style="font-size:3rem;color:#002c6d"></i>' +
        '</div>';

    // Build schedule rows
    var scheduleHtml = '';
    (doc.schedule || []).forEach(function (entry) {
      scheduleHtml +=
        '<div class="d-flex justify-content-between small' + (entry.time ? ' mb-1' : '') + '">' +
        '  <span class="fw-semibold">' + CMS.escapeHtml(entry.days) + ':</span>' +
        '  <span class="text-success fw-bold">' + CMS.escapeHtml(entry.time || '') + '</span>' +
        '</div>';
    });
    if (!scheduleHtml) {
      scheduleHtml = '<div class="text-muted small">No schedule available.</div>';
    }

    return '' +
      '<div class="col-md-6 col-lg-4 doctor-item scroll-animate animate-bottom" data-category="' + CMS.escapeHtml(doc.specialization) + '">' +
      '  <div class="card h-100 shadow-sm border-0 doctor-card cursor-pointer">' +
      '    <div class="card-body text-center p-4">' +
      '      <div class="doctor-avatar mb-3 mx-auto">' +
      image +
      '      </div>' +
      '      <h5 class="fw-bold mb-1 doctor-name" style="color:#002c6d">' + CMS.escapeHtml(doc.name) + '</h5>' +
      '      <span class="badge ' + badgeClass + ' fw-semibold px-3 py-2 rounded-pill mb-3">' +
      '        ' + CMS.escapeHtml(specLabel) +
      '      </span>' +
      '      <div class="text-muted small">' +
      '        <i class="bi bi-geo-alt-fill me-1"></i> ' + CMS.escapeHtml(doc.location || '') +
      '      </div>' +
      '    </div>' +
      '    <div class="schedule-details collapse border-top bg-light p-3">' +
      '      <h6 class="fw-bold text-dark mb-2 border-bottom pb-1" style="font-size:0.9rem">' +
      '        <i class="bi bi-calendar3 me-1 text-primary"></i> Clinic Schedule' +
      '      </h6>' +
      scheduleHtml +
      '    </div>' +
      '    <div class="card-footer bg-white border-0 text-center pb-3 pt-0">' +
      '      <small class="text-primary fw-semibold toggle-text">' +
      '        Click to view schedule <i class="bi bi-chevron-down ms-1"></i>' +
      '      </small>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  /**
   * Re-bind style.js doctor interactions (counts, filters, schedule toggle)
   * after dynamic rendering replaces the DOM.
   */
  function bindDoctorInteractions() {
    // Update the "All Doctors" and specialization counts.
    var doctorItems = document.querySelectorAll('.doctor-item');
    var countBadges = document.querySelectorAll('[data-count-for]');
    countBadges.forEach(function (badge) {
      var category = badge.getAttribute('data-count-for');
      if (category === 'all') {
        badge.textContent = doctorItems.length;
      } else {
        var catCount = document.querySelectorAll('.doctor-item[data-category="' + category + '"]').length;
        badge.textContent = catCount;
      }
    });

    // Attach schedule toggle (accordion behavior) to dynamically rendered cards.
    document.querySelectorAll('.doctor-card').forEach(function (card) {
      if (card.dataset.bound === 'true') return;
      card.dataset.bound = 'true';
      card.addEventListener('click', function () {
        var scheduleCollapse = this.querySelector('.schedule-details');
        var toggleText = this.querySelector('.toggle-text');
        var isAlreadyOpen = scheduleCollapse.classList.contains('show');

        document.querySelectorAll('.doctor-card').forEach(function (otherCard) {
          var otherSchedule = otherCard.querySelector('.schedule-details');
          var otherToggle = otherCard.querySelector('.toggle-text');
          if (otherSchedule) otherSchedule.classList.remove('show');
          if (otherToggle) {
            otherToggle.innerHTML = 'Click to view schedule <i class="bi bi-chevron-down ms-1"></i>';
          }
        });

        if (!isAlreadyOpen) {
          scheduleCollapse.classList.add('show');
          toggleText.innerHTML = 'Hide schedule <i class="bi bi-chevron-up ms-1"></i>';
        }
      });
    });
  }

  /**
   * Render all packages on the page.
   */
  function renderPackages(containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    CMS.getItems('packages').then(function (items) {
      // Sort by sortOrder, filter active
      var activeItems = items
        .filter(function (item) { return item.active !== false; })
        .sort(function (a, b) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

      if (activeItems.length === 0) {
        container.innerHTML =
          '<div class="col-12 text-center text-muted py-4">' +
          '  <i class="bi bi-box fs-1 d-block mb-2"></i>' +
          '  <p class="mb-0">No packages available at this time.</p>' +
          '</div>';
        return;
      }

      var html = '';
      activeItems.forEach(function (pkg) {
        html += buildPackageCard(pkg);
      });
      container.innerHTML = html;

      // Rebind flip cards for the new content
      if (window.PackageInteractions && window.PackageInteractions.init) {
        window.PackageInteractions.init();
      }
      if (window.ContentAnimations && window.ContentAnimations.reveal) {
        window.ContentAnimations.reveal(container);
      }
    });
  }

  /**
   * Build a single package flip-card HTML string.
   */
  function buildPackageCard(pkg) {
    var promoBadge = pkg.promoBadge
      ? '<span class="badge bg-danger position-absolute top-0 end-0 m-2">' + CMS.escapeHtml(pkg.promoBadge) + '</span>'
      : '';
    var image = pkg.image
      ? '<img src="' + CMS.escapeHtml(pkg.image) + '" class="card-img-top" alt="' + CMS.escapeHtml(pkg.name) + '">'
      : '<div class="card-img-top d-flex align-items-center justify-content-center bg-light" style="height:260px">' +
        '  <i class="bi bi-box-seam text-muted" style="font-size:4rem"></i>' +
        '</div>';

    var stepsHtml = (pkg.availmentSteps || []).map(function (step) {
      return '<li>' + CMS.escapeHtml(step) + '</li>';
    }).join('');

    var paymentHtml = (pkg.paymentOptions || []).map(function (opt) {
      var clean = String(opt).replace('dchi.accounting@yahoo.com', 'dchi.accounting@yahoo.com');
      var linkified = clean.replace(
        /(dchi\.accounting@yahoo\.com)/g,
        '<a href="mailto:$1">$1</a>'
      );
      return '<li>' + linkified + '</li>';
    }).join('');

    return '' +
      '<div class="col-md-6 col-lg-4 scroll-animate animate-bottom">' +
      '  <div class="flip-card h-100">' +
      '    <div class="flip-card-inner h-100">' +
      '      <div class="flip-card-front h-100">' +
      '        <div class="card border-0 shadow-sm h-100 overflow-hidden position-relative">' +
      promoBadge +
      image +
      '          <div class="card-body d-flex flex-column">' +
      '            <h5 class="fw-bold mb-2">' + CMS.escapeHtml(pkg.name) + '</h5>' +
      '            <p class="small text-muted mb-2">' + CMS.escapeHtml(pkg.shortDescription).replace(/\n/g, '<br>') + '</p>' +
      (pkg.promoDetails
        ? '<p class="small text-danger fw-bold mb-3">' + CMS.escapeHtml(pkg.promoDetails) + '</p>'
        : '') +
      '            <button class="btn btn-outline-primary mt-auto btn-flip" data-package-name="' + CMS.escapeHtml(pkg.name) + '">Learn More</button>' +
      '          </div>' +
      '        </div>' +
      '      </div>' +
      '      <div class="flip-card-back h-100">' +
      '        <div class="card border-0 shadow-sm h-100 overflow-hidden p-3 bg-light">' +
      '          <div class="card-body">' +
      '            <h5 class="fw-bold mb-2">' + CMS.escapeHtml(pkg.name) + ' — Details</h5>' +
      '            <p class="small text-muted mb-2">' + CMS.escapeHtml(pkg.fullDescription || pkg.shortDescription) + '</p>' +
      '            <p class="small fw-semibold mb-1">Operating Hours:</p>' +
      '            <p class="small text-muted mb-2">' + CMS.escapeHtml(pkg.operatingHours) + '</p>' +
      '            <p class="small fw-semibold mb-1">Availment of Service:</p>' +
      '            <ol class="small text-muted mb-2">' + stepsHtml + '</ol>' +
      '            <p class="small fw-semibold mb-1">Payment Options:</p>' +
      '            <ul class="small text-muted mb-2">' + paymentHtml + '</ul>' +
      '            <div class="mt-3 w-100 text-end"><button class="btn btn-sm btn-primary btn-close-back">Back</button></div>' +
      '          </div>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  // Auto-initialize based on elements present on the page
  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('news') || document.querySelector('[data-news-render]')) {
      renderNewsSections();
    }
    if (document.querySelector('[data-packages-render]')) {
      renderPackages('[data-packages-render]');
    }
    if (document.querySelector('[data-jobs-render]')) {
      renderJobs('[data-jobs-render]');
    }
    if (document.querySelector('[data-doctors-render]')) {
      renderDoctors('[data-doctors-render]');
    }
  });

  // Hook for style.js to re-run doctor interactions after dynamic render.
  // (style.js may override this with its own equivalent initializer.)
  window.DoctorRenderReady = window.DoctorRenderReady || bindDoctorInteractions;

  // Expose the renderer API for programmatic use
  window.NewsRenderer = {
    renderNewsSections: renderNewsSections,
    buildNewsCard: buildNewsCard,
    renderPackages: renderPackages,
    buildPackageCard: buildPackageCard,
    renderJobs: renderJobs,
    buildJobCard: buildJobCard,
    renderDoctors: renderDoctors,
    buildDoctorCard: buildDoctorCard,
    bindDoctorInteractions: bindDoctorInteractions
  };
})(window, window.CMS);
