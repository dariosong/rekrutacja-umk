/* =========================================================================
   PALMIERI — interakcje strony
   (menu mobilne, rozwijane menu „Pielgrzymki", animacje wejścia, rok w stopce)
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* --- Menu mobilne (hamburger) --- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
      document.body.classList.toggle("nav-locked", open);
    });
  }

  /* --- Rozwijane menu „Pielgrzymki" (klik + klawiatura, zamykanie poza) --- */
  document.querySelectorAll(".has-dropdown").forEach(item => {
    const btn = item.querySelector(".dropdown-toggle");
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".has-dropdown.is-open").forEach(item => {
      item.classList.remove("is-open");
      item.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.querySelectorAll(".has-dropdown.is-open").forEach(item => {
        item.classList.remove("is-open");
        item.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false");
      });
      if (nav && nav.classList.contains("is-open")) toggle.click();
    }
  });

  /* --- Cień headera po przewinięciu --- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Animacje wejścia (szanują prefers-reduced-motion) --- */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealed = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealed.forEach(el => io.observe(el));
  } else {
    revealed.forEach(el => el.classList.add("is-visible"));
  }

  /* --- Aktualny rok w stopce --- */
  document.querySelectorAll("[data-rok]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
