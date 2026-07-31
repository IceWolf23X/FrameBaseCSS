# FrameBaseCSS

FrameBaseCSS is a customizable, dependency-free monospace CSS design system
built for public websites, application interfaces, and technical
documentation. The default theme is dark.

The project maintains one readable canonical source:
[`framebase.css`](framebase.css).

Public documentation:
[`icewolf23x.github.io/FrameBaseCSS`](https://icewolf23x.github.io/FrameBaseCSS/).

## Quick start

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="framebase.css">
  <title>My website</title>
</head>
<body>
  <main class="fb-main">
    <div class="fb-container">
      <h1>Ready</h1>
      <button class="fb-button" type="button">Continue</button>
    </div>
  </main>
</body>
</html>
```

No framework, remote font, image, JavaScript, or build step is required.
JavaScript remains necessary only for application behavior that HTML does not
provide on its own.

## Component documentation

[`index.html`](index.html) is both the public HTML contract documentation and
an offline verification page. It includes:

- installation and token-based customization;
- page shells, containers, and layout primitives;
- headers, navigation, breadcrumbs, heroes, and metrics;
- technical documentation layouts;
- cards, badges, buttons, and action groups;
- forms, validation, and native HTML controls;
- callouts, statuses, progress, and meters;
- accordions, dialogs, and popovers;
- responsive tables, code, and terminals;
- figures, galleries, and avatars;
- static tabs, pagination, procedures, and empty states;
- utilities, accessibility, responsive behavior, and print styles.

To browse it locally:

```powershell
python -m http.server 8000
```

Then open `http://127.0.0.1:8000/`.

## Themes

The dark theme is included in `framebase.css`:

```html
<link rel="stylesheet" href="framebase.css">
```

The official light theme is a standalone entry point that imports the base
and overrides visual tokens only:

```html
<link rel="stylesheet" href="framebase-light.css">
```

Do not link both files at the same time.
[`framebase-light-demo.html`](framebase-light-demo.html) uses exactly the same
markup as the dark documentation page. Only the `framebase-light.css` link and
the reciprocal theme switch differ.

## Customization

Override tokens after the main stylesheet:

```css
:root {
  --fb-color-primary: #7dd3fc;
  --fb-color-background: #111827;
  --fb-container-max: 72rem;
  --fb-control-height: 2.75rem;
}
```

Do not correct components through IDs or page-specific selectors. Use the
documented `.fb-stack`, `.fb-flow`, `.fb-cluster`, `.fb-grid`, and composition
classes to control spacing and layout.

## Browser requirements

FrameBaseCSS uses modern CSS, including custom properties, `color-mix()`,
`:has()`, and `overflow: clip`. It targets modern versions of major browsers.

## Files

- `framebase.css`: canonical source.
- `index.html`: GitHub Pages homepage, documentation, and dark visual check.
- `framebase-light.css`: light theme importing the canonical source.
- `framebase-light-demo.html`: offline light-theme visual check.
- `.nojekyll`: static GitHub Pages publishing without Jekyll transforms.
- `CODE_INDEX.md`: technical repository map.
