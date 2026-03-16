(function () {
  function getHash(href) {
    if (!href) return "";
    var hashIndex = href.indexOf("#");
    return hashIndex >= 0 ? href.slice(hashIndex) : "";
  }

  function getTrackedLinks() {
    return Array.prototype.slice.call(
      document.querySelectorAll("#site-nav .masthead__menu-item:not(.masthead__menu-home-item) a[href*='#']")
    );
  }

  function updateActiveNav() {
    var navLinks = getTrackedLinks();
    if (!navLinks.length) return;

    var masthead = document.querySelector(".masthead");
    var offset = (masthead ? masthead.offsetHeight : 0) + 24;
    var scrollY = window.scrollY + offset;

    var sections = navLinks
      .map(function (link) {
        var hash = getHash(link.getAttribute("href"));
        if (!hash) return null;
        var section = document.querySelector(hash);
        if (!section) return null;
        return {
          hash: hash,
          top: section.offsetTop
        };
      })
      .filter(Boolean);

    if (!sections.length) return;

    var activeHash = sections[0].hash;

    for (var i = 0; i < sections.length; i += 1) {
      if (scrollY >= sections[i].top) {
        activeHash = sections[i].hash;
      } else {
        break;
      }
    }

    navLinks.forEach(function (link) {
      var isActive = getHash(link.getAttribute("href")) === activeHash;
      link.classList.toggle("is-active", isActive);
    });
  }

  var ticking = false;

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateActiveNav();
      ticking = false;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateActiveNav();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);
  });
})();
