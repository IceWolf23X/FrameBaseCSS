# Changelog

All notable changes to FrameBaseCSS are documented in this file. The project
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and Semantic
Versioning as defined in [VERSIONING.md](VERSIONING.md).

## [Unreleased]

### Added

- Automated HTML validation, axe accessibility checks, and Playwright visual
  regression tests for dark, light, desktop, and mobile documentation states.
- Public package metadata, CSS subpath exports, release-readiness checks, and
  GitHub contribution templates.
- Loading, toast, dropdown, drawer, responsive-navigation, advanced-table,
  composite-input, icon, badge-overlay, timeline, stepper, and calendar
  presentation contracts.
- A token-only dark/light/auto theme controller and additional semantic color,
  motion, layering, and control-size tokens.
- Focused component, theme, accessibility, browser-support, and RTL pages.
- Maintainer, security, changelog, SemVer, issue, and pull-request guidance.

### Changed

- The navigation example now uses a native `nav` landmark around its link list.
- Dark-theme semantic colors were adjusted to meet WCAG AA contrast on raised
  surfaces.
- Direction-sensitive component geometry now uses logical properties; explicit
  `left` and `right` utilities remain intentionally physical.

### Fixed

- Missing table captions, repeated unnamed complementary landmarks, invalid
  ARIA labels, and duplicate form control names in both documentation demos.
- Non-modal popovers no longer apply a modal backdrop, grid stacks no longer
  stretch their children into unused height, and responsive table captions and
  row labels remain readable at narrow widths.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Security

- No security changes.

## [1.1.0] - 2026-07-31

### Added

- Canonical dark and light stylesheets, optional Highlight.js integration,
  editable theme template, deterministic minification, and public GitHub Pages
  documentation.

[Unreleased]: https://github.com/IceWolf23X/FrameBaseCSS/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/IceWolf23X/FrameBaseCSS/releases/tag/v1.1.0
