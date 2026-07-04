/* =========================================================================
   PALMIERI — stopka (Web Component <palmieri-footer>)
   -------------------------------------------------------------------------
   Dane kontaktowe, firmowe i bankowe pochodzą z pliku data.js (obiekt
   PALMIERI_KONTAKT) — wystarczy zmienić je tam, a stopka zaktualizuje się
   na wszystkich stronach. Linki w kolumnie „Informacje" edytujesz w tablicy
   FOOTER_LINKI poniżej.

   Użycie:
     <palmieri-footer></palmieri-footer>            ← strona w katalogu głównym
     <palmieri-footer root="../"></palmieri-footer> ← strona w podkatalogu
   ========================================================================= */

const FOOTER_LINKI = [
  { nazwa: "O nas", url: "o-nas.html" },
  { nazwa: "Kontakt", url: "kontakt.html" },
  { nazwa: "Polityka prywatności", url: "kontakt.html" }
];

class PalmieriFooter extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute("root") || "";
    const k = PALMIERI_KONTAKT;

    const tel = k.telefony.map(t =>
      `<li><a href="tel:${t.numer.replace(/\s/g, "")}">${t.wyswietlany}</a> <span class="footer-note">${t.opis.split("—")[0].trim()}</span></li>`
    ).join("");

    const linki = FOOTER_LINKI.map(l => `<li><a href="${root}${l.url}">${l.nazwa}</a></li>`).join("");

    this.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-col footer-brand">
            <svg class="brand-mark" width="40" height="40" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 44c0-10 0-18 0-24" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
              <path d="M24 20C24 12 17 7 9 8c2 7 8 12 15 12z" fill="currentColor" opacity=".9"/>
              <path d="M24 20c0-8 7-13 15-12-2 7-8 12-15 12z" fill="currentColor" opacity=".7"/>
              <path d="M24 14C23 8 18 4 12 4c1 5 6 9 12 10z" fill="currentColor" opacity=".5"/>
              <path d="M24 14c1-6 6-10 12-10-1 5-6 9-12 10z" fill="currentColor" opacity=".35"/>
            </svg>
            <p class="footer-brand-name">Palmieri</p>
            <p class="footer-tagline">${k.tagline}. <em>Palmieri</em> — tak w średniowieczu nazywano pielgrzymów wracających z Ziemi Świętej z gałązką palmy.</p>
          </div>
          <div class="footer-col">
            <h2>Kontakt</h2>
            <ul>${tel}</ul>
            <ul>
              <li><a href="mailto:${k.email}">${k.email}</a></li>
              <li>${k.adres.ulica}, ${k.adres.miasto}</li>
            </ul>
          </div>
          <div class="footer-col">
            <h2>Informacje</h2>
            <ul>${linki}</ul>
            <ul class="footer-legal">
              <li>NIP: ${k.nip}</li>
              <li>KRS: ${k.krs}</li>
              <li>Gwarancja ubezpieczeniowa: <strong>${k.ubezpieczyciel}</strong></li>
            </ul>
          </div>
          <div class="footer-col">
            <h2>Konto bankowe</h2>
            <ul>
              <li>${k.bank.nazwa}</li>
              <li class="footer-account">${k.bank.konto}</li>
              <li>SWIFT: ${k.bank.swift}</li>
            </ul>
          </div>
        </div>
        <div class="container footer-bottom">
          <p>© <span data-rok>2026</span> ${k.nazwaFirmy} Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>`;
  }
}

customElements.define("palmieri-footer", PalmieriFooter);
