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

  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Active section highlight
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const setActive = (id) => {
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
};

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0.02 });

sections.forEach(sec => spy.observe(sec));

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revObs.observe(el));

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
