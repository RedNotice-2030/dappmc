<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= esc($title ?? 'DAPPMC') ?></title>
    <!-- Bootstrap 5 CSS -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <!-- Toastr CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" />
    <link rel="icon" type="image/png" href="<?= base_url('assets/images/dappmc-logo.png') ?>" />
    <!-- Bootstrap Icons -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
    />
    <link rel="stylesheet" href="<?= base_url('assets/css/style.css') ?>?v=2" />
  </head>
  <body>
    <div class="site-header">
      <div class="text-white py-2 border-bottom border-secondary" style="background-color: #002c6d">
        <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-1">
          <div class="small order-1">
            <span class="me-3"><i class="bi bi-clock me-1" style="color: #c6b350"></i> 24/7 Emergency Care</span>
            <span><i class="bi bi-geo-alt me-1" style="color: #c6b350"></i> <a href="<?= site_url('about') ?>#location" class="text-white text-decoration-none">Gensan Drive, Koronadal, 9506 South Cotabato</a></span>
          </div>
          <div class="small fw-bold order-2">
            <a href="tel:911" class="text-danger text-decoration-none me-3"><i class="bi bi-telephone-fill me-1"></i> Emergency: 911</a>
            <a href="tel:0832282202" class="text-white text-decoration-none"><i class="bi bi-telephone me-1"></i> Helpline: (083) 228 2202</a>
          </div>
        </div>
      </div>
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-lg">
      <div class="container">
        <a href="<?= site_url('') ?>" class="logo d-flex align-items-center me-auto text-decoration-none">
          <img class="logo-nav img-fluid" src="<?= base_url('assets/images/dappmc-logo.png') ?>" alt="" />
          <h1 class="sitename" style="margin: 10px">DAPPMC</h1>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto fw-semibold">
            <li class="nav-item"><a class="nav-link" href="<?= site_url('') ?>">Home</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="<?= site_url('services') ?>" role="button" data-bs-toggle="dropdown">Patient Services</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="<?= site_url('services') ?>">All Services</a></li>
                <li><a class="dropdown-item" href="<?= site_url('doctors') ?>">Doctors</a></li>
                <li><a class="dropdown-item" href="<?= site_url('services') ?>#packages">Health Packages</a></li>
                <li><a class="dropdown-item" href="<?= site_url('services') ?>#specialties">Medical Specialties</a></li>
                <li><a class="dropdown-item" href="<?= site_url('services') ?>#lab">Diagnostic Services</a></li>
                <li><a class="dropdown-item" href="<?= site_url('hmo') ?>">HMO Partners</a></li>
                <li><a class="dropdown-item" href="<?= site_url('services') ?>#billing">Billing & Insurance</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="<?= site_url('about') ?>" role="button" data-bs-toggle="dropdown">About</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="<?= site_url('about') ?>#history">History</a></li>
                <li><a class="dropdown-item" href="<?= site_url('about') ?>#vision-mission">Vision Mission</a></li>
                <li><a class="dropdown-item" href="<?= site_url('about') ?>#ims-policy">IMS Policy</a></li>
                <li><a class="dropdown-item" href="<?= site_url('about') ?>#core-values">Core Values</a></li>
                <li><a class="dropdown-item" href="<?= site_url('about') ?>#location">Visit Us</a></li>
                <li><a class="dropdown-item" href="<?= site_url('org') ?>">Our Team</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="<?= site_url('news') ?>" role="button" data-bs-toggle="dropdown">News & Announcements</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="<?= site_url('news') ?>#news">News</a></li>
                <li><a class="dropdown-item" href="<?= site_url('news') ?>#advisories">Health Advisories</a></li>
                <li><a class="dropdown-item" href="<?= site_url('news') ?>#events">Hospital Events</a></li>
                <li><a class="dropdown-item" href="<?= site_url('news') ?>#drives">Health Drives</a></li>
                <li><a class="dropdown-item" href="<?= site_url('news') ?>#alerts">COVID Alerts</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="<?= site_url('careers') ?>">Careers</a></li>
            <li class="nav-item"><a class="nav-link" href="<?= site_url('faqs') ?>">FAQs</a></li>
            <li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#contact-us-modal">Contact Us</a></li>
            <!-- <li class="nav-item"><a class="nav-link" href="<?= site_url('cms') ?>" title="Content Manager"><i class="bi bi-gear-fill"></i></a></li> -->
          </ul>
        </div>
      </div>
        </nav>
      </div>