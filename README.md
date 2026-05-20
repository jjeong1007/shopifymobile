# Shopify Mobile Prototype

Web prototype built from Figma designs, shown in a **390×844** mobile frame (iPhone 13/14).

## Run locally

```bash
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) with the prototype centered in a phone-sized viewport.

## Deploy to GitHub Pages

**Live URL (use this exact link):** https://jjeong1007.github.io/shopifymobile/

`https://jjeong1007.github.io/` alone will **not** work — the path must include `/shopifymobile/`.

Pushes to `main` auto-deploy via GitHub Actions.

**Required:** In **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”).

If the page looks blank on your phone, hard-refresh or open in a private tab to clear cache.

## Screens

- **/** — Welcome (Screen 25) with working Get started / Log in buttons
- **#/email** — Email sign-in sheet (Screen 26) — shared by both flows
