# SEO Fase 1 — Quick wins tecnici per brevamedical.ch

## Contesto
Il sito brevamedical.ch è un sito statico single-page hostato su GitHub Pages. Struttura attuale: index.html + style.css + immagini nella root. Il sito è in italiano, target Canton Ticino (Svizzera). Non ha robots.txt, sitemap, schema markup, canonical, né Open Graph tags. Questo task aggiunge solo elementi SEO tecnici senza creare pagine nuove né modificare il contenuto visibile.

---

## Task 1 — Crea robots.txt nella root del progetto

```
User-agent: *
Allow: /
Sitemap: https://brevamedical.ch/sitemap.xml
```

---

## Task 2 — Crea sitemap.xml nella root del progetto

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://brevamedical.ch/</loc>
    <lastmod>2026-04-15</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## Task 3 — Aggiungi meta tags e schema markup nel `<head>` di index.html

Inserisci PRIMA della chiusura `</head>`, DOPO il link a Google Fonts:

```html
<!-- Canonical -->
<link rel="canonical" href="https://brevamedical.ch/" />

<!-- Open Graph -->
<meta property="og:title" content="BREVA Medical – Servizi Anestesiologici" />
<meta property="og:description" content="Servizi anestesiologici professionali per strutture sanitarie private nel Canton Ticino, Svizzera." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://brevamedical.ch/" />
<meta property="og:locale" content="it_CH" />
<meta property="og:site_name" content="BREVA Medical" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="BREVA Medical – Servizi Anestesiologici" />
<meta name="twitter:description" content="Servizi anestesiologici professionali per strutture sanitarie private nel Canton Ticino." />

<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "BREVA Medical SAGL",
  "alternateName": "BREVA Medical",
  "url": "https://brevamedical.ch",
  "logo": "https://brevamedical.ch/logo-breva.png",
  "description": "Servizi anestesiologici professionali per strutture sanitarie private nel Canton Ticino, Svizzera.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Piazza dell'Indipendenza, 3",
    "addressLocality": "Lugano",
    "postalCode": "6900",
    "addressRegion": "TI",
    "addressCountry": "CH"
  },
  "telephone": "+41762932573",
  "email": "info@brevamedical.ch",
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Canton Ticino"
  },
  "medicalSpecialty": "Anesthesia",
  "availableService": [
    {
      "@type": "MedicalProcedure",
      "name": "Anestesia per studi dentistici"
    },
    {
      "@type": "MedicalProcedure",
      "name": "Anestesia per cliniche di fertilità"
    },
    {
      "@type": "MedicalProcedure",
      "name": "Anestesia per day surgery"
    },
    {
      "@type": "MedicalProcedure",
      "name": "Supporto anestesiologico per strutture ospedaliere"
    }
  ]
}
</script>
```

---

## Task 4 — Fix alt tag immagini in index.html

Trova e sostituisci:

- `alt="BREVA Medical"` nell'header (tag `<img>` dentro `.logo`) → `alt="BREVA Medical – Servizi anestesiologici Canton Ticino"`
- `alt="BREVA Medical"` nel footer (tag `<img>` dentro `.footer-logo`) → `alt="BREVA Medical logo"`

---

## Riepilogo file da creare/modificare

| File | Azione |
|------|--------|
| robots.txt | CREA (nuovo) |
| sitemap.xml | CREA (nuovo) |
| index.html | MODIFICA (aggiungi meta tags + schema nel head, fix alt immagini) |

Nessuna pagina nuova, nessuna modifica al CSS, nessuna modifica al contenuto visibile.
