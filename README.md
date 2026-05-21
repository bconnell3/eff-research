# Edmonton Folk Music Festival 2026 — Artist Research

A live artist availability tracker built to predict the 2026 Edmonton Folk Music Festival lineup before it's announced.

## The Project

I used Claude (Anthropic's AI) to research tour schedules, routing patterns, and availability windows for 50+ artists across folk, indie, soul, and Americana — cross-referenced against the festival's Aug 6–9, 2026 dates. Each artist is tiered by likelihood:

- **★ Strong Picks** — open window + strong profile fit + strategic routing case
- **✓ Likely Available** — no conflicting dates found in public listings
- **? No Dates Announced** — unknown if touring; worth a direct inquiry
- **~ Partial / Logistics** — minor conflict or radius clause issue
- **✗ Conflict / N/A** — booked, on hiatus, or wrong profile

Data sourced from Ticketmaster, Songkick, JamBase, Live Nation, and Music Festival Wizard as of May 2026.

## How It Works

No build step. The HTML loads React and Babel from CDN, fetches `App.jsx` at runtime, and Babel transpiles the JSX in the browser. To run locally, open the folder in VS Code and use Live Server.

## Prediction Tracking

The official EFF 2026 lineup is expected to be announced in the coming weeks. I'll be updating the artist data as new tour dates are confirmed. Check back after the announcement to see how close the research got.

## Stack

- React 18 (UMD)
- Babel Standalone (browser-side JSX transpilation)
- No bundler, no build step
- Deployed via Netlify (auto-deploys on push to main)
