/**
 * ============================================================================
 * DAPPMC CMS Admin Panel Logic
 * ============================================================================
 * This file handles all the interactive functionality of the CMS admin panel
 * (cms.html). It provides:
 *
 *   1. LOGIN AUTHENTICATION
 *      - Validates username/password against stored credentials
 *      - Default credentials: admin / dappmc2026
 *      - Credentials can be changed in the Settings tab
 *      - Session persists in localStorage until logout
 *
 *   2. CONTENT MANAGEMENT (CRUD operations)
 *      - News items (news, advisories, events, drives, alerts)
 *      - Health packages (flip cards on services.html)
 *      - Job openings (career cards on careers.html)
 *
 *   3. DATA UTILITIES
 *      - Export current collection as JSON file
 *      - Import JSON from clipboard
 *      - Reset to original file data
 *
 *   4. SETTINGS
 *      - Change login credentials
 *      - View CMS documentation
 *
 * DEPENDENCIES:
 *   - assets/js/cms.js (CMS data layer - must load first)
 *   - Bootstrap 5 (for modals)
 *   - Toastr (for notifications)
 * ============================================================================
 */
(function (window, CMS) {
  'use strict';

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================

  /** Storage key for login credentials in localStorage */
  var AUTH_STORAGE_KEY = 'dappmc-cms-auth';

  /** Storage key for session (logged in state) */
  var SESSION_STORAGE_KEY = 'dappmc-cms-session';

  /** Default credentials used on first load (before user changes them) */
  var DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: 'dappmc2026'
  };

  /** Current active tab in the admin panel */
  var currentTab = 'news';

  /** Current news category filter */
  var newsFilter = 'all';

  /** Item pending deletion (collection + id) */
  var deleteTarget = null;

  // ==========================================================================
  // CATEGORY DISPLAY CONFIGURATION
  // ==========================================================================

  /** Human-readable labels for news categories */
  var CATEGORY_LABELS = {
    news: 'News',
    advisories: 'Advisory',
    events: 'Event',
    drives: 'Drive',
    alerts: 'Alert'
  };

  /** Bootstrap badge classes for each news category */
  var CATEGORY_BADGES = {
    news: 'bg-primary-subtle text-primary',
    advisories: 'bg-warning-subtle text-warning-emphasis',
    events: 'bg-info-subtle text-info-emphasis',
    drives: 'bg-success-subtle text-success',
    alerts: 'bg-danger-subtle text-danger'
  };

  /** Available doctor specializations for the CMS dropdown */
  var DOCTOR_SPECIALIZATIONS = {
    cardiology: 'Cardiology',
    pediatrics: 'Pediatrics',
    radiology: 'Radiology',
    'internal-medicine': 'Internal Medicine',
    physiology: 'Physiology',
    anesthesiology: 'Anesthesiology',
    nephrology: 'Nephrology',
    urology: 'Urology',
    orthopedics: 'Orthopedics',
    pulmonology: 'Pulmonology',
    ent: 'ENT (Otolaryngology)',
    'general-surgery': 'General Surgery',
    'ob-gynecology': 'OB-Gynecology',
    neurology: 'Neurology'
  };

  // ==========================================================================
  // AUTHENTICATION
  // ==========================================================================

  /**
   * Get the stored credentials from localStorage.
   * Falls back to defaults if none are stored.
   * @returns {{username: string, password: string}}
   */
  function getCredentials() {
    try {
      var stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (parsed.username && parsed.password) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Invalid stored credentials, using defaults.', e);
    }
    return DEFAULT_CREDENTIALS;
  }

  /**
   * Save new credentials to localStorage.
   * @param {string} username
   * @param {string} password
   */
  function saveCredentials(username, password) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      username: username,
      password: password
    }));
  }

  /**
   * Check if the user is currently logged in.
   * @returns {boolean}
   */
  function isLoggedIn() {
    return localStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  }

  /**
   * Attempt to log in with the provided credentials.
   * @param {string} username
   * @param {string} password
   * @returns {boolean} true if login succeeded
   */
  function attemptLogin(username, password) {
    var creds = getCredentials();
    if (username === creds.username && password === creds.password) {
      localStorage.setItem(SESSION_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  }

  /**
   * Log out the current user.
   */
  function logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    showLoginScreen();
  }

  /**
   * Show the login screen and hide the CMS app.
   */
  function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('cms-app').classList.remove('visible');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-error').style.display = 'none';
  }

  /**
   * Show the CMS app and hide the login screen.
   */
  function showCmsApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('cms-app').classList.add('visible');
    var creds = getCredentials();
    document.getElementById('logged-in-user').innerHTML =
      '<i class="bi bi-person-circle me-1"></i>' + creds.username;
  }

  // ==========================================================================
  // TAB SWITCHING
  // ==========================================================================

  /**
   * Switch the active panel/tab in the admin interface.
   * @param {string} tab - 'news', 'packages', 'jobs', or 'settings'
   */
  function switchTab(tab) {
    currentTab = tab;

    // Hide all panels, show the selected one
    document.querySelectorAll('.cms-panel').forEach(function (panel) {
      panel.style.display = 'none';
    });
    var panel = document.getElementById('panel-' + tab);
    if (panel) panel.style.display = 'block';

    // Update sidebar active states
    document.querySelectorAll('[data-cms-tab]').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-cms-tab') === tab);
    });

    // Update mobile select
    var mobileSelect = document.getElementById('mobile-tab-select');
    if (mobileSelect) mobileSelect.value = tab;

    // Update page title
    var titles = {
      news: 'Content Manager',
      packages: 'Health Packages Manager',
      jobs: 'Job Openings Manager',
      doctors: 'Doctors Manager',
      settings: 'CMS Settings'
    };
    document.getElementById('cms-page-title').textContent = titles[tab] || 'Content Manager';

    // Render the appropriate list
    if (tab === 'news') {
      renderNewsList();
    } else if (tab === 'packages') {
      renderPackagesList();
    } else if (tab === 'jobs') {
      renderJobsList();
    } else if (tab === 'doctors') {
      renderDoctorsList();
    } else if (tab === 'settings') {
      loadSettings();
    }
  }

  // ==========================================================================
  // NEWS LIST RENDERING
  // ==========================================================================

  /**
   * Render the list of news items in the admin panel.
   * Filters by the current newsFilter category.
   */
  function renderNewsList() {
    var container = document.getElementById('news-items-list');
    if (!container) return;

    CMS.getItems('news').then(function (items) {
      var filtered = items;
      if (newsFilter !== 'all') {
        filtered = items.filter(function (item) {
          return item.category === newsFilter;
        });
      }

      // Sort by date descending (newest first)
      filtered.sort(function (a, b) {
        return (b.date || '').localeCompare(a.date || '');
      });

      // Empty state
      if (filtered.length === 0) {
        container.innerHTML =
          '<div class="empty-state">' +
          '  <i class="bi bi-newspaper"></i>' +
          '  <h6 class="fw-bold">No items found</h6>' +
          '  <p class="mb-0">Click "Add New" to create your first item.</p>' +
          '</div>';
        return;
      }

      // Build item rows
      var html = '';
      filtered.forEach(function (item) {
        var catLabel = CATEGORY_LABELS[item.category] || item.category;
        var badgeClass = CATEGORY_BADGES[item.category] || 'bg-secondary-subtle text-secondary';
        var dateLabel = CMS.formatDate(item.date);

        html +=
          '<div class="item-row">' +
          '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
          '    <span class="badge ' + badgeClass + ' badge-category">' + CMS.escapeHtml(catLabel) + '</span>' +
          '    <div class="flex-grow-1">' +
          '      <div class="item-title">' + CMS.escapeHtml(item.title) + '</div>' +
          '      <div class="item-meta"><i class="bi bi-calendar3 me-1"></i>' + CMS.escapeHtml(dateLabel) + '</div>' +
          '    </div>' +
          '  </div>' +
          '  <div class="d-flex gap-1">' +
          '    <button class="btn btn-sm btn-outline-primary btn-edit-news" data-id="' + CMS.escapeHtml(item.id) + '">' +
          '      <i class="bi bi-pencil"></i>' +
          '    </button>' +
          '    <button class="btn btn-sm btn-outline-danger btn-delete-news" data-id="' + CMS.escapeHtml(item.id) + '">' +
          '      <i class="bi bi-trash"></i>' +
          '    </button>' +
          '  </div>' +
          '</div>';
      });

      container.innerHTML = html;
      bindNewsActions();
    });
  }

  // ==========================================================================
  // PACKAGES LIST RENDERING
  // ==========================================================================

  /**
   * Render the list of health packages in the admin panel.
   */
  function renderPackagesList() {
    var container = document.getElementById('packages-items-list');
    if (!container) return;

    CMS.getItems('packages').then(function (items) {
      // Sort by sortOrder
      items.sort(function (a, b) {
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });

      // Empty state
      if (items.length === 0) {
        container.innerHTML =
          '<div class="empty-state">' +
          '  <i class="bi bi-box-seam"></i>' +
          '  <h6 class="fw-bold">No packages found</h6>' +
          '  <p class="mb-0">Click "Add New" to create your first package.</p>' +
          '</div>';
        return;
      }

      // Build item rows
      var html = '';
      items.forEach(function (pkg) {
        var statusBadge = pkg.active === false
          ? '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>'
          : '<span class="badge bg-success-subtle text-success badge-category">Active</span>';

        html +=
          '<div class="item-row">' +
          '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
          statusBadge +
          '    <div class="flex-grow-1">' +
          '      <div class="item-title">' + CMS.escapeHtml(pkg.name) + '</div>' +
          '      <div class="item-meta">Order: ' + (pkg.sortOrder || 0) + '</div>' +
          '    </div>' +
          '  </div>' +
          '  <div class="d-flex gap-1">' +
          '    <button class="btn btn-sm btn-outline-primary btn-edit-package" data-id="' + CMS.escapeHtml(pkg.id) + '">' +
          '      <i class="bi bi-pencil"></i>' +
          '    </button>' +
          '    <button class="btn btn-sm btn-outline-danger btn-delete-package" data-id="' + CMS.escapeHtml(pkg.id) + '">' +
          '      <i class="bi bi-trash"></i>' +
          '    </button>' +
          '  </div>' +
          '</div>';
      });

      container.innerHTML = html;
      bindPackageActions();
    });
  }

  // ==========================================================================
  // JOBS LIST RENDERING
  // ==========================================================================

  /**
   * Render the list of job openings in the admin panel.
   */
  function renderJobsList() {
    var container = document.getElementById('jobs-items-list');
    if (!container) return;

    CMS.getItems('jobs').then(function (items) {
      // Sort by sortOrder
      items.sort(function (a, b) {
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });

      // Empty state
      if (items.length === 0) {
        container.innerHTML =
          '<div class="empty-state">' +
          '  <i class="bi bi-briefcase"></i>' +
          '  <h6 class="fw-bold">No job openings found</h6>' +
          '  <p class="mb-0">Click "Add New" to create your first job posting.</p>' +
          '</div>';
        return;
      }

      // Build item rows
      var html = '';
      items.forEach(function (job) {
        var statusBadge = job.active === false
          ? '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>'
          : '<span class="badge bg-success-subtle text-success badge-category">Active</span>';

        html +=
          '<div class="item-row">' +
          '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
          statusBadge +
          '    <div class="flex-grow-1">' +
          '      <div class="item-title">' + CMS.escapeHtml(job.title) + '</div>' +
          '      <div class="item-meta">' + CMS.escapeHtml(job.type || 'Full-time') + ' · Order: ' + (job.sortOrder || 0) + '</div>' +
          '    </div>' +
          '  </div>' +
          '  <div class="d-flex gap-1">' +
          '    <button class="btn btn-sm btn-outline-primary btn-edit-job" data-id="' + CMS.escapeHtml(job.id) + '">' +
          '      <i class="bi bi-pencil"></i>' +
          '    </button>' +
          '    <button class="btn btn-sm btn-outline-danger btn-delete-job" data-id="' + CMS.escapeHtml(job.id) + '">' +
          '      <i class="bi bi-trash"></i>' +
          '    </button>' +
          '  </div>' +
          '</div>';
      });

      container.innerHTML = html;
      bindJobActions();
    });
  }

  // ==========================================================================
  // DOCTORS LIST RENDERING
  // ==========================================================================

  /**
   * Render the list of doctors in the admin panel.
   */
  function renderDoctorsList() {
    var container = document.getElementById('doctors-items-list');
    if (!container) return;

    CMS.getItems('doctors').then(function (items) {
      // Sort by sortOrder
      items.sort(function (a, b) {
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });

      // Empty state
      if (items.length === 0) {
        container.innerHTML =
          '<div class="empty-state">' +
          '  <i class="bi bi-person-badge"></i>' +
          '  <h6 class="fw-bold">No doctors found</h6>' +
          '  <p class="mb-0">Click "Add New" to create your first doctor.</p>' +
          '</div>';
        return;
      }

      // Build item rows
      var html = '';
      items.forEach(function (doc) {
        var statusBadge = doc.active === false
          ? '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>'
          : '<span class="badge bg-success-subtle text-success badge-category">Active</span>';
        var specLabel = doc.specializationLabel || DOCTOR_SPECIALIZATIONS[doc.specialization] || doc.specialization || 'Specialist';

        html +=
          '<div class="item-row">' +
          '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
          statusBadge +
          '    <div class="flex-grow-1">' +
          '      <div class="item-title">' + CMS.escapeHtml(doc.name) + '</div>' +
          '      <div class="item-meta">' + CMS.escapeHtml(specLabel) + ' · Order: ' + (doc.sortOrder || 0) + '</div>' +
          '    </div>' +
          '  </div>' +
          '  <div class="d-flex gap-1">' +
          '    <button class="btn btn-sm btn-outline-primary btn-edit-doctor" data-id="' + CMS.escapeHtml(doc.id) + '">' +
          '      <i class="bi bi-pencil"></i>' +
          '    </button>' +
          '    <button class="btn btn-sm btn-outline-danger btn-delete-doctor" data-id="' + CMS.escapeHtml(doc.id) + '">' +
          '      <i class="bi bi-trash"></i>' +
          '    </button>' +
          '  </div>' +
          '</div>';
      });

      container.innerHTML = html;
      bindDoctorActions();
    });
  }

  // ==========================================================================
  // ACTION BINDINGS
  // ==========================================================================

  /**
   * Bind edit/delete buttons for news items.
   */
  function bindNewsActions() {
    document.querySelectorAll('.btn-edit-news').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        CMS.getItems('news').then(function (items) {
          var item = items.find(function (i) { return i.id === id; });
          if (item) openNewsModal(item);
        });
      });
    });

    document.querySelectorAll('.btn-delete-news').forEach(function (btn) {
      btn.addEventListener('click', function () {
        deleteTarget = { collection: 'news', id: btn.getAttribute('data-id') };
        var modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
      });
    });
  }

  /**
   * Bind edit/delete buttons for package items.
   */
  function bindPackageActions() {
    document.querySelectorAll('.btn-edit-package').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        CMS.getItems('packages').then(function (items) {
          var item = items.find(function (i) { return i.id === id; });
          if (item) openPackageModal(item);
        });
      });
    });

    document.querySelectorAll('.btn-delete-package').forEach(function (btn) {
      btn.addEventListener('click', function () {
        deleteTarget = { collection: 'packages', id: btn.getAttribute('data-id') };
        var modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
      });
    });
  }

  /**
   * Bind edit/delete buttons for job items.
   */
  function bindJobActions() {
    document.querySelectorAll('.btn-edit-job').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        CMS.getItems('jobs').then(function (items) {
          var item = items.find(function (i) { return i.id === id; });
          if (item) openJobModal(item);
        });
      });
    });

    document.querySelectorAll('.btn-delete-job').forEach(function (btn) {
      btn.addEventListener('click', function () {
        deleteTarget = { collection: 'jobs', id: btn.getAttribute('data-id') };
        var modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
      });
    });
  }

  /**
   * Bind edit/delete buttons for doctor items.
   */
  function bindDoctorActions() {
    document.querySelectorAll('.btn-edit-doctor').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        CMS.getItems('doctors').then(function (items) {
          var item = items.find(function (i) { return i.id === id; });
          if (item) openDoctorModal(item);
        });
      });
    });

    document.querySelectorAll('.btn-delete-doctor').forEach(function (btn) {
      btn.addEventListener('click', function () {
        deleteTarget = { collection: 'doctors', id: btn.getAttribute('data-id') };
        var modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
      });
    });
  }

  // ==========================================================================
  // NEWS MODAL (ADD/EDIT)
  // ==========================================================================

  /**
   * Open the news item modal for adding or editing.
   * @param {Object|null} item - existing item to edit, or null for new
   */
  function openNewsModal(item) {
    var modalEl = document.getElementById('news-item-modal');
    document.getElementById('news-modal-title').textContent = item ? 'Edit News Item' : 'Add News Item';
    document.getElementById('news-item-id').value = item ? item.id : '';
    document.getElementById('news-item-category').value = item ? (item.category || 'news') : 'news';
    document.getElementById('news-item-date').value = item ? (item.date || '') : new Date().toISOString().split('T')[0];
    document.getElementById('news-item-title').value = item ? (item.title || '') : '';
    document.getElementById('news-item-excerpt').value = item ? (item.excerpt || '') : '';
    document.getElementById('news-item-content').value = item ? (item.content || '') : '';
    document.getElementById('news-item-image').value = item ? (item.image || '') : '';
    document.getElementById('news-item-tags').value = item && item.tags ? item.tags.join(', ') : '';

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  /**
   * Save the news item from the modal form.
   * Creates a new item or updates an existing one.
   */
  function saveNewsItem() {
    var id = document.getElementById('news-item-id').value;
    var category = document.getElementById('news-item-category').value;
    var date = document.getElementById('news-item-date').value;
    var title = document.getElementById('news-item-title').value.trim();
    var excerpt = document.getElementById('news-item-excerpt').value.trim();
    var content = document.getElementById('news-item-content').value.trim();
    var image = document.getElementById('news-item-image').value.trim();
    var tagsStr = document.getElementById('news-item-tags').value.trim();

    // Validation
    if (!title || !excerpt || !date) {
      toastr.warning('Please fill in the title, excerpt, and date.', 'Validation');
      return;
    }

    // Parse tags from comma-separated string
    var tags = tagsStr
      ? tagsStr.split(',').map(function (t) { return t.trim(); }).filter(Boolean)
      : [];

    // Build item object
    var item = {
      id: id || CMS.generateId('news'),
      category: category,
      title: title,
      excerpt: excerpt,
      content: content,
      image: image,
      date: date,
      tags: tags
    };

    // Save via CMS data layer
    CMS.saveItem('news', item).then(function () {
      toastr.success('News item saved successfully!', 'Success');
      var modalEl = document.getElementById('news-item-modal');
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      renderNewsList();
    }).catch(function (err) {
      console.error(err);
      toastr.error('Failed to save news item.', 'Error');
    });
  }

  // ==========================================================================
  // PACKAGE MODAL (ADD/EDIT)
  // ==========================================================================

  /**
   * Open the package modal for adding or editing.
   * @param {Object|null} item - existing package to edit, or null for new
   */
  function openPackageModal(item) {
    var modalEl = document.getElementById('package-item-modal');
    document.getElementById('package-modal-title').textContent = item ? 'Edit Health Package' : 'Add Health Package';
    document.getElementById('package-item-id').value = item ? item.id : '';
    document.getElementById('package-item-name').value = item ? (item.name || '') : '';
    document.getElementById('package-item-sort').value = item ? (item.sortOrder || 1) : 1;
    document.getElementById('package-item-short').value = item ? (item.shortDescription || '') : '';
    document.getElementById('package-item-full').value = item ? (item.fullDescription || '') : '';
    document.getElementById('package-item-image').value = item ? (item.image || '') : '';
    document.getElementById('package-item-badge').value = item ? (item.promoBadge || '') : '';
    document.getElementById('package-item-promo').value = item ? (item.promoDetails || '') : '';
    document.getElementById('package-item-hours').value = item ? (item.operatingHours || '') : '';
    document.getElementById('package-item-steps').value = item && item.availmentSteps ? item.availmentSteps.join('\n') : '';
    document.getElementById('package-item-payments').value = item && item.paymentOptions ? item.paymentOptions.join('\n') : '';
    document.getElementById('package-item-active').checked = item ? item.active !== false : true;

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  /**
   * Save the package from the modal form.
   * Creates a new package or updates an existing one.
   */
  function savePackageItem() {
    var id = document.getElementById('package-item-id').value;
    var name = document.getElementById('package-item-name').value.trim();
    var sortOrder = parseInt(document.getElementById('package-item-sort').value, 10) || 1;
    var shortDescription = document.getElementById('package-item-short').value.trim();
    var fullDescription = document.getElementById('package-item-full').value.trim();
    var image = document.getElementById('package-item-image').value.trim();
    var promoBadge = document.getElementById('package-item-badge').value.trim();
    var promoDetails = document.getElementById('package-item-promo').value.trim();
    var operatingHours = document.getElementById('package-item-hours').value.trim();
    var stepsText = document.getElementById('package-item-steps').value.trim();
    var paymentsText = document.getElementById('package-item-payments').value.trim();
    var active = document.getElementById('package-item-active').checked;

    // Validation
    if (!name || !shortDescription) {
      toastr.warning('Please fill in the package name and short description.', 'Validation');
      return;
    }

    // Parse line-separated lists
    var availmentSteps = stepsText
      ? stepsText.split('\n').map(function (s) { return s.trim(); }).filter(Boolean)
      : [];
    var paymentOptions = paymentsText
      ? paymentsText.split('\n').map(function (s) { return s.trim(); }).filter(Boolean)
      : [];

    // Build item object
    var item = {
      id: id || CMS.generateId('pkg'),
      name: name,
      shortDescription: shortDescription,
      fullDescription: fullDescription,
      image: image,
      promoBadge: promoBadge,
      promoDetails: promoDetails,
      operatingHours: operatingHours,
      availmentSteps: availmentSteps,
      paymentOptions: paymentOptions,
      active: active,
      sortOrder: sortOrder
    };

    // Save via CMS data layer
    CMS.saveItem('packages', item).then(function () {
      toastr.success('Package saved successfully!', 'Success');
      var modalEl = document.getElementById('package-item-modal');
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      renderPackagesList();
    }).catch(function (err) {
      console.error(err);
      toastr.error('Failed to save package.', 'Error');
    });
  }

  // ==========================================================================
  // JOB MODAL (ADD/EDIT)
  // ==========================================================================

  /**
   * Open the job modal for adding or editing.
   * @param {Object|null} item - existing job to edit, or null for new
   */
  function openJobModal(item) {
    var modalEl = document.getElementById('job-item-modal');
    document.getElementById('job-modal-title').textContent = item ? 'Edit Job Opening' : 'Add Job Opening';
    document.getElementById('job-item-id').value = item ? item.id : '';
    document.getElementById('job-item-title').value = item ? (item.title || '') : '';
    document.getElementById('job-item-type').value = item ? (item.type || 'Full-time') : 'Full-time';
    document.getElementById('job-item-sort').value = item ? (item.sortOrder || 1) : 1;
    document.getElementById('job-item-qualifications').value = item && item.qualifications ? item.qualifications.join('\n') : '';
    document.getElementById('job-item-benefits').value = item && item.benefits ? item.benefits.join('\n') : '';
    document.getElementById('job-item-active').checked = item ? item.active !== false : true;

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  /**
   * Save the job from the modal form.
   * Creates a new job or updates an existing one.
   */
  function saveJobItem() {
    var id = document.getElementById('job-item-id').value;
    var title = document.getElementById('job-item-title').value.trim();
    var type = document.getElementById('job-item-type').value.trim() || 'Full-time';
    var sortOrder = parseInt(document.getElementById('job-item-sort').value, 10) || 1;
    var qualificationsText = document.getElementById('job-item-qualifications').value.trim();
    var benefitsText = document.getElementById('job-item-benefits').value.trim();
    var active = document.getElementById('job-item-active').checked;

    // Validation
    if (!title) {
      toastr.warning('Please fill in the job title.', 'Validation');
      return;
    }

    // Parse line-separated lists
    var qualifications = qualificationsText
      ? qualificationsText.split('\n').map(function (s) { return s.trim(); }).filter(Boolean)
      : [];
    var benefits = benefitsText
      ? benefitsText.split('\n').map(function (s) { return s.trim(); }).filter(Boolean)
      : [];

    // Build item object
    var item = {
      id: id || CMS.generateId('job'),
      title: title,
      type: type,
      qualifications: qualifications,
      benefits: benefits,
      active: active,
      sortOrder: sortOrder
    };

    // Save via CMS data layer
    CMS.saveItem('jobs', item).then(function () {
      toastr.success('Job opening saved successfully!', 'Success');
      var modalEl = document.getElementById('job-item-modal');
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      renderJobsList();
    }).catch(function (err) {
      console.error(err);
      toastr.error('Failed to save job opening.', 'Error');
    });
  }

  // ==========================================================================
  // DOCTOR MODAL (ADD/EDIT)
  // ==========================================================================

  /**
   * Open the doctor modal for adding or editing.
   * @param {Object|null} item - existing doctor to edit, or null for new
   */
  function openDoctorModal(item) {
    var modalEl = document.getElementById('doctor-item-modal');
    document.getElementById('doctor-modal-title').textContent = item ? 'Edit Doctor' : 'Add Doctor';
    document.getElementById('doctor-item-id').value = item ? item.id : '';
    document.getElementById('doctor-item-name').value = item ? (item.name || '') : '';
    document.getElementById('doctor-item-specialization').value = item ? (item.specialization || 'cardiology') : 'cardiology';
    document.getElementById('doctor-item-sort').value = item ? (item.sortOrder || 1) : 1;
    document.getElementById('doctor-item-location').value = item ? (item.location || '') : '';
    document.getElementById('doctor-item-image').value = item ? (item.image || '') : '';
    document.getElementById('doctor-item-schedule').value = item && item.schedule
      ? item.schedule.map(function (s) { return s.days + ' | ' + s.time; }).join('\n')
      : '';
    document.getElementById('doctor-item-active').checked = item ? item.active !== false : true;

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  /**
   * Save the doctor from the modal form.
   * Creates a new doctor or updates an existing one.
   */
  function saveDoctorItem() {
    var id = document.getElementById('doctor-item-id').value;
    var name = document.getElementById('doctor-item-name').value.trim();
    var specialization = document.getElementById('doctor-item-specialization').value;
    var sortOrder = parseInt(document.getElementById('doctor-item-sort').value, 10) || 1;
    var location = document.getElementById('doctor-item-location').value.trim();
    var image = document.getElementById('doctor-item-image').value.trim();
    var scheduleText = document.getElementById('doctor-item-schedule').value.trim();
    var active = document.getElementById('doctor-item-active').checked;

    // Validation
    if (!name) {
      toastr.warning('Please fill in the doctor name.', 'Validation');
      return;
    }

    // Parse schedule lines in "Days | Time" format
    var schedule = [];
    if (scheduleText) {
      scheduleText.split('\n').forEach(function (line) {
        line = line.trim();
        if (!line) return;
        var parts = line.split('|');
        var days = (parts[0] || '').trim();
        var time = (parts[1] || '').trim();
        if (days) {
          schedule.push({ days: days, time: time });
        }
      });
    }

    // Build item object
    var item = {
      id: id || CMS.generateId('doc'),
      name: name,
      specialization: specialization,
      specializationLabel: DOCTOR_SPECIALIZATIONS[specialization] || specialization,
      location: location,
      image: image,
      schedule: schedule,
      active: active,
      sortOrder: sortOrder
    };

    // Save via CMS data layer
    CMS.saveItem('doctors', item).then(function () {
      toastr.success('Doctor saved successfully!', 'Success');
      var modalEl = document.getElementById('doctor-item-modal');
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      renderDoctorsList();
    }).catch(function (err) {
      console.error(err);
      toastr.error('Failed to save doctor.', 'Error');
    });
  }

  // ==========================================================================
  // DELETE CONFIRMATION
  // ==========================================================================

  /**
   * Confirm and execute the pending delete operation.
   */
  function confirmDelete() {
    if (!deleteTarget) return;

    CMS.deleteItem(deleteTarget.collection, deleteTarget.id).then(function () {
      toastr.success('Item deleted successfully!', 'Success');
      var modalEl = document.getElementById('delete-modal');
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      deleteTarget = null;

      // Re-render the appropriate list
      if (currentTab === 'news') {
        renderNewsList();
      } else if (currentTab === 'packages') {
        renderPackagesList();
      } else if (currentTab === 'jobs') {
        renderJobsList();
      } else if (currentTab === 'doctors') {
        renderDoctorsList();
      }
    }).catch(function (err) {
      console.error(err);
      toastr.error('Failed to delete item.', 'Error');
    });
  }

  // ==========================================================================
  // EXPORT / IMPORT / RESET
  // ==========================================================================

  /**
   * Export the current collection as a downloadable JSON file.
   */
  function exportCurrent() {
    CMS.exportData(currentTab, currentTab + '.json').then(function () {
      toastr.success('Exported ' + currentTab + '.json', 'Export');
    });
  }

  /**
   * Open the import modal.
   */
  function openImportModal() {
    document.getElementById('import-json-text').value = '';
    var modal = new bootstrap.Modal(document.getElementById('import-modal'));
    modal.show();
  }

  /**
   * Confirm and execute the JSON import.
   */
  function confirmImport() {
    var jsonText = document.getElementById('import-json-text').value.trim();
    if (!jsonText) {
      toastr.warning('Please paste JSON content to import.', 'Validation');
      return;
    }

    CMS.importData(currentTab, jsonText).then(function () {
      toastr.success('Data imported successfully!', 'Success');
      var modalEl = document.getElementById('import-modal');
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      // Re-render the appropriate list
      if (currentTab === 'news') {
        renderNewsList();
      } else if (currentTab === 'packages') {
        renderPackagesList();
      } else if (currentTab === 'jobs') {
        renderJobsList();
      } else if (currentTab === 'doctors') {
        renderDoctorsList();
      }
    }).catch(function (err) {
      console.error(err);
      toastr.error('Invalid JSON. Please check your content.', 'Error');
    });
  }

  /**
   * Reset the current collection to its original file data.
   */
  function resetCurrent() {
    if (!confirm('Reset all ' + currentTab + ' data to the original file content? This will discard your local changes.')) return;
    CMS.resetData(currentTab);
    toastr.success('Data reset to original file content.', 'Reset');

    // Re-render the appropriate list
    if (currentTab === 'news') {
      renderNewsList();
    } else if (currentTab === 'packages') {
      renderPackagesList();
    } else if (currentTab === 'jobs') {
      renderJobsList();
    } else if (currentTab === 'doctors') {
      renderDoctorsList();
    }
  }

  // ==========================================================================
  // SETTINGS
  // ==========================================================================

  /**
   * Load current settings into the settings form.
   */
  function loadSettings() {
    var creds = getCredentials();
    document.getElementById('settings-username').value = creds.username;
    document.getElementById('settings-password').value = '';
    document.getElementById('settings-password-confirm').value = '';
  }

  /**
   * Save new login credentials from the settings form.
   */
  function saveSettings() {
    var username = document.getElementById('settings-username').value.trim();
    var password = document.getElementById('settings-password').value;
    var confirmPassword = document.getElementById('settings-password-confirm').value;

    // Validation
    if (!username) {
      toastr.warning('Please enter a username.', 'Validation');
      return;
    }
    if (!password) {
      toastr.warning('Please enter a new password.', 'Validation');
      return;
    }
    if (password !== confirmPassword) {
      toastr.warning('Passwords do not match.', 'Validation');
      return;
    }
    if (password.length < 6) {
      toastr.warning('Password must be at least 6 characters.', 'Validation');
      return;
    }

    // Save credentials
    saveCredentials(username, password);
    document.getElementById('logged-in-user').innerHTML =
      '<i class="bi bi-person-circle me-1"></i>' + username;
    toastr.success('Login credentials updated successfully!', 'Success');
    loadSettings();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  /**
   * Initialize the admin panel on DOMContentLoaded.
   * Sets up all event listeners and checks login state.
   */
  document.addEventListener('DOMContentLoaded', function () {
    // Toastr configuration
    if (window.toastr) {
      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        timeOut: 3000
      };
    }

    // --- LOGIN FORM ---
    document.getElementById('login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var username = document.getElementById('login-username').value.trim();
      var password = document.getElementById('login-password').value;

      if (attemptLogin(username, password)) {
        showCmsApp();
        switchTab('news');
        toastr.success('Welcome back, ' + username + '!', 'Login Successful');
      } else {
        document.getElementById('login-error').style.display = 'block';
      }
    });

    // --- LOGOUT ---
    document.getElementById('btn-logout').addEventListener('click', function () {
      logout();
      toastr.info('You have been logged out.', 'Logout');
    });

    // --- TAB SWITCHING (sidebar) ---
    document.querySelectorAll('[data-cms-tab]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        switchTab(link.getAttribute('data-cms-tab'));
      });
    });

    // --- TAB SWITCHING (mobile select) ---
    var mobileSelect = document.getElementById('mobile-tab-select');
    if (mobileSelect) {
      mobileSelect.addEventListener('change', function () {
        switchTab(mobileSelect.value);
      });
    }

    // --- NEWS CATEGORY FILTER ---
    document.querySelectorAll('#news-category-filter [data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#news-category-filter [data-filter]').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        newsFilter = btn.getAttribute('data-filter');
        renderNewsList();
      });
    });

    // --- ADD BUTTONS ---
    document.getElementById('btn-add-news').addEventListener('click', function () {
      openNewsModal(null);
    });
    document.getElementById('btn-add-package').addEventListener('click', function () {
      openPackageModal(null);
    });
    document.getElementById('btn-add-job').addEventListener('click', function () {
      openJobModal(null);
    });
    document.getElementById('btn-add-doctor').addEventListener('click', function () {
      openDoctorModal(null);
    });

    // --- SAVE BUTTONS ---
    document.getElementById('btn-save-news').addEventListener('click', saveNewsItem);
    document.getElementById('btn-save-package').addEventListener('click', savePackageItem);
    document.getElementById('btn-save-job').addEventListener('click', saveJobItem);
    document.getElementById('btn-save-doctor').addEventListener('click', saveDoctorItem);

    // --- DELETE CONFIRM ---
    document.getElementById('btn-confirm-delete').addEventListener('click', confirmDelete);

    // --- EXPORT / IMPORT / RESET ---
    document.getElementById('btn-export').addEventListener('click', exportCurrent);
    document.getElementById('btn-import').addEventListener('click', openImportModal);
    document.getElementById('btn-confirm-import').addEventListener('click', confirmImport);
    document.getElementById('btn-reset').addEventListener('click', resetCurrent);

    // --- SETTINGS ---
    document.getElementById('btn-save-settings').addEventListener('click', saveSettings);

    // --- CHECK LOGIN STATE ---
    if (isLoggedIn()) {
      showCmsApp();
      switchTab('news');
    } else {
      showLoginScreen();
    }
  });
})(window, window.CMS);