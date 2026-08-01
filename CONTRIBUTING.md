# Contributing to FrameBaseCSS

FrameBaseCSS accepts focused fixes, accessible component contracts, tests, and
documentation improvements. Keep the framework usable with semantic HTML and
without a required JavaScript runtime.

## Local setup

Requirements:

- Node.js 20.19 or newer;
- npm;
- Git.

```sh
npm ci
npx playwright install chromium firefox webkit
npm run check
```

## Source and generated CSS

Edit only the readable source files: `framebase.css`, `framebase-light.css`,
`framebase-highlight.css`, and `framebase-theme-template.css`. Never edit a
`.min.css` file directly. Run `npm run build:css` after source changes and commit
the regenerated distributions with the source.

## Component and token rules

- Prefix public component classes with `fb-` and utilities with `u-`.
- Prefer semantic HTML and native controls before ARIA or scripted substitutes.
- Use existing spacing, color, radius, control, and motion tokens before adding
  a new public token.
- Add only tokens that represent a reusable decision across components.
- Define component structure, variants, states, responsive behavior, required
  attributes, accessibility, and JavaScript responsibility in the docs.
- Preserve existing public classes and tokens unless the SemVer process in
  `VERSIONING.md` explicitly permits a breaking release.

## Tests

```sh
npm run test:html
npm run test:a11y
npm run test:visual
npm run check
```

Visual changes must be intentional. Inspect expected, actual, and diff images
before running `npm run test:browser:update`; never update snapshots merely to
silence a failure. Chromium owns the OS-specific `-win32` and `-linux`
baselines. Firefox and WebKit run the functional, responsive, keyboard, theme,
RTL, and accessibility contracts without duplicating screenshots. Tests block
the optional Highlight.js CDN request, disable animation, hide the caret, wait
for stable local layout, and use a strict `0.01` difference ratio.

## Accessibility

New interactive contracts must cover keyboard behavior, visible focus, native
disabled states, accessible names, semantic state attributes, contrast, reduced
motion, and narrow viewports. Consumer-owned JavaScript behavior must be stated
explicitly and must not be presented as functionality supplied by the CSS.

## Pull requests

Keep changes focused, update `CHANGELOG.md` under `Unreleased`, regenerate
minified files, update relevant `CODE_INDEX.md` entries, and include tests and
documentation for public contracts. The full `npm run check` command must pass.
