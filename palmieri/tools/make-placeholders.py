#!/usr/bin/env python3
"""Generuje zastępcze tła w barwach marki (granat + złoto).

Pliki trafiają do assets/photos-zastepcze/ i służą wyłącznie jako makieta.
Własne zdjęcia wrzucamy do assets/photos/ i podmieniamy ścieżki
w content/wyjazdy.js — wtedy znika też adnotacja „Zdjęcie zastępcze".

    python3 tools/make-placeholders.py

Wymaga: pillow, numpy
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "photos-zastepcze"

NAVY = np.array([22, 36, 63], float)
GOLD = np.array([184, 150, 90], float)
CREAM = np.array([239, 231, 210], float)

W, H = 1200, 1600

# nazwa: (x, y) źródła światła w ułamkach kadru, siła, barwa światła
SCENES = {
    "ziemia-swieta": ((0.68, 0.30), 1.00, GOLD),
    "fatima": ((0.30, 0.22), 0.80, CREAM),
    "rzym": ((0.50, 0.62), 0.92, GOLD),
    "medziugorje": ((0.22, 0.72), 0.72, GOLD),
    "grecja": ((0.78, 0.66), 0.86, CREAM),
    "domyslne": ((0.50, 0.38), 0.85, GOLD),
}


def scene(center, strength, light, seed):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:H, 0:W]
    x = xx / W
    y = yy / H

    # miękka poświata wokół źródła światła
    cx, cy = center
    d = np.sqrt(((x - cx) * 1.15) ** 2 + (y - cy) ** 2)
    glow = np.clip(1.0 - d / 0.92, 0, 1) ** 2.1 * strength

    # pasmowy gradient horyzontu — sugeruje przestrzeń bez dosłowności
    band = np.clip(1.0 - np.abs(y - (cy + 0.18)) / 0.55, 0, 1) ** 2.4 * 0.30 * strength

    mix = np.clip(glow * 0.85 + band, 0, 1)[..., None]
    img = NAVY + (light - NAVY) * mix

    # winieta
    vig = np.clip(1.0 - (((x - 0.5) ** 2 + (y - 0.5) ** 2) ** 0.5) / 0.86, 0, 1) ** 1.5
    img *= (0.42 + 0.58 * vig)[..., None]

    # ziarno
    grain = rng.normal(0, 5.5, (H, W, 1))
    img = np.clip(img + grain, 0, 255).astype("uint8")

    out = Image.fromarray(img).filter(ImageFilter.GaussianBlur(0.6))
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for i, (name, (center, strength, light)) in enumerate(SCENES.items()):
        path = OUT / f"{name}.jpg"
        scene(center, strength, light, seed=i * 101 + 7).save(path, quality=88, optimize=True)
        print("zapisano", path.relative_to(ROOT))


if __name__ == "__main__":
    main()
