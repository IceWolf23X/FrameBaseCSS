# FrameBaseCSS

FrameBaseCSS is a customizable, runtime-dependency-free monospace CSS design
system built for public websites, application interfaces, and technical
documentation. The default theme is dark, every public component uses the
`fb-*` namespace, and no framework or build step is required by consumers.

The component API has one readable canonical base stylesheet:
[`framebase.css`](framebase.css). The light theme and Highlight.js integration
are optional overlays that do not duplicate component or layout rules.

Public documentation:
[`css.icewolf23x.dev`](https://css.icewolf23x.dev/).

## Design goals

- Plug-and-use HTML contracts instead of framework-specific abstractions.
- One canonical component API shared by dark and light themes.
- Responsive layouts, accessible states, native controls, and print support.
- Readable source files for development and generated minified files for
  production delivery.
- Optional integrations kept outside the main stylesheet.
- No runtime JavaScript, remote font, image, package manager, or build tool
  required for the core CSS.

## For developers and AI-assisted workflows

FrameBaseCSS is designed as a shared presentation contract for both developers
and AI-assisted development tools. A developer can compose documented classes
directly, while an AI can generate clean semantic HTML against the same stable,
tested CSS foundation instead of repeatedly inventing alignment, centering,
spacing, formatting, responsive layout, and component states.

Providing this repository and its HTML contracts as project context lets an AI
focus on structure, content, and application-specific behavior. Reusing the
existing contracts can reduce corrective iterations and the amount of prompt
and output context required, potentially saving development time, model tokens,
and usage costs. Generated HTML and application behavior should still receive
normal human review and project-specific testing.

## Quick start

```html
<!DOCTYPE html>
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

After the `1.2.0` package is intentionally published, install that exact
version with:

```sh
npm install framebasecss@1.2.0
```

The package exposes the minified dark entry point by default and explicit
subpaths for `base`, `light`, `themes`, and `highlight`. FrameBaseCSS has not
been published to npm by this repository update; the metadata is ready, but an
intentional publication remains a separate maintainer action.

The following version-pinned CDN forms become valid only after `1.2.0` is
published to npm:

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/framebasecss@1.2.0/framebase.min.css">
<link rel="stylesheet"
  href="https://unpkg.com/framebasecss@1.2.0/framebase.min.css">
```

Replace the asset name with `framebase-light.min.css`,
`framebase-themes.min.css`, or `framebase-highlight.min.css` as required. Keep
the explicit version; do not use `latest` in production documentation.

## Distribution files

| Purpose | Readable source | Minified distribution |
| --- | --- | --- |
| Dark default theme and components | `framebase.css` | `framebase.min.css` |
| Light theme entry point | `framebase-light.css` | `framebase-light.min.css` |
| Dark/light/auto theme controller | `framebase-themes.css` | `framebase-themes.min.css` |
| Optional Highlight.js theme | `framebase-highlight.css` | `framebase-highlight.min.css` |
| Editable custom-theme starter | `framebase-theme-template.css` | Not generated |

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
- loading indicators, skeletons, toasts, dropdown menus, and drawers;
- responsive navigation, advanced data tables, and composite inputs;
- icon sizing, badge overlays, timelines, steppers, and calendar presentation;
- utilities, accessibility, responsive behavior, and print styles.

The consultable documentation starts at [`docs/index.html`](docs/index.html).
Its component matrix and complete new contracts are in
[`docs/components.html`](docs/components.html), with dedicated theme,
accessibility, browser-support, and RTL verification pages. The mega-demo stays
available as the broad rendering fixture rather than being replaced.

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

For one HTML document that supports an explicit dark, light, or automatic
system theme, link the controller instead:

```html
<html lang="en" data-theme="auto">
  <head>
    <link rel="stylesheet" href="framebase-themes.css">
  </head>
</html>
```

Accepted values are `dark`, `light`, and `auto`. The consumer may change the
attribute and persist a preference with its own application code; the CSS does
not ship preference storage or runtime JavaScript. Component HTML remains
identical across all three values.

### Custom theme starter

Copy [`framebase-theme-template.css`](framebase-theme-template.css), rename the
copy for the project, and edit its documented token groups. It is a complete
entry point that imports `framebase.css`, so the page links only the renamed
theme:

```html
<link rel="stylesheet" href="my-theme.css">
```

The starter initially reproduces the default dark theme and exposes the public
palette, typography, spacing, shape, motion, and global layout tokens. Delete
unchanged declarations to inherit their canonical values. Review semantic
foreground/background pairs and the `prefers-contrast` overrides whenever the
palette changes.

The template intentionally has no committed `.min.css` counterpart because it
is an editable starting point rather than a finished distribution theme. The
maintainer build validates its syntax, license banner, and canonical import.

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
  --fb-color-primary: #3dcdda;
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

For a reusable complete theme, start from
[`framebase-theme-template.css`](framebase-theme-template.css). For a small
project-specific adjustment, override only the required tokens after the main
stylesheet:

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
`:has()`, logical properties, dynamic viewport units, and `overflow: clip`.
The fully enhanced compatibility target is:

| Browser | Minimum target | Evidence level |
| --- | ---: | --- |
| Chrome / Chromium | 114 | Feature-derived; Chromium 151 automated |
| Microsoft Edge | 114 | Feature-derived |
| Mozilla Firefox | 125 | Feature-derived; Firefox 153 automated |
| Apple Safari | 17 | Feature-derived; Playwright WebKit 26.5 automated |

The repository uses Playwright 1.62.1 to run structural, responsive, keyboard,
accessibility, theme, RTL, dialog, details, native-control, and progressive
popover checks in Chromium 151, Firefox 153, and WebKit 26.5. Visual regression
screenshots remain Chromium-only and use operating-system-specific baselines
because text rasterization and system monospace metrics differ between Windows
and Ubuntu. WebKit coverage is direct engine coverage; Safari 17 remains a
feature-derived product target rather than a claim that Safari itself ran in CI.
WebKit skip-link focus is checked directly because Safari-style full-keyboard
link navigation is a host preference; disclosure and dialog keyboard behavior
are still exercised through keyboard input.

`color-mix()` and `:has()` are progressive visual enhancements. Without them,
semantic content and native states remain usable but some derived backgrounds
and parent-aware accents are omitted. The Popover API is optional: use native
`details` or consumer behavior for older engines. Native `dialog` is the
recommended modal and drawer foundation. No legacy polyfills are bundled.
See [`docs/browser-support.html`](docs/browser-support.html) for the tested
matrix and fallback details.

## Versioning

FrameBaseCSS follows Semantic Versioning. Additive components and tokens are
minor changes; compatible defect corrections are patches; removing or renaming
classes, tokens, package exports, or required markup is major. Public
deprecations remain for at least one complete minor release when a safe alias
is possible. See [`VERSIONING.md`](VERSIONING.md) and
[`CHANGELOG.md`](CHANGELOG.md).

## Maintainer build

The readable stylesheets are the canonical sources. Maintainer tooling requires
Node.js 20.19 or newer. Their `.min.css`
counterparts are generated distribution assets and must not be edited by hand.

```powershell
npm ci
npx playwright install chromium firefox webkit
npm run build
npm run build:css
npm run check
npm run check:css
npm run test:html
npm run test:a11y
npm run test:visual
```

`build:css` regenerates all four minified stylesheets. `check:css` performs a
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

Chromium owns the visual baselines; Firefox and WebKit execute the non-visual
browser contracts. `playwright.config.mjs` defaults to normal motion and the
suite separately verifies `prefers-reduced-motion: reduce`. Screenshot capture
disables animations, hides the caret, waits for stable local layout, and uses a
`0.01` pixel-difference ratio. Baselines are suffixed with `-win32` or `-linux`.

To review an intentional visual change, run `npm run test:visual`, inspect each
expected/actual/diff image in `test-results`, and update only the current
platform with `npm run test:browser:update`. Never copy an unreviewed baseline
between operating systems or increase the tolerance to conceal a regression.

## Continuous integration

The `CSS distribution` workflow runs on pushes and pull requests with
read-only repository permissions. It installs the exact lockfile dependency
set and pinned Chromium, Firefox, and WebKit browsers, then runs
`npm run check`. Stale generated
assets, invalid HTML, axe violations, visual regressions, missing release files,
or inconsistent package metadata fail the job. Browser diagnostics are uploaded
only after failure. The workflow never edits the repository or creates commits.

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
- `framebase-theme-template.css`: validated editable starter for custom themes.
- `framebase-themes.css` and `framebase-themes.min.css`: dark/light/auto token controller.
- `framebase-highlight.css`: optional Highlight.js output theme.
- `framebase-highlight.min.css`: generated minified Highlight.js theme.
- `framebase-light-demo.html`: offline light-theme visual check.
- `docs/`: focused component, theme, accessibility, browser, and RTL documentation.
- `scripts/build-css.mjs`: deterministic CSS build and verification script.
- `scripts/check-release.mjs`: required release-file and package metadata checks.
- `scripts/serve-static.mjs`: local-only static server for browser tests.
- `tests/`: Playwright, axe, responsive, state, and visual regression coverage.
- `package.json` and `package-lock.json`: pinned maintainer tooling.
- `.github/workflows/css-distribution.yml`: generated-asset CI verification.
- `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `VERSIONING.md`: project governance.
- `.nojekyll`: static GitHub Pages publishing without Jekyll transforms.
- `.gitignore`: excludes local npm installation artifacts.
- `LICENSE`: MIT license terms and copyright notice.
- `CODE_INDEX.md`: technical repository map.
