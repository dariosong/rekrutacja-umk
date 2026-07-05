/* =========================================================================
   PALMIERI — interakcje strony
   (menu mobilne, rozwijane menu „Pielgrzymki", zwężanie paska marki,
    animacje wejścia, subtelny parallax fotografii, rok w stopce)
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

  /* --- Zwężanie paska marki po przewinięciu --- */
  const header = document.querySelector(".site-header");

  /* --- Subtelny parallax fotografii ([data-parallax] > img/.zoom) --- */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const parallaxEls = Array.from(document.querySelectorAll("[data-parallax]"));
  let ticking = false;

  function updateScrollEffects() {
    ticking = false;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
    if (reduced || window.innerWidth < 1024) return;
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const target = el.querySelector("img") || el.querySelector(".zoom");
      if (!target) return;
      /* przesunięcie proporcjonalne do pozycji elementu w oknie: maks. ~6% */
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const shift = Math.max(-1, Math.min(1, progress)) * -(rect.height * 0.06);
      target.style.transform = `translateY(${shift.toFixed(1)}px)`;
    });
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrollEffects);
    }
  }
  updateScrollEffects();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* --- Animacje wejścia (odsłanianie sekcji; szanują prefers-reduced-motion) --- */
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
