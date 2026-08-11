/* =========================================================================
   PALMIERI — WSTRZYKIWANIE TREŚCI DO SZABLONU

   • [data-p="kierunek"]        — wstawia tekst pola z content/wyjazdy.js
   • [data-p="marka.www"]       — pola marki adresujemy przez kropkę
   • [data-photo]               — ustawia tło zdjęcia (pole `zdjecie`)
   • [data-p-list="punkty"]     — powiela swój pierwszy element dla każdej pozycji
   • [data-p-program="program"] — j.w., dla par [numer, opis]

   Parametry adresu:
   ?wyjazd=fatima   — wybór wyjazdu
   ?cena=5%20490    — nadpisanie dowolnego pojedynczego pola
   ?safe=1          — pokazuje strefy zasłaniane przez interfejs platformy
   ?zdjecie=...     — inne zdjęcie (ścieżka względem pliku szablonu)
   ========================================================================= */

(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);

  function pole(dane, sciezka) {
    return sciezka.split(".").reduce(function (akc, klucz) {
      return akc == null ? undefined : akc[klucz];
    }, dane);
  }

  function zastosuj() {
    var dane = window.PALMIERI;
    if (!dane) {
      console.warn("Palmieri: brak content/wyjazdy.js — szablon pokazuje treść zapasową.");
      return;
    }

    var slug = params.get("wyjazd") || document.body.dataset.wyjazd || "ziemia-swieta";
    var wyjazd = dane.wyjazdy[slug];
    if (!wyjazd) {
      console.warn('Palmieri: nie znam wyjazdu "' + slug + '".');
      wyjazd = dane.wyjazdy[Object.keys(dane.wyjazdy)[0]];
    }

    var zrodlo = Object.assign({}, wyjazd, { marka: dane.marka });

    // pojedyncze pola nadpisane w adresie
    params.forEach(function (wartosc, klucz) {
      if (klucz !== "wyjazd" && klucz !== "safe" && klucz !== "skala") zrodlo[klucz] = wartosc;
    });

    // ---- teksty ----
    document.querySelectorAll("[data-p]").forEach(function (el) {
      var wartosc = pole(zrodlo, el.dataset.p);
      if (wartosc == null) return;
      el.textContent = wartosc;
    });

    // ---- zdjęcia ----
    var zdjecie = zrodlo.zdjecie;
    document.querySelectorAll("[data-photo]").forEach(function (el) {
      var wlasne = el.dataset.photo || zdjecie;
      if (!wlasne) return;
      el.style.setProperty("--photo", 'url("' + wlasne + '")');
      el.classList.add("has-photo");
      var nota = el.parentElement && el.parentElement.querySelector(".p-photo-note");
      if (nota && !/photos-zastepcze\//.test(wlasne)) nota.remove();
    });

    // ---- listy ----
    document.querySelectorAll("[data-p-list]").forEach(function (lista) {
      var pozycje = pole(zrodlo, lista.dataset.pList);
      if (!Array.isArray(pozycje)) return;
      var wzor = lista.firstElementChild;
      if (!wzor) return;
      lista.innerHTML = "";
      pozycje.forEach(function (tekst, i) {
        var el = wzor.cloneNode(true);
        var numer = el.querySelector("[data-slot='numer']");
        var opis = el.querySelector("[data-slot='opis']") || el;
        if (numer) numer.textContent = String(i + 1).padStart(2, "0");
        opis.textContent = tekst;
        lista.appendChild(el);
      });
    });

    document.querySelectorAll("[data-p-program]").forEach(function (lista) {
      var pozycje = pole(zrodlo, lista.dataset.pProgram);
      if (!Array.isArray(pozycje)) return;
      var wzor = lista.firstElementChild;
      if (!wzor) return;
      lista.innerHTML = "";
      pozycje.forEach(function (para) {
        var el = wzor.cloneNode(true);
        var numer = el.querySelector("[data-slot='numer']");
        var opis = el.querySelector("[data-slot='opis']");
        if (numer) numer.textContent = para[0];
        if (opis) opis.textContent = para[1];
        lista.appendChild(el);
      });
    });

    // ---- strefy bezpieczne ----
    if (params.get("safe") === "1") {
      document.body.classList.add("show-safe");
      document.querySelectorAll(".p-canvas[data-safe]").forEach(function (kanwa) {
        var rodzaj = kanwa.dataset.safe; // "shorts" | "story"
        var strefy = rodzaj === "shorts" ? ["top", "bottom", "right"] : ["top", "bottom"];
        var nakladka = document.createElement("div");
        nakladka.className = "p-safe p-safe--" + rodzaj;
        nakladka.innerHTML = strefy
          .map(function (s) {
            return '<div class="p-safe__zone is-' + s + '"></div>';
          })
          .join("");
        kanwa.appendChild(nakladka);
      });
    }

    document.documentElement.classList.add("p-gotowe");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", zastosuj);
  } else {
    zastosuj();
  }
})();
