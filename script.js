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

/* ================= PROJECTS CAROUSEL (3 at a time) ================= */
(function initProjectsCarousel(){
  const track = document.getElementById("projectsTrack");
  if (!track) return;

  const prevBtn = document.querySelector(".pc-prev");
  const nextBtn = document.querySelector(".pc-next");
  const cards = Array.from(track.querySelectorAll(".p-card"));

  let index = 0;

  const getVisibleCount = () => (window.innerWidth <= 980 ? 1 : 3);

  const getStep = () => {
    // distance to move = card width + gap (16px)
    const first = cards[0];
    if (!first) return 0;
    const cardW = first.getBoundingClientRect().width;
    return cardW + 16;
  };

  const clampIndex = () => {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);
    index = Math.min(Math.max(index, 0), maxIndex);
  };

  const update = () => {
    clampIndex();
    const step = getStep();
    track.style.transform = `translateX(${-index * step}px)`;

    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === maxIndex;
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      index -= 1;
      update();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      index += 1;
      update();
    });
  }

  // Keyboard accessibility when carousel is on screen
  window.addEventListener("keydown", (e) => {
    const projectsSection = document.getElementById("projects");
    if (!projectsSection) return;

    const rect = projectsSection.getBoundingClientRect();
    const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
    if (!onScreen) return;

    if (e.key === "ArrowLeft") {
      index -= 1;
      update();
    }
    if (e.key === "ArrowRight") {
      index += 1;
      update();
    }
  });

  // Recalc on resize (keeps 3 visible on desktop, 1 on mobile)
  window.addEventListener("resize", () => {
    update();
  });

  update();
})();
