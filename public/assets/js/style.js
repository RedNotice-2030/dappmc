document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.getAttribute('href') === '#' || this.hasAttribute('data-bs-toggle') || this.hasAttribute('data-bs-target')) {
      return;
    }

    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".scroll-animate");

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observerInstance.unobserve(entry.target); // Unobserve so it only animates once
        }
      });
    },
    {
      threshold: 0.15, // Triggers when 15% of element is visible
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", function () {

  // these bindings after dynamically rendering doctor cards.
  function initDoctorInteractions() {
    // 1. AUTOMATIC DOCTOR COUNTER
    const doctorItems = document.querySelectorAll(".doctor-item");
    const countBadges = document.querySelectorAll("[data-count-for]");

    countBadges.forEach((badge) => {
      const category = badge.getAttribute("data-count-for");
      if (category === "all") {
        badge.textContent = doctorItems.length;
      } else {
        const categoryCount = document.querySelectorAll(`.doctor-item[data-category="${category}"]`).length;
        badge.textContent = categoryCount;
      }
    });

    // 2. FILTERING BY SPECIALIZATION
    const filterButtons = document.querySelectorAll(".doctor-filter-list .list-group-item");

    filterButtons.forEach((btn) => {
      if (btn.dataset.bound === "true") return;
      btn.dataset.bound = "true";
      btn.addEventListener("click", function () {
        filterButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");
        const items = document.querySelectorAll(".doctor-item");

        items.forEach((item) => {
          if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });

    // 3. ACCORDION CARD CLICK TOGGLE
    const doctorCards = document.querySelectorAll(".doctor-card");

    doctorCards.forEach((card) => {
      if (card.dataset.bound === "true") return;
      card.dataset.bound = "true";
      card.addEventListener("click", function () {
        const scheduleCollapse = this.querySelector(".schedule-details");
        const toggleText = this.querySelector(".toggle-text");
        const isAlreadyOpen = scheduleCollapse.classList.contains("show");

        // Close all other schedule cards
        document.querySelectorAll(".doctor-card").forEach((otherCard) => {
          const otherSchedule = otherCard.querySelector(".schedule-details");
          const otherToggleText = otherCard.querySelector(".toggle-text");

          if (otherSchedule) otherSchedule.classList.remove("show");
          if (otherToggleText) {
            otherToggleText.innerHTML = 'Click to view schedule <i class="bi bi-chevron-down ms-1"></i>';
          }
        });

        // Toggle current card
        if (!isAlreadyOpen) {
          scheduleCollapse.classList.add("show");
          toggleText.innerHTML = 'Hide schedule <i class="bi bi-chevron-up ms-1"></i>';
        }
      });
    });
  }

  // Expose for content-renderer.js to call after dynamic doctor rendering.
  window.DoctorRenderReady = initDoctorInteractions;

  // Run once on initial page load (in case doctors are statically present).
  initDoctorInteractions();

});

// --- 4. FLIP CARD INTERACTIONS FOR PACKAGE CARDS ---
document.addEventListener('DOMContentLoaded', function(){
  let currentFlipped = null;

  function closeCurrent() {
    if (currentFlipped) {
      currentFlipped.classList.remove('is-flipped');
      currentFlipped = null;
    }
  }

  document.querySelectorAll('.btn-flip').forEach(btn => {
    btn.addEventListener('click', function(e){
      e.preventDefault();
      const col = e.currentTarget.closest('.col-md-6, .col, .col-lg-4');
      if (!col) return;
      const inner = col.querySelector('.flip-card-inner');
      if (!inner) return;

      if (currentFlipped && currentFlipped !== inner) {
        currentFlipped.classList.remove('is-flipped');
      }

      const nowFlipped = inner.classList.toggle('is-flipped');
      currentFlipped = nowFlipped ? inner : null;
    });
  });

  // Close when clicking close button on back face
  document.addEventListener('click', function(e){
    if (e.target.matches('.btn-close-back')) {
      const inner = e.target.closest('.flip-card-inner');
      if (inner) {
        inner.classList.remove('is-flipped');
        if (currentFlipped === inner) currentFlipped = null;
      }
    }
  });
});

(function () {
  let headerStickyInitialized = false;

  function initStickyHeader() {
    if (headerStickyInitialized) return;
    const siteHeader = document.querySelector('.site-header');
    if (!siteHeader) return;
    headerStickyInitialized = true;

    let threshold = window.innerHeight * 0.33; // 0.33 for one-third, change to 0.5 for half

    function updateStickyState() {
      if (window.scrollY < threshold) {
        siteHeader.classList.add('sticky-active');
      } else {
        siteHeader.classList.remove('sticky-active');
      }
    }

    updateStickyState();
    window.addEventListener('scroll', updateStickyState);
    window.addEventListener('resize', function () {
      threshold = window.innerHeight * 0.33;
      updateStickyState();
    });
  }

  document.addEventListener('DOMContentLoaded', initStickyHeader);
  window.addEventListener('header-footer-loaded', initStickyHeader);
})();
