# CLAUDE.md

## Project at a glance

This is **Velostevie** — a personal cycling blog by Stephen Masters. It is a Hugo static site using the [Hinode](https://gethinode.com) theme via Hugo Modules. Content is currently articles about cycling routes, starting with La Loire à Vélo (2024).

## Architecture

- **Content:** `content/articles/<year>/<series>/<date>_<slug>/index.md` — page bundles with YAML front matter.
- **Images:** `assets/images/articles/<year>/<series>/<slug>/` — referenced in content with root-relative `/images/...` paths.
- **Theme:** [Hinode](https://github.com/gethinode/hinode) via `go.mod` and `config/_default/hugo.toml` — no local layout overrides in `layouts/`.
- **Config:** `config/_default/` — `hugo.toml`, `params.toml`, `languages.toml`, `menus/`, etc.
- **Build output:** `public/` — generated, do not edit directly.

## Developer commands

```bash
npm install && npm run mod:update   # first-time setup
npm run start                       # local dev server at http://localhost:1313
npm run build                       # production build → public/
npm run mod:update                  # update Hugo modules
npm run lint                        # lint scripts, styles, markdown
```

## Content conventions

- Articles live at `content/articles/<year>/<series>/<YYYY-MM-DD>_<slug>/index.md`.
- Use **YAML front matter** (`---`) — existing content uses YAML throughout.
- Standard front matter fields: `date`, `title`, `tags`, `image`, `thumbnail.url`.
- Images are referenced with root-relative paths: `/images/articles/<year>/<series>/<slug>/filename.png`.
- Images are embedded using the Hinode `{{< image >}}` shortcode, e.g.:
  ```
  {{< image caption="Caption text"
  src="/images/articles/2024/loire-a-velo/lav_day_10/filename.png"
  ratio="4x3" wrapper="text-center" class="rounded col-6 col-md-6">}}
  ```
- For portrait images, add `portrait=true` to the shortcode.

## Guardrails

- Edit source files (`content/`, `config/`, `assets/`, `static/`) — never edit generated `public/` output.
- Before adding custom template overrides in `layouts/`, check whether the behaviour is configurable in `config/_default/params.toml` first.
- Keep `go.mod` and `config/_default/hugo.toml` module declarations in sync when touching theme dependencies.
- Images are stored under `assets/images/` (not `assets/img/` — the old AGENTS.md had this wrong).
