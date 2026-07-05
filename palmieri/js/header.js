/* =========================================================================
   PALMIERI — menu górne (Web Component <palmieri-header>)
   -------------------------------------------------------------------------
   Pasek marki wg templatki „Editorial": granatowy, wycentrowany emblemat
   + logotyp PALMIERI (pliki images/godlo.png i images/logotyp.png),
   nawigacja wersalikami, przycisk „Zadzwoń do nas" po prawej.

   Aby zmienić pozycje menu, edytuj TYLKO tablicę MENU poniżej.
   Pozycja z polem `dropdown: "pielgrzymki"` automatycznie rozwija listę
   wypraw z pliku data.js — nie trzeba jej tu powielać.

   Użycie na stronie (root = ścieżka do katalogu głównego strony):
     <palmieri-header></palmieri-header>            ← strona w katalogu głównym
     <palmieri-header root="../"></palmieri-header> ← strona w podkatalogu
   ========================================================================= */

const MENU = [
  { nazwa: "Home", url: "index.html" },
  { nazwa: "Pielgrzymki", url: "index.html#pielgrzymki", dropdown: "pielgrzymki" },
  { nazwa: "O nas", url: "o-nas.html" },
  { nazwa: "Opinie", url: "index.html#opinie" },
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
              <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <ul class="dropdown">${sub}</ul>
          </li>`;
      }
      return `<li class="nav-item${isActive ? " is-active" : ""}">
                <a class="nav-link" href="${root}${item.url}"${isActive ? ' aria-current="page"' : ""}>${item.nazwa}</a>
              </li>`;
    }).join("");

    this.innerHTML = `
      <header class="site-header">
        <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Otwórz menu">
          <span></span><span></span><span></span>
        </button>
        <a href="${root}index.html" aria-label="Palmieri — strona główna" style="text-decoration:none">
          <div class="brand-emblem"><img src="${root}images/godlo.png" alt=""></div>
          <img class="brand-word" src="${root}images/logotyp.png" alt="PALMIERI">
          <div class="brand-sub">BIURO PIELGRZYMKOWE · TORUŃ</div>
        </a>
        <a class="header-cta" href="tel:${k.telefonGlowny.numer.replace(/\s/g, "")}">Zadzwoń do nas</a>
        <nav class="site-nav" id="site-nav" aria-label="Menu główne">
          <ul class="nav-list">${items}</ul>
        </nav>
      </header>`;
  }
}

customElements.define("palmieri-header", PalmieriHeader);
