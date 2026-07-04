/* =========================================================================
   PALMIERI — menu górne (Web Component <palmieri-header>)
   -------------------------------------------------------------------------
   Aby zmienić pozycje menu, edytuj TYLKO tablicę MENU poniżej.
   Pozycja z polem `dropdown: "pielgrzymki"` automatycznie rozwija listę
   wypraw z pliku data.js — nie trzeba jej tu powielać.

   Użycie na stronie (root = ścieżka do katalogu głównego strony):
     <palmieri-header></palmieri-header>            ← strona w katalogu głównym
     <palmieri-header root="../"></palmieri-header> ← strona w podkatalogu
   ========================================================================= */

const MENU = [
  { nazwa: "Home", url: "index.html" },
  { nazwa: "O nas", url: "o-nas.html" },
  { nazwa: "Pielgrzymki", url: "index.html#pielgrzymki", dropdown: "pielgrzymki" },
  { nazwa: "Kontakt", url: "kontakt.html" }
];

class PalmieriHeader extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute("root") || "";
    const active = this.getAttribute("active") || "";
    const k = PALMIERI_KONTAKT;

    const items = MENU.map(item => {
      const isActive = item.nazwa.toLowerCase() === active.toLowerCase();
      if (item.dropdown === "pielgrzymki") {
        const sub = PALMIERI_TRIPS.map(t =>
          `<li><a href="${root}${t.url}">
             <strong>${t.nazwa}</strong>
             <span>${t.termin} · ${t.dni} dni</span>
           </a></li>`).join("");
        return `
          <li class="nav-item has-dropdown${isActive ? " is-active" : ""}">
            <button class="nav-link dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">
              ${item.nazwa}
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <ul class="dropdown">${sub}</ul>
          </li>`;
      }
      return `<li class="nav-item${isActive ? " is-active" : ""}">
                <a class="nav-link" href="${root}${item.url}"${isActive ? ' aria-current="page"' : ""}>${item.nazwa}</a>
              </li>`;
    }).join("");

    this.innerHTML = `
      <div class="topbar">
        <div class="container topbar-inner">
          <span class="topbar-hours">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            ${k.godziny[0].dni} ${k.godziny[0].godz} · ${k.godziny[1].dni} ${k.godziny[1].godz}
          </span>
          <a class="topbar-phone" href="tel:${k.telefonGlowny.numer.replace(/\s/g, "")}">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" fill="currentColor"/></svg>
            ${k.telefonGlowny.numer}
          </a>
        </div>
      </div>
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="${root}index.html" aria-label="Palmieri — strona główna">
            <svg class="brand-mark" width="34" height="34" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 44c0-10 0-18 0-24" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
              <path d="M24 20C24 12 17 7 9 8c2 7 8 12 15 12z" fill="currentColor" opacity=".9"/>
              <path d="M24 20c0-8 7-13 15-12-2 7-8 12-15 12z" fill="currentColor" opacity=".7"/>
              <path d="M24 14C23 8 18 4 12 4c1 5 6 9 12 10z" fill="currentColor" opacity=".5"/>
              <path d="M24 14c1-6 6-10 12-10-1 5-6 9-12 10z" fill="currentColor" opacity=".35"/>
            </svg>
            <span class="brand-text">Palmieri<small>${k.tagline}</small></span>
          </a>
          <nav class="site-nav" id="site-nav" aria-label="Menu główne">
            <ul class="nav-list">${items}</ul>
            <a class="btn btn-gold nav-cta" href="tel:${k.telefonGlowny.numer.replace(/\s/g, "")}">Zadzwoń do nas</a>
          </nav>
          <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Otwórz menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>`;
  }
}

customElements.define("palmieri-header", PalmieriHeader);
