(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Top scroll progress
  const progressEl = document.querySelector(".scroll-progress");
  if (progressEl) {
    const updateProgress = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const clamped = Math.max(0, Math.min(1, ratio));
      progressEl.style.transform = `scaleX(${clamped})`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  // Hero role rotator
  const rotator = document.querySelector(".role-rotator");
  if (rotator) {
    const roles = String(rotator.getAttribute("data-roles") || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (roles.length) rotator.textContent = roles[0];

    if (!reduceMotion && roles.length > 1) {
      let i = 0;
      window.setInterval(() => {
        i = (i + 1) % roles.length;
        if (typeof rotator.animate === "function") {
          rotator.animate(
            [
              { opacity: 0.35, transform: "translateY(4px)" },
              { opacity: 1, transform: "translateY(0)" }
            ],
            { duration: 260, easing: "ease-out" }
          );
        }
        rotator.textContent = roles[i];
      }, 2000);
    }
  }

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

    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      if (!links.contains(target) && !toggle.contains(target)) closeMenu();
    });
  }

  // Active section highlight (hash links only)
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

  // Reveal on scroll
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
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  // Hero metrics count-up
  const metricValues = Array.from(document.querySelectorAll(".metric-value"));
  if (metricValues.length) {
    const numberFmt = new Intl.NumberFormat("en-US");

    const paintMetric = (el, val) => {
      const target = Number(el.getAttribute("data-count") || 0);
      const suffix = String(el.getAttribute("data-suffix") || "");
      const safe = Math.max(0, Math.min(target, val));
      el.textContent = `${numberFmt.format(Math.round(safe))}${suffix}`;
    };

    const animateMetric = (el) => {
      const target = Number(el.getAttribute("data-count") || 0);
      const start = performance.now();
      const duration = 900 + Math.min(target / 30, 900);

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        paintMetric(el, target * eased);
        if (t < 1) window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      metricValues.forEach((el) => paintMetric(el, Number(el.getAttribute("data-count") || 0)));
    } else {
      metricValues.forEach((el) => paintMetric(el, 0));
      const metricsRoot = document.querySelector(".hero-metrics");
      if (metricsRoot) {
        const metricsObs = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              metricValues.forEach((el, idx) => {
                window.setTimeout(() => animateMetric(el), idx * 140);
              });
              obs.disconnect();
            });
          },
          { threshold: 0.25 }
        );

        metricsObs.observe(metricsRoot);
      }
    }
  }

  // ✅ Skills bars fill on scroll (CSS uses var(--w))
  const skillsSection = document.querySelector("#skills");
  if (skillsSection) {
    const bars = Array.from(skillsSection.querySelectorAll(".bar i"));

    if (reduceMotion) {
      bars.forEach((bar) => {
        const w = bar.getAttribute("data-w");
        if (w) bar.style.setProperty("--w", w);
      });
    } else {
      bars.forEach((bar) => bar.style.setProperty("--w", "0%"));

      const skillsObs = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            bars.forEach((bar, i) => {
              const w = bar.getAttribute("data-w");
              if (!w) return;
              window.setTimeout(() => bar.style.setProperty("--w", w), i * 110);
            });

            obs.disconnect();
          });
        },
        { threshold: 0.35 }
      );

      skillsObs.observe(skillsSection);
    }
  }

  // Contact form (mailto)
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
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`);

      window.location.href = `mailto:dhairyasinghal403@gmail.com?subject=${subject}&body=${body}`;
      if (note) note.textContent = "Opening your email client…";
      form.reset();
    });
  }

  /* =========================
     Projects Carousel (fixed sizing + single-click links)
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
    if (!originalCards.length) return;

    let visible = getVisibleCards(carouselEl);
    let index = visible;
    let isAnimating = false;
    let autoplayTimer = null;

    const interval = Number(carouselEl.getAttribute("data-interval")) || 3000;
    let autoplay = carouselEl.getAttribute("data-autoplay") === "true";
    if (reduceMotion) autoplay = false;

    // Swipe
    let startX = 0;
    let currentX = 0;
    let isPointerDown = false;
    let isDragging = false;

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
      node.querySelectorAll("a,button,input,textarea,select").forEach((el) => el.setAttribute("tabindex", "-1"));
    };

    const buildClones = () => {
      cleanupClones();

      originalCards = Array.from(track.children).filter((n) => n.getAttribute("data-clone") !== "true");
      visible = getVisibleCards(carouselEl);

      const tail = originalCards.slice(-visible).map((n) => {
        const c = n.cloneNode(true);
        c.setAttribute("data-clone", "true");
        markCloneA11y(c);
        return c;
      });

      const head = originalCards.slice(0, visible).map((n) => {
        const c = n.cloneNode(true);
        c.setAttribute("data-clone", "true");
        markCloneA11y(c);
        return c;
      });

      tail.forEach((n) => track.prepend(n));
      head.forEach((n) => track.append(n));

      index = visible;
      setTranslate(-index * slideSize(), false);
    };

    const goTo = (newIndex, { animate = true } = {}) => {
      if (isAnimating && animate) return;
      const step = slideSize();
      if (!step) return;

      isAnimating = animate;
      index = newIndex;
      setTranslate(-index * step, animate);
    };

    const next = () => goTo(index + 1, { animate: true });
    const prev = () => goTo(index - 1, { animate: true });

    const startAutoplay = () => {
      if (!autoplay) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(next, interval);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const onTransitionEnd = () => {
      const totalOriginal = originalCards.length;
      const lastRealIndex = visible + totalOriginal - 1;

      if (index > lastRealIndex) {
        index = visible;
        setTranslate(-index * slideSize(), false);
      }
      if (index < visible) {
        index = lastRealIndex;
        setTranslate(-index * slideSize(), false);
      }
      isAnimating = false;
    };

    if (prevBtn) prevBtn.addEventListener("click", () => { stopAutoplay(); prev(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { stopAutoplay(); next(); startAutoplay(); });

    carouselEl.addEventListener("mouseenter", stopAutoplay);
    carouselEl.addEventListener("mouseleave", startAutoplay);
    carouselEl.addEventListener("focusin", stopAutoplay);
    carouselEl.addEventListener("focusout", startAutoplay);

    // ✅ Don’t capture pointerdown on links/buttons (so View Dashboard opens on single click)
    viewport.addEventListener("pointerdown", (e) => {
      const target = e.target;
      if (target && target.closest("a,button")) return;

      isPointerDown = true;
      isDragging = false;
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
      if (Math.abs(delta) > 8) isDragging = true;

      const base = -index * slideSize();
      setTranslate(base + delta, false);
    });

    const endPointer = () => {
      if (!isPointerDown) return;
      isPointerDown = false;

      const delta = currentX - startX;
      const threshold = 60;

      if (isDragging) {
        if (delta <= -threshold) next();
        else if (delta >= threshold) prev();
        else goTo(index, { animate: true });
      } else {
        goTo(index, { animate: true });
      }

      startAutoplay();
    };

    viewport.addEventListener("pointerup", endPointer);
    viewport.addEventListener("pointercancel", endPointer);
    viewport.addEventListener("pointerleave", endPointer);

    track.addEventListener("transitionend", onTransitionEnd);

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        buildClones();
      }, 140);
    });

    buildClones();
    startAutoplay();
  }

  document.querySelectorAll(".projects-carousel").forEach(createProjectsCarousel);
})();
