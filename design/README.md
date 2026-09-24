# Handoff: Baluti & Co. Advocates — marketing website

## Overview
Law-firm marketing site (Kampala, Uganda). 9 pages plus a shared header and footer. Founder: Emanuel Baluti, Founder & Principal Attorney.

## About the design files
Everything in `site/` is an **HTML design reference**: a working prototype that shows the intended look and behaviour, not production code. Rebuild it in the target stack (for example Next.js + Tailwind, Astro, or a WordPress theme) using that stack's normal patterns. Each `.dc.html` file opens directly when the folder is served (use `npx serve site`, not file://). All styling is inline, so exact values can be read straight from the markup.

## Fidelity
**High-fidelity.** Colours, type, spacing, copy and interactions are final. Match them exactly.

## Screenshots
Run `take-screenshots.mjs` (instructions at the top of the file). It saves full-page PNGs at 2x for every page into `screenshots/<breakpoint>/`:
- 390×844 mobile portrait
- 844×390 mobile landscape
- 1024×768 tablet
- 1440×900 desktop

## Breakpoints
Layout switches currently come from JS reading `window.innerWidth`. Use CSS media queries in the rebuild.
- **< 640px (mobile portrait):** single column; full-width buttons; hero practice-area pills spread edge to edge; **no photo in the home hero** (flat black).
- **640–899px (mobile landscape / small tablet):** single column; the home hero uses the library photo with an rgba(18,18,22,.74) overlay; standalone CTAs are min-width 280px.
- **≥ 900px (tablet/desktop):** multi-column grids; hero pills left-aligned; standalone CTAs are min-width 280px (not pills or side-by-side button pairs).
Fluid sizes use `clamp()` throughout. Copy those values as they are.

## Design tokens
**Colour**
- Crimson (primary): `#C8102E`
- Crimson dark (hover/pressed): `#97071F`
- Crimson light (hover on dark): `#E11B3C`
- Black (dark sections, ink text, footer): `#000000`
- White: `#FFFFFF`
- Form field background: `#F4F4F2`
- Muted text: `#5A6570`; helper text: `#7A838C`
- Hairlines: `rgba(0,0,0,.10–.12)` on light backgrounds; `rgba(255,255,255,.10–.22)` on black or crimson

**Type**
- Headings: **Roboto Serif** (Google Fonts, opsz 8–144, 400–700), weight 700, line-height 1.04–1.1
- Body/UI: **Figtree** 400/500/600/700
- Eyebrow: 12px, uppercase, letter-spacing .24em, weight 600, often preceded by a 34×1px rule
- Home H1: `clamp(2.6rem, 5.4vw, 4.6rem)`
- Section H2: `clamp(2rem, 3.8vw, 3.1rem)`
- Crimson CTA H2: `clamp(2.4rem, 6vw, 4rem)`

**Shape**
- Square corners everywhere (no border radius) except pills
- Buttons: solid crimson; or on crimson, a 1px white outline that turns into a white fill with crimson text on hover. Button labels are uppercase with .12em tracking and a .25s transition.

## Signature motif: concentric thin rings
Dark and crimson heroes, plus the home CTA, each carry three 1px circles that **share one centre**. Each circle uses `position:absolute; left:88%; top:6%; transform:translate(-50%,-50%); aspect-ratio:1; border-radius:50%`. Sizes are `min(Npx, Mvw)` in a fixed ratio (home hero: 900 / 620 / 340px). On black, the rings alternate faint white and crimson (.11 / .30 / .07). On crimson they are all white (.22 / .16 / .10). The rings are `aria-hidden`, use `pointer-events:none`, and the parent section has `overflow:hidden`.

## Red sections (used sparingly)
- Home "Need help?" CTA: full crimson with rings and an outlined white button
- Contact page hero: full crimson
Everything else is black and white with crimson accents.

## Interactions
- **Home hero rotating word:** "Protecting your ___." cycles through future → business → legacy → property → reputation → family → investments. Each word types at 95ms/char, holds for 2.2s, erases at 45ms/char and waits 380ms before the next. The word is crimson with a blinking caret. The cycle restarts when the hero scrolls back into view.
- **Header:** sticky; hamburger opens a full-screen menu on mobile.
- **Contact form:** name, email, phone, practice area (custom dropdown) and message. Submitting shows an inline success state. The form sits on a white card with padding `clamp(16px,2vw,24px)` and #F4F4F2 fields. Email and phone share a row only when each can be at least 180px wide. Grid tracks use `minmax(0,1fr)` and inputs use `width:100%; min-width:0`.

## Content
- Phones: the primary number (see footer) and +256 752 605 525
- Emanuel Baluti: emmanuel@baluti.co.ug. General enquiries: legal@baluti.co.ug
- The People page still has placeholder "Partner" entries waiting for real names and titles.

## Assets
Photos are Unsplash placeholders; their URLs are inline in the markup. Replace them with real firm photography. There is no logo file: the wordmark is live text ("BALUTI & Co." in Roboto Serif over a tracked "ADVOCATES").

## Files (site/)
Home, About, People, AttorneyBio, PracticeAreas, PracticeAreaDetail, Insights, Article, Contact, SiteHeader, SiteFooter (`.dc.html`). `index.html` is a copy of Home. `support.js` and `image-slot.js` are prototype runtime files and are **not needed** in the rebuild.
