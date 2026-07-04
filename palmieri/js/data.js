/* =========================================================================
   PALMIERI — wspólne dane strony
   -------------------------------------------------------------------------
   To jest JEDYNE miejsce, w którym edytujesz:
   • listę pielgrzymek (używana w menu górnym, sidebarze i na stronie głównej)
   • dane kontaktowe i firmowe (używane w headerze, stopce i na podstronach)
   Po zapisaniu pliku zmiany pojawiają się automatycznie na wszystkich stronach.
   ========================================================================= */

const PALMIERI_TRIPS = [
  {
    id: "ziemia-swieta",
    nazwa: "Ziemia Święta",
    podtytul: "Śladami Jezusa — Jerozolima, Betlejem, Nazaret i Galilea",
    termin: "4 – 11 września 2026",
    dni: 8,
    kraj: "Izrael",
    cena: "3 700 PLN + 990 USD",
    url: "pielgrzymki/ziemia-swieta.html",
    klasaObrazka: "img-ziemia-swieta"
  },
  {
    id: "etiopia",
    nazwa: "Etiopia",
    podtytul: "Śladami Arki Przymierza i Królowej Saby — mistyczna Lalibela i Aksum",
    termin: "14 – 26 września 2026",
    dni: 13,
    kraj: "Etiopia",
    cena: "zapytaj o cenę",
    url: "pielgrzymki/ziemia-swieta.html#kontakt",
    klasaObrazka: "img-etiopia"
  },
  {
    id: "malta",
    nazwa: "Malta",
    podtytul: "Śladami św. Pawła i Caravaggia — mała wyspa o wielkim sercu",
    termin: "4 – 11 listopada 2026",
    dni: 8,
    kraj: "Malta",
    cena: "zapytaj o cenę",
    url: "pielgrzymki/ziemia-swieta.html#kontakt",
    klasaObrazka: "img-malta"
  },
  {
    id: "indie",
    nazwa: "Indie — podróż jak z baśni",
    podtytul: "Złoty Trójkąt, loty wewnętrzne i relaks na Goa",
    termin: "8 – 19 października 2026",
    dni: 12,
    kraj: "Indie",
    cena: "zapytaj o cenę",
    url: "pielgrzymki/indie.html",
    klasaObrazka: "img-indie"
  },
  {
    id: "peru",
    nazwa: "Peru",
    podtytul: "Machu Picchu, zaginione miasta Inków i sanktuarium Matki Bożej z Chapi",
    termin: "17 – 27 października 2026",
    dni: 11,
    kraj: "Peru",
    cena: "zapytaj o cenę",
    url: "pielgrzymki/indie.html#kontakt",
    klasaObrazka: "img-peru"
  },
  {
    id: "wietnam",
    nazwa: "Wietnam — Perła Azji",
    podtytul: "Hanoi, Zatoka Ha Long, Sanktuarium La Vang i Sajgon",
    termin: "12 – 24 listopada 2026",
    dni: 13,
    kraj: "Wietnam",
    cena: "zapytaj o cenę",
    url: "pielgrzymki/indie.html#kontakt",
    klasaObrazka: "img-wietnam"
  }
];

const PALMIERI_KONTAKT = {
  nazwaFirmy: "Palmieri sp. z o.o.",
  tagline: "Butikowe biuro pielgrzymkowe",
  telefonGlowny: { numer: "+48 601 976 612", wyswietlany: "601 976 612", opis: "sprawy ogólne" },
  telefony: [
    { numer: "+48 601 976 612", wyswietlany: "601 976 612", opis: "Główny — sprawy ogólne" },
    { numer: "+48 663 534 462", wyswietlany: "663 534 462", opis: "Rezerwacje — organizacja wyjazdów" },
    { numer: "+48 531 622 012", wyswietlany: "531 622 012", opis: "Informacje — programy pielgrzymek" }
  ],
  email: "biuro@palmieri.pl",
  emailPielgrzymki: "pielgrzymki@palmieri.pl",
  adres: { ulica: "ul. Zbożowa 17/37", miasto: "87-100 Toruń" },
  godziny: [
    { dni: "poniedziałek – piątek", godz: "9:00 – 17:00" },
    { dni: "sobota", godz: "10:00 – 14:00" },
    { dni: "niedziela", godz: "zamknięte" }
  ],
  nip: "9562320737",
  krs: "0000643862",
  bank: {
    nazwa: "ING Bank Śląski",
    konto: "05 1050 1979 1000 0090 8011 2781",
    swift: "INGBPLPW"
  },
  ubezpieczyciel: "UNIQA"
};
