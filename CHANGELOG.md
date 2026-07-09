# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- First-party Plausible analytics proxy via Cloudflare Pages Functions, keeping
  the tracking script and event beacon same-origin so tracker blocklists that
  match the plausible.io domain do not block them.
- Mini-Travels route section with the Carding Mill Valley hike.
- Conventional Commits enforced via a shared `.githooks/commit-msg` hook.

### Removed

- Redundant `@commitlint` dev dependencies; commit-message linting is now
  handled by the shared hook.

[Unreleased]: https://github.com/stephen-masters/velostevie/commits/main
