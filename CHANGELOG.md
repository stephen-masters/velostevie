# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.3] - 2026-07-17

### Changed

- Document automated release pipeline in CLAUDE.md

## [2.0.2] - 2026-07-17

### Fixed

- Allow duplicate sibling headings so generated changelog passes MD024

## [2.0.1] - 2026-07-17

### Added

- Add automated changelog and release pipeline

### Changed

- Skip merge commits in git-cliff changelog config

## [2.0.0] - 2026-07-10

### Added

- Add GitHub Actions workflow for GitHub Pages deployment
- Add build-time-over-runtime architectural principle to CLAUDE.md
- Add Giscus comments to article pages
- Add MIT licence for code and copyright notice for content
- Add build-time watermark test using sharp
- Add header comments to all scripts; document scripts commenting rule
- Add content to CDM days 3, 6, 7, and 9; rename day 9 dinner image
- Add map marker hover preview (Variation A)
- Add Playwright tests for photo marker hover preview
- Add test to validate article front matter image references
- Add npm audit and Trivy security scanning workflow
- Add About page with custom layout and brand-voice content
- Add portrait photo support to About page per design handoff
- Add sass dev dependency for Dart Sass transpiler
- Add axe-core/playwright for a11y tests
- Add SEO improvements: meta tags, Open Graph, Twitter Cards, JSON-LD
- Add description front matter to all 25 day-report pages
- Add social links to footer
- Add social links to footer and About page
- Add navigation, tags, stats, 404, and accessibility improvements
- Adding route stats to frontmatter. This is to trigger the new feature to show a little stats block on route pages
- Adding route stats to frontmatter. This is to trigger the new feature to show a little stats block on route pages
- Add Plausible analytics (production-only)
- Add Mini-Travels route section with Carding Mill Valley hike; fix homepage hero lede
- Add shared commit-msg hook enforcing Conventional Commits
- Add CHANGELOG following Keep a Changelog format

### Changed

- Initial commit
- Initial commit
- Clean-up
- Updating .gitignore
- Continuing to add Loire content
- Initial content up to day 14
- Initial site build with github actions
- Working to fix npm dependencies causing issues in build
- Trying to fix build by copying my personal site
- Trying to fix build by copying my personal site
- Caching images
- Caching images
- Using self-hosted runner
- Using self-hosted runner
- Using self-hosted runner
- Using self-hosted runner
- Loire articles updated to align with new short codes.
- Fix map marker click-to-lightbox: use exifr full build for PNG support, decode URIs before comparing
- Replacing Loire a Velo images with new exports that have location metadata
- Re-exported images - now with location metadata
- Correcting image paths
- Removing Playwright step from the GitHub Actions. It was failing to launch a server and web browser to interact with the site, and that is okay with me. I can run those tests locally.
- Updating Node
- Fix broken images on GitHub Pages by enabling canonifyURLs
- Fix map markers and GPX routes broken on GitHub Pages
- Fix photo marker URLs using relURL instead of absURL
- Fix photo URLs: use path-relative input with absURL
- Switch deployment target from GitHub Pages to Cloudflare Pages
- Fix marker tooltip captions showing %20 instead of spaces
- Correcting date on article
- Update CLAUDE.md with deployment and URL gotchas from today
- Update baseURL to velostevie.com custom domain
- Migrate images to assets pipeline with build-time GPS and WebP processing
- Fix missing gallery params and update GPS check script
- Implementing copyright watermarks in Hugo asset pipeline
- Update README.md
- Fix stale static/ references in README and add watermark Playwright tests
- Fix all linting and get all tests passing
- Fix gpxmap test to work with canonifyURLs and run tests serially
- Fix dev server loading assets from production instead of localhost
- Update CLAUDE.md with canonifyURLs/dev config notes; fix flaky watermark test
- Update CLAUDE.md and README to document hover preview and lint fixes
- Update CLAUDE.md: order tests server-free first, browser tests last
- Corrected path to header and thumbnail image on CDM day 5
- Fix map marker tap on mobile — open lightbox on first tap
- Wire up portrait photo on About page
- Update About page with real content and portrait caption
- Derive nav and footer logo text from site title
- Fix CI build: run hugo via npm run build, not bare shell command
- Update trivy-action to v0.36.0
- Switch SCSS transpiler from dartsass to libsass
- Fix Dart Sass transpiler: use sass-embedded native binary via postinstall
- Force GitHub Actions to run on Node.js 24
- Update GitHub Actions to Node.js 24-native versions
- Replace comments with social sharing links on day pages
- Swap share buttons: Bluesky, Mastodon, Threads instead of Twitter/LinkedIn
- Use Tootpick for Mastodon sharing instead of mastodon.social/share
- Tweaking the about me text.
- Improving the about me info.
- Fix npm audit: resolve all 7 vulnerabilities
- Document Plausible analytics in CLAUDE.md
- Proxy Plausible through a first-party path to avoid tracker blocking
- Document Conventional Commits enforcement
- Manage git hooks with Lefthook (lint staged, build on push)

### Fixed

- Refine Mini-Travels 2026: fix about-page typo, add year to title, reorganise Carding Mill image paths

### Removed

- Remove Hinode references and clean up unused dependencies
- Remove redundant commitlint dev dependencies

[2.0.3]: https://github.com/stephen-masters/velostevie/compare/v2.0.2..v2.0.3
[2.0.2]: https://github.com/stephen-masters/velostevie/compare/v2.0.1..v2.0.2
[2.0.1]: https://github.com/stephen-masters/velostevie/compare/v2.0.0..v2.0.1
[2.0.0]: https://github.com/stephen-masters/velostevie/tree/v2.0.0

<!-- generated by git-cliff -->
