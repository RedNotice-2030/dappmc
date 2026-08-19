/**
 * ============================================================================
 * DAPPMC CMS Admin Panel Logic
 * ============================================================================
 * This file handles all the interactive functionality of the CMS admin panel
 * (cms.html). It provides:
 *
 *   1. LOGIN AUTHENTICATION
 *      - Validates username/password against the MySQL users table
 *      - Passwords are hashed with PHP's password_hash()
 *      - Session is managed server-side by CodeIgniter 4
 *      - Credentials can be changed in the Settings tab
 *
 *   2. CONTENT MANAGEMENT (CRUD operations)
 *      - News items (news, advisories, events, drives, alerts)
 *      - Health packages (flip cards on services.html)
 *      - Job openings (career cards on careers.html)
 *      - Doctors (doctor profiles on doctors.html)
 *
 *   3. USER ACCOUNT MANAGEMENT
 *      - List all CMS users from the MySQL database
 *      - Add, edit, and deactivate/reactivate user accounts
 *
 *   4. DATA UTILITIES
 *      - Export current collection as JSON file
 *      - Import JSON from clipboard
 *      - Reset to original file data
 *
 *   5. SETTINGS
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
  "use strict";

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================

  /** Current active tab in the admin panel */
  var currentTab = "news";

  /** Current news category filter */
  var newsFilter = "all";

  /** Item pending deletion (collection + id) */
  var deleteTarget = null;

  // ==========================================================================
  // CATEGORY DISPLAY CONFIGURATION
  // ==========================================================================

  /** Human-readable labels for news categories */
  var CATEGORY_LABELS = {
    news: "News",
    advisories: "Advisory",
    events: "Event",
    drives: "Drive",
    alerts: "Alert"
  };

  /** Bootstrap badge classes for each news category */
  var CATEGORY_BADGES = {
    news: "bg-primary-subtle text-primary",
    advisories: "bg-warning-subtle text-warning-emphasis",
    events: "bg-info-subtle text-info-emphasis",
    drives: "bg-success-subtle text-success",
    alerts: "bg-danger-subtle text-danger"
  };

  /** Available doctor specializations for the CMS dropdown */
  var DOCTOR_SPECIALIZATIONS = {
    cardiology: "Cardiology",
    pediatrics: "Pediatrics",
    radiology: "Radiology",
    "internal-medicine": "Internal Medicine",
    physiology: "Physiology",
    anesthesiology: "Anesthesiology",
    nephrology: "Nephrology",
    urology: "Urology",
    orthopedics: "Orthopedics",
    pulmonology: "Pulmonology",
    ent: "ENT (Otolaryngology)",
    "general-surgery": "General Surgery",
    "ob-gynecology": "OB-Gynecology",
    neurology: "Neurology"
  };

  // ==========================================================================
  // AUTHENTICATION (server-side sessions via MySQL)
  // ==========================================================================

  /** Holds the currently authenticated user (from server) */
  var currentUser = null;

  /**
   * Get the currently authenticated user.
   * @returns {Object|null}
   */
  function getCurrentUser() {
    return currentUser;
  }

  /**
   * Check with the server if a session is active.
   * @returns {Promise<Object|null>} user object or null
   */
  function checkServerSession() {
    return fetch("auth/check", {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.logged_in) {
          currentUser = data.user;
          return data.user;
        }
        currentUser = null;
        return null;
      })
      .catch(function (err) {
        console.error("Session check failed:", err);
        currentUser = null;
        return null;
      });
  }

  /**
   * Attempt to log in with the provided credentials via the server.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object|null>} user object on success, null on failure
   */
  function attemptLogin(username, password) {
    return fetch("auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'X-CSRF-TOKEN': CSRF.tokenValue
      },
      body:
        "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (response.ok && data.success) {
            currentUser = data.user;
            return data.user;
          }
          // Pass the server's error message for display
          return { error: (data && data.message) || "Invalid username or password." };
        });
      })
      .catch(function (err) {
        console.error("Login request failed:", err);
        return null;
      });
  }

  /**
   * Log out the current user (destroys the server session).
   * @returns {Promise<boolean>}
   */
  function logout() {
    return fetch("auth/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'X-CSRF-TOKEN': CSRF.tokenValue
      }
    })
      .then(function (response) {
        currentUser = null;
        showLoginScreen();
        return response.ok;
      })
      .catch(function (err) {
        console.error("Logout request failed:", err);
        currentUser = null;
        showLoginScreen();
        return false;
      });
  }

  /**
   * Show the login screen and hide the CMS app.
   */
  function showLoginScreen() {
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("cms-app").classList.remove("visible");
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
    document.getElementById("login-error").style.display = "none";
  }

  /**
   * Show the CMS app and hide the login screen.
   */
  function showCmsApp() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("cms-app").classList.add("visible");
    var username = currentUser
      ? currentUser.username || currentUser.full_name || "Admin"
      : "Admin";
    document.getElementById("logged-in-user").innerHTML =
      '<i class="bi bi-person-circle me-1"></i>' + username;
    updateNavForRole();
  }

  /**
   * Show or hide the "User Accounts" nav link based on the current user's role.
   */
  function updateNavForRole() {
    var role = currentUser ? currentUser.role : null;
    var isAdmin = role === "admin";
    var isHrManager = role === "hr_manager";
    var isEditor = role === "editor";
    var canManageJobs = isAdmin || isHrManager;

    toggleNavItem("users", isAdmin);
    toggleNavItem("jobs", canManageJobs);
    toggleNavItem("news", !isHrManager);
    toggleNavItem("packages", !isHrManager);
    toggleNavItem("doctors", !isEditor);
  }

  /**
   * Show or hide a sidebar nav-link and its mobile <option> by tab name.
   * @param {string} tab
   * @param {boolean} visible
   */
  function toggleNavItem(tab, visible) {
    var navLink = document.querySelector('[data-cms-tab="' + tab + '"]');
    if (navLink) {
      navLink.style.display = visible ? "" : "none";
    }
    var mobileOption = document.querySelector(
      '#mobile-tab-select option[value="' + tab + '"]'
    );
    if (mobileOption) {
      mobileOption.style.display = visible ? "" : "none";
    }
  }

  /**
   * Returns true if the given role is allowed to view the given tab.
   * Mirrors the same rules used in updateNavForRole().
   */
  function isTabAllowedForRole(tab, role) {
    var isAdmin = role === "admin";
    var isHrManager = role === "hr_manager";
    var isEditor = role === "editor";
    var canManageJobs = isAdmin || isHrManager;

    switch (tab) {
      case "users":
        return isAdmin;
      case "jobs":
        return canManageJobs;
      case "news":
        return !isHrManager;
      case "packages":
        return !isHrManager;
      case "doctors":
        return !isEditor;
      case "settings":
        return true; // everyone can access settings
      default:
        return true;
    }
  }

  /**
   * Finds the first tab (in sidebar order) that the given role is allowed to view.
   * Used to pick where to land a user after login.
   */
  function getFirstAllowedTab(role) {
    var tabOrder = ["news", "packages", "jobs", "doctors", "users", "settings"];
    for (var i = 0; i < tabOrder.length; i++) {
      if (isTabAllowedForRole(tabOrder[i], role)) {
        return tabOrder[i];
      }
    }
    return "settings"; // fallback, should never actually hit this
  }

  // ==========================================================================
  // TAB SWITCHING
  // ==========================================================================

  /**
   * Switch the active panel/tab in the admin interface.
   * @param {string} tab - 'news', 'packages', 'jobs', 'doctors', 'users', 'settings'
   */
  function switchTab(tab) {
    var role = currentUser ? currentUser.role : null;

    // Block force-navigation to any tab the current role isn't allowed to view
    if (!isTabAllowedForRole(tab, role)) {
      tab = getFirstAllowedTab(role);
    }

    currentTab = tab;

    // Hide all panels, show the selected one
    document.querySelectorAll(".cms-panel").forEach(function (panel) {
      panel.style.display = "none";
    });
    var panel = document.getElementById("panel-" + tab);
    if (panel) panel.style.display = "block";

    // Update sidebar active states
    document.querySelectorAll("[data-cms-tab]").forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-cms-tab") === tab);
    });

    // Update mobile select
    var mobileSelect = document.getElementById("mobile-tab-select");
    if (mobileSelect) mobileSelect.value = tab;

    // Update page title
    var titles = {
      news: "Content Manager",
      packages: "Health Packages Manager",
      jobs: "Job Openings Manager",
      doctors: "Doctors Manager",
      users: "User Accounts Manager",
      settings: "CMS Settings"
    };
    document.getElementById("cms-page-title").textContent = titles[tab] || "Content Manager";

    // Render the appropriate list
    if (tab === "news") {
      renderNewsList();
    } else if (tab === "packages") {
      renderPackagesList();
    } else if (tab === "jobs") {
      renderJobsList();
    } else if (tab === "doctors") {
      renderDoctorsList();
    } else if (tab === "users") {
      renderUsersList();
    } else if (tab === "settings") {
      loadSettings();
    }
  }

  // ==========================================================================
  // NEWS LIST RENDERING — DB-backed
  // ==========================================================================

  /**
   * Render the list of news items in the admin panel.
   * Fetches from the server DB via /api/news/admin.
   */
  function renderNewsList() {
    var container = document.getElementById("news-items-list");
    if (!container) return;

    fetch("api/news/admin", {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (!data.success) {
          container.innerHTML =
            '<div class="empty-state">' +
            '  <i class="bi bi-newspaper"></i>' +
            '  <h6 class="fw-bold">Failed to load news</h6>' +
            '  <p class="mb-0">' + CMS.escapeHtml(data.message || "Please try again.") + "</p>" +
            "</div>";
          return;
        }

        var items = data.news || [];

        // Filter by category
        var filtered = items;
        if (newsFilter !== "all") {
          filtered = items.filter(function (item) {
            return item.category === newsFilter;
          });
        }

        // Sort by date descending (newest first)
        filtered.sort(function (a, b) {
          return (b.date || "").localeCompare(a.date || "");
        });

        // Empty state
        if (filtered.length === 0) {
          container.innerHTML =
            '<div class="empty-state">' +
            '  <i class="bi bi-newspaper"></i>' +
            '  <h6 class="fw-bold">No items found</h6>' +
            '  <p class="mb-0">Click "Add New" to create your first item.</p>' +
            "</div>";
          return;
        }

        // Build item rows
        var html = "";
        filtered.forEach(function (item) {
          var catLabel = CATEGORY_LABELS[item.category] || item.category;
          var badgeClass =
            CATEGORY_BADGES[item.category] ||
            "bg-secondary-subtle text-secondary";
          var dateLabel = CMS.formatDate(item.date);

          html +=
            '<div class="item-row">' +
            '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
            '    <span class="badge ' + badgeClass + ' badge-category">' +
            CMS.escapeHtml(catLabel) +
            "</span>" +
            '    <div class="flex-grow-1">' +
            '      <div class="item-title">' + CMS.escapeHtml(item.title) + "</div>" +
            '      <div class="item-meta"><i class="bi bi-calendar3 me-1"></i>' +
            CMS.escapeHtml(dateLabel) +
            "</div>" +
            "    </div>" +
            "  </div>" +
            '  <div class="d-flex gap-1">' +
            '    <button class="btn btn-sm btn-outline-primary btn-edit-news" data-id="' +
            CMS.escapeHtml(item.id) +
            '">' +
            '      <i class="bi bi-pencil"></i>' +
            "    </button>" +
            '    <button class="btn btn-sm btn-outline-danger btn-delete-news" data-id="' +
            CMS.escapeHtml(item.id) +
            '">' +
            '      <i class="bi bi-trash"></i>' +
            "    </button>" +
            "  </div>" +
            "</div>";
        });

        container.innerHTML = html;
        bindNewsActions();
      })
      .catch(function (err) {
        console.error("Failed to load news:", err);
        container.innerHTML =
          '<div class="empty-state">' +
          '  <i class="bi bi-newspaper"></i>' +
          '  <h6 class="fw-bold">Failed to load news</h6>' +
          '  <p class="mb-0">Please refresh the page and try again.</p>' +
          "</div>";
      });
  }

  /**
   * Fetch all news items from the server (for modal editing).
   * @returns {Promise<Array>}
   */
  function fetchNewsItems() {
    return fetch("api/news/admin", {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data.success ? (data.news || []) : [];
      });
  }

  // ==========================================================================
  // PACKAGES LIST RENDERING
  // ==========================================================================

  /**
   * Render the list of health packages in the admin panel.
   */
  function renderPackagesList() {
    var container = document.getElementById("packages-items-list");
    if (!container) return;

    CMS.getItems("packages").then(function (items) {
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
          "</div>";
        return;
      }

      // Build item rows
      var html = "";
      items.forEach(function (pkg) {
        var statusBadge =
          pkg.active === false
            ? '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>'
            : '<span class="badge bg-success-subtle text-success badge-category">Active</span>';

        html +=
          '<div class="item-row">' +
          '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
          statusBadge +
          '    <div class="flex-grow-1">' +
          '      <div class="item-title">' + CMS.escapeHtml(pkg.name) + "</div>" +
          '      <div class="item-meta">Order: ' + (pkg.sortOrder || 0) + "</div>" +
          "    </div>" +
          "  </div>" +
          '  <div class="d-flex gap-1">' +
          '    <button class="btn btn-sm btn-outline-primary btn-edit-package" data-id="' +
          CMS.escapeHtml(pkg.id) +
          '">' +
          '      <i class="bi bi-pencil"></i>' +
          "    </button>" +
          '    <button class="btn btn-sm btn-outline-danger btn-delete-package" data-id="' +
          CMS.escapeHtml(pkg.id) +
          '">' +
          '      <i class="bi bi-trash"></i>' +
          "    </button>" +
          "  </div>" +
          "</div>";
      });

      container.innerHTML = html;
      bindPackageActions();
    });
  }

  // ==========================================================================
  // JOBS LIST RENDERING — DB-backed
  // ==========================================================================

  /**
   * Fetch all jobs for the admin.
   * @returns {Promise<Array>}
   */
  function fetchAdminJobs() {
    return fetch("jobs/list", {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data.success ? (data.jobs || []) : [];
      });
  }

  /**
   * Fetch all benefits for the admin.
   * @returns {Promise<Array>}
   */
  var cachedBenefits = [];

  function fetchBenefits() {
    return fetch("jobs/benefits", {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        cachedBenefits = data.success ? (data.benefits || []) : [];
        return cachedBenefits;
      });
  }

  /**
   * Render the list of job openings in the admin panel.
   */
  function renderJobsList() {
    var container = document.getElementById("jobs-items-list");
    if (!container) return;

    fetchAdminJobs().then(function (items) {
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
          "</div>";
        return;
      }

      // Build item rows
      var html = "";
      items.forEach(function (job) {
        var statusBadge =
          job.active === false ||
          parseInt(job.active, 10) === 0
            ? '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>'
            : '<span class="badge bg-success-subtle text-success badge-category">Active</span>';

        html +=
          '<div class="item-row">' +
          '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
          statusBadge +
          '    <div class="flex-grow-1">' +
          '      <div class="item-title">' + CMS.escapeHtml(job.title) + "</div>" +
          '      <div class="item-meta">Order: ' + (job.sortOrder || 0) + "</div>" +
          "    </div>" +
          "  </div>" +
          '  <div class="d-flex gap-1">' +
          '    <button class="btn btn-sm btn-outline-primary btn-edit-job" data-id="' +
          CMS.escapeHtml(job.id) +
          '">' +
          '      <i class="bi bi-pencil"></i>' +
          "    </button>" +
          '    <button class="btn btn-sm btn-outline-danger btn-delete-job" data-id="' +
          CMS.escapeHtml(job.id) +
          '">' +
          '      <i class="bi bi-trash"></i>' +
          "    </button>" +
          "  </div>" +
          "</div>";
      });

      container.innerHTML = html;
      bindJobActions();
    });
  }

  /**
   * Bind edit/delete buttons for job items.
   */
  function bindJobActions() {
    document.querySelectorAll(".btn-edit-job").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        fetchAdminJobs().then(function (items) {
          var item = items.find(function (i) {
            return String(i.id) === String(id);
          });
          if (item) openJobModal(item);
        });
      });
    });

    document.querySelectorAll(".btn-delete-job").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        if (!confirm("Delete this job opening? This cannot be undone.")) return;

        fetch("jobs/delete/" + id, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            'X-CSRF-TOKEN': CSRF.tokenValue
          }
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data.success) {
              toastr.success(data.message || "Job deleted.", "Success");
              renderJobsList();
            } else {
              toastr.error(data.message || "Failed to delete job.", "Error");
            }
          })
          .catch(function (err) {
            console.error(err);
            toastr.error("Failed to delete job.", "Error");
          });
      });
    });
  }

  // ==========================================================================
  // DOCTORS LIST RENDERING
  // ==========================================================================

  /**
   * Render the list of doctors in the admin panel.
   */
  function renderDoctorsList() {
    var container = document.getElementById("doctors-items-list");
    if (!container) return;

    CMS.getItems("doctors").then(function (items) {
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
          "</div>";
        return;
      }

      // Build item rows
      var html = "";
      items.forEach(function (doc) {
        var statusBadge =
          doc.active === false
            ? '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>'
            : '<span class="badge bg-success-subtle text-success badge-category">Active</span>';
        var specLabel =
          doc.specializationLabel ||
          DOCTOR_SPECIALIZATIONS[doc.specialization] ||
          doc.specialization ||
          "Specialist";

        html +=
          '<div class="item-row">' +
          '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
          statusBadge +
          '    <div class="flex-grow-1">' +
          '      <div class="item-title">' + CMS.escapeHtml(doc.name) + "</div>" +
          '      <div class="item-meta">' + CMS.escapeHtml(specLabel) + " · Order: " + (doc.sortOrder || 0) + "</div>" +
          "    </div>" +
          "  </div>" +
          '  <div class="d-flex gap-1">' +
          '    <button class="btn btn-sm btn-outline-primary btn-edit-doctor" data-id="' +
          CMS.escapeHtml(doc.id) +
          '">' +
          '      <i class="bi bi-pencil"></i>' +
          "    </button>" +
          '    <button class="btn btn-sm btn-outline-danger btn-delete-doctor" data-id="' +
          CMS.escapeHtml(doc.id) +
          '">' +
          '      <i class="bi bi-trash"></i>' +
          "    </button>" +
          "  </div>" +
          "</div>";
      });

      container.innerHTML = html;
      bindDoctorActions();
    });
  }

  // ==========================================================================
  // ACTION BINDINGS
  // ==========================================================================

  /**
   * Bind edit/delete buttons for news items (DB-backed).
   */
  function bindNewsActions() {
    document.querySelectorAll(".btn-edit-news").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        fetchNewsItems().then(function (items) {
          var item = items.find(function (i) {
            return String(i.id) === String(id);
          });
          if (item) openNewsModal(item);
        });
      });
    });

    document.querySelectorAll(".btn-delete-news").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        if (!confirm("Delete this news item? This cannot be undone.")) return;

        fetch("api/news/delete/" + id, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            'X-CSRF-TOKEN': CSRF.tokenValue
          }
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data.success) {
              toastr.success(data.message || "News item deleted.", "Success");
              renderNewsList();
            } else {
              toastr.error(data.message || "Failed to delete news item.", "Error");
            }
          })
          .catch(function (err) {
            console.error(err);
            toastr.error("Failed to delete news item.", "Error");
          });
      });
    });
  }

  /**
   * Bind edit/delete buttons for package items.
   */
  function bindPackageActions() {
    document.querySelectorAll(".btn-edit-package").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        CMS.getItems("packages").then(function (items) {
          var item = items.find(function (i) {
            return i.id === id;
          });
          if (item) openPackageModal(item);
        });
      });
    });

    document.querySelectorAll(".btn-delete-package").forEach(function (btn) {
      btn.addEventListener("click", function () {
        deleteTarget = { collection: "packages", id: btn.getAttribute("data-id") };
        var modal = new bootstrap.Modal(document.getElementById("delete-modal"));
        modal.show();
      });
    });
  }

  /**
   * Bind edit/delete buttons for doctor items.
   */
  function bindDoctorActions() {
    document.querySelectorAll(".btn-edit-doctor").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        CMS.getItems("doctors").then(function (items) {
          var item = items.find(function (i) {
            return i.id === id;
          });
          if (item) openDoctorModal(item);
        });
      });
    });

    document.querySelectorAll(".btn-delete-doctor").forEach(function (btn) {
      btn.addEventListener("click", function () {
        deleteTarget = { collection: "doctors", id: btn.getAttribute("data-id") };
        var modal = new bootstrap.Modal(document.getElementById("delete-modal"));
        modal.show();
      });
    });
  }

  function openDoctorModal(item) {
    var modalEl = document.getElementById("doctor-item-modal");
    document.getElementById("doctor-modal-title").textContent = item ? "Edit Doctor" : "Add Doctor";
    document.getElementById("doctor-item-id").value = item ? item.id : "";
    document.getElementById("doctor-item-name").value = item ? (item.name || "") : "";
    document.getElementById("doctor-item-specialization").value = item ? (item.specialization || "cardiology") : "cardiology";
    document.getElementById("doctor-item-sort").value = item ? (item.sortOrder || 1) : 1;
    document.getElementById("doctor-item-location").value = item ? (item.location || "") : "";
    document.getElementById("doctor-item-image").value = item ? (item.image || "") : "";
    document.getElementById("doctor-item-schedule").value = item && item.schedule
      ? item.schedule.map(function (s) { return s.days + " | " + s.time; }).join("\n")
      : "";
    document.getElementById("doctor-item-active").checked = item ? item.active !== false : true;

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  function saveDoctorItem() {
    var id = document.getElementById("doctor-item-id").value;
    var name = document.getElementById("doctor-item-name").value.trim();
    var specialization = document.getElementById("doctor-item-specialization").value;
    var sortOrder = parseInt(document.getElementById("doctor-item-sort").value, 10) || 1;
    var location = document.getElementById("doctor-item-location").value.trim();
    var image = document.getElementById("doctor-item-image").value.trim();
    var scheduleText = document.getElementById("doctor-item-schedule").value.trim();
    var active = document.getElementById("doctor-item-active").checked;

    if (!name) {
      toastr.warning("Please fill in the doctor name.", "Validation");
      return;
    }

    var schedule = [];
    if (scheduleText) {
      scheduleText.split("\n").forEach(function (line) {
        line = line.trim();
        if (!line) return;
        var parts = line.split("|");
        var days = (parts[0] || "").trim();
        var time = (parts[1] || "").trim();
        if (days) {
          schedule.push({ days: days, time: time });
        }
      });
    }

    var item = {
      id: id || CMS.generateId("doc"),
      name: name,
      specialization: specialization,
      specializationLabel: DOCTOR_SPECIALIZATIONS[specialization] || specialization,
      location: location,
      image: image,
      schedule: schedule,
      active: active,
      sortOrder: sortOrder
    };

    CMS.saveItem("doctors", item).then(function () {
      toastr.success("Doctor saved successfully!", "Success");
      var modalEl = document.getElementById("doctor-item-modal");
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      renderDoctorsList();
    }).catch(function (err) {
      console.error(err);
      toastr.error("Failed to save doctor.", "Error");
    });
  }

  // ==========================================================================
  // NEWS MODAL (ADD/EDIT) — DB-backed
  // ==========================================================================

  /**
   * Open the news item modal for adding or editing.
   * @param {Object|null} item - existing item to edit, or null for new
   */
  function openNewsModal(item) {
    var modalEl = document.getElementById("news-item-modal");
    document.getElementById("news-modal-title").textContent = item
      ? "Edit News Item"
      : "Add News Item";
    document.getElementById("news-item-id").value = item ? item.id : "";
    document.getElementById("news-item-category").value = item
      ? item.category || "news"
      : "news";
    document.getElementById("news-item-date").value = item
      ? item.date || ""
      : new Date().toISOString().split("T")[0];
    document.getElementById("news-item-title").value = item ? item.title || "" : "";
    document.getElementById("news-item-excerpt").value = item
      ? item.excerpt || ""
      : "";
    document.getElementById("news-item-content").value = item
      ? item.content || ""
      : "";
    document.getElementById("news-item-image").value = item ? item.image || "" : "";
    document.getElementById("news-item-tags").value =
      item && item.tags ? item.tags.join(", ") : "";

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  /**
   * Save the news item from the modal form (DB-backed).
   * Creates a new item or updates an existing one.
   */
  function saveNewsItem() {
    var id = document.getElementById("news-item-id").value;
    var category = document.getElementById("news-item-category").value;
    var date = document.getElementById("news-item-date").value;
    var title = document.getElementById("news-item-title").value.trim();
    var excerpt = document.getElementById("news-item-excerpt").value.trim();
    var content = document.getElementById("news-item-content").value.trim();
    var image = document.getElementById("news-item-image").value.trim();
    var tagsStr = document.getElementById("news-item-tags").value.trim();

    // Validation
    if (!title || !excerpt || !date) {
      toastr.warning("Please fill in the title, excerpt, and date.", "Validation");
      return;
    }

    // Parse tags from comma-separated string
    var tags = tagsStr
      ? tagsStr
          .split(",")
          .map(function (t) {
            return t.trim();
          })
          .filter(Boolean)
      : [];

    // Build form data
    var params = new URLSearchParams();
    params.append("category", category);
    params.append("title", title);
    params.append("excerpt", excerpt);
    params.append("content", content);
    params.append("image", image);
    params.append("date", date);
    params.append("tags", JSON.stringify(tags));
    params.append("is_active", 1);

    var url = id ? "api/news/update/" + id : "api/news/create";

    fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'X-CSRF-TOKEN': CSRF.tokenValue
      },
      body: params.toString()
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data.success) {
          toastr.success(result.data.message || "News item saved successfully!", "Success");
          var modalEl = document.getElementById("news-item-modal");
          var modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          renderNewsList();
        } else {
          toastr.error(result.data.message || "Failed to save news item.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to save news item.", "Error");
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
    var modalEl = document.getElementById("package-item-modal");
    document.getElementById("package-modal-title").textContent = item
      ? "Edit Health Package"
      : "Add Health Package";
    document.getElementById("package-item-id").value = item ? item.id : "";
    document.getElementById("package-item-name").value = item ? item.name || "" : "";
    document.getElementById("package-item-sort").value = item
      ? item.sortOrder || 1
      : 1;
    document.getElementById("package-item-short").value = item
      ? item.shortDescription || ""
      : "";
    document.getElementById("package-item-full").value = item
      ? item.fullDescription || ""
      : "";
    document.getElementById("package-item-image").value = item ? item.image || "" : "";
    document.getElementById("package-item-badge").value = item
      ? item.promoBadge || ""
      : "";
    document.getElementById("package-item-promo").value = item
      ? item.promoDetails || ""
      : "";
    document.getElementById("package-item-hours").value = item
      ? item.operatingHours || ""
      : "";
    document.getElementById("package-item-steps").value =
      item && item.availmentSteps ? item.availmentSteps.join("\n") : "";
    document.getElementById("package-item-payments").value =
      item && item.paymentOptions ? item.paymentOptions.join("\n") : "";
    document.getElementById("package-item-active").checked = item
      ? item.active !== false
      : true;

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  /**
   * Save the package from the modal form.
   * Creates a new package or updates an existing one.
   */
  function savePackageItem() {
    var id = document.getElementById("package-item-id").value;
    var name = document.getElementById("package-item-name").value.trim();
    var sortOrder =
      parseInt(document.getElementById("package-item-sort").value, 10) || 1;
    var shortDescription = document
      .getElementById("package-item-short")
      .value.trim();
    var fullDescription = document.getElementById("package-item-full").value.trim();
    var image = document.getElementById("package-item-image").value.trim();
    var promoBadge = document.getElementById("package-item-badge").value.trim();
    var promoDetails = document.getElementById("package-item-promo").value.trim();
    var operatingHours = document.getElementById("package-item-hours").value.trim();
    var stepsText = document.getElementById("package-item-steps").value.trim();
    var paymentsText = document.getElementById("package-item-payments").value.trim();
    var active = document.getElementById("package-item-active").checked;

    // Validation
    if (!name || !shortDescription) {
      toastr.warning("Please fill in the package name and short description.", "Validation");
      return;
    }

    // Parse line-separated lists
    var availmentSteps = stepsText
      ? stepsText
          .split("\n")
          .map(function (s) {
            return s.trim();
          })
          .filter(Boolean)
      : [];
    var paymentOptions = paymentsText
      ? paymentsText
          .split("\n")
          .map(function (s) {
            return s.trim();
          })
          .filter(Boolean)
      : [];

    // Auto-increment sortOrder: find the highest existing sortOrder + 1
    var maxSort = 1;
    CMS.getItems("packages").then(function (items) {
      items.forEach(function (p) {
        if (p.sortOrder && p.sortOrder > maxSort) {
          maxSort = p.sortOrder;
        }
      });
      // Build item object with auto-incremented sortOrder
      var item = {
        id: id || CMS.generateId("pkg"),
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
        sortOrder: sortOrder || maxSort + 1
      };

      // Save via CMS data layer
      CMS.saveItem("packages", item).then(function () {
        toastr.success("Package saved successfully!", "Success");
        var modalEl = document.getElementById("package-item-modal");
        var modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
        renderPackagesList();
      }).catch(function (err) {
        console.error(err);
        toastr.error("Failed to save package.", "Error");
      });
    });
  }

  // ==========================================================================
  // JOB MODAL (ADD/EDIT) — DB-backed
  // ==========================================================================

  function renderBenefitCheckboxes(checkedIds) {
    var container = document.getElementById("job-item-benefits-list");
    if (!container) return;

    checkedIds = (checkedIds || []).map(function (id) {
      return Number(id);
    });
    var html = "";
    cachedBenefits.forEach(function (b) {
      var isChecked = checkedIds.indexOf(Number(b.id)) !== -1;
      html +=
        '<div class="form-check">' +
        '  <input class="form-check-input job-benefit-checkbox" type="checkbox" value="' +
        b.id +
        '" id="benefit-' +
        b.id +
        '"' +
        (isChecked ? " checked" : "") +
        ">" +
        '  <label class="form-check-label small" for="benefit-' +
        b.id +
        '">' +
        CMS.escapeHtml(b.benefit_text) +
        "</label>" +
        "</div>";
    });
    container.innerHTML =
      html ||
      '<p class="text-muted small mb-0">No benefits yet — add one below.</p>';
  }

  /**
   * Open the job modal for adding or editing.
   * @param {Object|null} item - existing job to edit, or null for new
   */
  function openJobModal(item) {
    var modalEl = document.getElementById("job-item-modal");
    document.getElementById("job-modal-title").textContent = item
      ? "Edit Job Opening"
      : "Add Job Opening";
    document.getElementById("job-item-id").value = item ? item.id : "";
    document.getElementById("job-item-title").value = item ? item.title || "" : "";
    document.getElementById("job-item-type").value = item
      ? item.employment_type || "full-time"
      : "full-time";
    document.getElementById("job-item-sort").value = item
      ? item.sortOrder || 1
      : 1;
    document.getElementById("job-item-qualifications").value = item
      ? (item.qualifications || []).join("\n")
      : "";
    document.getElementById("job-item-active").checked = item
      ? item.active !== false
      : true;

    // Sort order is only manually editable when editing an existing job —
    // new jobs get auto-assigned the next available position.
    var sortField = document.getElementById("job-item-sort");
    var sortGroup = sortField.closest(".col-md-4");
    if (sortGroup) {
      sortGroup.style.display = item ? "" : "none";
    }

    fetchBenefits().then(function () {
      renderBenefitCheckboxes(item ? item.benefit_ids : []);
    });

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  function saveJobItem() {
    var id = document.getElementById("job-item-id").value;
    var title = document.getElementById("job-item-title").value.trim();
    var employmentType = document.getElementById("job-item-type").value;
    var sortOrder = parseInt(document.getElementById("job-item-sort").value, 10) || 1;
    var qualificationsText = document.getElementById("job-item-qualifications").value.trim();
    var active = document.getElementById("job-item-active").checked ? 1 : 0;

    if (!title) {
      toastr.warning("Please fill in the job title.", "Validation");
      return;
    }

    var qualifications = qualificationsText
      ? qualificationsText.split("\n").map(function (s) { return s.trim(); }).filter(Boolean)
      : [];

    var benefitIds = Array.from(document.querySelectorAll(".job-benefit-checkbox:checked")).map(function (cb) {
      return parseInt(cb.value, 10);
    });

    var params = new URLSearchParams();
    params.append("title", title);
    params.append("employment_type", employmentType);
    params.append("sort_order", sortOrder);
    params.append("active", active);
    params.append("qualifications", JSON.stringify(qualifications));
    params.append("benefit_ids", JSON.stringify(benefitIds));

    var url = id ? "jobs/update/" + id : "jobs/create";

    fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-CSRF-TOKEN": CSRF.tokenValue
      },
      body: params.toString()
    })
      .then(function (response) { return response.json().then(function (data) { return { ok: response.ok, data: data }; }); })
      .then(function (result) {
        if (result.ok && result.data.success) {
          toastr.success(result.data.message || "Job saved successfully!", "Success");
          var modalEl = document.getElementById("job-item-modal");
          var modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          renderJobsList();
        } else {
          toastr.error(result.data.message || "Failed to save job.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to save job.", "Error");
      });
  }

  function addNewBenefit() {
    var text = prompt("Enter the new benefit text:");
    if (!text || !text.trim()) return;

    var params = new URLSearchParams();
    params.append("benefit_text", text.trim());

    fetch("jobs/benefits/create", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-CSRF-TOKEN": CSRF.tokenValue
      },
      body: params.toString()
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.success) {
          toastr.success("Benefit added.", "Success");
          var previouslyChecked = Array.from(document.querySelectorAll(".job-benefit-checkbox:checked")).map(function (cb) { return parseInt(cb.value, 10); });
          previouslyChecked.push(data.id);
          fetchBenefits().then(function () { renderBenefitCheckboxes(previouslyChecked); });
        } else {
          toastr.error(data.message || "Failed to add benefit.", "Error");
        }
      });
  }

  // ==========================================================================
  // DELETE CONFIRMATION (legacy, for packages/doctors using localStorage)
  // ==========================================================================

  /**
   * Confirm and execute the pending delete operation (localStorage-based).
   */
  function confirmDelete() {
    if (!deleteTarget) return;

    CMS.deleteItem(deleteTarget.collection, deleteTarget.id).then(function () {
      toastr.success("Item deleted successfully!", "Success");
      var modalEl = document.getElementById("delete-modal");
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      deleteTarget = null;

      // Re-render the appropriate list
      if (currentTab === "packages") {
        renderPackagesList();
      } else if (currentTab === "doctors") {
        renderDoctorsList();
      }
    }).catch(function (err) {
      console.error(err);
      toastr.error("Failed to delete item.", "Error");
    });
  }

  // ==========================================================================
  // EXPORT / IMPORT / RESET
  // ==========================================================================

  /**
   * Export the current collection as a downloadable JSON file.
   */
  function exportCurrent() {
    CMS.exportData(currentTab, currentTab + ".json").then(function () {
      toastr.success("Exported " + currentTab + ".json", "Export");
    });
  }

  /**
   * Open the import modal.
   */
  function openImportModal() {
    document.getElementById("import-json-text").value = "";
    var modal = new bootstrap.Modal(document.getElementById("import-modal"));
    modal.show();
  }

  /**
   * Confirm and execute the JSON import.
   */
  function confirmImport() {
    var jsonText = document.getElementById("import-json-text").value.trim();
    if (!jsonText) {
      toastr.warning("Please paste JSON content to import.", "Validation");
      return;
    }

    CMS.importData(currentTab, jsonText).then(function () {
      toastr.success("Data imported successfully!", "Success");
      var modalEl = document.getElementById("import-modal");
      var modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      // Re-render the appropriate list
      if (currentTab === "news") {
        renderNewsList();
      } else if (currentTab === "packages") {
        renderPackagesList();
      } else if (currentTab === "jobs") {
        renderJobsList();
      } else if (currentTab === "doctors") {
        renderDoctorsList();
      }
    }).catch(function (err) {
      console.error(err);
      toastr.error("Invalid JSON. Please check your content.", "Error");
    });
  }

  /**
   * Reset the current collection to its original file data.
   */
  function resetCurrent() {
    if (
      !confirm(
        "Reset all " + currentTab + " data to the original file content? This will discard your local changes."
      )
    )
      return;
    CMS.resetData(currentTab);
    toastr.success("Data reset to original file content.", "Reset");

    // Re-render the appropriate list
    if (currentTab === "news") {
      renderNewsList();
    } else if (currentTab === "packages") {
      renderPackagesList();
    } else if (currentTab === "jobs") {
      renderJobsList();
    } else if (currentTab === "doctors") {
      renderDoctorsList();
    }
  }

  // ==========================================================================
  // USER ACCOUNT MANAGEMENT
  // ==========================================================================

  /**
   * Render the list of users in the admin panel.
   */
  function renderUsersList() {
    var container = document.getElementById("users-items-list");
    if (!container) return;

    fetch("users/list", {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (!data.success) {
          container.innerHTML =
            '<div class="empty-state">' +
            '  <i class="bi bi-people"></i>' +
            '  <h6 class="fw-bold">Failed to load users</h6>' +
            '  <p class="mb-0">' + CMS.escapeHtml(data.message || "Please try again.") + "</p>" +
            "</div>";
          return;
        }

        var users = data.users || [];

        // Empty state
        if (users.length === 0) {
          container.innerHTML =
            '<div class="empty-state">' +
            '  <i class="bi bi-people"></i>' +
            '  <h6 class="fw-bold">No users found</h6>' +
            '  <p class="mb-0">Click "Add User" to create your first account.</p>' +
            "</div>";
          return;
        }

        var currentUserId = currentUser ? currentUser.id : null;

        // Build user rows
        var html = "";
        users.forEach(function (user) {
          var isSelf = currentUserId !== null && String(user.id) === String(currentUserId);
          var userIsActive = user.is_active == 1;
          var statusBadge = userIsActive
            ? '<span class="badge bg-success-subtle text-success badge-category">Active</span>'
            : '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>';
          var roleBadge =
            user.role === "admin"
              ? '<span class="badge bg-primary-subtle text-primary badge-category">Admin</span>'
              : '<span class="badge bg-info-subtle text-info-emphasis badge-category">' +
                CMS.escapeHtml(user.role || "user") +
                "</span>";
          var selfBadge = isSelf
            ? ' <span class="badge bg-warning-subtle text-warning-emphasis badge-category">You</span>'
            : "";
          var lastLogin = user.last_login
            ? CMS.formatDate(user.last_login.substring(0, 10))
            : "Never";

          html +=
            '<div class="item-row">' +
            '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
            statusBadge +
            roleBadge +
            selfBadge +
            '    <div class="flex-grow-1">' +
            '      <div class="item-title">' + CMS.escapeHtml(user.username) + "</div>" +
            '      <div class="item-meta">' +
            '        <i class="bi bi-envelope me-1"></i>' + CMS.escapeHtml(user.email) +
            '        <span class="ms-2"><i class="bi bi-clock-history me-1"></i>Last login: ' +
            CMS.escapeHtml(lastLogin) +
            "</span>" +
            "      </div>" +
            "    </div>" +
            "  </div>" +
            '  <div class="d-flex gap-1">' +
            '    <button class="btn btn-sm btn-outline-primary btn-edit-user" data-id="' +
            user.id +
            '">' +
            '      <i class="bi bi-pencil"></i>' +
            "    </button>";
          if (userIsActive) {
            html +=
              '    <button class="btn btn-sm btn-outline-danger btn-deactivate-user" data-id="' +
              user.id +
              '"' +
              (isSelf ? ' disabled title="You cannot deactivate your own account"' : "") +
              ">" +
              '      <i class="bi bi-person-slash"></i>' +
              "    </button>";
          } else {
            html +=
              '    <button class="btn btn-sm btn-outline-success btn-activate-user" data-id="' +
              user.id +
              '">' +
              '      <i class="bi bi-person-check"></i>' +
              "    </button>";
          }
          html += "  </div>" + "</div>";
        });

        container.innerHTML = html;
        bindUserActions();
      })
      .catch(function (err) {
        console.error("Failed to load users:", err);
        container.innerHTML =
          '<div class="empty-state">' +
          '  <i class="bi bi-people"></i>' +
          '  <h6 class="fw-bold">Failed to load users</h6>' +
          '  <p class="mb-0">Please refresh the page and try again.</p>' +
          "</div>";
      });
  }

  /**
   * Bind edit/deactivate/activate buttons for user rows.
   */
  function bindUserActions() {
    document.querySelectorAll(".btn-edit-user").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        fetchUsers().then(function (users) {
          var user = users.find(function (u) {
            return String(u.id) === String(id);
          });
          if (user) openUserModal(user);
        });
      });
    });

    document.querySelectorAll(".btn-deactivate-user").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        if (!confirm("Deactivate this user? They will no longer be able to log in.")) return;
        setUserActive(id, 0);
      });
    });

    document.querySelectorAll(".btn-activate-user").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        setUserActive(id, 1);
      });
    });
  }

  /**
   * Fetch all users from the server.
   * @returns {Promise<Array>}
   */
  function fetchUsers() {
    return fetch("users/list", {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data.success ? (data.users || []) : [];
      });
  }

  /**
   * Open the user modal for adding or editing.
   * @param {Object|null} user - existing user to edit, or null for new
   */
  function openUserModal(user) {
    document.getElementById("user-modal-title").textContent = user ? "Edit User" : "Add User";
    document.getElementById("user-item-id").value = user ? user.id : "";
    document.getElementById("user-item-username").value = user ? user.username || "" : "";
    document.getElementById("user-item-fullname").value = user ? user.full_name || "" : "";
    document.getElementById("user-item-email").value = user ? user.email || "" : "";
    document.getElementById("user-item-role").value = user ? user.role || "admin" : "admin";
    document.getElementById("user-item-password").value = "";
    document.getElementById("user-item-password-confirm").value = "";
    document.getElementById("user-item-active").checked = user ? user.is_active == 1 : true;

    // For new users: password required. For edits: password optional (blank = keep current)
    document.getElementById("user-item-password").required = !user;
    document.getElementById("user-password-help").textContent = user
      ? "(leave blank to keep current)"
      : "(min 6 characters)";

    var modal = new bootstrap.Modal(document.getElementById("user-item-modal"));
    modal.show();
  }

  /**
   * Save a user from the modal form (create or update via server).
   */
  function saveUserItem() {
    var id = document.getElementById("user-item-id").value;
    var username = document.getElementById("user-item-username").value.trim();
    var fullName = document.getElementById("user-item-fullname").value.trim();
    var email = document.getElementById("user-item-email").value.trim();
    var role = document.getElementById("user-item-role").value;
    var password = document.getElementById("user-item-password").value;
    var passwordConfirm = document.getElementById("user-item-password-confirm").value;
    var isActive = document.getElementById("user-item-active").checked ? 1 : 0;

    // Validation
    if (!username || !email) {
      toastr.warning("Username and email are required.", "Validation");
      return;
    }
    if (password !== passwordConfirm) {
      toastr.warning("Passwords do not match.", "Validation");
      return;
    }
    if (!id && !password) {
      toastr.warning("Password is required for new users.", "Validation");
      return;
    }
    if (password && password.length < 6) {
      toastr.warning("Password must be at least 6 characters.", "Validation");
      return;
    }

    // Build form data
    var params = new URLSearchParams();
    params.append("username", username);
    params.append("full_name", fullName);
    params.append("email", email);
    params.append("role", role);
    params.append("is_active", isActive);
    if (password) params.append("password", password);

    var url = id ? "users/update/" + id : "users/create";

    fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'X-CSRF-TOKEN': CSRF.tokenValue
      },
      body: params.toString()
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data.success) {
          toastr.success(result.data.message || "User saved successfully!", "Success");
          var modalEl = document.getElementById("user-item-modal");
          var modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          renderUsersList();
        } else {
          toastr.error(result.data.message || "Failed to save user.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to save user.", "Error");
      });
  }

  /**
   * Activate or deactivate a user.
   * @param {number} id
   * @param {number} isActive - 1 to activate, 0 to deactivate
   */
  function setUserActive(id, isActive) {
    var params = new URLSearchParams();
    params.append("is_active", isActive);

    fetch("users/set-active/" + id, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'X-CSRF-TOKEN': CSRF.tokenValue
      },
      body: params.toString()
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data.success) {
          toastr.success(result.data.message || "User status updated.", "Success");
          renderUsersList();
        } else {
          toastr.error(result.data.message || "Failed to update user status.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to update user status.", "Error");
      });
  }

  // ==========================================================================
  // SETTINGS
  // ==========================================================================

  /**
   * Load current settings into the settings form.
   */
  function loadSettings() {
    var username = currentUser ? currentUser.username : "";
    document.getElementById("settings-username").value = username;
    document.getElementById("settings-password").value = "";
    document.getElementById("settings-password-confirm").value = "";
  }

  /**
   * Save new login credentials from the settings form (updates the database via server).
   */
  function saveSettings() {
    var username = document.getElementById("settings-username").value.trim();
    var password = document.getElementById("settings-password").value;
    var confirmPassword = document.getElementById("settings-password-confirm").value;

    // Validation
    if (!username) {
      toastr.warning("Please enter a username.", "Validation");
      return;
    }
    if (!password) {
      toastr.warning("Please enter a new password.", "Validation");
      return;
    }
    if (password !== confirmPassword) {
      toastr.warning("Passwords do not match.", "Validation");
      return;
    }
    if (password.length < 6) {
      toastr.warning("Password must be at least 6 characters.", "Validation");
      return;
    }

    // Update credentials on the server
    fetch("auth/change-password", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'X-CSRF-TOKEN': CSRF.tokenValue
      },
      body: "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.success) {
          // Update the local user info
          if (currentUser) {
            currentUser.username = username;
          }
          document.getElementById("logged-in-user").innerHTML =
            '<i class="bi bi-person-circle me-1"></i>' + username;
          toastr.success("Login credentials updated successfully!", "Success");
          loadSettings();
        } else {
          toastr.error(data.message || "Failed to update credentials.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to update credentials.", "Error");
      });
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  /**
   * Initialize the admin panel on DOMContentLoaded.
   * Sets up all event listeners and checks login state.
   */
  document.addEventListener("DOMContentLoaded", function () {
    // Toastr configuration
    if (window.toastr) {
      toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
        timeOut: 3000
      };
    }

    // --- LOGIN FORM ---
    document.getElementById("login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var username = document.getElementById("login-username").value.trim();
      var password = document.getElementById("login-password").value;

      // Disable the button while the request is in flight
      var submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      attemptLogin(username, password).then(function (result) {
        if (submitBtn) submitBtn.disabled = false;
        if (result && !result.error) {
          showCmsApp();
          switchTab("news");
          toastr.success("Welcome back, " + username + "!", "Login Successful");
        } else {
          var errMsg = (result && result.error) || "Invalid username or password.";
          var errEl = document.getElementById("login-error");
          errEl.innerHTML = '<i class="bi bi-exclamation-circle me-1"></i>' + errMsg;
          errEl.style.display = "block";
        }
      });
    });

    // --- LOGOUT ---
    document.getElementById("btn-logout").addEventListener("click", function () {
      logout().then(function () {
        toastr.info("You have been logged out.", "Logout");
      });
    });

    // --- TAB SWITCHING (sidebar) ---
    document.querySelectorAll("[data-cms-tab]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        switchTab(link.getAttribute("data-cms-tab"));
      });
    });

    // --- TAB SWITCHING (mobile select) ---
    var mobileSelect = document.getElementById("mobile-tab-select");
    if (mobileSelect) {
      mobileSelect.addEventListener("change", function () {
        switchTab(mobileSelect.value);
      });
    }

    // --- NEWS CATEGORY FILTER ---
    document.querySelectorAll("#news-category-filter [data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("#news-category-filter [data-filter]").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        newsFilter = btn.getAttribute("data-filter");
        renderNewsList();
      });
    });

    // --- ADD BUTTONS ---
    document.getElementById("btn-add-news").addEventListener("click", function () {
      openNewsModal(null);
    });
    document.getElementById("btn-add-package").addEventListener("click", function () {
      openPackageModal(null);
    });
    document.getElementById("btn-add-job").addEventListener("click", function () {
      openJobModal(null);
    });
    document.getElementById("btn-add-doctor").addEventListener("click", function () {
      openDoctorModal(null);
    });
    document.getElementById("btn-add-user").addEventListener("click", function () {
      openUserModal(null);
    });

    var addBenefitBtn = document.getElementById("btn-add-new-benefit");
    if (addBenefitBtn) {
      addBenefitBtn.addEventListener("click", addNewBenefit);
    }
    // --- SAVE BUTTONS ---
    document.getElementById("btn-save-news").addEventListener("click", saveNewsItem);
    document.getElementById("btn-save-package").addEventListener("click", savePackageItem);
    document.getElementById("btn-save-job").addEventListener("click", saveJobItem);
    document.getElementById("btn-save-doctor").addEventListener("click", saveDoctorItem);
    document.getElementById("btn-save-user").addEventListener("click", saveUserItem);

    // --- DELETE CONFIRM ---
    document.getElementById("btn-confirm-delete").addEventListener("click", confirmDelete);

    // --- EXPORT / IMPORT / RESET ---
    // document.getElementById("btn-export").addEventListener("click", exportCurrent);
    // document.getElementById("btn-import").addEventListener("click", openImportModal);
    // document.getElementById("btn-confirm-import").addEventListener("click", confirmImport);
    // document.getElementById("btn-reset").addEventListener("click", resetCurrent);

    // --- SETTINGS ---
    document.getElementById("btn-save-settings").addEventListener("click", saveSettings);

    // --- CHECK LOGIN STATE (server-side session) ---
    checkServerSession().then(function (user) {
      if (user) {
        showCmsApp();
        switchTab("news");
      } else {
        showLoginScreen();
      }
    });
  });
})(window, window.CMS);