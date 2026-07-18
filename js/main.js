/* ==========================================================================
   Illusions GT Auto Spa — interactions
   Vanilla JS only: preloader, nav state, scroll reveals, counter,
   before/after slider, testimonial carousel, contact form.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById("preloader");
  function dismissPreloader() {
    if (preloader) preloader.classList.add("is-done");
  }
  if (prefersReducedMotion) {
    dismissPreloader();
  } else {
    // Dismiss once assets settle, but never hold the page hostage.
    window.addEventListener("load", function () { setTimeout(dismissPreloader, 450); });
    setTimeout(dismissPreloader, 2600);
  }

  /* ---------- Nav: solid background after the hero starts scrolling ---------- */
  var nav = document.getElementById("nav");
  var lastSolid = false;
  function onScrollNav() {
    var solid = window.scrollY > 40;
    if (solid !== lastSolid) {
      nav.classList.toggle("is-solid", solid);
      lastSolid = solid;
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  function closeMenu() {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll-triggered reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    // Stagger siblings that enter together by handing each a small delay.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function (el, i) {
      // Small per-element delay makes grouped cards cascade naturally.
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
      var idx = Array.prototype.indexOf.call(siblings, el);
      if (idx > 0) el.style.setProperty("--d", Math.min(idx * 0.09, 0.45) + "s");
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Animated counter (About stat) ---------- */
  var statEl = document.querySelector("[data-count]");
  if (statEl && "IntersectionObserver" in window && !prefersReducedMotion) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statIO.unobserve(entry.target);
        var target = parseInt(entry.target.getAttribute("data-count"), 10);
        var suffix = entry.target.getAttribute("data-suffix") || "";
        var start = null;
        var dur = 1400;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          // ease-out cubic
          var eased = 1 - Math.pow(1 - p, 3);
          entry.target.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    statIO.observe(statEl);
  }

  /* ---------- Before / after comparison slider ---------- */
  var ba = document.getElementById("baSlider");
  var handle = document.getElementById("baHandle");
  if (ba && handle) {
    var dragging = false;

    function setSplit(pct) {
      pct = Math.max(2, Math.min(98, pct));
      ba.style.setProperty("--split", pct + "%");
      handle.setAttribute("aria-valuenow", String(Math.round(pct)));
    }

    function pctFromEvent(e) {
      var rect = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    }

    ba.addEventListener("pointerdown", function (e) {
      dragging = true;
      ba.setPointerCapture(e.pointerId);
      setSplit(pctFromEvent(e));
    });
    ba.addEventListener("pointermove", function (e) {
      if (dragging) setSplit(pctFromEvent(e));
    });
    ba.addEventListener("pointerup", function () { dragging = false; });
    ba.addEventListener("pointercancel", function () { dragging = false; });

    // Keyboard support on the handle
    handle.addEventListener("keydown", function (e) {
      var current = parseFloat(handle.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft") { setSplit(current - 4); e.preventDefault(); }
      if (e.key === "ArrowRight") { setSplit(current + 4); e.preventDefault(); }
    });

    // A gentle nudge on first view so visitors notice it's interactive.
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      var nudged = false;
      var baIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || nudged) return;
          nudged = true;
          baIO.unobserve(ba);
          var seq = [50, 58, 42, 50];
          seq.forEach(function (v, i) {
            setTimeout(function () { if (!dragging) setSplit(v); }, 600 + i * 450);
          });
          ba.querySelector(".ba__pane--before").style.transition = "clip-path 0.45s ease";
          handle.style.transition = "left 0.45s ease";
          setTimeout(function () {
            ba.querySelector(".ba__pane--before").style.transition = "";
            handle.style.transition = "";
          }, 600 + seq.length * 450 + 500);
        });
      }, { threshold: 0.5 });
      baIO.observe(ba);
    }
  }

  /* ---------- Testimonial carousel ---------- */
  var quotesRoot = document.getElementById("quotes");
  if (quotesRoot) {
    var quotes = quotesRoot.querySelectorAll(".quote");
    var dots = quotesRoot.querySelectorAll(".quotes__dot");
    var qi = 0;
    var timer = null;

    function showQuote(n) {
      qi = (n + quotes.length) % quotes.length;
      quotes.forEach(function (q, i) { q.classList.toggle("is-active", i === qi); });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === qi); });
    }
    function startAuto() {
      if (prefersReducedMotion) return;
      stopAuto();
      timer = setInterval(function () { showQuote(qi + 1); }, 6500);
    }
    function stopAuto() { if (timer) clearInterval(timer); }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { showQuote(i); startAuto(); });
    });
    quotesRoot.addEventListener("mouseenter", stopAuto);
    quotesRoot.addEventListener("mouseleave", startAuto);
    startAuto();
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var endpoint = form.getAttribute("action");

      if (endpoint) {
        // Real backend configured (e.g. Formspree) — POST there.
        status.textContent = "Sending…";
        fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        }).then(function (res) {
          if (res.ok) {
            form.reset();
            status.textContent = "Thank you — we'll be in touch shortly.";
          } else {
            status.textContent = "Something went wrong. Please call us at (202) 338-4100.";
          }
        }).catch(function () {
          status.textContent = "Something went wrong. Please call us at (202) 338-4100.";
        });
      } else {
        // No backend yet: open a pre-filled email draft instead.
        var subject = "Detailing inquiry — " + (data.get("service") || "General");
        var body =
          "Name: " + data.get("name") + "\n" +
          "Email: " + data.get("email") + "\n" +
          "Phone: " + (data.get("phone") || "—") + "\n" +
          "Service: " + (data.get("service") || "—") + "\n\n" +
          data.get("message");
        window.location.href = "mailto:illusionsgtautospa@gmail.com" +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
        status.textContent = "Opening your email app — or call (202) 338-4100.";
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
