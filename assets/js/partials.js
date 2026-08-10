function loadPartial(url, container) {
  return fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load partial: ' + url);
      }
      return response.text();
    })
    .then(function (html) {
      var placeholder = document.getElementById(container);
      if (placeholder) {
        placeholder.innerHTML = html;
      }
    });
}

function normalizeNavPath(path) {
  if (!path) {
    return 'index';
  }

  var cleanedPath = path.split('?')[0].split('#')[0].replace(/\\/g, '/');
  cleanedPath = cleanedPath.replace(/^\/+/, '').replace(/\/+$/, '');

  if (!cleanedPath) {
    return 'index';
  }

  var segments = cleanedPath.split('/');
  var lastSegment = segments[segments.length - 1] || 'index';

  return lastSegment.replace(/\.html$/i, '').toLowerCase() || 'index';
}

function setActiveNavLink() {
  var currentPath = normalizeNavPath(window.location.pathname);

  var links = document.querySelectorAll('#header-placeholder .nav-link');
  links.forEach(function (link) {
    var href = link.getAttribute('href') || '';

    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      return;
    }

    var linkUrl = new URL(href, window.location.href);
    var linkPath = normalizeNavPath(linkUrl.pathname);

    var isActive = linkPath === currentPath;
    link.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function loadHeaderFooter() {
  Promise.all([
    loadPartial('assets/includes/header.html', 'header-placeholder').then(setActiveNavLink),
    loadPartial('assets/includes/footer.html', 'footer-placeholder')
  ])
    .then(function () {
      window.dispatchEvent(new Event('header-footer-loaded'));
    })
    .catch(function (error) {
      console.error(error);
    });
}

document.addEventListener('DOMContentLoaded', loadHeaderFooter);
