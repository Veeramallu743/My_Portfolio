/* Portfolio interactions — dependency-free, progressive enhancement.
   Every feature degrades safely: content is fully visible without JS,
   and each capability is feature-detected before use. */
(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var progress = document.querySelector("[data-scroll-progress]");
  var sectionNav = document.querySelector("[data-section-nav]");
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll("[data-section-nav] a")
  );
  var revealItems = Array.prototype.slice.call(
    document.querySelectorAll(".reveal-on-scroll")
  );
  var copyButton = document.querySelector("[data-copy-email]");
  var toast = document.querySelector("[data-toast]");

  var navSections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  var scrollFramePending = false;
  var activeHref = null;
  var toastTimer;
  var labelTimer;

  /* ---------- Active section in the top pill nav ---------- */

  function centrePill(link) {
    // On narrow screens the pill row scrolls horizontally — keep the active
    // pill in view without disturbing vertical page scroll.
    if (!sectionNav || sectionNav.scrollWidth <= sectionNav.clientWidth + 4) return;
    var navBox = sectionNav.getBoundingClientRect();
    var linkBox = link.getBoundingClientRect();
    var offset = linkBox.left - navBox.left + sectionNav.scrollLeft;
    var target = offset - (sectionNav.clientWidth - linkBox.width) / 2;
    try {
      sectionNav.scrollTo({ left: target, behavior: "smooth" });
    } catch (err) {
      sectionNav.scrollLeft = target;
    }
  }

  function setActiveSection(section) {
    if (!section) return;
    var href = "#" + section.id;
    if (href === activeHref) return;
    activeHref = href;
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === href;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
        centrePill(link);
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveNavigation() {
    if (!navSections.length) return;

    var docEl = document.documentElement;
    var nearPageEnd =
      window.innerHeight + window.scrollY >= docEl.scrollHeight - 120;
    if (nearPageEnd) {
      setActiveSection(document.getElementById("contact") || navSections[navSections.length - 1]);
      return;
    }

    // A section becomes "current" once its top crosses ~45% of the viewport.
    var activationLine = window.scrollY + window.innerHeight * 0.45;
    var current = navSections[0];
    navSections.forEach(function (section) {
      if (section.getBoundingClientRect().top + window.scrollY <= activationLine) {
        current = section;
      }
    });
    setActiveSection(current);
  }

  /* ---------- Scroll-driven UI (rAF-throttled) ---------- */

  function updateScrollState() {
    var docEl = document.documentElement;
    var scrollable = docEl.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
    if (progress) progress.style.width = percent.toFixed(2) + "%";

    updateActiveNavigation();
    scrollFramePending = false;
  }

  function requestScrollUpdate() {
    if (scrollFramePending) return;
    scrollFramePending = true;
    if (window.requestAnimationFrame) window.requestAnimationFrame(updateScrollState);
    else updateScrollState();
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  window.addEventListener("orientationchange", requestScrollUpdate, { passive: true });

  /* ---------- Reveal on scroll (with fallback) ---------- */

  function revealAll() {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
  }

  if ("IntersectionObserver" in window && revealItems.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
    // Safety net: if the observer never fires (rare engine quirks), reveal
    // anything already in view shortly after load.
    window.addEventListener("load", function () {
      window.setTimeout(function () {
        revealItems.forEach(function (item) {
          if (
            !item.classList.contains("visible") &&
            item.getBoundingClientRect().top < window.innerHeight
          ) {
            item.classList.add("visible");
          }
        });
      }, 600);
    });
  } else {
    revealAll();
  }

  if ("IntersectionObserver" in window && navSections.length) {
    var navObserver = new IntersectionObserver(updateActiveNavigation, {
      rootMargin: "-30% 0px -60% 0px",
      threshold: [0, 0.25, 0.75],
    });
    navSections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------- Copy email (reliable fallback + honest feedback) ---------- */

  function showToast(message, ok) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("toast-error", ok === false);
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("visible");
    }, 2800);
  }

  function legacyCopy(text) {
    try {
      var helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;";
      document.body.appendChild(helper);
      helper.focus();
      helper.select();
      helper.setSelectionRange(0, text.length);
      var ok = document.execCommand && document.execCommand("copy");
      helper.remove();
      return !!ok;
    } catch (err) {
      return false;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return legacyCopy(text);
        }
      );
    }
    return Promise.resolve(legacyCopy(text));
  }

  if (copyButton) {
    copyButton.dataset.label = copyButton.textContent.trim();
    copyButton.addEventListener("click", function () {
      var email = copyButton.dataset.email;
      if (!email) return;
      copyText(email).then(function (ok) {
        window.clearTimeout(labelTimer);
        if (ok) {
          copyButton.textContent = "Copied ✓";
          showToast("Email copied to clipboard", true);
        } else {
          copyButton.textContent = "Press Ctrl+C";
          showToast("Couldn’t copy automatically — " + email, false);
        }
        labelTimer = window.setTimeout(function () {
          copyButton.textContent = copyButton.dataset.label;
        }, 2600);
      });
    });
  }

  /* ---------- Footer year ---------- */

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Initial paint ---------- */

  updateScrollState();
})();
