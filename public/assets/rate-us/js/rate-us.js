(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
  const CATEGORIES = [
    { key: 'staffRating', label: 'Care team' },
    { key: 'cleanlinessRating', label: 'Cleanliness' },
    { key: 'waitRating', label: 'Wait time' },
    { key: 'communicationRating', label: 'Communication' },
  ];

  const configEl = $('#rate-us-config');
  const config = configEl ? JSON.parse(configEl.textContent || '{}') : {};

  const state = {
    data: config.initialData || { stats: null, reviews: [] },
    loading: false,
    step: 0,
    freshId: null,
    form: emptyForm(),
  };

  function emptyForm() {
    return {
      overall: 0,
      staffRating: 0,
      cleanlinessRating: 0,
      waitRating: 0,
      communicationRating: 0,
      department: '',
      visitDate: '',
      comment: '',
      wouldRecommend: null,
      patientName: '',
      email: '',
    };
  }

  function init() {
    initClock();
    initReveal();
    bindModal();
    bindFormInputs();
    bindRefreshButtons();
    renderAll(state.data);
    loadRatings(true);
    scheduleToast();
  }

  function initClock() {
    const clock = $('[data-clock]');
    const wait = $('[data-er-wait]');

    function tick() {
      if (clock) clock.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }

    tick();
    window.setInterval(tick, 1000);
    window.setInterval(() => {
      if (wait) wait.textContent = String(7 + Math.floor(Math.random() * 10));
    }, 18000);
  }

  function initReveal() {
    const items = $$('.ru-reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el) => io.observe(el));
  }

  function bindRefreshButtons() {
    $$('[data-refresh-ratings]').forEach((btn) => {
      btn.addEventListener('click', () => loadRatings(false));
    });
  }

  function bindModal() {
    $$('[data-open-rate-modal]').forEach((btn) => {
      btn.addEventListener('click', openModal);
    });

    $$('[data-close-rate-modal]').forEach((btn) => {
      btn.addEventListener('click', closeModal);
    });

    const next = $('[data-modal-next]');
    const back = $('[data-modal-back]');
    const submit = $('[data-modal-submit]');

    if (next) next.addEventListener('click', nextStep);
    if (back) back.addEventListener('click', () => setStep(Math.max(0, state.step - 1)));
    if (submit) submit.addEventListener('click', submitRating);

    document.addEventListener('keydown', (event) => {
      const modal = $('[data-rate-modal]');
      if (event.key === 'Escape' && modal && !modal.classList.contains('ru-hidden')) {
        closeModal();
      }
    });
  }

  function bindFormInputs() {
    $$('[data-star-input]').forEach((group) => {
      group.addEventListener('mouseover', (event) => {
        const btn = event.target.closest('[data-star-value]');
        if (!btn) return;
        paintStarGroup(group, Number(btn.dataset.starValue));
      });

      group.addEventListener('mouseleave', () => {
        paintStarGroup(group, state.form[group.dataset.starInput] || 0);
      });

      group.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-star-value]');
        if (!btn) return;
        const key = group.dataset.starInput;
        const value = Number(btn.dataset.starValue);
        state.form[key] = state.form[key] === value ? 0 : value;
        paintStarGroup(group, state.form[key]);
        clearError();
      });
    });

    $$('[data-department]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.form.department = btn.dataset.department || '';
        paintDepartments();
        clearError();
      });
    });

    $$('[data-field]').forEach((field) => {
      field.addEventListener('input', () => {
        state.form[field.dataset.field] = field.value;
        if (field.dataset.field === 'comment') updateCommentCount();
        clearError();
      });
    });

    $$('[data-recommend]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const raw = btn.dataset.recommend;
        state.form.wouldRecommend = raw === 'null' ? null : raw === 'true';
        paintRecommend();
      });
    });
  }

  function openModal() {
    state.form = emptyForm();
    $$('[data-field]').forEach((field) => { field.value = ''; });
    const visit = $('[data-field="visitDate"]');
    if (visit && config.today) visit.max = config.today;
    updateCommentCount();
    paintAllInputs();
    setStep(0);
    const modal = $('[data-rate-modal]');
    if (!modal) return;
    modal.classList.remove('ru-hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => $('.ru-modal', modal)?.focus(), 30);
    hideToast(true);
  }

  function closeModal() {
    const modal = $('[data-rate-modal]');
    if (!modal) return;
    modal.classList.add('ru-hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function setStep(step) {
    state.step = step;
    clearError();

    $$('[data-modal-step]').forEach((el) => {
      el.classList.toggle('ru-hidden', Number(el.dataset.modalStep) !== step);
    });

    const titles = [
      ['Step 1 / 3 — Score', 'How did we do?'],
      ['Step 2 / 3 — Context', 'Tell us about the visit'],
      ['Step 3 / 3 — Sign', 'Put it on the record'],
      ['Recorded', 'On the ward ledger.'],
    ];

    const [kicker, title] = titles[step] || titles[0];
    const kickerEl = $('[data-modal-kicker]');
    const titleEl = $('[data-modal-title]');
    if (kickerEl) kickerEl.textContent = kicker;
    if (titleEl) titleEl.textContent = title;

    $$('[data-progress]').forEach((bar) => {
      bar.classList.toggle('is-active', Number(bar.dataset.progress) <= Math.min(step, 2));
    });

    $('[data-modal-back]')?.classList.toggle('ru-hidden', step === 0 || step === 3);
    $('[data-modal-hint]')?.classList.toggle('ru-hidden', step !== 0);
    $('[data-modal-next]')?.classList.toggle('ru-hidden', step >= 2);
    $('[data-modal-submit]')?.classList.toggle('ru-hidden', step !== 2);
    $('[data-modal-done]')?.classList.toggle('ru-hidden', step !== 3);

    if (step === 2) updateSummary();
  }

  function nextStep() {
    if (state.step === 0 && !state.form.overall) {
      setError('Pick an overall score to continue.');
      return;
    }

    if (state.step === 1) {
      if (!state.form.department) {
        setError('Choose the department you visited.');
        return;
      }
      if (!state.form.visitDate) {
        setError('Add the date of your visit.');
        return;
      }
      if (config.today && state.form.visitDate > config.today) {
        setError('Visit date cannot be in the future.');
        return;
      }
    }

    setStep(state.step + 1);
  }

  function updateSummary() {
    const dept = $('[data-summary-department]');
    const date = $('[data-summary-date]');
    const stars = $('[data-summary-stars]');
    if (dept) dept.textContent = state.form.department || 'Department';
    if (date) date.textContent = state.form.visitDate ? formatDate(state.form.visitDate) : 'Date';
    if (stars) stars.innerHTML = starHTML(state.form.overall);
  }

  function setError(message) {
    const box = $('[data-form-error]');
    if (!box) return;
    box.textContent = message;
    box.classList.remove('ru-hidden');
  }

  function clearError() {
    const box = $('[data-form-error]');
    if (!box) return;
    box.textContent = '';
    box.classList.add('ru-hidden');
  }

  function updateCommentCount() {
    const count = $('[data-comment-count]');
    if (count) count.textContent = String((state.form.comment || '').length);
  }

  function paintAllInputs() {
    $$('[data-star-input]').forEach((group) => {
      paintStarGroup(group, state.form[group.dataset.starInput] || 0);
    });
    paintDepartments();
    paintRecommend();
  }

  function paintStarGroup(group, value) {
    $$('[data-star-value]', group).forEach((btn) => {
      btn.classList.toggle('is-on', Number(btn.dataset.starValue) <= value);
    });
    const label = $('[data-star-label]', group);
    if (label) label.textContent = value ? LABELS[value] : 'Tap to score';
  }

  function paintDepartments() {
    $$('[data-department]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.department === state.form.department);
    });
  }

  function paintRecommend() {
    $$('[data-recommend]').forEach((btn) => {
      const raw = btn.dataset.recommend;
      const active = raw === 'null'
        ? state.form.wouldRecommend === null
        : state.form.wouldRecommend === (raw === 'true');
      btn.classList.toggle('is-active', active);
    });
  }

  async function submitRating() {
    const submit = $('[data-modal-submit]');
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Recording…';
    }

    try {
      const response = await fetch(config.apiUrl || '/api/ratings', {
        method: 'POST',
        credentials: 'same-origin',
        headers: requestHeaders(true),
        body: JSON.stringify({
          patientName: state.form.patientName,
          email: state.form.email,
          department: state.form.department,
          visitDate: state.form.visitDate,
          overall: state.form.overall,
          staffRating: state.form.staffRating || null,
          cleanlinessRating: state.form.cleanlinessRating || null,
          waitRating: state.form.waitRating || null,
          communicationRating: state.form.communicationRating || null,
          comment: state.form.comment,
          wouldRecommend: state.form.wouldRecommend,
        }),
      });

      const payload = await response.json();
      updateCsrf(payload.csrfHash);

      if (!response.ok || !payload.ok) {
        setError(payload.error || 'Could not save your feedback. Please try again.');
        return;
      }

      state.freshId = payload.review.id;
      const ref = $('[data-success-reference]');
      const meta = $('[data-success-meta]');
      if (ref) ref.textContent = payload.review.referenceCode;
      if (meta) meta.textContent = `${payload.review.department} · ${payload.review.overall}/5 stars`;
      setStep(3);
      rememberRated();
      await loadRatings(true);
    } catch (error) {
      setError('Network hiccup — your feedback did not go through. Try again.');
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = '★ Submit my rating';
      }
    }
  }

  async function loadRatings(silent) {
    if (!silent) setLoading(true);

    try {
      const response = await fetch(config.apiUrl || '/api/ratings', {
        method: 'GET',
        credentials: 'same-origin',
        headers: requestHeaders(false),
      });

      if (!response.ok) throw new Error(`status ${response.status}`);
      const payload = await response.json();
      state.data = payload;
      renderAll(payload);
      $('[data-error-box]')?.classList.add('ru-hidden');
    } catch (error) {
      if (!state.data || !state.data.stats) {
        $('[data-error-box]')?.classList.remove('ru-hidden');
      }
    } finally {
      setLoading(false);
    }
  }

  function setLoading(loading) {
    state.loading = loading;
    $$('[data-refresh-ratings]').forEach((btn) => {
      btn.disabled = loading;
      btn.style.opacity = loading ? '.55' : '';
    });
  }

  function renderAll(payload) {
    const stats = payload?.stats || null;
    const reviews = payload?.reviews || [];

    renderStats(stats);
    renderReviews(reviews);
  }

  function renderStats(stats) {
    const avg = stats && stats.average !== null ? Number(stats.average) : null;
    const count = stats ? Number(stats.count || 0) : 0;

    setText('[data-hero-average]', avg === null ? '–.–' : avg.toFixed(1));
    setText('[data-hero-count]', String(count));
    setText('[data-wall-average]', avg === null ? '–.–' : avg.toFixed(1));
    setText('[data-wall-count]', String(count));
    setText('[data-monitor-average]', avg === null ? '–.–' : avg.toFixed(1));
    setText('[data-monitor-count]', String(count));
    setText('[data-last-sync]', new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toUpperCase());

    $$('[data-star-display]').forEach((el) => { el.innerHTML = starHTML(avg || 0); });

    const distribution = stats?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const max = Math.max(1, ...Object.values(distribution).map(Number));
    [1, 2, 3, 4, 5].forEach((star) => {
      const n = Number(distribution[star] || 0);
      const bar = $(`[data-dist-bar="${star}"]`);
      const label = $(`[data-dist-count="${star}"]`);
      if (bar) bar.style.width = `${(n / max) * 100}%`;
      if (label) label.textContent = String(n);
    });

    CATEGORIES.forEach((category) => {
      const value = stats?.categories?.[category.key] ?? null;
      const label = $(`[data-category-label="${category.key}"]`);
      const bar = $(`[data-category-bar="${category.key}"]`);
      if (label) label.textContent = value === null ? '–.–' : Number(value).toFixed(1);
      if (bar) bar.style.width = value === null ? '0%' : `${(Number(value) / 5) * 100}%`;
    });
  }

  function renderReviews(reviews) {
    const list = $('[data-review-list]');
    const empty = $('[data-empty-wall]');
    const template = $('#rate-us-review-template');
    if (!list || !template) return;

    list.innerHTML = '';
    empty?.classList.toggle('ru-hidden', reviews.length > 0);

    reviews.forEach((review) => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.classList.toggle('is-mid', review.overall === 3);
      card.classList.toggle('is-low', review.overall <= 2);
      card.classList.toggle('is-fresh', review.id === state.freshId);

      setNodeText($('[data-review-initials]', card), initials(review.patientName));
      setNodeText($('[data-review-name]', card), review.patientName || 'Anonymous patient');
      setNodeText(
        $('[data-review-meta]', card),
        `${review.department} · visited ${formatDate(review.visitDate)} · ${timeAgo(review.createdAt)}`
      );
      const stars = $('[data-review-stars]', card);
      if (stars) stars.innerHTML = starHTML(review.overall);

      const comment = $('[data-review-comment]', card);
      if (comment) {
        if (review.comment) {
          comment.textContent = `“${review.comment}”`;
        } else {
          comment.classList.add('ru-hidden');
        }
      }

      const tags = $('[data-review-tags]', card);
      if (tags) {
        CATEGORIES.forEach((category) => {
          if (review[category.key] === null || review[category.key] === undefined) return;
          const tag = document.createElement('span');
          tag.textContent = `${category.label} ${review[category.key]}/5`;
          tags.appendChild(tag);
        });

        if (review.wouldRecommend !== null && review.wouldRecommend !== undefined) {
          const tag = document.createElement('span');
          tag.textContent = review.wouldRecommend ? 'Recommends' : 'Does not recommend';
          tags.appendChild(tag);
        }
      }

      list.appendChild(card);
    });
  }

  function requestHeaders(withJson) {
    const headers = { 'X-Requested-With': 'XMLHttpRequest' };
    if (withJson) headers['Content-Type'] = 'application/json';

    const csrfHeader = $('meta[name="ci4-csrf-header"]')?.getAttribute('content') || config.csrf?.headerName;
    const csrfToken = $('meta[name="ci4-csrf-token"]')?.getAttribute('content') || config.csrf?.hash;
    if (csrfHeader && csrfToken) headers[csrfHeader] = csrfToken;

    return headers;
  }

  function updateCsrf(hash) {
    if (!hash) return;
    const meta = $('meta[name="ci4-csrf-token"]');
    if (meta) meta.setAttribute('content', hash);
    if (config.csrf) config.csrf.hash = hash;
  }

  function scheduleToast() {
    try {
      if (sessionStorage.getItem('dappmc-rated') === '1' || sessionStorage.getItem('dappmc-prompt-dismissed') === '1') return;
    } catch (error) {
      // ignore private-mode storage issues
    }

    const toast = $('[data-rate-toast]');
    if (!toast) return;

    window.setTimeout(() => toast.classList.remove('ru-hidden'), 6500);

    $('[data-dismiss-toast]')?.addEventListener('click', () => hideToast(false));
  }

  function hideToast(fromOpen) {
    $('[data-rate-toast]')?.classList.add('ru-hidden');
    if (!fromOpen) {
      try { sessionStorage.setItem('dappmc-prompt-dismissed', '1'); } catch (error) {}
    }
  }

  function rememberRated() {
    try { sessionStorage.setItem('dappmc-rated', '1'); } catch (error) {}
  }

  function setText(selector, text) {
    const el = $(selector);
    if (el) el.textContent = text;
  }

  function setNodeText(node, text) {
    if (node) node.textContent = text;
  }

  function starHTML(value) {
    const score = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
    let html = '<span class="ru-star-row" aria-label="' + score + ' out of 5 stars">';
    for (let i = 1; i <= 5; i++) html += i <= score ? '★' : '☆';
    html += '</span>';
    return html;
  }

  function initials(name) {
    if (!name) return '·';
    const parts = String(name).trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '·';
  }

  function formatDate(value) {
    const date = parseDate(value);
    if (!date) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function timeAgo(value) {
    const date = parseDate(value);
    if (!date) return 'just now';
    const mins = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(value);
  }

  function parseDate(value) {
    if (!value) return null;
    const input = String(value);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(input) ? new Date(`${input}T12:00:00`) : new Date(input);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
