/* =========================================================================
   PALMIERI — stopka (Web Component <palmieri-footer>)
   -------------------------------------------------------------------------
   Granatowa stopka wg templatki „Editorial": emblemat + logotyp, trzy
   kolumny (Kontakt / Informacje / Konto bankowe). Dane kontaktowe, firmowe
   i bankowe pochodzą z pliku data.js (obiekt PALMIERI_KONTAKT) — wystarczy
   zmienić je tam. Linki w kolumnie „Informacje" edytujesz w tablicy
   FOOTER_LINKI poniżej.

   Użycie:
     <palmieri-footer></palmieri-footer>            ← strona w katalogu głównym
     <palmieri-footer root="../"></palmieri-footer> ← strona w podkatalogu
   ========================================================================= */

const FOOTER_LINKI = [
  { nazwa: "O nas", url: "o-nas.html" },
  { nazwa: "Program pielgrzymek", url: "index.html#pielgrzymki" },
  { nazwa: "Kontakt", url: "kontakt.html" },
  { nazwa: "Polityka prywatności", url: "kontakt.html" }
];

class PalmieriFooter extends HTMLElement {
  connectedCallback() {
    const root = this.getAttribute("root") || "";
    const k = PALMIERI_KONTAKT;

    const tel = k.telefony.map(t =>
      `<a href="tel:${t.numer.replace(/\s/g, "")}">${t.wyswietlany}</a>`).join(" · ");

    const linki = FOOTER_LINKI.map(l => `<a href="${root}${l.url}">${l.nazwa}</a>`).join("<br>");

    this.innerHTML = `
      <footer class="site-footer">
        <div class="brand-emblem"><img src="${root}images/godlo.png" alt=""></div>
        <img class="brand-word" src="${root}images/logotyp.png" alt="PALMIERI" style="margin:2px auto 0">
        <div class="footer-cols">
          <div>
            <div class="h">Kontakt</div>
            ${tel}<br>
            <a href="mailto:${k.email}">${k.email}</a><br>
            ${k.adres.ulica}, ${k.adres.miasto}
          </div>
          <div>
            <div class="h">Informacje</div>
            ${linki}<br>
            NIP ${k.nip} · KRS ${k.krs}
          </div>
          <div>
            <div class="h">Konto bankowe</div>
            ${k.bank.nazwa}<br>
            <span class="footer-account">${k.bank.konto}</span><br>
            SWIFT: ${k.bank.swift}<br>
            Gwarancja ubezpieczeniowa ${k.ubezpieczyciel}
          </div>
        </div>
        <div class="footer-bottom">
          <p>© <span data-rok>2026</span> ${k.nazwaFirmy} Wszystkie prawa zastrzeżone.</p>
        </div>
      </footer>`;
  }
}

customElements.define("palmieri-footer", PalmieriFooter);
