<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DAPPMC - Content Manager</title>
    <meta name="csrf-token-name" content="<?= csrf_token() ?>">
    <meta name="csrf-token-value" content="<?= csrf_hash() ?>">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- Toastr CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" />
    <link rel="icon" type="image/png" href="<?= base_url('assets/images/dappmc-logo.png') ?>" />
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
    <link rel="stylesheet" href="<?= base_url('assets/css/style.css') ?>" />
    <style>
      body { background-color: #f5f7fa; }
      .cms-sidebar { background-color: #002c6d; min-height: 100vh; color: #fff; }
      .cms-sidebar .nav-link { color: rgba(255, 255, 255, 0.8); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.25rem; transition: all 0.2s ease; }
      .cms-sidebar .nav-link:hover, .cms-sidebar .nav-link.active { background-color: rgba(198, 179, 80, 0.2); color: #c6b350; }
      .cms-sidebar .nav-link i { margin-right: 0.5rem; }
      .cms-header { background-color: #fff; border-bottom: 2px solid #c6b350; padding: 1rem 1.5rem; }
      .cms-card { background-color: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0; }
      .cms-card-header { border-bottom: 1px solid #e2e8f0; padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; }
      .cms-card-body { padding: 1.5rem; }
      .item-row { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 0.5rem; transition: all 0.2s ease; background-color: #fff; }
      .item-row:hover { border-color: #c6b350; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
      .item-row .item-title { font-weight: 600; color: #002c6d; }
      .item-row .item-meta { font-size: 0.8rem; color: #6c757d; }
      .btn-cms-primary { background-color: #002c6d; border-color: #002c6d; color: #fff; }
      .btn-cms-primary:hover { background-color: #001f52; border-color: #001f52; color: #fff; }
      .btn-cms-gold { background-color: #c6b350; border-color: #c6b350; color: #002c6d; font-weight: 600; }
      .btn-cms-gold:hover { background-color: #b3a046; border-color: #b3a046; color: #002c6d; }
      .badge-category { font-size: 0.75rem; padding: 0.35rem 0.75rem; border-radius: 20px; }
      .empty-state { text-align: center; padding: 3rem 1rem; color: #6c757d; }
      .empty-state i { font-size: 3rem; display: block; margin-bottom: 1rem; color: #c6b350; }
      .form-label { font-weight: 600; color: #002c6d; font-size: 0.9rem; }
      .help-text { font-size: 0.8rem; color: #6c757d; }
      .list-editor-item { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
      .list-editor-item input { flex: 1; }
      .list-editor-item .btn-remove-item { flex-shrink: 0; }
      .modal-content { border-radius: 12px !important; }
      .modal-header { background-color: #002c6d; color: #fff; border-radius: 12px 12px 0 0 !important; }
      .modal-header .btn-close { filter: invert(1); }
      .nav-tabs .nav-link { color: #002c6d; font-weight: 600; }
      .nav-tabs .nav-link.active { color: #c6b350; border-bottom: 3px solid #c6b350; }
      .toast-container { z-index: 2000; }
      .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #002c6d 0%, #001f52 100%); padding: 1rem; }
      .login-card { background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); max-width: 420px; width: 100%; padding: 2.5rem; border-top: 4px solid #c6b350; }
      .login-logo { width: 80px; height: auto; margin-bottom: 1rem; }
      .login-title { font-family: "Copperplate Gothic", sans-serif; color: #002c6d; font-weight: bold; }
      .login-subtitle { color: #6c757d; font-size: 0.9rem; }
      .login-input { border-radius: 8px; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; }
      .login-input:focus { border-color: #c6b350; box-shadow: 0 0 0 0.2rem rgba(198, 179, 80, 0.25); }
      .login-btn { background-color: #002c6d; border-color: #002c6d; color: #fff; border-radius: 8px; padding: 0.75rem; font-weight: 600; width: 100%; }
      .login-btn:hover { background-color: #001f52; border-color: #001f52; color: #fff; }
      .login-error { color: #dc2626; font-size: 0.85rem; margin-top: 0.5rem; display: none; }
      .login-hint { background-color: #f0f4f9; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #6c757d; margin-top: 1rem; }
      .login-hint code { background: #e2e8f0; padding: 0.1rem 0.4rem; border-radius: 4px; color: #002c6d; }
      .cms-app { display: none; }
      .cms-app.visible { display: block; }
      .logout-btn { color: #002c6d; background: transparent; border: 1px solid #002c6d; border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.85rem; transition: all 0.2s ease; }
      .logout-btn:hover { background: #dc2626; border-color: #dc2626; color: #fff; }
    </style>
  </head>
  <body>
    <!-- LOGIN SCREEN -->
    <div class="login-screen" id="login-screen">
      <div class="login-card">
        <div class="text-center mb-4">
          <img src="<?= base_url('assets/images/dappmc-logo.png') ?>" alt="DAPPMC" class="login-logo" />
          <h4 class="login-title mb-1">DAPPMC Content Manager</h4>
          <p class="login-subtitle mb-0">Sign in to manage website content</p>
        </div>
        <form id="login-form">
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" class="form-control login-input" id="login-username" placeholder="Enter username" autocomplete="username" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control login-input" id="login-password" placeholder="Enter password" autocomplete="current-password" required />
          </div>
          <div class="login-error" id="login-error">
            <i class="bi bi-exclamation-circle me-1"></i>Invalid username or password.
          </div>
          <button type="submit" class="btn login-btn mt-2">
            <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
          </button>
        </form>
        <div class="login-hint">
          <strong>Secure sign-in:</strong><br />
          Your credentials are verified through the hospital database.
          <br />
          <small class="text-muted">Contact the system administrator if you need access.</small>
        </div>
      </div>
    </div>

    <!-- CMS APPLICATION -->
    <div class="cms-app" id="cms-app">
      <div class="container-fluid p-0">
        <div class="row g-0">
          <div class="col-lg-2 cms-sidebar d-none d-lg-block">
            <div class="p-4">
              <div class="d-flex align-items-center mb-4">
                <img src="<?= base_url('assets/images/dappmc-logo.png') ?>" alt="DAPPMC" style="width: 40px; height: auto" />
                <span class="ms-2 fw-bold" style="color: #c6b350; font-family: 'Copperplate Gothic', sans-serif">DAPPMC CMS</span>
              </div>
              <nav class="nav flex-column">
                <a class="nav-link active" href="#" data-cms-tab="news"><i class="bi bi-newspaper"></i> News & Content</a>
                <a class="nav-link" href="#" data-cms-tab="packages"><i class="bi bi-box-seam"></i> Health Packages</a>
                <a class="nav-link" href="#" data-cms-tab="jobs"><i class="bi bi-briefcase"></i> Job Openings</a>
                <a class="nav-link" href="#" data-cms-tab="doctors"><i class="bi bi-person-badge"></i> Doctors</a>
                <a class="nav-link" href="#" data-cms-tab="users"><i class="bi bi-people"></i> User Accounts</a>
                <a class="nav-link" href="#" data-cms-tab="settings"><i class="bi bi-gear"></i> Settings</a>
                <a class="nav-link" href="<?= site_url('') ?>"><i class="bi bi-house-door"></i> View Website</a>
              </nav>
              <hr style="border-color: rgba(255,255,255,0.2)" />
              <div class="small text-white-50 px-2">
                <p class="mb-1"><i class="bi bi-info-circle me-1"></i>Changes are saved to your browser and can be exported as JSON files to update the live site.</p>
              </div>
            </div>
          </div>

          <div class="col-lg-10">
            <div class="cms-header d-flex justify-content-between align-items-center">
              <div>
                <h4 class="mb-0 fw-bold" style="color: #002c6d" id="cms-page-title">Content Manager</h4>
                <small class="text-muted">Manage website content without editing code</small>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <span class="text-muted small d-none d-md-inline" id="logged-in-user"><i class="bi bi-person-circle me-1"></i>admin</span>
                <!-- <button class="btn btn-cms-gold btn-sm" id="btn-export"><i class="bi bi-download me-1"></i> Export JSON</button>
                <button class="btn btn-outline-secondary btn-sm" id="btn-import"><i class="bi bi-upload me-1"></i> Import JSON</button>
                <button class="btn btn-outline-danger btn-sm" id="btn-reset"><i class="bi bi-arrow-counterclockwise me-1"></i> Reset</button> -->
                <button class="logout-btn" id="btn-logout" title="Logout"><i class="bi bi-box-arrow-right me-1"></i> Logout</button>
              </div>
            </div>

            <div class="p-4">
              <div class="d-lg-none mb-3">
                <select class="form-select" id="mobile-tab-select">
                  <option value="news">News & Content</option>
                  <option value="packages">Health Packages</option>
                  <option value="jobs">Job Openings</option>
                  <option value="doctors">Doctors</option>
                  <option value="users">User Accounts</option>
                  <option value="settings">Settings</option>
                </select>
              </div>

              <div id="panel-news" class="cms-panel">
                <div class="cms-card">
                  <div class="cms-card-header">
                    <div>
                      <h5 class="mb-0 fw-bold" style="color: #002c6d"><i class="bi bi-newspaper me-2" style="color: #c6b350"></i>News & Announcements</h5>
                      <small class="text-muted">Manage news, advisories, events, drives, and alerts</small>
                    </div>
                    <button class="btn btn-cms-primary btn-sm" id="btn-add-news"><i class="bi bi-plus-lg me-1"></i> Add New</button>
                  </div>
                  <div class="cms-card-body">
                    <div class="mb-3">
                      <div class="btn-group btn-group-sm" role="group" id="news-category-filter">
                        <button class="btn btn-outline-primary active" data-filter="all">All</button>
                        <button class="btn btn-outline-primary" data-filter="news">News</button>
                        <button class="btn btn-outline-primary" data-filter="advisories">Advisories</button>
                        <button class="btn btn-outline-primary" data-filter="events">Events</button>
                        <button class="btn btn-outline-primary" data-filter="drives">Drives</button>
                        <button class="btn btn-outline-primary" data-filter="alerts">Alerts</button>
                      </div>
                    </div>
                    <div id="news-items-list"></div>
                  </div>
                </div>
              </div>

              <div id="panel-packages" class="cms-panel" style="display: none">
                <div class="cms-card">
                  <div class="cms-card-header">
                    <div>
                      <h5 class="mb-0 fw-bold" style="color: #002c6d"><i class="bi bi-box-seam me-2" style="color: #c6b350"></i>Health Packages</h5>
                      <small class="text-muted">Manage health package flip cards</small>
                    </div>
                    <button class="btn btn-cms-primary btn-sm" id="btn-add-package"><i class="bi bi-plus-lg me-1"></i> Add New</button>
                  </div>
                  <div class="cms-card-body"><div id="packages-items-list"></div></div>
                </div>
              </div>

              <div id="panel-jobs" class="cms-panel" style="display: none">
                <div class="cms-card">
                  <div class="cms-card-header">
                    <div>
                      <h5 class="mb-0 fw-bold" style="color: #002c6d"><i class="bi bi-briefcase me-2" style="color: #c6b350"></i>Job Openings</h5>
                      <small class="text-muted">Manage career job postings</small>
                    </div>
                    <button class="btn btn-cms-primary btn-sm" id="btn-add-job"><i class="bi bi-plus-lg me-1"></i> Add New</button>
                  </div>
                  <div class="cms-card-body"><div id="jobs-items-list"></div></div>
                </div>
              </div>

              <div id="panel-doctors" class="cms-panel" style="display: none">
                <div class="cms-card">
                  <div class="cms-card-header">
                    <div>
                      <h5 class="mb-0 fw-bold" style="color: #002c6d"><i class="bi bi-person-badge me-2" style="color: #c6b350"></i>Doctors & Specialists</h5>
                      <small class="text-muted">Manage doctor profiles shown on doctors.html</small>
                    </div>
                    <button class="btn btn-cms-primary btn-sm" id="btn-add-doctor"><i class="bi bi-plus-lg me-1"></i> Add New</button>
                  </div>
                  <div class="cms-card-body"><div id="doctors-items-list"></div></div>
                </div>
              </div>

              <div id="panel-users" class="cms-panel" style="display: none">
                <div class="cms-card">
                  <div class="cms-card-header">
                    <div>
                      <h5 class="mb-0 fw-bold" style="color: #002c6d"><i class="bi bi-people me-2" style="color: #c6b350"></i>User Accounts</h5>
                      <small class="text-muted">Manage CMS user accounts — add, edit, or deactivate users</small>
                    </div>
                    <button class="btn btn-cms-primary btn-sm" id="btn-add-user"><i class="bi bi-plus-lg me-1"></i> Add User</button>
                  </div>
                  <div class="cms-card-body">
                    <div id="users-items-list"></div>
                  </div>
                </div>
              </div>

              <div id="panel-settings" class="cms-panel" style="display: none">
                <div class="cms-card">
                  <div class="cms-card-header">
                    <div>
                      <h5 class="mb-0 fw-bold" style="color: #002c6d"><i class="bi bi-gear me-2" style="color: #c6b350"></i>Settings</h5>
                      <small class="text-muted">Manage CMS login credentials</small>
                    </div>
                  </div>
                  <div class="cms-card-body">
                    <div class="row g-4">
                      <div class="col-md-6">
                        <div class="border rounded-3 p-4">
                          <h6 class="fw-bold mb-3" style="color: #002c6d"><i class="bi bi-shield-lock me-2"></i>Change Login Credentials</h6>
                          <div class="mb-3">
                            <label class="form-label">New Username</label>
                            <input type="text" class="form-control" id="settings-username" placeholder="Enter new username" />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">New Password</label>
                            <input type="password" class="form-control" id="settings-password" placeholder="Enter new password" />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="settings-password-confirm" placeholder="Confirm new password" />
                          </div>
                          <button class="btn btn-cms-primary" id="btn-save-settings"><i class="bi bi-check-lg me-1"></i> Save Credentials</button>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="border rounded-3 p-4">
                          <h6 class="fw-bold mb-3" style="color: #002c6d"><i class="bi bi-info-circle me-2"></i>About This CMS</h6>
                          <p class="small text-muted mb-2">
                            This lightweight Content Management System allows you to update website content
                            without editing HTML code manually.
                          </p>
                          <ul class="small text-muted mb-3">
                            <li>User accounts are stored securely in the <code>users</code> MySQL table</li>
                            <li>Session is managed server-side by CodeIgniter 4</li>
                            <li>Content is still stored in JSON files under <code>assets/data/</code></li>
                            <!-- <li>Use <strong>Export JSON</strong> to download updated data files</li> -->
                          </ul>
                          <div class="alert alert-success small mb-0">
                            <i class="bi bi-shield-check me-1"></i>
                            <strong>Database Connected:</strong> Login credentials are verified against the
                            hospital's MySQL database with secure password hashing.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- News Item Modal -->
    <div class="modal fade" id="news-item-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="news-modal-title">Add News Item</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="news-item-form">
              <input type="hidden" id="news-item-id" />
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Category</label>
                  <select class="form-select" id="news-item-category" required>
                    <option value="news">News & Announcements</option>
                    <option value="advisories">Health Advisories</option>
                    <option value="events">Hospital Events</option>
                    <option value="drives">Health Drives</option>
                    <option value="alerts">COVID Alerts</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Date</label>
                  <input type="date" class="form-control" id="news-item-date" required />
                </div>
                <div class="col-12">
                  <label class="form-label">Title</label>
                  <input type="text" class="form-control" id="news-item-title" required placeholder="e.g. DAPPMC Opens New Outpatient Department" />
                </div>
                <div class="col-12">
                  <label class="form-label">Excerpt <span class="help-text">(short summary shown on the card)</span></label>
                  <textarea class="form-control" id="news-item-excerpt" rows="2" required placeholder="Brief summary of the article..."></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label">Full Content <span class="help-text">(shown when "Read More" is clicked)</span></label>
                  <textarea class="form-control" id="news-item-content" rows="5" placeholder="Full article content..."></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label">Image URL <span class="help-text">(optional — leave blank for a themed icon)</span></label>
                  <input type="text" class="form-control" id="news-item-image" placeholder="assets/images/your-image.jpg" />
                </div>
                <div class="col-12">
                  <label class="form-label">Tags <span class="help-text">(comma-separated, optional)</span></label>
                  <input type="text" class="form-control" id="news-item-tags" placeholder="facility, announcement" />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-cms-primary" id="btn-save-news">Save Item</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Package Item Modal -->
    <div class="modal fade" id="package-item-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="package-modal-title">Add Health Package</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="package-item-form">
              <input type="hidden" id="package-item-id" />
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label">Package Name</label>
                  <input type="text" class="form-control" id="package-item-name" required placeholder="e.g. Women's Health Package" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Sort Order</label>
                  <input type="number" class="form-control" id="package-item-sort"/>
                </div>
                <div class="col-12">
                  <label class="form-label">Short Description <span class="help-text">(shown on the front of the card)</span></label>
                  <textarea class="form-control" id="package-item-short" rows="2" required placeholder="What's included in this package?"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label">Full Description <span class="help-text">(shown on the back of the card)</span></label>
                  <textarea class="form-control" id="package-item-full" rows="2" placeholder="Detailed description..."></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Image Path</label>
                  <input type="text" class="form-control" id="package-item-image" placeholder="assets/images/packages/whp1.jpg" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Promo Badge <span class="help-text">(e.g. "20% OFF" — leave blank for none)</span></label>
                  <input type="text" class="form-control" id="package-item-badge" placeholder="20% OFF" />
                </div>
                <div class="col-12">
                  <label class="form-label">Promo Details <span class="help-text">(e.g. "Promo valid Aug 1–31, 2026")</span></label>
                  <input type="text" class="form-control" id="package-item-promo" placeholder="Promo valid Aug 1–31, 2026 · Cash transactions only" />
                </div>
                <div class="col-12">
                  <label class="form-label">Operating Hours</label>
                  <input type="text" class="form-control" id="package-item-hours" placeholder="8:00am to 5:00pm, Mondays to Fridays." />
                </div>
                <div class="col-12">
                  <label class="form-label">Availment Steps <span class="help-text">(one per line)</span></label>
                  <textarea class="form-control" id="package-item-steps" rows="3" placeholder="Step 1&#10;Step 2&#10;Step 3"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label">Payment Options <span class="help-text">(one per line)</span></label>
                  <textarea class="form-control" id="package-item-payments" rows="3" placeholder="Pay in cash&#10;Pay via GCash"></textarea>
                </div>
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="package-item-active" checked />
                    <label class="form-check-label" for="package-item-active">Active (visible on website)</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-cms-primary" id="btn-save-package">Save Package</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Item Modal -->
    <div class="modal fade" id="job-item-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="job-modal-title">Add Job Opening</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="job-item-form">
              <input type="hidden" id="job-item-id" />
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label">Job Title</label>
                  <input type="text" class="form-control" id="job-item-title" required placeholder="e.g. Staff Nurse" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Employment Type</label>
                  <select class="form-select" id="job-item-type">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="project-based">Project-based</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Sort Order</label>
                  <input type="number" class="form-control" id="job-item-sort" value="1" min="1" />
                </div>
                <div class="col-12">
                  <label class="form-label">Qualifications <span class="help-text">(one per line)</span></label>
                  <textarea class="form-control" id="job-item-qualifications" rows="4" placeholder="Qualification 1&#10;Qualification 2&#10;Qualification 3"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label">What We Offer <span class="help-text">(check all that apply)</span></label>
                  <div id="job-item-benefits-list" class="border rounded p-2" style="max-height: 160px; overflow-y: auto;"></div>
                  <button type="button" class="btn btn-sm btn-outline-primary mt-2" id="btn-add-new-benefit">
                    <i class="bi bi-plus-lg me-1"></i> Add New Benefit
                  </button>
                </div>
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="job-item-active" checked />
                    <label class="form-check-label" for="job-item-active">Active (visible on website)</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-cms-primary" id="btn-save-job">Save Job</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Doctor Item Modal -->
    <div class="modal fade" id="doctor-item-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="doctor-modal-title">Add Doctor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="doctor-item-form">
              <input type="hidden" id="doctor-item-id" />
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label">Doctor Name</label>
                  <input type="text" class="form-control" id="doctor-item-name" required placeholder="e.g. Dr. Juan Dela Cruz" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Sort Order</label>
                  <input type="number" class="form-control" id="doctor-item-sort" value="1" min="1" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Specialization</label>
                  <select class="form-select" id="doctor-item-specialization">
                    <option value="cardiology">Cardiology</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="radiology">Radiology</option>
                    <option value="internal-medicine">Internal Medicine</option>
                    <option value="physiology">Physiology</option>
                    <option value="anesthesiology">Anesthesiology</option>
                    <option value="nephrology">Nephrology</option>
                    <option value="urology">Urology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="pulmonology">Pulmonology</option>
                    <option value="ent">ENT (Otolaryngology)</option>
                    <option value="general-surgery">General Surgery</option>
                    <option value="ob-gynecology">OB-Gynecology</option>
                    <option value="neurology">Neurology</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Clinic Location</label>
                  <input type="text" class="form-control" id="doctor-item-location" placeholder="e.g. Room 204, Heart Station" />
                </div>
                <div class="col-12">
                  <label class="form-label">Image Path <span class="help-text">(leave blank for default)</span></label>
                  <input type="text" class="form-control" id="doctor-item-image" placeholder="assets/images/doctors/DAPPMC FINAL LOGO_1.png" />
                </div>
                <div class="col-12">
                  <label class="form-label">Clinic Schedule <span class="help-text">(one per line, format: "Days | Time")</span></label>
                  <textarea class="form-control" id="doctor-item-schedule" rows="4" placeholder="Mon & Wed | 9:00 AM – 1:00 PM&#10;Friday | 2:00 PM – 5:00 PM"></textarea>
                </div>
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="doctor-item-active" checked />
                    <label class="form-check-label" for="doctor-item-active">Active (visible on website)</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-cms-primary" id="btn-save-doctor">Save Doctor</button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Account Modal -->
    <div class="modal fade" id="user-item-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="user-modal-title">Add User</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="user-item-form">
              <input type="hidden" id="user-item-id" />
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Username</label>
                  <input type="text" class="form-control" id="user-item-username" required placeholder="e.g. jdelacruz" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="user-item-fullname" placeholder="e.g. Juan Dela Cruz" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" id="user-item-email" required placeholder="user@dappmc.ph" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Role</label>
                  <select class="form-select" id="user-item-role">
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                    <option value="hr_manager">HR Manager</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Password <span class="help-text" id="user-password-help">(min 6 characters)</span></label>
                  <input type="password" class="form-control" id="user-item-password" autocomplete="new-password" placeholder="Enter password" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Confirm Password</label>
                  <input type="password" class="form-control" id="user-item-password-confirm" autocomplete="new-password" placeholder="Confirm password" />
                </div>
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="user-item-active" checked />
                    <label class="form-check-label" for="user-item-active">Active (can log in)</label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-cms-primary" id="btn-save-user">Save User</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <!-- <div class="modal fade" id="import-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Import JSON</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="small text-muted">Paste the JSON content below to replace the current data. You can get this from the "Export JSON" button.</p>
            <textarea class="form-control" id="import-json-text" rows="10" placeholder='{"news": [...]}'></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-cms-primary" id="btn-confirm-import">Import</button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="delete-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this item? This cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="btn-confirm-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="<?= base_url('assets/js/cms.js') ?>"></script>
    <script src="<?= base_url('assets/js/csrf.js') ?>"></script>
    <script src="<?= base_url('assets/js/cms-admin.js') ?>"></script>
  </body>
</html>
