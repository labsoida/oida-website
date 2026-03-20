# OIDA LABS — Landing Page Specification Document

**Versione:** 3.0
**Data:** 19 Marzo 2026
**Preparato da:** Web Designer
**Per:** Stefano Giarratana — Oida Labs
**Scopo:** Brief tecnico-creativo per la realizzazione del sito in HTML/CSS/JS

---

## 1. PANORAMICA PROGETTO

### 1.1 Cos'è Oida Labs
Oida Labs è un'agenzia di marketing specializzata esclusivamente nel settore healthcare. Il team è composto da medici e professionisti sanitari (50+ anni di esperienza combinata nel settore) che hanno risolto i propri problemi di marketing e ora li risolvono per altre strutture sanitarie. È un servizio da medici per medici.

**Nome:** Oida Labs
**Origine:** Oida (οἶδα) — prima persona singolare del verbo greco antico per "sapere", nel senso di sapere profondo e già insito. Usato da Socrate nell'Apologia.
**Tagline:** Know More. Move Faster.
**Dominio:** oida-labs.com
**Email:** info@oida-labs.com

**Messaggio chiave del sito (da permeare in ogni sezione):** Oida Labs è composta da medici esperti di marketing che risolvono i problemi di marketing di altri medici. Non siamo un'agenzia generalista che si è "specializzata" in sanità — siamo sanitari che hanno imparato il marketing. Questa è la differenza fondamentale.

### 1.2 Obiettivo del sito
Creare una landing page one-page che bilanci **presentazione autorevole** e **generazione lead**. Il sito deve posizionare Oida Labs come partner strategico indispensabile per strutture sanitarie, intercettando i pain point del target (medici titolari, direttori di clinica) e rendendo chiari i problemi che Oida può risolvere. La CTA principale è il form di contatto.

### 1.3 Target
- **Primario:** Medici titolari di studi medici, direttori sanitari di cliniche e policlinici
- **Secondario:** Manager operativi di strutture sanitarie
- **Mindset del target:** Professionisti con poco tempo, scettici verso il marketing generico, abituati a comunicazione formale e basata su dati. Vogliono risultati concreti, non promesse creative.

**NOTA: Non citare aree geografiche specifiche nel sito.** Oida è attiva in IT, CH e UK ma prende clienti ovunque. L'area geografica non va menzionata nei copy.

### 1.4 Lingua
Solo italiano.

---

## 2. BRAND IDENTITY & DESIGN SYSTEM

### 2.1 Palette Colori — Regola 60/30/10

| Ruolo | Colore | HEX | Uso |
|-------|--------|-----|-----|
| **60% — Dominante** | Nero | `#000000` | Sfondo principale di tutte le sezioni |
| **30% — Secondario** | Bianco | `#FFFFFF` | Testo principale, spazi di respiro |
| **10% — Accent** | Electric Teal | `#00C2B2` | CTA, highlight, numeri chiave, bordi interattivi, hover states, elementi focus |

**Regole aggiuntive:**
- Il sito è **dark-first**: lo sfondo predefinito è SEMPRE nero
- Il teal va usato con parsimonia e solo per elementi che devono attirare l'attenzione (CTA, numeri importanti, bordi hover, icone)
- Mai usare il teal come sfondo di sezioni intere
- Per variazioni di sfondo tra sezioni usare: `#000000` (nero puro), `#0A0A0A` (nero leggermente più chiaro), `#111111` (grigio scurissimo)
- Testo secondario / muted: `#888888` o `#AAAAAA`
- Bordi sottili: `rgba(255,255,255,0.1)` oppure `#1A1A1A`

### 2.2 Tipografia

| Ruolo | Font | Stile | Uso |
|-------|------|-------|-----|
| **Titoli / Headlines** | Glaseer Stencil | UPPERCASE, spaziatura ampia | Headline hero, titoli di sezione. **OBBLIGATORIO: caricare il font come webfont custom via @font-face.** I file font (.woff2, .woff, .otf) devono essere inclusi nel pacchetto del sito. Nessun font alternativo è ammesso. |
| **Sottotitoli / Label** | Bank Gothic | UPPERCASE, compatto | Sottotitoli, label sezioni, tag. **OBBLIGATORIO: caricare il font come webfont custom via @font-face.** I file font devono essere inclusi nel pacchetto del sito. Nessun font alternativo è ammesso. |
| **Corpo testo** | Arial | Regular o Light | Paragrafi, descrizioni. Mai sotto 14px su schermo. Arial è un font di sistema e non necessita di caricamento. |

**NOTA CRITICA SUI FONT:** I font Glaseer Stencil e Bank Gothic sono parte integrante dell'identità visiva di Oida Labs e NON possono essere sostituiti in nessun caso. I file font devono essere forniti dal cliente e caricati tramite `@font-face` nel CSS. Struttura consigliata:
```
/fonts/
  glaseer-stencil.woff2
  glaseer-stencil.woff
  bank-gothic.woff2
  bank-gothic.woff
```
```css
@font-face {
  font-family: 'Glaseer Stencil';
  src: url('/fonts/glaseer-stencil.woff2') format('woff2'),
       url('/fonts/glaseer-stencil.woff') format('woff');
  font-display: swap;
}
@font-face {
  font-family: 'Bank Gothic';
  src: url('/fonts/bank-gothic.woff2') format('woff2'),
       url('/fonts/bank-gothic.woff') format('woff');
  font-display: swap;
}
```

**Dimensioni raccomandate (desktop):**

| Elemento | Size |
|----------|------|
| Hero headline | 56-72px, bold/black weight |
| Hero sottotitolo (claim) | 20-24px, regular, colore muted |
| Titolo di sezione | 36-44px, bold, uppercase |
| Label sopra titolo sezione | 12-14px, uppercase, letter-spacing 0.15em, colore teal |
| Corpo testo | 16-18px, line-height 1.6 |
| Testo card/box | 14-16px |
| Numeri / KPI grandi | 48-64px, bold |
| Footer / note | 12-14px, muted |

### 2.3 Logo
Il logo Oida Labs è composto da:
- **Pittogramma:** Lettera O stilizzata come mirino/occhio con punto teal centrale
- **Wordmark:** "OIDA LABS" in font display

**Varianti disponibili:**
1. Logo completo (pittogramma + wordmark) — su sfondo nero
2. Pittogramma standalone — per favicon e spazi ridotti
3. Logo orizzontale — per header
4. Versione invertita — pittogramma su sfondo bianco

**File logo:** Caricare i file SVG forniti dal cliente. Il pittogramma ha un punto teal `#00C2B2` al centro.

### 2.4 Icone
Usare un set di icone **line/outline** in bianco o teal, stile minimalista e tech. Consigliati: Phosphor Icons, Lucide, o Feather Icons. Evitare assolutamente cliché sanitari (croci rosse, cuori, stetoscopi).

Icone suggerite per i servizi:
- **Consulenza Strategica:** `compass` / `clipboard-check` / `map`
- **Digital Marketing & ADV:** `target` / `megaphone` / `chart-bar-increasing`
- **Sviluppo Web - SEO & GEO:** `globe` / `search` / `code`
- **AI, CRM & Automation:** `cpu` / `database` / `bot`
- **Talent Acquisition:** `users` / `user-plus` / `briefcase`

**NOTA:** Nel deck, i bullet point dei servizi usano il pittogramma Oida (il mirino/occhio piccolo) come icona. Replicare questo stile nel sito usando una versione SVG inline del pittogramma come bullet custom.

---

## 3. STRUTTURA DELLA PAGINA

### Layout generale
- **Tipo:** One-page con scroll verticale
- **Navbar:** NESSUNA. Solo il logo Oida Labs posizionato in alto a sinistra, fisso. Nessun menu, nessun hamburger. La navigazione avviene esclusivamente via scroll.
- **Max-width contenuti:** 1200px centrato
- **Padding sezioni:** 100-120px verticale (desktop), 60-80px (mobile)
- **Responsività:** Mobile-first, breakpoints a 768px (tablet) e 1200px (desktop)

### Ordine delle sezioni (dall'alto verso il basso):

```
┌─────────────────────────────────────────┐
│  LOGO (fisso, in alto a sinistra)       │
├─────────────────────────────────────────┤
│  1. HERO                                │
├─────────────────────────────────────────┤
│  2. CHI SIAMO                           │
├─────────────────────────────────────────┤
│  3. SERVIZI                             │
├─────────────────────────────────────────┤
│  4. PERCHÉ NOI                          │
├─────────────────────────────────────────┤
│  5. CONTATTI                            │
├─────────────────────────────────────────┤
│  6. FOOTER                              │
└─────────────────────────────────────────┘
```

---

## 4. DETTAGLIO SEZIONI

---

### SEZIONE 1: HERO

**Obiettivo:** Impatto immediato. Far capire in 3 secondi cosa fa Oida e perché il visitatore (medico/titolare) dovrebbe restare.

**Layout:** Centrato, full-viewport (100vh). Sfondo nero con un leggero effetto di glow/gradiente teal sfumato negli angoli (ispirazione Fylle: gradiente radiale teal con opacità molto bassa, 5-10%, posizionato in alto a destra o in basso a sinistra per dare profondità senza distrarre).

**Struttura dall'alto verso il basso:**

```
[Logo Oida Labs — pittogramma + wordmark, centrato o in alto a sinistra]

                    [ampio spazio vuoto]

          SIAMO MEDICI CHE HANNO RISOLTO
          I LORO PROBLEMI DI MARKETING.
              ORA LI RISOLVIAMO PER TE.

     Uniamo esperienza sanitaria, competenze di
     marketing e pragmatismo, per metterle al servizio
     delle strutture sanitarie e supportarle nelle
     sfide quotidiane della loro crescita.

              KNOW MORE. MOVE FASTER.

                [ Parliamone → ]

                    [ampio spazio vuoto]
```

**Dettagli degli elementi:**

1. **Headline principale:**
   - Testo: "Siamo medici che hanno risolto i loro problemi di marketing. Ora li risolviamo per te."
   - Stile: 56-72px, Glaseer Stencil, UPPERCASE, bianco. La parola "per te" può essere in teal `#00C2B2` per creare contrasto e focus.
   - Centrato
   - Animazione: fade-in + leggero slide-up all'ingresso della pagina (durata: 0.8s, ease-out)

2. **Sottotitolo:**
   - Testo: "Uniamo esperienza sanitaria, competenze di marketing e pragmatismo, per metterle al servizio delle strutture sanitarie e supportarle nelle sfide quotidiane della loro crescita."
   - Stile: 18-22px, Arial regular, colore `#AAAAAA` (grigio chiaro), centrato
   - Max-width: 600px per leggibilità
   - Animazione: fade-in con delay 0.3s rispetto alla headline

3. **Tagline:**
   - Testo: "KNOW MORE. MOVE FASTER."
   - Stile: 14-16px, Bank Gothic, UPPERCASE, teal `#00C2B2`, letter-spacing 0.2em
   - Posizionata tra sottotitolo e CTA button
   - Animazione: fade-in con delay 0.5s

4. **CTA Button:**
   - Testo: "Parliamone" con freccia →
   - Stile: sfondo teal `#00C2B2`, testo nero `#000000`, bold, uppercase, padding 16px 40px, border-radius 4-6px (angoli leggermente arrotondati, NON pillola)
   - Hover: sfondo bianco `#FFFFFF`, testo nero
   - Azione: smooth scroll alla sezione Contatti (#contatti)
   - Animazione: fade-in con delay 0.6s

5. **Indicatore di scroll (opzionale):**
   - Una sottile freccia verso il basso o linea animata in basso al centro del viewport per suggerire lo scroll
   - Colore: `rgba(255,255,255,0.3)`

**NON includere:** Numeri, loghi clienti, immagini, video.

---

### SEZIONE 2: CHI SIAMO

**Obiettivo:** Stabilire credibilità e differenziazione. Far capire che dietro Oida ci sono persone che hanno vissuto in prima persona la sanità, non marketer generici.

**Layout:** Sfondo `#0A0A0A` (leggerissima variazione dal nero per separare dalla hero). Contenuto centrato, max-width 900px.

**Struttura:**

```
                    CHI SIAMO
      (label in teal, uppercase, piccolo)

          I TUOI ADDETTI AI LAVORI.
            (titolo sezione, grande, Glaseer Stencil)

      (NON CHIAMARCI CONSULENTI)
            (sottotitolo in teal, Bank Gothic)

    Siamo medici che hanno risolto i loro problemi
    di marketing. Ora li risolviamo per te.


    ┌──────────┐  ┌──────────┐  ┌──────────────┐
    │   50+    │  │   100%   │  │  IT-CH-UK    │
    │ Anni di  │  │Verticali │  │  Dove siamo  │
    │esperienza│  │nel settore│  │    attivi    │
    │ sanitaria│  │sanitario │  │              │
    └──────────┘  └──────────┘  └──────────────┘

    Uniamo esperienza sanitaria, competenze di
    marketing e pragmatismo, per metterle al servizio
    delle strutture sanitarie e supportarle nelle
    sfide quotidiane della loro crescita.
```

**Dettagli degli elementi:**

1. **Label sezione:**
   - Testo: "CHI SIAMO"
   - Stile: 12-14px, Bank Gothic, uppercase, letter-spacing 0.15em, colore teal `#00C2B2`

2. **Titolo sezione:**
   - Testo: "I tuoi addetti ai lavori."
   - Stile: 36-44px, Glaseer Stencil, UPPERCASE, bianco

3. **Sottotitolo:**
   - Testo: "(Non chiamarci consulenti)"
   - Stile: 18-22px, Bank Gothic, UPPERCASE, teal `#00C2B2`

4. **Frase chiave:**
   - Testo: "Siamo medici che hanno risolto i loro problemi di marketing. Ora li risolviamo per te."
   - Stile: 18-20px, Arial, bianco, centrato

5. **KPI in basso (3 colonne):**
   - Tre box affiancati con bordo teal `#00C2B2` e sfondo leggermente trasparente, angoli arrotondati (come nel deck)
   - Numero grande (48-56px, Bank Gothic, UPPERCASE, bianco)
   - Descrizione sotto (14px, Arial, bianco muted)
   - I tre KPI:
     - **50+** → "Anni di esperienza sanitaria"
     - **100%** → "Verticali nel settore sanitario"
     - **IT-CH-UK** → "Dove siamo attivi"
   - Animazione: counter animation sui numeri quando entrano nel viewport

6. **Chiusura sezione (sotto i KPI):**
   - Testo in corsivo: "Uniamo esperienza sanitaria, competenze di marketing e pragmatismo, per metterle al servizio delle strutture sanitarie e supportarle nelle sfide quotidiane della loro crescita"
   - Stile: 16px, Arial, italic, `#AAAAAA`, centrato

---

### SEZIONE 3: SERVIZI

**Obiettivo:** Far capire in un colpo d'occhio cosa fa Oida, senza costringere l'utente a leggere un catalogo. Ogni servizio è presentato come un problema che il medico riconosce → la soluzione in una frase. L'utente deve pensare "ecco, questo è il mio problema" e scrollare al form. Niente elenchi tecnici, niente dettagli operativi.

**Layout:** Sfondo `#000000`. Contenuto max 1200px.

**Formato scelto:** Griglia compatta di 5 card, tutte visibili in un singolo schermo (o quasi) su desktop. Niente sezioni full-width per ogni servizio — l'utente non deve scrollare 5 schermate solo per i servizi.

**Struttura:**

```
                    SERVIZI
      (label in teal, Bank Gothic, uppercase)

              COSA FACCIAMO
       (titolo sezione, Glaseer Stencil)

    Dal lancio della prima campagna alla
    creazione della tua prima sala operatoria.
            (sottotitolo, italic, muted)


  ┌─────────────────────┐  ┌─────────────────────┐
  │ [icona]             │  │ [icona]             │
  │ CONSULENZA          │  │ DIGITAL MARKETING   │
  │ STRATEGICA          │  │ & ADV               │
  │                     │  │                     │
  │ Non sai da dove     │  │ I pazienti ci sono. │
  │ partire?            │  │ Ma non ti trovano.  │
  │                     │  │                     │
  │ Analizziamo il tuo  │  │ Campagne digitali   │
  │ contesto e ti       │  │ costruite per il    │
  │ diciamo cosa fare,  │  │ settore sanitario.  │
  │ in che ordine, con  │  │ Risultati           │
  │ quali priorità.     │  │ misurabili.         │
  └─────────────────────┘  └─────────────────────┘

  ┌─────────────────────┐  ┌─────────────────────┐
  │ [icona]             │  │ [icona]             │
  │ SVILUPPO WEB        │  │ AI, CRM &           │
  │ SEO & GEO           │  │ AUTOMATION          │
  │                     │  │                     │
  │ Il tuo sito non ti  │  │ Quanti contatti     │
  │ porta pazienti?     │  │ stai perdendo?      │
  │                     │  │                     │
  │ Lo rifacciamo.      │  │ Automazioni per     │
  │ E facciamo in modo  │  │ seguire ogni        │
  │ che Google ti       │  │ richiesta senza     │
  │ trovi per primo.    │  │ perderne nessuna.   │
  └─────────────────────┘  └─────────────────────┘

  ┌───────────────────────────────────────────────┐
  │ [icona]                                       │
  │ TALENT ACQUISITION                            │
  │                                               │
  │ Ti manca personale sanitario?                 │
  │                                               │
  │ Lo troviamo noi. Con campagne mirate,         │
  │ non con annunci generici.                     │
  └───────────────────────────────────────────────┘
```

**Dettagli design delle card:**

- **Layout griglia:** 2 colonne su desktop (2+2+1), stacked su mobile. La quinta card (Talent Acquisition) occupa tutta la larghezza in basso, per dare un ritmo diverso e chiudere la griglia.
- **Stile card:** Sfondo `rgba(255,255,255,0.02)`, bordo `rgba(255,255,255,0.08)`, border-radius 8px, padding 32px. Hover: bordo teal `#00C2B2` (transizione 0.3s).
- **Icona:** 40-48px, teal, in alto a sinistra della card. Stile line/outline.
- **Titolo servizio:** 18-20px, Bank Gothic, UPPERCASE, teal `#00C2B2`
- **Pain point (domanda):** 16-18px, Arial, bianco puro. Una frase breve, diretta, che il medico riconosce come suo problema. In grassetto o con peso maggiore per distinguerla visivamente.
- **Soluzione (risposta):** 14-16px, Arial, `#AAAAAA`. Una o due frasi che dicono cosa Oida fa per risolvere quel problema. Niente elenchi, niente tecnicismi.
- **Nessun bullet point, nessun elenco feature.** Ogni card ha al massimo 4-5 righe di testo totale.
- **Animazione:** Le card appaiono con staggered fade-in (0.1s delay tra una e l'altra) quando la sezione entra nel viewport.

**I 5 servizi — testi delle card:**

| # | Titolo | Pain point | Soluzione |
|---|--------|-----------|-----------|
| 1 | CONSULENZA STRATEGICA | Non sai da dove partire? | Analizziamo il tuo contesto e ti diciamo cosa fare, in che ordine, con quali priorità. |
| 2 | DIGITAL MARKETING & ADV | I pazienti ci sono. Ma non ti trovano. | Campagne digitali costruite per il settore sanitario. Risultati misurabili. |
| 3 | SVILUPPO WEB — SEO & GEO | Il tuo sito non ti porta pazienti? | Lo rifacciamo. E facciamo in modo che Google ti trovi per primo. |
| 4 | AI, CRM & AUTOMATION | Quanti contatti stai perdendo? | Automazioni per seguire ogni richiesta senza perderne nessuna. |
| 5 | TALENT ACQUISITION | Ti manca personale sanitario? | Lo troviamo noi. Con campagne mirate, non con annunci generici. |

---

### SEZIONE 4: PERCHÉ NOI

**Obiettivo:** Sintetizzare in 3 punti perché Oida è diversa da qualunque altra agenzia. Questa sezione chiude il ragionamento prima della CTA finale.

**Layout:** Sfondo `#0A0A0A`. Contenuto centrato, max-width 1000px.

**Struttura:**

```
                  PERCHÉ OIDA
      (label in teal, Bank Gothic, uppercase)

            PERCHÉ SCEGLIERE NOI
            (titolo sezione, Glaseer Stencil)


  ┌─ 01 ────────────┐  ┌─ 02 ────────────┐  ┌─ 03 ────────────┐
  │                  │  │                  │  │                  │
  │ Parliamo la      │  │ Un solo settore. │  │ Un team di       │
  │ tua lingua.      │  │ Il tuo.          │  │ addetti ai       │
  │                  │  │                  │  │ lavori.          │
  │ Siamo sanitari.  │  │ Lavoriamo solo   │  │ 50+ anni di      │
  │ Non dobbiamo     │  │ in sanità.       │  │ esperienza       │
  │ spiegarcele.     │  │ Nessun           │  │ sanitaria sul    │
  │                  │  │ compromesso.     │  │ campo.           │
  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Dettagli design:**

- **Formato:** 3 card affiancate su desktop (griglia 3 colonne), stacked su mobile. Compatte, stessa altezza.
- **Stile card:** Sfondo `rgba(255,255,255,0.02)`, bordo `rgba(255,255,255,0.06)`, bordo sinistro spesso (4px) in teal, padding 28-32px.
- **Numero:** "01", "02", "03" — posizionato in alto a sinistra, 12px, Bank Gothic, teal
- **Titolo punto:** 20-22px, Glaseer Stencil o Arial bold, bianco, UPPERCASE
- **Descrizione:** 14-16px, Arial, `#BBBBBB`, line-height 1.6. Testi brevi e incisivi — max 2-3 righe.
- **Animazione:** Le 3 card appaiono insieme con staggered fade-in (0.1s delay tra una e l'altra)
- **Hover:** bordo sinistro teal si illumina, leggero shift di background

---

### SEZIONE 5: CONTATTI

**Obiettivo:** Convertire. Il visitatore che arriva qui ha già letto tutto e deve trovare un form semplice e invitante.

**Layout:** Sfondo `#000000`. Contenuto centrato, max-width 600px.

**Struttura:**

```
                   CONTATTI
      (label in teal, uppercase, piccolo)

       Hai ancora domande? Bene.
       Sono esattamente quelle di cui
       vogliamo parlare.
            (titolo sezione)


    ┌────────────────────────────────────┐
    │  Nome                              │
    ├────────────────────────────────────┤
    │  Email *                           │
    ├────────────────────────────────────┤
    │  Telefono (opzionale)              │
    ├────────────────────────────────────┤
    │                                    │
    │  Messaggio                         │
    │                                    │
    │                                    │
    ├────────────────────────────────────┤
    │                                    │
    │         [ INVIA MESSAGGIO ]        │
    │                                    │
    └────────────────────────────────────┘

         info@oida-labs.com
         oida-labs.com
```

**Dettagli design:**

- **Titolo:** Riprendere la chiusura del deck: "Hai ancora domande? Bene. Sono esattamente quelle di cui vogliamo parlare." — 28-36px, bianco
- **Form:**
  - Campi: Nome (text), Email (email, required), Telefono (tel, opzionale), Messaggio (textarea)
  - Stile campi: sfondo `#111111`, bordo `rgba(255,255,255,0.1)`, testo bianco, placeholder `#666666`, border-radius 4px, padding 14-16px
  - Focus state: bordo teal `#00C2B2`
  - Label: non visibili (usare solo placeholder), oppure label piccole sopra il campo in `#888888`
- **Button submit:**
  - Testo: "INVIA MESSAGGIO"
  - Stile: identico alla CTA hero — sfondo teal, testo nero, bold, uppercase, full-width del form
  - Hover: sfondo bianco
- **Info contatto sotto il form:**
  - Email e sito, 14px, `#888888`
  - Eventuale icona email/globe in teal accanto

**Nota tecnica — Invio email:** Il form deve inviare una email con il contenuto compilato all'indirizzo **info@oida-labs.com**. Opzioni di implementazione:
- **Formspree** (consigliato, no backend): configurare un endpoint Formspree con destinazione info@oida-labs.com. L'action del form diventa `https://formspree.io/f/{form_id}` con metodo POST.
- **EmailJS** (alternativa client-side): invio diretto via JavaScript senza backend.
- **Backend custom** (PHP/Node): se l'hosting lo supporta, uno script server-side che usa SMTP per inviare a info@oida-labs.com.

Il codice HTML deve includere il form con tutti i campi pronti, e un commento che indichi dove inserire l'endpoint scelto.

---

### SEZIONE 6: FOOTER

**Obiettivo:** Chiudere la pagina con informazioni legali e contatti minimi.

**Layout:** Sfondo `#000000` con linea divisoria superiore `rgba(255,255,255,0.05)`. Padding ridotto (40-60px verticale).

**Struttura:**

```
─────────────────────────────────────────

[Pittogramma Oida]

Oida Labs
info@oida-labs.com · oida-labs.com

© 2026 Oida Labs. Tutti i diritti riservati.
Privacy Policy · Cookie Policy

[icona LinkedIn]  [icona Instagram]
```

**Dettagli:**
- Tutto centrato
- Pittogramma piccolo (32-40px)
- Testo: 12-14px, `#666666`
- Link policy: `#888888`, hover in teal
- Icone social: 20-24px, `#666666`, hover in teal
- I link Privacy Policy e Cookie Policy puntano a pagine placeholder (#)

---

## 5. INTERAZIONI & ANIMAZIONI

### 5.1 Animazioni globali
- **Scroll-triggered fade-in:** Ogni sezione/blocco appare con `opacity: 0 → 1` e `translateY(30px → 0)` quando entra nel viewport. Usare IntersectionObserver.
- **Durata:** 0.6-0.8s, easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out smooth)
- **Stagger:** Elementi multipli nella stessa sezione appaiono con delay incrementale di 0.1-0.15s

### 5.2 Hover states
- **CTA buttons:** transizione background-color 0.3s
- **Card "Perché Noi":** bordo sinistro più luminoso, leggero shift di background
- **Link footer:** color transition al teal

### 5.3 Smooth scroll
- Scroll behavior smooth su tutto il documento (`scroll-behavior: smooth` su HTML)
- La CTA hero scrolla alla sezione #contatti

### 5.4 Effetto glow (Hero)
- Gradiente radiale teal con opacità 3-8% posizionato su un angolo (es. alto destra) della hero
- Statico o con leggero movimento (animazione CSS lenta, 15-20s cycle)
- Ispirazione: l'effetto verde sfumato di Fylle ma adattato al teal Oida

### 5.5 Performance
- Nessun framework pesante. Vanilla JS per IntersectionObserver e smooth scroll.
- CSS custom properties per i colori (facile manutenzione)
- Lazy load su eventuali immagini
- Font custom (Glaseer Stencil, Bank Gothic): preload dei file .woff2 per rendering immediato

---

## 6. RESPONSIVE DESIGN

**Obiettivo scroll:** L'intera pagina deve essere percorribile in 3-4 scroll su desktop. L'utente non deve mai sentirsi "lontano" dal form contatti.

### Desktop (>1200px)
- Max-width container: 1200px
- Servizi: griglia 2 colonne (2+2+1 card)
- KPI Chi Siamo: 3 colonne affiancate
- Perché Noi: 3 card affiancate in riga (non impilate)
- Form: max-width 600px centrato

### Tablet (768px — 1200px)
- Container: padding laterale 40px
- Servizi: griglia 2 colonne (si adatta)
- KPI: 3 colonne (possono ridursi in dimensione)
- Perché Noi: stacked verticalmente

### Mobile (<768px)
- Container: padding laterale 20px
- Hero headline: 36-44px
- Tutto impilato verticalmente
- KPI: impilati verticalmente o 1 colonna
- Servizi: card impilate, full-width
- Card Perché Noi: full-width impilate
- Form: full-width
- CTA button: full-width
- Padding sezioni: 60px verticale

---

## 7. ASPETTI TECNICI

### 7.1 Stack raccomandato
- **HTML5** semantico (`<header>`, `<main>`, `<section>`, `<footer>`)
- **CSS3** con custom properties, flexbox, grid
- **JavaScript vanilla** per scroll animations (IntersectionObserver)
- **Nessun framework** (no React, no Tailwind) — HTML/CSS/JS puri per massima semplicità e portabilità
- **Single file** o al massimo 3 file (index.html, style.css, main.js)

### 7.2 SEO base
- Tag `<title>`: "Oida Labs — Marketing Sanitario. Know More. Move Faster."
- Meta description: "Siamo medici esperti di marketing. Digital marketing, SEO, CRM, AI e consulenza operativa per cliniche, studi medici e strutture sanitarie."
- Open Graph tags per condivisione social
- Favicon: pittogramma Oida
- Schema markup: Organization

### 7.3 Performance
- Obiettivo: Lighthouse score >90 su tutte le metriche
- Minimizzare CSS/JS
- Font preload
- Nessuna immagine pesante (icone SVG inline o icon font)

### 7.4 Accessibilità
- Contrasto minimo: WCAG AA (il bianco su nero supera ampiamente, verificare teal su nero)
- `alt` text su tutte le immagini
- Focus states visibili
- Form con label accessibili (`aria-label` se placeholder-only)
- Struttura heading corretta (h1 > h2 > h3)

---

## 8. TONO DI VOCE — LINEE GUIDA PER I COPY

Il tono di Oida è definito nel brand manual. Ecco le regole da seguire per tutti i testi del sito:

### SIAMO:
- **Concreti e misurabili** — numeri, risultati, fatti
- **Veloci e adattativi** — linguaggio diretto, frasi corte
- **Esperti di settore** — usiamo il linguaggio della sanità con naturalezza
- **Partner strategici** — parliamo al pari, non dal basso
- **Tech-forward** — guardiamo al futuro, non al passato

### NON SIAMO:
- Vaghi e creativi per il gusto di esserlo
- Lenti e burocratici
- Generalisti
- Semplici fornitori
- Nostalgici dei metodi tradizionali

### Regole di copy:
- Mai tono entusiasta e promozionale
- Ogni frase deve guadagnarsi il suo posto
- Focus sempre sul cliente, mai autoreferenziale
- Linguaggio diretto, nessun fronzolo
- Frasi brevi e assertive dove possibile

### Esempio corretto:
"Analizziamo i dati, ottimizziamo la campagna, consegniamo risultati. Senza perdere tempo."

### Esempio da evitare:
"Siamo appassionati di raccontare le storie del vostro brand in modo creativo e coinvolgente!"

---

## 9. CHECKLIST PRE-LANCIO

- [ ] Logo SVG caricato e funzionante (tutte le varianti)
- [ ] Font Glaseer Stencil e Bank Gothic caricati via @font-face (file .woff2/.woff forniti dal cliente)
- [ ] Form collegato e funzionante (invio email a info@oida-labs.com)
- [ ] Favicon impostata (pittogramma Oida)
- [ ] Meta tag SEO compilati
- [ ] Open Graph compilato
- [ ] Test responsivo su mobile, tablet, desktop
- [ ] Test su Chrome, Firefox, Safari, Edge
- [ ] Lighthouse score verificato
- [ ] Privacy Policy e Cookie Policy linkate (anche se placeholder)
- [ ] Google Analytics / tag manager configurato
- [ ] Cookie banner GDPR (se necessario)
- [ ] Verificare contrasto teal `#00C2B2` su nero per WCAG AA
- [ ] Smooth scroll funzionante
- [ ] Animazioni non invasive (prefers-reduced-motion rispettato)
- [ ] Form validation funzionante (email obbligatoria)

---

## 10. RIFERIMENTI VISIVI

- **Stile generale:** Ispirato a [fylle.ai/landing](https://www.fylle.ai/landing/) — dark, minimal, impattante, headline grandi, CTA neon/accent, ampio uso dello spazio negativo
- **Adattamento:** Meno prodotto-centrico di Fylle, più consulenziale. Il target è un medico 45-60 anni, non un marketer tech-savvy. Il sito deve risultare autorevole, premium, senza sembrare "da startup".
- **Palette:** Dove Fylle usa verde neon, Oida usa teal `#00C2B2`. Il teal è più sofisticato e meno aggressivo.
- **Differenza chiave nei copy:** Il messaggio centrale è "da medici per medici". I testi seguono fedelmente il tono del pitch deck — professionali, diretti, concreti — senza essere arroganti o provocatori. Il valore differenziante è che il team di Oida è composto da sanitari veri, non da marketer che si sono "specializzati" in sanità.

---

*Fine del documento. Questo file contiene tutte le informazioni necessarie per generare il codice HTML/CSS/JS della landing page di Oida Labs.*
