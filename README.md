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

Pushes to `main` auto-deploy via GitHub Actions.

**Required:** In **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”). If you use “Deploy from branch”, the site serves raw source and stays blank.

Live URL: **https://jjeong1007.github.io/shopifymobile/**

If you still see a blank page after fixing settings, hard-refresh or clear cache on your phone (Safari: hold reload → “Request Desktop Website” off, then reload).

## Screens

- **/** — Welcome (Screen 25) with working Get started / Log in buttons
- **/email** — Email sign-in sheet (Screen 26) — shared by both flows
  - Real email input with validation
  - Continue with email (enabled when email is entered)
  - Social login buttons (prototype stubs)
  - Cancel returns to welcome
  - Footer toggles signup ↔ login mode
