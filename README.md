# Demo pre VR Group, a.s. (Frontend vývojář junior/medior/senior)

### Spustenie

**Vite dev server**

Ak máte nainštalovaný Node.js tak stačí `npm install` v priečinku a následne `npm run dev`. Aplikácia sa spustí na porte 8080.

**Docker**

Aplikácia obshahuje aj Dockerfile takže je možné ju spustiť aj cez Docker
`docker build .`
Skopírujte id buildnutého image alebo si ho predtým otagujte `docker build . -t "sample-tag"`
Následne už len `docker run -p  8080:8080 [tag alebo id]`
Aplikácia by mala byť dostupná na porte 8080

### Ovládanie

Aplikácia má 3 nástroje.

1. Meranie dĺžky

- Ikona pravítka
- Je možne kliknúť dva body na mape a následne zonbrazi vzdialenosť medi nimi a pochodový uhol
- Keď je tento nástroj aktívny je možné prejsť do editovacieho módu stlačením Tab. Potom je možné zadať presnú vzdialenosť aj pochodový uhol.
  Pomocou klávesy Tab je možné prepínať medzi zadavaním vzdialenosti a uhlu. Je možné zadať vzdialenosť vo formáte "100km" alebo "100m" aplikácie potom skonvertuje jednotky.
  Pri uhl je možné zadať hodnotu vo formáte "1rad" vtedy aplikácia použije radiány. Ak nezadáte žiadne znaky iba čísla východzie jendnotky sú metre a stupne.
  Kontrola na vstupe nie je lebo sa jedná len o demo.

2. Merania úhlu

- Ikona úhlu
- Po zvolenní troch bodov na mape vám zobrazí uhol medzi nimi vždy v rozsahu 0-180 stupňov

3. Kreslenie polyčiary

- Ikona polyčiary
- Keď je nástroj aktívny umožňuje kresliť a modifikovať kreslenú polyčiaru
- Kreslenie ukončíte držaním Shiftu a dvojitým kliknutím na posledný bod kde chcete aby sa polyčiara skončila
- Modifikovať môžte keď je nástroj aktívny a držíte Ctrl. Je možné pridávať a upravovať body. Pri dvojkliku je možné body mazať.

Posledné tlačidlo vymaže všetky kreslenia.
