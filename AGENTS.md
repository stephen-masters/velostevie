# AGENTS.md

## Project at a glance
- This repo is a Hugo site for a cycling blog, with most behavior coming from the Hinode theme module (`go.mod`, `config/_default/hugo.toml`).
- Source content lives under `content/en/**`; rendered output is committed under `public/**`.
- There are no local custom layouts in `layouts/`; template behavior is inherited from `github.com/gethinode/hinode`.

## Architecture and boundaries
- **Content layer:** Markdown posts/pages in `content/en/**` with YAML front matter.
- **Presentation layer:** Hinode theme via Hugo Modules (`[[module.imports]] path = 'github.com/gethinode/hinode'`).
- **Asset layer:** Images used in posts are stored in `assets/img/**`; site-wide static files are in `static/**`.
- **Build artifacts:** `public/` and `resources/_gen/` are generated outputs (`.gitignore` marks them generated).

## Developer workflow (actual commands used here)
- Run locally: `hugo server`
- Validate config: `hugo config`
- Build/verify: `hugo --gc --minify`
- Refresh module deps: `hugo mod get`
- Re-vendor theme files (optional): `hugo mod vendor` (writes `_vendor/`)

## Content conventions to follow
- Blog posts are date-prefixed files under `content/en/blog/<year>/`, e.g. `content/en/blog/2024/2024-08-17_lav_day_00.md`.
- Post front matter consistently includes: `author`, `title`, `date`, `description`, `tags`, and nested `thumbnail.url` + `thumbnail.author`.
- Example thumbnail style from posts: `thumbnail.url: img/blog/2024/lav_day_10/IMG_9419.png` (no leading slash).
- In-body images are linked with root-relative `/assets/...`, e.g. `![...](/assets/img/blog/2024/lav_day_10/IMG_9415.png)`.
- Language config maps English content to `content/en` (`config/_default/languages.toml`), so new content should stay under that tree unless language config changes.

## Front matter / format details
- New content generated from `archetypes/default.md` starts with TOML front matter (`+++`), but existing content primarily uses YAML (`---`).
- Match the surrounding directory style when editing: in `content/en/blog/**`, keep YAML front matter for consistency.
- The home page content entry is `content/en/_index.md` and includes a `thumbnail` block used by theme components.

## Guardrails for AI edits
- Prefer editing source files (`content/`, `config/`, `assets/`, `static/`) rather than generated `public/` output.
- If changing theme behavior, first check whether it is configurable in `config/_default/params.toml` before introducing custom template overrides.
- Keep module declarations aligned between `go.mod` and `config/_default/hugo.toml` when touching theme dependencies.
