/* =========================================================================
   PALMIERI — sidebar „Inne pielgrzymki" (Web Component <palmieri-sidebar>)
   -------------------------------------------------------------------------
   Wg projektu „Palmieri Pielgrzymka": ramka z listą pozostałych wypraw
   (miniatura, nazwa, termin) i linkiem „Zobacz wszystkie". Lista pochodzi
   z pliku data.js (tablica PALMIERI_TRIPS) — wyprawa aktualnie oglądana
   (atrybut `current`) jest pomijana.

   Użycie na podstronie wyprawy:
     <palmieri-sidebar root="../" current="indie"></palmieri-sidebar>
   ========================================================================= */

class PalmieriSidebar extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute("root") || "";
    const current = this.getAttribute("current") || "";

    const trips = PALMIERI_TRIPS.filter(t => t.id !== current).map(t => `
      <a class="dt-oitem" href="${root}${t.url}">
        <span class="dt-othumb ${t.klasaObrazka}" aria-hidden="true"></span>
        <span>
          <span class="dt-oname">${t.nazwa}</span>
          <span class="dt-odate">${t.termin}</span>
        </span>
      </a>`).join("");

    this.innerHTML = `
      <aside class="dt-side">
        <div class="dt-others">
          <div class="dt-oh">Inne pielgrzymki</div>
          ${trips}
          <a class="dt-oall" href="${root}index.html#pielgrzymki">Zobacz wszystkie →</a>
        </div>
      </aside>`;
  }
}

customElements.define("palmieri-sidebar", PalmieriSidebar);
