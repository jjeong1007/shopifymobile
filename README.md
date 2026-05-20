# Shopify Mobile Prototype

Web prototype built from Figma designs, shown in a **390×844** mobile frame (iPhone 13/14).

## Run locally

```bash
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) with the prototype centered in a phone-sized viewport.

## Deploy to GitHub Pages

Live URL: **https://jjeong1007.github.io/shopifymobile/**

Pushes to `main` auto-deploy via GitHub Actions. One-time setup in the repo on GitHub:

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions** (not “Deploy from branch”).
2. Push to `main` — the workflow builds `dist/` and publishes it.

If the site was blank before, it was serving raw source (`/src/main.tsx`) instead of the production build.

## Screens

- **/** — Welcome (Screen 25) with working Get started / Log in buttons
- **/email** — Email sign-in sheet (Screen 26) — shared by both flows
  - Real email input with validation
  - Continue with email (enabled when email is entered)
  - Social login buttons (prototype stubs)
  - Cancel returns to welcome
  - Footer toggles signup ↔ login mode
