#!/usr/bin/env python3
"""Eksport szablonów Palmieri do plików PNG.

    python3 tools/export.py                       # wszystkie szablony, domyślny wyjazd
    python3 tools/export.py --wyjazd fatima       # wszystkie szablony dla Fatimy
    python3 tools/export.py ad-01 story-02        # tylko wybrane szablony
    python3 tools/export.py --safe                # z podglądem stref interfejsu
    python3 tools/export.py --skala 2             # dwukrotna rozdzielczość

Gotowe pliki lądują w export/.

Wymaga: playwright  (pip install playwright && playwright install chromium)
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path
from urllib.parse import quote

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
TEMPLATES = ROOT / "templates"
EXPORT = ROOT / "export"

# W tym środowisku Chromium jest już zainstalowany poza katalogiem Playwrighta.
CHROME_HINTS = [
    os.environ.get("PALMIERI_CHROME", ""),
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
]


def krotko(sciezka: Path) -> str:
    """Ścieżka względem katalogu projektu, a dla katalogów spoza niego — pełna."""
    try:
        return str(sciezka.relative_to(ROOT))
    except ValueError:
        return str(sciezka)


def executable() -> str | None:
    for hint in CHROME_HINTS:
        if hint and Path(hint).exists():
            return hint
    return None


def main() -> int:
    ap = argparse.ArgumentParser(description="Eksport szablonów Palmieri do PNG.")
    ap.add_argument("filtry", nargs="*", help="fragmenty nazw szablonów do wyeksportowania")
    ap.add_argument("--wyjazd", default=None, help="slug wyjazdu z content/wyjazdy.js")
    ap.add_argument("--safe", action="store_true", help="dorysuj strefy zasłaniane przez interfejs")
    ap.add_argument("--skala", type=float, default=1.0, help="mnożnik rozdzielczości (domyślnie 1)")
    ap.add_argument("--katalog", default=None, help="katalog docelowy (domyślnie export/)")
    args = ap.parse_args()

    pliki = sorted(TEMPLATES.glob("*.html"))
    if args.filtry:
        pliki = [p for p in pliki if any(f in p.name for f in args.filtry)]
    if not pliki:
        print("Nie znalazłem szablonów pasujących do podanych filtrów.", file=sys.stderr)
        return 1

    cel = Path(args.katalog) if args.katalog else EXPORT
    if args.wyjazd and not args.katalog:
        cel = EXPORT / args.wyjazd
    cel.mkdir(parents=True, exist_ok=True)

    zapytanie = []
    if args.wyjazd:
        zapytanie.append("wyjazd=" + quote(args.wyjazd))
    if args.safe:
        zapytanie.append("safe=1")
    sufiks = ("?" + "&".join(zapytanie)) if zapytanie else ""

    exe = executable()
    zapisane = 0

    with sync_playwright() as pw:
        przegladarka = pw.chromium.launch(executable_path=exe) if exe else pw.chromium.launch()
        kontekst = przegladarka.new_context(
            viewport={"width": 1200, "height": 1920},
            device_scale_factor=args.skala,
        )
        strona = kontekst.new_page()

        for plik in pliki:
            strona.goto(plik.as_uri() + sufiks)
            strona.wait_for_selector("html.p-gotowe", timeout=10_000)
            strona.evaluate("document.fonts.ready")
            strona.wait_for_timeout(180)

            kanwy = strona.query_selector_all(".p-canvas[data-export]")
            if not kanwy:
                print(f"  pomijam {plik.name} — brak kanwy z atrybutem data-export")
                continue

            # `omit_background` zdejmuje tło strony, a nie tło elementu. Bez tego
            # nakładki na wideo wychodziły z pełnym granatem zamiast przezroczystości.
            if any(k.get_attribute("data-export-alpha") == "1" for k in kanwy):
                strona.add_style_tag(content="html, body { background: transparent !important; }")

            for kanwa in kanwy:
                nazwa = kanwa.get_attribute("data-export")
                alfa = kanwa.get_attribute("data-export-alpha") == "1"
                wyjscie = cel / f"{nazwa}.png"
                kanwa.screenshot(path=str(wyjscie), omit_background=alfa)
                rozmiar = kanwa.bounding_box()
                print(
                    f"  {krotko(wyjscie)}  "
                    f"{int(rozmiar['width'] * args.skala)}×{int(rozmiar['height'] * args.skala)}"
                    + ("  (przezroczyste tło)" if alfa else "")
                )
                zapisane += 1

        przegladarka.close()

    print(f"\nGotowe — {zapisane} plików w {krotko(cel)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
