// Smooth UX + minimal interactions only

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    // Escape to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Outside click to close
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      if (!links.contains(target) && !toggle.contains(target)) closeMenu();
    });
  }

  // Active section highlight (safe: ignore non-hash links)
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sectionEls = navLinks
    .map((a) => a.getAttribute("href"))
    .filter((h) => h && h.startsWith("#"))
    .map((h) => document.querySelector(h))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((a) => {
      const h = a.getAttribute("href");
      a.classList.toggle("active", h === `#${id}`);
    });
  };

  if (sectionEls.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.02 }
    );

    sectionEls.forEach((sec) => spy.observe(sec));
  }

  // Reveal on scroll (skip if reduced motion)
  if (!reduceMotion) {
    const reveals = document.querySelectorAll(".reveal");
    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((el) => revObs.observe(el));
  } else {
    // ensure visible
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  // Contact form (client-side mailto) + better validation
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();

      if (!name || !email || !message) {
        if (note) note.textContent = "Please fill in all fields.";
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        if (note) note.textContent = "Please enter a valid email.";
        return;
      }

      const subject = encodeURIComponent(`Portfolio Inquiry — ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
      );

      // mailto can fail if no email client configured; still okay
      window.location.href = `mailto:dhairyasinghal403@gmail.com?subject=${subject}&body=${body}`;

      if (note) note.textContent = "Opening your email client…";
      form.reset();
    });
  }

  /* =========================
     Projects Carousel
     - Shows 3 desktop, 1 mobile (CSS var)
     - Moves by 1 card
     - Autoplay every 5s (disabled if reduced motion)
     - Infinite loop with clones
     - Swipe support on mobile
     - Clones are aria-hidden + not tabbable (a11y)
  ========================= */

  function getVisibleCards(carouselEl) {
    const styles = getComputedStyle(carouselEl);
    const v = styles.getPropertyValue("--pc-cards").trim();
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : 3;
  }

  function createProjectsCarousel(carouselEl) {
    const viewport = carouselEl.querySelector(".pc-viewport");
    const track = carouselEl.querySelector(".pc-track");
    const prevBtn = carouselEl.querySelector(".pc-prev");
    const nextBtn = carouselEl.querySelector(".pc-next");

    if (!viewport || !track) return;

    let originalCards = Array.from(track.children);
    if (originalCards.length === 0) return;

    let visible = getVisibleCards(carouselEl);
    let index = visible; // start after prepended clones
    let isAnimating = false;
    let autoplayTimer = null;

    const interval = Number(carouselEl.getAttribute("data-interval")) || 5000;
    let autoplay = carouselEl.getAttribute("data-autoplay") === "true";
    if (reduceMotion) autoplay = false;

    // Swipe
    let startX = 0;
    let currentX = 0;
    let isPointerDown = false;

    const getGapPx = () => {
      const cs = getComputedStyle(track);
      const gap = cs.gap || cs.columnGap || "0px";
      const px = parseFloat(gap);
      return Number.isFinite(px) ? px : 0;
    };

    const slideSize = () => {
      const firstCard = track.querySelector(".p-card");
      if (!firstCard) return 0;
      return firstCard.getBoundingClientRect().width + getGapPx();
    };

    const setTranslate = (x, withTransition = true) => {
      track.style.transition = withTransition ? "transform 420ms ease" : "none";
      track.style.transform = `translate3d(${x}px,0,0)`;
    };

    const cleanupClones = () => {
      track.querySelectorAll("[data-clone='true']").forEach((n) => n.remove());
    };

    const markCloneA11y = (node) => {
      node.setAttribute("aria-hidden", "true");
      node.querySelectorAll("a, button, input, textarea, select").forEach((el) => {
        el.setAttribute("tabindex", "-1");
      });
    };

    const buildClones = () => {
      cleanupClones();
      originalCards = Array.from(track.children);
      visible = getVisibleCards(carouselEl);

      // clone last "visible" to the front
      const tail = originalCards.slice(-visible).map((n) => {
        const c = n.cloneNode(true);
        c.setAttribute("data-clone", "true");
        markCloneA11y(c);
        return c;
      });

      // clone first "visible" to the end
      const head = originalCards.slice(0, visible).map((n) => {
        const c = n.cloneNode(true);
        c.setAttribute("data-clone", "true");
        markCloneA11y(c);
        return c;
      });

      tail.forEach((n) => track.prepend(n));
      head.forEach((n) => track.append(n));

      // reset index to first real slide
      index = visible;

      // jump to correct position without animation
      const x = -index * slideSize();
      setTranslate(x, false);
    };

    const goTo = (newIndex, opts = {}) => {
      const { animate = true } = opts;
      if (isAnimating && animate) return;

      const step = slideSize();
      if (!step) return;

      isAnimating = animate;
      index = newIndex;

      const x = -index * step;
      setTranslate(x, animate);
    };

    const next = () => goTo(index + 1, { animate: true });
    const prev = () => goTo(index - 1, { animate: true });

    const startAutoplay = () => {
      if (!autoplay) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(() => next(), interval);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const onTransitionEnd = () => {
      const totalOriginal = originalCards.length; // real cards only
      const lastRealIndex = visible + totalOriginal - 1;

      // moved into appended clones
      if (index > lastRealIndex) {
        index = visible;
        const x = -index * slideSize();
        setTranslate(x, false);
      }

      // moved into prepended clones
      if (index < visible) {
        index = lastRealIndex;
        const x = -index * slideSize();
        setTranslate(x, false);
      }

      isAnimating = false;
    };

    // Buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        stopAutoplay();
        prev();
        startAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        stopAutoplay();
        next();
        startAutoplay();
      });
    }

    // Pause on hover/focus (desktop)
    carouselEl.addEventListener("mouseenter", stopAutoplay);
    carouselEl.addEventListener("mouseleave", startAutoplay);
    carouselEl.addEventListener("focusin", stopAutoplay);
    carouselEl.addEventListener("focusout", startAutoplay);

    // Swipe support
    viewport.addEventListener("pointerdown", (e) => {
      isPointerDown = true;
      startX = e.clientX;
      currentX = startX;
      stopAutoplay();
      track.style.transition = "none";
      viewport.setPointerCapture?.(e.pointerId);
    });

    viewport.addEventListener("pointermove", (e) => {
      if (!isPointerDown) return;
      currentX = e.clientX;

      const delta = currentX - startX;
      const base = -index * slideSize();
      setTranslate(base + delta, false);
    });

    const endPointer = () => {
      if (!isPointerDown) return;
      isPointerDown = false;

      const delta = currentX - startX;
      const threshold = 60;

      if (delta <= -threshold) next();
      else if (delta >= threshold) prev();
      else goTo(index, { animate: true });

      startAutoplay();
    };

    viewport.addEventListener("pointerup", endPointer);
    viewport.addEventListener("pointercancel", endPointer);
    viewport.addEventListener("pointerleave", endPointer);

    track.addEventListener("transitionend", onTransitionEnd);

    // Resize rebuild (debounced)
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        cleanupClones();

        // restore only real nodes
        const onlyReal = Array.from(track.children).filter(
          (n) => n.getAttribute("data-clone") !== "true"
        );
        track.innerHTML = "";
        onlyReal.forEach((n) => track.append(n));
        originalCards = Array.from(track.children);

        buildClones();
      }, 140);
    });

    buildClones();
    startAutoplay();
  }

  document.querySelectorAll(".projects-carousel").forEach(createProjectsCarousel);
})();
