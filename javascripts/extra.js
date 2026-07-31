/**
 * Delta Core Labs - Interactive JavaScript
 * Handles scroll effects, back-to-top, theme transitions,
 * copy feedback, and scroll-triggered animations.
 */

(function () {
  "use strict";

  /* ─── Back to Top Button ─── */
  function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    const threshold = 300;

    function toggleVisibility() {
      if (window.scrollY > threshold) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", throttle(toggleVisibility, 100));
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ─── Smooth Scroll for Anchor Links ─── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      });
    });
  }

  /* ─── Reading Progress Bar ─── */
  function initReadingProgress() {
    const progressBar = document.createElement("div");
    progressBar.className = "reading-progress";
    progressBar.style.cssText =
      "position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#667eea,#764ba2,#f093fb);z-index:9999;transition:width 50ms linear;width:0;border-radius:0 2px 2px 0;";
    document.body.appendChild(progressBar);

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + "%";
    }

    window.addEventListener("scroll", throttle(updateProgress, 16));
  }

  /* ─── Enhanced Copy Button Feedback ─── */
  function initCopyFeedback() {
    document.addEventListener("click", function (e) {
      const clipboardBtn = e.target.closest(".md-clipboard");
      if (!clipboardBtn) return;

      const originalTitle = clipboardBtn.getAttribute("title");
      clipboardBtn.setAttribute("title", "Copied!");
      clipboardBtn.classList.add("copied");

      setTimeout(function () {
        clipboardBtn.setAttribute("title", originalTitle || "Copy to clipboard");
        clipboardBtn.classList.remove("copied");
      }, 2000);
    });
  }

  /* ─── Intersection Observer for Scroll Animations ─── */
  function initScrollAnimations() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
      ".dcl-card, .dcl-feature, .dcl-stat, .dcl-timeline__item, [data-animate]"
    );
    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─── External Link Handler ─── */
  function initExternalLinks() {
    document.querySelectorAll("a[href]").forEach(function (link) {
      const href = link.getAttribute("href");
      if (
        href &&
        href.startsWith("http") &&
        !href.includes(window.location.hostname)
      ) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        // Add external link icon if not already present
        if (!link.querySelector(".external-icon") && !link.closest("nav")) {
          const icon = document.createElement("span");
          icon.className = "external-icon";
          icon.innerHTML = " ↗";
          icon.style.cssText = "font-size:0.75em;opacity:0.6;";
          link.appendChild(icon);
        }
      }
    });
  }

  /* ─── Table of Contents Active State Enhancement ─── */
  function initTocHighlight() {
    const tocLinks = document.querySelectorAll(".md-sidebar--secondary .md-nav__link");
    if (!tocLinks.length) return;

    const headings = [];
    tocLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const heading = document.querySelector(href);
        if (heading) headings.push({ element: heading, link: link });
      }
    });

    function highlightToc() {
      let current = null;
      headings.forEach(function (item) {
        const rect = item.element.getBoundingClientRect();
        if (rect.top <= 100) {
          current = item;
        }
      });

      tocLinks.forEach(function (link) {
        link.classList.remove("toc-active");
      });
      if (current) {
        current.link.classList.add("toc-active");
      }
    }

    window.addEventListener("scroll", throttle(highlightToc, 100));
  }

  /* ─── Image Lazy Loading Enhancement ─── */
  function initLazyImages() {
    document.querySelectorAll(".md-content img").forEach(function (img) {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
      img.style.opacity = "0";
      img.style.transition = "opacity 0.4s ease";
      if (img.complete) {
        img.style.opacity = "1";
      } else {
        img.addEventListener("load", function () {
          img.style.opacity = "1";
        });
      }
    });
  }

  /* ─── Keyboard Shortcut: / to focus search ─── */
  function initKeyboardShortcuts() {
    document.addEventListener("keydown", function (e) {
      // Press "/" to focus search (when not in an input)
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
      ) {
        e.preventDefault();
        const searchInput = document.querySelector(".md-search__input");
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  /* ─── Utility: Throttle ─── */
  function throttle(fn, delay) {
    let lastCall = 0;
    return function () {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, arguments);
      }
    };
  }

  /* ─── Initialize Everything ─── */
  function init() {
    initBackToTop();
    initSmoothScroll();
    initReadingProgress();
    initCopyFeedback();
    initScrollAnimations();
    initExternalLinks();
    initTocHighlight();
    initLazyImages();
    initKeyboardShortcuts();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Re-init on instant navigation (MkDocs Material instant loading)
  document.addEventListener("DOMContentSwitch", init);
})();
