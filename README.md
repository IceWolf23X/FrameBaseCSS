# FrameBaseCSS

FrameBaseCSS is a customizable, runtime-dependency-free monospace CSS design
system built for public websites, application interfaces, and technical
documentation. The default theme is dark, every public component uses the
`fb-*` namespace, and no framework or build step is required by consumers.

The component API has one readable canonical base stylesheet:
[`framebase.css`](framebase.css). The light theme and Highlight.js integration
are optional overlays that do not duplicate component or layout rules.

Public documentation:
[`icewolf23x.github.io/FrameBaseCSS`](https://icewolf23x.github.io/FrameBaseCSS/).

## Design goals

- Plug-and-use HTML contracts instead of framework-specific abstractions.
- One canonical component API shared by dark and light themes.
- Responsive layouts, accessible states, native controls, and print support.
- Readable source files for development and generated minified files for
  production delivery.
- Optional integrations kept outside the main stylesheet.
- No runtime JavaScript, remote font, image, package manager, or build tool
  required for the core CSS.

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

## Distribution files

| Purpose | Readable source | Minified distribution |
| --- | --- | --- |
| Dark default theme and components | `framebase.css` | `framebase.min.css` |
| Light theme entry point | `framebase-light.css` | `framebase-light.min.css` |
| Optional Highlight.js theme | `framebase-highlight.css` | `framebase-highlight.min.css` |

Use either the readable or minified file for each selected layer, never both.
The minified files expose the same public CSS and HTML contracts as their
readable sources. They are committed release assets, so consumers can download
or link them directly without installing Node.js.

For a production dark page:

```html
<link rel="stylesheet" href="framebase.min.css">
```

For a production light page, use the light entry point by itself:

```html
<link rel="stylesheet" href="framebase-light.min.css">
```

`framebase-light.min.css` imports `framebase.min.css`; keep both files in the
same directory. The readable light entry point follows the equivalent source
contract and imports `framebase.css`.

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

Use `framebase.min.css` as the production equivalent.

The official light theme is a standalone entry point that imports the base
and overrides visual tokens only:

```html
<link rel="stylesheet" href="framebase-light.css">
```

Use `framebase-light.min.css` as the production equivalent. It imports
`framebase.min.css` automatically.

Do not link both files at the same time.
[`framebase-light-demo.html`](framebase-light-demo.html) uses exactly the same
markup as the dark documentation page. Only the `framebase-light.css` link and
the reciprocal theme switch differ.

## Optional syntax highlighting

[`framebase-highlight.css`](framebase-highlight.css) is an optional theme
for code processed by Highlight.js. It contains only `.hljs-*` presentation
rules and does not bundle, import, or download Highlight.js.

Load the addon after the selected FrameBaseCSS theme, then provide and
initialize your preferred Highlight.js build:

```html
<link rel="stylesheet" href="framebase.css">
<link rel="stylesheet" href="framebase-highlight.css">

<div class="fb-code-block">
  <div class="fb-code-header">
    <span class="fb-code-file">theme.css</span>
    <span class="fb-code-language">CSS</span>
  </div>
  <pre><code class="language-css">:root {
  --fb-color-primary: #35c6d4;
}</code></pre>
</div>

<script src="/assets/highlight.min.js"></script>
<script>hljs.highlightAll();</script>
```

Production pages may replace the two readable stylesheets above with
`framebase.min.css` and `framebase-highlight.min.css`. Light pages should use
`framebase-light.min.css` followed by `framebase-highlight.min.css`.

The public demos pin and verify Highlight.js `11.11.1`. Projects remain free
to select, install, and update their own version. Code remains readable without
JavaScript; only automatic highlighting is omitted. Do not load a separate
Highlight.js visual theme unless it is intended to override the FrameBaseCSS
addon.

The code documentation in both public demos renders the same CSS source with
and without Highlight.js side by side. The plain example uses the library's
`nohighlight` opt-out class, so the comparison demonstrates real runtime
behavior rather than manually reproduced token colors.

Highlight.js is an independent project distributed under the
[BSD 3-Clause License](https://github.com/highlightjs/highlight.js/blob/main/LICENSE).

When FrameBaseCSS is updated, maintainers should check the latest stable
Highlight.js release, review its public scope contract, and run both demos
against it. The pinned demo version and integrity hash are updated only after
those checks pass.

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

Load project-specific token overrides after the selected FrameBaseCSS theme
and after any optional FrameBaseCSS addon. This preserves one predictable
cascade without modifying generated or internal component rules.

## Browser requirements

FrameBaseCSS uses modern CSS, including custom properties, `color-mix()`,
`:has()`, and `overflow: clip`. It targets modern versions of major browsers.

## Maintainer build

The readable stylesheets are the canonical sources. Their `.min.css`
counterparts are generated distribution assets and must not be edited by hand.

```powershell
npm ci
npm run build:css
npm run check:css
```

`build:css` regenerates all three minified stylesheets. `check:css` performs a
non-mutating comparison and fails when a generated file is missing or stale.
The build preserves MIT license banners and rewrites the generated light
theme to import `framebase.min.css`; the readable source continues to import
`framebase.css`.

Build tooling uses the pinned `clean-css` development dependency. It is needed
only by repository maintainers; consuming FrameBaseCSS requires no Node.js,
npm, runtime dependency, or build step.

The build is deterministic and intentionally uses fixed source/output pairs.
It does not discover files through globs, inline theme imports, or perform
level-two rule restructuring.

## Continuous integration

The `CSS distribution` workflow runs on pushes and pull requests with
read-only repository permissions. It installs the exact lockfile dependency
set and runs `npm run check:css`; missing or stale generated assets fail the
job. The workflow never edits the repository or creates automated commits.

When updating the project:

1. Edit only readable source stylesheets.
2. Run `npm run build:css`.
3. Review source and generated changes together.
4. Run `npm run check:css` and the relevant HTML verification.
5. Commit readable sources and their generated distributions together.

## License and attribution

FrameBaseCSS is released under the [MIT License](LICENSE). You may use, copy,
modify, and distribute it, including in commercial projects, subject to the
license terms. The copyright and license notice must be retained in copies or
substantial portions of the software.

Visible attribution is not required, but a link to FrameBaseCSS is greatly
appreciated. An optional credit can be added with:

```html
<a href="https://github.com/IceWolf23X/FrameBaseCSS">
  Built with FrameBaseCSS
</a>
```

## Files

- `framebase.css`: canonical source.
- `framebase.min.css`: generated minified canonical distribution.
- `index.html`: GitHub Pages homepage, documentation, and dark visual check.
- `framebase-light.css`: light theme importing the canonical source.
- `framebase-light.min.css`: generated minified light-theme distribution.
- `framebase-highlight.css`: optional Highlight.js output theme.
- `framebase-highlight.min.css`: generated minified Highlight.js theme.
- `framebase-light-demo.html`: offline light-theme visual check.
- `scripts/build-css.mjs`: deterministic CSS build and verification script.
- `package.json` and `package-lock.json`: pinned maintainer tooling.
- `.github/workflows/css-distribution.yml`: generated-asset CI verification.
- `.nojekyll`: static GitHub Pages publishing without Jekyll transforms.
- `.gitignore`: excludes local npm installation artifacts.
- `LICENSE`: MIT license terms and copyright notice.
- `CODE_INDEX.md`: technical repository map.
