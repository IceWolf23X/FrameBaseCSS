# Versioning and compatibility

FrameBaseCSS follows Semantic Versioning for its public CSS and package
contracts.

## Patch releases

A patch fixes a defect without intentionally changing documented markup,
classes, tokens, package paths, or component behavior. Small accessibility and
browser corrections qualify when existing valid usage continues to work.

## Minor releases

A minor release adds backward-compatible classes, variants, tokens, assets, or
documentation contracts. Existing selectors and token meanings remain valid.

## Major releases

A major release may remove or rename a public class or token, change required
HTML structure, alter a package export, or redefine a documented state in a way
that requires consumer changes. Changes in normal CSS rendering count as
breaking when they violate a documented contract rather than merely fixing a
confirmed defect.

## Deprecation policy

Public classes and tokens are deprecated before removal whenever a safe alias is
possible. A deprecation remains for at least one complete minor release and is
recorded in the changelog and migration documentation. Renamed classes retain a
temporary selector alias; renamed tokens retain a fallback alias. Removal occurs
only in a major release. Newly introduced, unreleased contracts may be corrected
before their first release without a compatibility alias.
