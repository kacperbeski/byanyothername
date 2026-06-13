# By Any Other Name — site

Next.js (App Router) + TypeScript + Framer Motion. Six real routes, all typography on black.

## Run it

```bash
cd site
npm install
npm run dev
```

Open http://localhost:3000. (Requires Node 18+. Production: `npm run build && npm start`, or deploy the `site/` folder to Vercel as-is.)

## Navigate

Arrow keys, scroll/swipe, the corner cues, or the text menu (top right).

- `/` Main — curtain, wordmark lights up, tagline floats. Scroll to push through into About.
- `/about` — the statement resolves from blur. Scroll back to return.
- `/services` ← right of center · `/clients` → left of center
- `/team` ↓ below center · `/contact` → right of Team
- Opposite direction undoes a move. Browser back/forward works.

## Swap in real assets later

- **Fonts:** placeholders are Cormorant Garamond (display serif) + Space Grotesk (labels), loaded in `app/layout.tsx`. Drop brand .woff2 files in `assets/fonts/` and switch to `next/font/local` there — one edit.
- **Wordmark:** currently set in type in `components/CenterScene.tsx`. Replace with the SVG when supplied.
- **Team photos:** `public/team/{craig,zach,kacper}.jpg` (B&W, generated from the screenshots you provided).
- **OG image / favicon:** `public/og.jpg` and `app/icon.svg` are placeholders.
- **Domain:** SEO URLs assume `https://byanyothername.com` (`app/layout.tsx`, `app/sitemap.ts`).

## Where things live

- `lib/stages.ts` — all copy (verbatim from BUILD-PROMPT), spatial map, per-route metadata
- `components/Theater.tsx` — stage navigation, transitions, keyboard/wheel/swipe input
- `components/CenterScene.tsx` — curtain, wordmark, Main→About focus pull
- `app/globals.css` — grain, vignette, all styling

`prefers-reduced-motion` gets plain cross-fades (no blur, curtain, jolt, or float).
