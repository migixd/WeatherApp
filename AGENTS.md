# AGENTS.md

## Project status

Weather web app (React + Vite + OpenMeteo). Goal and API example requests are in `README.md`.

- The Vite app is **not scaffolded yet**: no `package.json`, no `src/`, no `.git` at repo root. Nothing to `npm install`/`npm run`. First step is `npm create vite@latest . -- --template react` (per README) — don't assume standard Vite scripts exist until then.
- `Plantilla-app-clima-HTML/` is a **static UI prototype only** (plain HTML using `x-dc` template syntax, e.g. `<sc-if>`/`{{ vals... }}`). It has no API logic — it is the visual reference for the final app, not code to port.
- `Plantilla-app-clima-HTML/_ds/` is generated design-system tooling (a cached "organic" system). Do not edit it. The styling rules below are distilled from it and apply to the real app.

## Spec-driven workflow

Big features are spec-driven via skills in `.agents/skills/`:

- `/spec` — clarifies requirements and writes `specs/NN-slug.md` (e.g. `01-foo.md`; states `Draft` / `In review` / `Approved` / `Implemented`, or Spanish equivalents). Run it **before writing code** for a feature.
- `/spec-impl NN-slug` — implements only specs whose state means **Approved/Aprobado**, on branch `spec-NN-slug`. Branch is auto-created unless `specs/.spec-config.yml` sets `AutoCreateBranch: false`. Note: this depends on git, but the repo currently has no `.git`.
- Match the language of existing specs/UI copy (Spanish so far).

## UI styling conventions (mirror the prototype)

- Use design tokens, never raw values: `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)`; fonts only Caprasimo (headings) / Figtree (body).
- Icons: Lucide. Buttons/pills use `border-radius: 999px`.
- Style interactive states explicitly (hover/pressed from the accent ramp, `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`) — don't leave browser defaults.

## Weather data

Two-step OpenMeteo flow: 1) geocoding search by city name → lat/lon; 2) forecast call for `current=temperature_2m`. Request `language=es`. Exact example URLs are in `README.md`.

## MCPs

This project uses the Playwright MCP. Any screenshots or files it generates must be placed inside the `.playwright-mcp` folder.

## Prototype features the app must reproduce

Home with default city + temp/condition, "Todas las ciudades" list, "Buscar y agregar", "Eliminar ciudad" (default city must not be deletable), "Ciudad predeterminada" (set default), "Ajustes" (settings, °C/°F toggle). City catalog seeded with Chihuahua cities.