# FrameBaseCSS

FrameBaseCSS è un design system CSS monospace, personalizzabile e senza
dipendenze, progettato per siti pubblici, interfacce applicative e
documentazione tecnica. Il tema predefinito è dark.

Il progetto mantiene una sola sorgente canonica leggibile:
[`framebase.css`](framebase.css).

## Quick start

```html
<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="framebase.css">
  <title>Il mio sito</title>
</head>
<body>
  <main class="fb-main">
    <div class="fb-container">
      <h1>Pronto</h1>
      <button class="fb-button" type="button">Continua</button>
    </div>
  </main>
</body>
</html>
```

Non sono richiesti framework, font remoti, immagini, JavaScript o una fase di
build. JavaScript rimane necessario soltanto per eventuali comportamenti
applicativi che HTML non fornisce autonomamente.

## Documentazione dei componenti

[`framebase-demo.html`](framebase-demo.html) è sia la documentazione pubblica
dei contratti HTML sia una pagina di verifica offline. Contiene:

- installazione e personalizzazione tramite token;
- shell di pagina, contenitori e primitive di layout;
- header, navigazione, breadcrumb, hero e metriche;
- layout per documentazione tecnica;
- card, badge, pulsanti e gruppi di azioni;
- form, validazione e controlli HTML nativi;
- callout, stati, progress e meter;
- accordion, dialog e popover;
- tabelle responsive, codice e terminale;
- figure, gallery e avatar;
- tab statiche, paginazione, procedure e stati vuoti;
- utility, accessibilità, responsive e stampa.

Per consultarla localmente:

```powershell
python -m http.server 8000
```

Apri quindi `http://127.0.0.1:8000/framebase-demo.html`.

## Temi

Il tema dark è incluso in `framebase.css`:

```html
<link rel="stylesheet" href="framebase.css">
```

Il tema light ufficiale è un entrypoint autonomo che importa la base e
sovrascrive esclusivamente i token visivi:

```html
<link rel="stylesheet" href="framebase-light.css">
```

Non collegare contemporaneamente entrambi i file. La pagina
[`framebase-light-demo.html`](framebase-light-demo.html) usa lo stesso identico
markup della documentazione dark: cambia soltanto il collegamento al foglio
`framebase-light.css`.

## Personalizzazione

Sovrascrivi i token dopo il foglio principale:

```css
:root {
  --fb-color-primary: #7dd3fc;
  --fb-color-background: #111827;
  --fb-container-max: 72rem;
  --fb-control-height: 2.75rem;
}
```

I componenti non devono essere corretti tramite ID o selettori specifici della
singola pagina. Usa le primitive `.fb-stack`, `.fb-flow`, `.fb-cluster`,
`.fb-grid` e le classi di composizione documentate per controllare lo spazio e
il layout.

## Requisiti browser

FrameBaseCSS usa CSS moderno, inclusi custom properties, `color-mix()`, `:has()`
e `overflow: clip`. È destinato alle versioni moderne dei browser principali.

## File

- `framebase.css`: sorgente canonica.
- `framebase-demo.html`: documentazione e verifica visuale offline.
- `framebase-light.css`: tema light che importa la sorgente canonica.
- `framebase-light-demo.html`: verifica visuale offline del tema light.
- `CODE_INDEX.md`: mappa tecnica del repository.
