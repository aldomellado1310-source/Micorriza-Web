// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".primary-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Reveal-on-scroll for major blocks
const revealTargets = document.querySelectorAll(
  ".hero-copy > *, .hero-visual, .section-head, .card, .sector, .tech-copy, .metrics-panel, .resource, .about-grid > *, .cta-inner > *, .icon-row > li, .kpi-tile, .case-card, .partner-logo, .manifesto-band blockquote, .bento-tile, .metaphor-card, .metaphor-bridge"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

// Asigna --reveal-i a hijos directos de grids para cascada al hacer reveal.
document.querySelectorAll(
  ".cards, .sector-grid, .metaphor-grid, .icon-row, .kpi-grid, .partner-grid"
).forEach((grid) => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.setProperty("--reveal-i", i);
  });
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
revealTargets.forEach((el) => io.observe(el));

// Eyebrow letter-spacing reveal on viewport entry
const eyebrowIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        eyebrowIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6, rootMargin: "0px 0px -20px 0px" }
);
document.querySelectorAll(".eyebrow").forEach((el) => eyebrowIO.observe(el));
