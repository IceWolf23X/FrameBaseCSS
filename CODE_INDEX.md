# FrameBaseCSS code index

Compact technical map of the project. Paths are relative to the repository
root.

## Sources

| Path | Role | Content and relationships |
| --- | --- | --- |
| `framebase.css` | Canonical source and public contract | Dependency-free monospace design system with a dark default theme. Defines `--fb-*` tokens, `.fb-*` layouts and components, and `.u-*` utilities under one namespaced contract. It is consumed directly by the documentation and imported by the light theme. |
| `framebase-light.css` | Official theme override | Imports `framebase.css` and redefines only the color scheme, semantic palette, and shadows. It does not duplicate component or layout rules. |
| `index.html` | GitHub Pages homepage and dark verification | Public static entry point using only `framebase.css`. Documents public HTML contracts and renders the same components in realistic public-site, dashboard, editorial, form, data, code, media, and responsive technical-documentation examples. |
| `framebase-light-demo.html` | Manual light verification | Structurally identical copy of `index.html`; only the `framebase-light.css` link and reciprocal switch back to the dark theme differ. Components contain no theme-specific markup. |
| `.nojekyll` | GitHub Pages configuration | Disables Jekyll transforms and publishes the static assets in the root of `main` directly. |
| `README.md` | Public entry point | Describes the goals, quick start, official themes, documentation path, customization model, browser requirements, and public file map. |

## `framebase.css` structure

1. Design tokens.
2. Reset, inheritance, and document base.
3. Typography.
4. General layouts.
5. Site shell and navigation.
6. Public pages.
7. Documentation layouts.
8. Content and action components.
9. Forms and native HTML controls.
10. Feedback, data, code, and media.
11. Secondary navigation and utilities.
12. Responsive behavior, user preferences, and print.

## Exclusions

The project contains no dependencies, build output, generated files, binary
assets, or vendored trees. Demonstration SVGs are embedded directly in the demo
to preserve offline operation.
