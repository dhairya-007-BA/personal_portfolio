// Smooth UX + minimal interactions only

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Active section highlight
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const setActive = (id) => {
  navLinks.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === `#${id}`)
  );
};

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0.02 }
);

sections.forEach((sec) => spy.observe(sec));

// Reveal on scroll
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

// Contact form (client-side mailto)
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

    const subject = encodeURIComponent(`Portfolio Inquiry — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );

    window.location.href = `mailto:dhairyasinghal403@gmail.com?subject=${subject}&body=${body}`;

    if (note) note.textContent = "Opening your email client…";
    form.reset();
  });
}

/* ================= PROJECTS: AUTO-SWIPE CAROUSEL (3 visible desktop) ================= */
const track = document.getElementById("projectsTrack");
const prevBtn = document.querySelector(".pc-arrow.prev");
const nextBtn = document.querySelector(".pc-arrow.next");

let currentIndex = 0;
let autoTimer = null;

const getVisibleCount = () => {
  // Matches your CSS breakpoints (no design guessing)
  if (window.matchMedia("(max-width: 760px)").matches) return 1;
  if (window.matchMedia("(max-width: 980px)").matches) return 2;
  return 3;
};

const getStepSize = () => {
  const firstCard = track?.querySelector(".p-card");
  if (!firstCard) return 0;

  const cardW = firstCard.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(track).gap || "16");
  return cardW + gap;
};

const clampIndex = (idx) => {
  const cards = track ? Array.from(track.querySelectorAll(".p-card")) : [];
  const visible = getVisibleCount();
  const maxIndex = Math.max(0, cards.length - visible);

  if (idx < 0) return maxIndex;        // loop to end
  if (idx > maxIndex) return 0;        // loop to start
  return idx;
};

const updateCarousel = (idx, smooth = true) => {
  if (!track) return;

  const step = getStepSize();
  currentIndex = clampIndex(idx);

  // If step can't be measured yet, skip transform
  if (!step) return;

  if (!smooth) track.style.transition = "none";
  track.style.transform = `translate3d(${-currentIndex * step}px, 0, 0)`;
  if (!smooth) {
    // Re-enable transition next frame
    requestAnimationFrame(() => {
      track.style.transition = "transform .55s ease";
    });
  }
};

const goNext = () => updateCarousel(currentIndex + 1);
const goPrev = () => updateCarousel(currentIndex - 1);

const stopAuto = () => {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
};

const startAuto = () => {
  stopAuto();
  autoTimer = setInterval(() => {
    goNext();
  }, 5000); // 5 seconds as requested
};

if (track) {
  // Buttons
  if (prevBtn) prevBtn.addEventListener("click", () => { goPrev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { goNext(); startAuto(); });

  // Pause on hover (desktop)
  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

  // Touch swipe (mobile + touch devices)
  let startX = 0;
  let isDown = false;

  track.addEventListener("touchstart", (e) => {
    stopAuto();
    isDown = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isDown) return;
    isDown = false;

    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
    const dx = endX - startX;

    if (Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
    startAuto();
  }, { passive: true });

  // Keyboard accessibility (optional but clean)
  document.addEventListener("keydown", (e) => {
    const inProjects = window.location.hash === "#projects";
    if (!inProjects) return;

    if (e.key === "ArrowRight") { goNext(); startAuto(); }
    if (e.key === "ArrowLeft") { goPrev(); startAuto(); }
  });

  // Handle resize (keep alignment correct)
  window.addEventListener("resize", () => {
    updateCarousel(currentIndex, false);
  });

  // Init
  updateCarousel(0, false);
  startAuto();
}
