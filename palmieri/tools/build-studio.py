#!/usr/bin/env python3
"""Skleja `studio.html` — jeden plik, który otwiera się dwuklikiem.

Studio nie potrzebuje internetu ani niczego zainstalowanego: fonty, znak,
szablony i zdjęcia zastępcze siedzą w środku pliku. Uruchom po każdej zmianie
w brand/, templates/ albo content/wyjazdy.js:

    python3 tools/build-studio.py

Wymaga: pillow
"""
from __future__ import annotations

import base64
import io
import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

# Kolejność i opisy szablonów — to samo źródło co w galerii index.html.
OPISY = {
    "shorts-01-hook": ("Shorts", "Plansza otwierająca"),
    "shorts-02-belka": ("Shorts", "Belka opisowa"),
    "shorts-03-cytat": ("Shorts", "Cytat"),
    "shorts-04-lista": ("Shorts", "Trzy punkty"),
    "shorts-05-endcard": ("Shorts", "Plansza końcowa"),
    "story-01-zdjecie": ("Relacje", "Kadr ze zdjęciem"),
    "story-02-oferta": ("Relacje", "Oferta wyjazdu"),
    "story-03-ostatnie-miejsca": ("Relacje", "Ostatnie miejsca"),
    "story-04-opinia": ("Relacje", "Opinia pielgrzyma"),
    "story-05-program": ("Relacje", "Program dzień po dniu"),
    "ad-01-4x5": ("Reklamy", "Reklama wyjazdu 4:5"),
    "ad-02-1x1": ("Reklamy", "Reklama kwadratowa"),
    "ad-03-9x16": ("Reklamy", "Reklama pionowa"),
    "ad-04-link-1200x628": ("Reklamy", "Reklama linkowa"),
    "ad-05-karuzela": ("Reklamy", "Karuzela, 3 slajdy"),
}

# Etykiety pól w panelu treści; kolejność wyznacza kolejność w formularzu.
ETYKIETY = [
    ("eyebrow", "Nadtytuł", "input"),
    ("kierunek", "Kierunek", "input"),
    ("podtytul", "Podtytuł", "input"),
    ("hook", "Zdanie otwierające", "textarea"),
    ("lead", "Zajawka", "textarea"),
    ("termin", "Termin", "input"),
    ("terminKrotki", "Termin skrócony", "input"),
    ("dni", "Czas trwania", "input"),
    ("wylot", "Wylot", "input"),
    ("opiekun", "Opiekun duchowy", "input"),
    ("cena", "Cena", "input"),
    ("waluta", "Waluta", "input"),
    ("cenaNota", "Co w cenie", "textarea"),
    ("miejsca", "Wolne miejsca", "input"),
    ("cta", "Wezwanie", "input"),
    ("opinia", "Opinia", "textarea"),
    ("opiniaAutor", "Autor opinii", "input"),
    ("cytat", "Cytat", "textarea"),
    ("zrodlo", "Źródło cytatu", "input"),
]

FORMATY = {
    "p-canvas--9x16": (1080, 1920),
    "p-canvas--4x5": (1080, 1350),
    "p-canvas--1x1": (1080, 1080),
    "p-canvas--191x1": (1200, 628),
    "p-canvas--16x9": (1920, 1080),
}


def b64(dane: bytes) -> str:
    return base64.b64encode(dane).decode()


def fonty_inline() -> str:
    """@font-face z plikami wklejonymi jako data URI — bez sieci i bez CDN-u."""
    css = (ROOT / "brand" / "fonts.css").read_text()

    def podmien(m):
        plik = ROOT / "brand" / m.group(1)
        return f"url(data:font/woff2;base64,{b64(plik.read_bytes())}) format('woff2')"

    return re.sub(r"url\((fonts/[^)]+)\)\s*format\('woff2'\)", podmien, css)


def zdjecia_zastepcze() -> dict[str, str]:
    """Makiety tła w mniejszej rozdzielczości — to i tak miękkie gradienty."""
    out = {}
    for plik in sorted((ROOT / "assets" / "photos-zastepcze").glob("*.jpg")):
        im = Image.open(plik)
        im = im.resize((760, round(760 * im.height / im.width)), Image.LANCZOS)
        bufor = io.BytesIO()
        im.save(bufor, "JPEG", quality=82, optimize=True)
        out[plik.name] = "data:image/jpeg;base64," + b64(bufor.getvalue())
    return out


def szablony() -> tuple[list[dict], str]:
    """Wyciąga kanwy z plików szablonów razem z ich lokalnymi stylami."""
    lista, dodatkowe_style = [], []

    for stem, (grupa, nazwa) in OPISY.items():
        plik = ROOT / "templates" / f"{stem}.html"
        tresc = plik.read_text()

        for styl in re.findall(r"<style>(.*?)</style>", tresc, re.S):
            # `body` w karuzeli układa slajdy obok siebie — w studiu nie ma zastosowania
            if "body {" not in styl:
                dodatkowe_style.append(styl.strip())

        ciało = tresc[tresc.index(">", tresc.index("<body")) + 1 : tresc.index("</body>")]
        domyslny = re.search(r'<body[^>]*data-wyjazd="([^"]+)"', tresc)

        kanwy = []
        for kanwa in re.findall(r'(<div class="p-canvas.*?)(?=\n<!-- -|\Z)', ciało, re.S):
            kanwa = kanwa.strip()
            if not kanwa.endswith("</div>"):
                continue
            klasy = re.search(r'class="([^"]+)"', kanwa).group(1)
            format_ = next((k for k in FORMATY if k in klasy), "p-canvas--9x16")
            kanwy.append({
                "id": re.search(r'data-export="([^"]+)"', kanwa).group(1),
                "w": FORMATY[format_][0],
                "h": FORMATY[format_][1],
                "alpha": 'data-export-alpha="1"' in kanwa,
                "safe": (re.search(r'data-safe="([^"]+)"', kanwa) or [None, ""])[1],
                "html": kanwa,
            })

        lista.append({
            "stem": stem,
            "grupa": grupa,
            "nazwa": nazwa,
            "wyjazd": domyslny.group(1) if domyslny else "ziemia-swieta",
            "kanwy": kanwy,
        })

    return lista, "\n".join(dict.fromkeys(dodatkowe_style))


def dane_wyjazdow() -> str:
    tresc = (ROOT / "content" / "wyjazdy.js").read_text()
    return tresc[tresc.index("{", tresc.index("window.PALMIERI")) : tresc.rindex("};") + 1]


def main() -> None:
    lista, style_szablonow = szablony()
    strona = (ROOT / "tools" / "studio.template.html").read_text()

    podmiany = {
        "/*FONTY*/": fonty_inline(),
        "/*TOKENY*/": (ROOT / "brand" / "tokens.css").read_text(),
        "/*KOMPONENTY*/": (ROOT / "brand" / "palmieri.css").read_text(),
        "/*STYLE-SZABLONOW*/": style_szablonow,
        "/*SYGNET*/": json.dumps(
            re.sub(r"\s+", " ", (ROOT / "brand" / "logo-sygnet.svg").read_text()).strip()
        ),
        "/*DANE*/": dane_wyjazdow(),
        "/*SZABLONY*/": json.dumps(lista, ensure_ascii=False),
        "/*ZDJECIA*/": json.dumps(zdjecia_zastepcze()),
        "/*ETYKIETY*/": json.dumps(ETYKIETY, ensure_ascii=False),
    }
    for klucz, wartosc in podmiany.items():
        strona = strona.replace(klucz, wartosc, 1)

    cel = ROOT / "studio.html"
    cel.write_text(strona)
    print(f"zapisano {cel.relative_to(ROOT)} — {cel.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
