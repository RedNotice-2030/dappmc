(function (window, CMS) {
  "use strict";

  var currentTab = "news";

  var newsFilter = "all";

  var CATEGORY_LABELS = {
    news: "News",
    advisories: "Advisory",
    events: "Event",
    drives: "Drive",
    alerts: "Alert"
  };

  var CATEGORY_BADGES = {
    news: "bg-primary-subtle text-primary",
    advisories: "bg-warning-subtle text-warning-emphasis",
    events: "bg-info-subtle text-info-emphasis",
    drives: "bg-success-subtle text-success",
    alerts: "bg-danger-subtle text-danger"
  };

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

  var currentUser = null;

  /**
   * @returns {Object|null}
   */
  function getCurrentUser() {
    return currentUser;
  }

  /**
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

  function showLoginScreen() {
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("cms-app").classList.remove("visible");
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
    document.getElementById("login-error").style.display = "none";
  }

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

  function getFirstAllowedTab(role) {
    var tabOrder = ["news", "packages", "jobs", "doctors", "users", "settings"];
    for (var i = 0; i < tabOrder.length; i++) {
      if (isTabAllowedForRole(tabOrder[i], role)) {
        return tabOrder[i];
      }
    }
    return "settings"; // fallback, should never actually hit this
  }


  /**
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

          var isActive = item.is_active !== 0 && item.is_active !== false;
          var statusBadge = isActive
            ? '<span class="badge bg-success-subtle text-success badge-category">Active</span>'
            : '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>';

          html +=
            '<div class="item-row">' +
            '  <div class="d-flex align-items-center gap-3 flex-grow-1">' +
            statusBadge +
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
            "    </button>";
          if (isActive) {
            html +=
              '    <button class="btn btn-sm btn-outline-danger btn-deactivate-news" data-id="' +
              CMS.escapeHtml(item.id) +
              '">' +
              '      <i class="bi bi-eye-slash"></i>' +
              "    </button>";
          } else {
            html +=
              '    <button class="btn btn-sm btn-outline-success btn-activate-news" data-id="' +
              CMS.escapeHtml(item.id) +
              '">' +
              '      <i class="bi bi-eye"></i>' +
              "    </button>";
          }
          html +=
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

  // PACKAGES LIST RENDERING

  function fetchAdminPackages() {
    return fetch("packages/list", {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (response) { return response.json(); })
      .then(function (data) { return data.success ? (data.packages || []) : []; });
  }

  function renderPackagesList() {
    var container = document.getElementById("packages-items-list");
    if (!container) return;

    fetchAdminPackages().then(function (items) {
      items.sort(function (a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0); });

      if (items.length === 0) {
        container.innerHTML =
          '<div class="empty-state">' +
          '  <i class="bi bi-box-seam"></i>' +
          '  <h6 class="fw-bold">No packages found</h6>' +
          '  <p class="mb-0">Click "Add New" to create your first package.</p>' +
          "</div>";
        return;
      }

      var html = "";
      items.forEach(function (pkg) {
        var isActive = pkg.active !== false;
        var statusBadge;
        if (pkg.isExpired) {
          statusBadge = '<span class="badge bg-warning-subtle text-warning-emphasis badge-category">Expired</span>';
        } else if (isActive) {
          statusBadge = '<span class="badge bg-success-subtle text-success badge-category">Active</span>';
        } else {
          statusBadge = '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>';
        }

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
          '    <button class="btn btn-sm btn-outline-primary btn-edit-package" data-id="' + pkg.id + '">' +
          '      <i class="bi bi-pencil"></i>' +
          "    </button>";
        if (isActive) {
          html +=
            '    <button class="btn btn-sm btn-outline-danger btn-deactivate-package" data-id="' + pkg.id + '">' +
            '      <i class="bi bi-eye-slash"></i>' +
            "    </button>";
        } else {
          html +=
            '    <button class="btn btn-sm btn-outline-success btn-activate-package" data-id="' + pkg.id + '">' +
            '      <i class="bi bi-eye"></i>' +
            "    </button>";
        }
        html += "  </div></div>";
      });

      container.innerHTML = html;
      bindPackageActions();
    });
  }


  /**
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
        var isActive = job.active !== false && parseInt(job.active, 10) !== 0;
        var statusBadge = isActive
          ? '<span class="badge bg-success-subtle text-success badge-category">Active</span>'
          : '<span class="badge bg-secondary-subtle text-secondary badge-category">Inactive</span>';

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
          '    <button class="btn btn-sm ' + (isActive ? 'btn-outline-danger btn-deactivate-job' : 'btn-outline-success btn-activate-job') + '" data-id="' +
          CMS.escapeHtml(job.id) +
          '">' +
          '      <i class="bi ' + (isActive ? 'bi-eye-slash' : 'bi-eye') + '"></i>' +
          "    </button>" +
          "  </div>" +
          "</div>";
      });

      container.innerHTML = html;
      bindJobActions();
    });
  }

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

    document.querySelectorAll(".btn-deactivate-job").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        if (!confirm("Hide this job opening from the website? You can reactivate it anytime.")) return;
        setJobActive(id, 0);
      });
    });

    document.querySelectorAll(".btn-activate-job").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setJobActive(btn.getAttribute("data-id"), 1);
      });
    });
  }

  function setJobActive(id, isActive) {
    var params = new URLSearchParams();
    params.append("active", isActive ? 1 : 0);

    fetch("jobs/set-active/" + id, {
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
          toastr.success(data.message || "Job status updated.", "Success");
          renderJobsList();
        } else {
          toastr.error(data.message || "Failed to update job status.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to update job status.", "Error");
      });
  }

  /**
   * @returns {Promise<Array>}
   */
  function fetchAdminDoctors() {
    return fetch("doctors/list", {
      method: "GET",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data.success ? (data.doctors || []) : [];
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to load doctors.", "Error");
        return [];
      });
  }

  function renderDoctorsList() {
    var container = document.getElementById("doctors-items-list");
    if (!container) return;

    fetchAdminDoctors().then(function (items) {
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
        var isActive = doc.active !== false && parseInt(doc.active, 10) !== 0;
        var statusBadge =
          !isActive
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
          '    <button class="btn btn-sm ' + (isActive ? 'btn-outline-danger btn-deactivate-doctor' : 'btn-outline-success btn-activate-doctor') + '" data-id="' +
          CMS.escapeHtml(doc.id) +
          '">' +
          '      <i class="bi ' + (isActive ? 'bi-eye-slash' : 'bi-eye') + '"></i>' +
          "    </button>" +
          "  </div>" +
          "</div>";
      });

      container.innerHTML = html;
      bindDoctorActions();
    });
  }

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

    document.querySelectorAll(".btn-deactivate-news").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        if (!confirm("Hide this news item from the website? You can reactivate it anytime.")) return;
        setNewsActive(id, 0);
      });
    });

    document.querySelectorAll(".btn-activate-news").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        setNewsActive(id, 1);
      });
    });
  }

  function setNewsActive(id, isActive) {
    var params = new URLSearchParams();
    params.append("is_active", isActive);

    fetch("api/news/set-active/" + id, {
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
          toastr.success(data.message || "News item status updated.", "Success");
          renderNewsList();
        } else {
          toastr.error(data.message || "Failed to update news item status.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to update news item status.", "Error");
      });
  }

  function bindPackageActions() {
    document.querySelectorAll(".btn-edit-package").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        fetchAdminPackages().then(function (items) {
          var item = items.find(function (i) { return String(i.id) === String(id); });
          if (item) openPackageModal(item);
        });
      });
    });

    document.querySelectorAll(".btn-deactivate-package").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        if (!confirm("Hide this package from the website? You can reactivate it anytime.")) return;
        setPackageActive(id, 0);
      });
    });

    document.querySelectorAll(".btn-activate-package").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        setPackageActive(id, 1);
      });
    });
  }

  function setPackageActive(id, isActive) {
    var params = new URLSearchParams();
    params.append("active", isActive);

    fetch("packages/set-active/" + id, {
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
          toastr.success(data.message || "Package status updated.", "Success");
          renderPackagesList();
        } else {
          toastr.error(data.message || "Failed to update package status.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to update package status.", "Error");
      });
  }

  function bindDoctorActions() {
    document.querySelectorAll(".btn-edit-doctor").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        fetchAdminDoctors().then(function (items) {
          var item = items.find(function (i) {
            return String(i.id) === String(id);
          });
          if (item) openDoctorModal(item);
        });
      });
    });

    document.querySelectorAll(".btn-deactivate-doctor").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        if (!confirm("Hide this doctor from the website? You can reactivate it anytime.")) return;
        setDoctorActive(id, 0);
      });
    });

    document.querySelectorAll(".btn-activate-doctor").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setDoctorActive(btn.getAttribute("data-id"), 1);
      });
    });
  }

  function setDoctorActive(id, isActive) {
    var params = new URLSearchParams();
    params.append("active", isActive);

    fetch("doctors/set-active/" + id, {
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
          toastr.success(data.message || "Doctor status updated.", "Success");
          renderDoctorsList();
        } else {
          toastr.error(data.message || "Failed to update doctor status.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to update doctor status.", "Error");
      });
  }

  function openDoctorModal(item) {
    var modalEl = document.getElementById("doctor-item-modal");
    document.getElementById("doctor-modal-title").textContent = item ? "Edit Doctor" : "Add Doctor";
    document.getElementById("doctor-item-id").value = item ? item.id : "";
    document.getElementById("doctor-item-name").value = item ? (item.name || "") : "";
    document.getElementById("doctor-item-specialization").value = item ? (item.specialization || "cardiology") : "cardiology";
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

    var params = new URLSearchParams();
    params.append("name", name);
    params.append("specialization", specialization);
    params.append("specialization_label", DOCTOR_SPECIALIZATIONS[specialization] || specialization);
    params.append("location", location);
    params.append("image", image);
    params.append("schedule", JSON.stringify(schedule));
    params.append("active", active ? 1 : 0);

    var url = id ? "doctors/update/" + id : "doctors/create";

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
          toastr.success(result.data.message || "Doctor saved successfully!", "Success");
          var modalEl = document.getElementById("doctor-item-modal");
          var modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          renderDoctorsList();
        } else {
          toastr.error(result.data.message || "Failed to save doctor.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to save doctor.", "Error");
      });
  }

  /**
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
    document.getElementById("news-item-image").value = item ? (item.image || "") : "";
    document.getElementById("news-item-image-file").value = "";

    var previewWrap = document.getElementById("news-item-image-preview");
    var previewImg = document.getElementById("news-item-image-preview-img");
    if (item && item.image) {
      previewImg.src = item.image;
      previewWrap.style.display = "block";
    } else {
      previewWrap.style.display = "none";
    }
    document.getElementById("news-item-tags").value =
      item && item.tags ? item.tags.join(", ") : "";

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

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
    var imageFile = document.getElementById("news-item-image-file").files[0];
    var existingImage = document.getElementById("news-item-image").value;

    var formData = new FormData();
    formData.append("category", category);
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("date", date);
    formData.append("tags", JSON.stringify(tags));
    formData.append("is_active", 1);
    formData.append("existing_image", existingImage);
    if (imageFile) {
      formData.append("image_file", imageFile);
    }

    var url = id ? "api/news/update/" + id : "api/news/create";

    fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": CSRF.tokenValue
        // No Content-Type here — the browser sets the correct multipart boundary automatically for FormData
      },
      body: formData
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

  /**
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
    document.getElementById("package-item-image").value = item 
      ? item.image || "" : "";
    document.getElementById("package-item-badge").value = item
      ? item.promoBadge || ""
      : "";
    document.getElementById("package-item-promo").value = item
      ? item.promoDetails || ""
      : "";
    document.getElementById("package-item-expires").value = item
      ? (item.promoExpiresAt || "")
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
    var sortField = document.getElementById("package-item-sort");
    var sortGroup = sortField.closest(".col-md-4");
    if (sortGroup) {
      sortGroup.style.display = item ? "" : "none";
    }

    var modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  function savePackageItem() {
    var id = document.getElementById("package-item-id").value;
    var name = document.getElementById("package-item-name").value.trim();
    var shortDescription = document.getElementById("package-item-short").value.trim();
    var fullDescription = document.getElementById("package-item-full").value.trim();
    var image = document.getElementById("package-item-image").value.trim();
    var promoBadge = document.getElementById("package-item-badge").value.trim();
    var promoDetails = document.getElementById("package-item-promo").value.trim();
    var promoExpires = document.getElementById("package-item-expires").value;
    var operatingHours = document.getElementById("package-item-hours").value.trim();
    var stepsText = document.getElementById("package-item-steps").value.trim();
    var paymentsText = document.getElementById("package-item-payments").value.trim();
    var active = document.getElementById("package-item-active").checked ? 1 : 0;

    if (!name || !shortDescription) {
      toastr.warning("Please fill in the package name and short description.", "Validation");
      return;
    }

    var availmentSteps = stepsText
      ? stepsText.split("\n").map(function (s) { return s.trim(); }).filter(Boolean)
      : [];
    var paymentOptions = paymentsText
      ? paymentsText.split("\n").map(function (s) { return s.trim(); }).filter(Boolean)
      : [];

    var params = new URLSearchParams();
    params.append("name", name);
    params.append("short_description", shortDescription);
    params.append("full_description", fullDescription);
    params.append("image", image);
    params.append("promo_badge", promoBadge);
    params.append("promo_details", promoDetails);
    params.append("promo_expires_at", promoExpires);
    params.append("operating_hours", operatingHours);
    params.append("availment_steps", JSON.stringify(availmentSteps));
    params.append("payment_options", JSON.stringify(paymentOptions));
    params.append("active", active);

    var url = id ? "packages/update/" + id : "packages/create";

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
          toastr.success(result.data.message || "Package saved successfully!", "Success");
          var modalEl = document.getElementById("package-item-modal");
          var modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          renderPackagesList();
        } else {
          toastr.error(result.data.message || "Failed to save package.", "Error");
        }
      })
      .catch(function (err) {
        console.error(err);
        toastr.error("Failed to save package.", "Error");
      });
  }

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