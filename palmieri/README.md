# Palmieri — strona butikowego biura pielgrzymkowego

Nowoczesna, statyczna strona (HTML + CSS + vanilla JS, bez frameworków i bez
procesu budowania). Działa na dowolnym hostingu statycznym — wystarczy wgrać
zawartość tego katalogu.

## Struktura

```
palmieri/
├── index.html                  strona główna
├── o-nas.html                  o nas
├── kontakt.html                kontakt
├── pielgrzymki/
│   ├── ziemia-swieta.html      wzorcowa podstrona wyprawy (z ramką ceny)
│   └── indie.html              wzorcowa podstrona wyprawy (program 12 dni)
├── css/style.css               wszystkie style (design tokens na górze pliku)
└── js/
    ├── data.js                 ★ WSPÓLNE DANE — lista pielgrzymek + kontakt
    ├── header.js               menu górne  (Web Component <palmieri-header>)
    ├── sidebar.js              sidebar     (Web Component <palmieri-sidebar>)
    ├── footer.js               stopka      (Web Component <palmieri-footer>)
    └── main.js                 interakcje (menu mobilne, FAQ, animacje)
```

## Jak aktualizować

### Menu górne
Edytuj tablicę `MENU` na górze pliku `js/header.js`. Pozycja „Pielgrzymki"
rozwija się automatycznie na podstawie listy wypraw z `js/data.js`.

### Lista pielgrzymek (menu, sidebar i karty na stronie głównej)
Edytuj tablicę `PALMIERI_TRIPS` w `js/data.js` — jedna zmiana aktualizuje
menu rozwijane, sidebar i siatkę kart na stronie głównej.

### Stopka / dane kontaktowe (telefony, adres, NIP, konto bankowe)
Edytuj obiekt `PALMIERI_KONTAKT` w `js/data.js`. Dodatkowe linki w stopce —
tablica `FOOTER_LINKI` w `js/footer.js`.

### Kolory i typografia
Zmienne CSS na górze `css/style.css` (sekcja `:root`).

## Dodanie nowej podstrony wyprawy

1. Skopiuj `pielgrzymki/indie.html` pod nową nazwą i podmień treść.
2. Dodaj wyprawę do `PALMIERI_TRIPS` w `js/data.js` (pole `url` wskazuje
   nowy plik, `id` musi być unikalne).
3. W nowym pliku ustaw `<palmieri-sidebar root="../" current="TWOJE-ID">`.

## Zdjęcia

Fotografie leżą w katalogu `images/` (zespół: `zespol.jpg`, `zespol2.jpg`;
kierunki: `ziemia-swieta.jpg`, `etiopia.jpg`, `malta.jpg`, `indie.jpg`,
`peru.jpg`, `wietnam.jpg` — przeniesione z dotychczasowej strony
n-adventures.pl). Kafelki kierunków wskazują na nie klasami `img-*`
w `css/style.css` — podmiana zdjęcia to podmiana pliku o tej samej nazwie.

## Design

Wariant „Biel i zaufanie": cała strona jasna (białe tła, delikatne błękity,
jasna stopka i pas CTA), przyjazny niebieski `#2563eb` / granat `#1d4077`
w nagłówkach, miodowe przyciski `#eda14a`, prawdziwe fotografie zespołu
i kierunków. Nagłówki Sora, tekst Inter. Wszystkie kolory to zmienne
w `:root` na górze `css/style.css`.

## Uwaga

Adresy e-mail (`biuro@palmieri.pl`), domena i część terminów/cen wypraw to
placeholdery do potwierdzenia przed publikacją.
