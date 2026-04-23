# Velostevie

A personal cycling blog by Stephen Masters, built with [Hugo](https://gohugo.io) and the [Hinode](https://gethinode.com) theme.

## Prerequisites

- [Git](https://git-scm.com)
- [Go](https://go.dev/dl/)
- [Node.js](https://nodejs.org) (includes npm)

## Setup

Install dependencies and Hugo modules:

```bash
npm install && npm run mod:update
```

## Running locally

Start the development server:

```bash
npm run start
```

The site will be available at `http://localhost:1313`.

## Building for production

```bash
npm run build
```

Output is written to the `public/` directory.

## GitHub Actions build

`.github/workflows/deploy.yml` has been modified based on the assumption it is using a self-hosted runner.

On my mac, this can be found in: `/Users/stevie/dev/utils/actions-runner`

Start a shell in that directory and run: `./run-helper.sh run`

## Other commands

| Command | Description |
|---|---|
| `npm run start:prod` | Run dev server in production mode |
| `npm run mod:update` | Update Hugo modules and vendors |
| `npm run lint` | Lint scripts, styles, and markdown |
| `npm run upgrade` | Upgrade npm packages and Hugo modules |
