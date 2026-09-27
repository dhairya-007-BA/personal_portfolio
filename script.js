// This static page owns its listeners/observers; dispose them on navigation and
// reinitialize after a back-forward-cache restore.
function initializePortfolio() {
  const lifecycle = new AbortController();
  const timers = new Set();
  const frames = new Set();
  const observers = [];
  const on = (target, event, callback, options = {}) => target.addEventListener(event, callback, { ...options, signal: lifecycle.signal });
  const later = (callback, delay) => {
    const id = window.setTimeout(() => { timers.delete(id); callback(); }, delay);
    timers.add(id);
    return id;
  };
  const frame = (callback) => {
    const id = requestAnimationFrame((time) => { frames.delete(id); callback(time); });
    frames.add(id);
  };
  const observe = (callback, options) => {
    const observer = new IntersectionObserver(callback, options);
    observers.push(observer);
    return observer;
  };
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = motion.matches;
  const rootEl = document.documentElement;
  rootEl.classList.add('js');
  on(motion, 'change', () => {
    if (motion.matches) {
      document.getAnimations().forEach((animation) => animation.cancel());
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      document.querySelectorAll('.bar i').forEach((bar) => bar.style.setProperty('--w', bar.dataset.w));
    }
  });
  window.addEventListener('pagehide', () => {
    lifecycle.abort();
    timers.forEach(clearTimeout);
    frames.forEach(cancelAnimationFrame);
    observers.forEach((observer) => observer.disconnect());
  }, { once: true });

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
    on(window, "scroll", updateProgress, { passive: true });
    on(window, "resize", updateProgress);
  }

  // Retain the original role animation, but stop it offscreen or on reduced motion.
  const rotator = document.querySelector('.role-rotator');
  if (rotator) {
    const roles = rotator.dataset.roles.split(',').map((role) => role.trim());
    let index = 0;
    let timer;
    let visible = false;
    const schedule = () => {
      clearTimeout(timer); timers.delete(timer);
      if (!motion.matches && !document.hidden && visible) timer = later(() => {
        if (motion.matches || document.hidden || !visible) { schedule(); return; }
        index = (index + 1) % roles.length;
        rotator.textContent = roles[index];
        rotator.animate?.([{ opacity: .35, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' });
        schedule();
      }, 4000);
    };
    on(motion, 'change', schedule);
    on(document, 'visibilitychange', schedule);
    const visibility = observe((entries) => { visible = entries[0].isIntersecting; schedule(); });
    visibility.observe(rotator);
  }

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const mobile = window.matchMedia('(max-width: 1000px)');
  if (toggle && links) {
    const closeMenu = (restoreFocus = false) => {
      const wasOpen = links.classList.contains('open');
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus && wasOpen) toggle.focus();
    };
    on(toggle, 'click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach((link) => on(link, 'click', () => {
      closeMenu();
      const href = link.getAttribute('href');
      if (mobile.matches && href.startsWith('#')) {
        const destination = document.querySelector(href);
        destination?.setAttribute('tabindex', '-1');
        destination?.focus({ preventScroll: true });
      }
    }));
    on(document, 'keydown', (event) => {
      if (event.key === 'Escape') closeMenu(true);
    });
    on(document, 'click', (event) => {
      if (!links.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    on(document, 'focusin', (event) => {
      if (!links.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    on(mobile, 'change', () => closeMenu(true));
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
      if (h === `#${id}`) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  };

  if (sectionEls.length) {
    const spy = observe(
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
  if (!reduceMotion && "IntersectionObserver" in window) {
    rootEl.classList.add("reveal-enabled");
    const reveals = document.querySelectorAll(".reveal");
    const revObs = observe(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
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
        const t = motion.matches ? 1 : Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        paintMetric(el, target * eased);
        if (t < 1) frame(tick);
      };

      frame(tick);
    };

    if (reduceMotion) {
      metricValues.forEach((el) => paintMetric(el, Number(el.getAttribute("data-count") || 0)));
    } else {
      metricValues.forEach((el) => paintMetric(el, 0));
      const metricsRoot = document.querySelector(".hero-metrics");
      if (metricsRoot) {
        const metricsObs = observe(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              metricValues.forEach((el, idx) => {
                later(() => animateMetric(el), idx * 140);
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

      const skillsObs = observe(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            bars.forEach((bar, i) => {
              const w = bar.getAttribute("data-w");
              if (!w) return;
              later(() => bar.style.setProperty("--w", w), i * 110);
            });

            obs.disconnect();
          });
        },
        { threshold: 0.35 }
      );

      skillsObs.observe(skillsSection);
    }
  }

  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !message) {
      note.textContent = 'Please enter your name and a message, not just spaces.';
      form.elements.namedItem(!name ? 'name' : 'message').focus();
      return;
    }
    const subject = encodeURIComponent(`Portfolio Inquiry — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`);
    window.location.href = `mailto:dhairyasinghal403@gmail.com?subject=${subject}&body=${body}`;
    note.textContent = 'Email draft requested. Send it in your email app. Your message stays here if you need to copy it.';
  });

  function createProjectsCarousel(carousel) {
    const viewport = carousel.querySelector('.pc-viewport');
    const cards = [...carousel.querySelectorAll('.p-card')];
    if (!viewport || !cards.length) return;
    let timer;
    let hovered = false;
    let touching = false;
    let visible = false;
    const stop = () => { clearTimeout(timer); timers.delete(timer); };
    const step = (direction) => {
      const gap = parseFloat(getComputedStyle(carousel.querySelector('.pc-track')).gap) || 0;
      const distance = cards[0].getBoundingClientRect().width + gap;
      const max = viewport.scrollWidth - viewport.clientWidth;
      let left = viewport.scrollLeft + direction * distance;
      if (direction > 0 && viewport.scrollLeft >= max - 2) left = 0;
      else if (direction < 0 && viewport.scrollLeft <= 2) left = max;
      viewport.scrollTo({ left: Math.max(0, Math.min(max, left)), behavior: motion.matches ? 'instant' : 'smooth' });
    };
    const schedule = () => {
      stop();
      if (visible && !motion.matches && !document.hidden && !hovered && !touching && !carousel.contains(document.activeElement)) {
        timer = later(() => {
          if (!motion.matches && !document.hidden && visible && !hovered && !touching && !carousel.contains(document.activeElement)) step(1);
          schedule();
        }, 12000);
      }
    };
    on(carousel.querySelector('.pc-prev'), 'click', () => { stop(); step(-1); });
    on(carousel.querySelector('.pc-next'), 'click', () => { stop(); step(1); });
    on(carousel, 'pointerenter', (event) => { if (event.pointerType === 'mouse') { hovered = true; stop(); } });
    on(carousel, 'pointerleave', () => { hovered = false; schedule(); });
    on(carousel, 'focusin', stop);
    on(carousel, 'focusout', () => later(schedule, 0));
    on(viewport, 'pointerdown', () => { touching = true; stop(); }, { passive: true });
    on(window, 'pointerup', () => { if (touching) { touching = false; schedule(); } }, { passive: true });
    on(window, 'pointercancel', () => { touching = false; schedule(); }, { passive: true });
    on(viewport, 'wheel', schedule, { passive: true });
    on(document, 'visibilitychange', schedule);
    on(motion, 'change', () => {
      if (motion.matches) viewport.scrollTo({ left: viewport.scrollLeft, behavior: 'instant' });
      schedule();
    });
    const visibility = observe((entries) => {
      visible = entries[0].isIntersecting;
      schedule();
    }, { threshold: 0.1 });
    visibility.observe(carousel);
  }
  document.querySelectorAll('.projects-carousel').forEach(createProjectsCarousel);

}
initializePortfolio();
window.addEventListener('pageshow', (event) => { if (event.persisted) initializePortfolio(); });
