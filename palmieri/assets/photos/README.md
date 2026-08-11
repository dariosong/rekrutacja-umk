# Zdjęcia własne

Tu wrzucamy zdjęcia z pielgrzymek, a potem wskazujemy je w polu `zdjecie`
w `content/wyjazdy.js`, na przykład:

```js
zdjecie: "../assets/photos/jerozolima-wieczor.jpg",
```

Adnotacja „Zdjęcie zastępcze” pojawia się tylko przy plikach z katalogu
`assets/photos-zastepcze/` — po podmianie na własne zdjęcie znika sama.

## Czego szukać w kadrze

- **Format pionowy albo kwadratowy**, minimum 1600 px krótszego boku —
  kadr jest przycinany do kanwy z `background-size: cover`.
- **Spokojna, ciemniejsza połowa kadru** tam, gdzie w szablonie leży tekst
  (najczęściej dół). Każde zdjęcie i tak dostaje przyciemnienie, którego
  wymaga księga znaku, ale rozświetlone niebo pod nagłówkiem zawsze przegrywa.
- **Ludzie w drodze** czytają się lepiej niż same zabytki — marka mówi
  o przemianie człowieka, nie o zwiedzaniu.
- **Bez znaków wodnych i obcych logotypów.**

Klasa `.p-photo--duotone` sprowadza zdjęcie do granatowo-złotego duotonu marki.
Jeżeli konkretne zdjęcie ma zostać w naturalnych barwach, usuń tę klasę
z szablonu i zostaw samo `.p-scrim`.
