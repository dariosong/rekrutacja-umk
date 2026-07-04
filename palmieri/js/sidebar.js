/* =========================================================================
   PALMIERI — sidebar „Nasze pielgrzymki" (Web Component <palmieri-sidebar>)
   -------------------------------------------------------------------------
   Lista wypraw pochodzi z pliku data.js (tablica PALMIERI_TRIPS) — sidebar
   aktualizuje się sam po każdej zmianie tamtej tablicy.

   Użycie na podstronie wyprawy:
     <palmieri-sidebar root="../" current="indie"></palmieri-sidebar>
   `current` = id wyprawy, którą właśnie ogląda użytkownik (zostanie
   podświetlona i oznaczona), `root` = ścieżka do katalogu głównego strony.
   ========================================================================= */

class PalmieriSidebar extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute("root") || "";
    const current = this.getAttribute("current") || "";
    const k = PALMIERI_KONTAKT;

    const trips = PALMIERI_TRIPS.map(t => `
      <li>
        <a class="sidebar-trip${t.id === current ? " is-current" : ""}" href="${root}${t.url}"${t.id === current ? ' aria-current="page"' : ""}>
          <span class="sidebar-trip-thumb ${t.klasaObrazka}" aria-hidden="true"></span>
          <span class="sidebar-trip-body">
            <span class="sidebar-trip-date">${t.termin}</span>
            <strong>${t.nazwa}</strong>
            <span class="sidebar-trip-sub">${t.podtytul}</span>
          </span>
        </a>
      </li>`).join("");

    this.innerHTML = `
      <aside class="sidebar">
        <section class="sidebar-box">
          <h2 class="sidebar-title">Nasze pielgrzymki</h2>
          <ul class="sidebar-trips">${trips}</ul>
        </section>
        <section class="sidebar-box sidebar-contact">
          <h2 class="sidebar-title">Masz pytania?</h2>
          <p>Chętnie opowiemy o szczegółach programu i pomożemy wybrać wyprawę dla Ciebie.</p>
          <a class="btn btn-gold btn-block" href="tel:${k.telefonGlowny.numer.replace(/\s/g, "")}">
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" fill="currentColor"/></svg>
            ${k.telefonGlowny.wyswietlany}
          </a>
          <a class="sidebar-mail" href="mailto:${k.emailPielgrzymki}">${k.emailPielgrzymki}</a>
        </section>
      </aside>`;
  }
}

customElements.define("palmieri-sidebar", PalmieriSidebar);
