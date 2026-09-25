@AGENTS.md

# Tech stack

Every Next.js project uses this stack. Follow it rather than adding alternatives.

- **Next.js** with the **App Router** (`src/app`), TypeScript, `@/*` → `src/*`
- **Tailwind CSS v4**: configured in CSS (`src/app/globals.css`), no `tailwind.config`
- **shadcn/ui**: add components with `npx shadcn@latest add <name>` (they go in `src/components/ui`); combine classes with `cn()` from `@/lib/utils`
- **Context API** for global client state: providers live in `src/context/`, each exporting a `XProvider` and a `useX()` hook that throws outside its provider; mount providers in `src/app/layout.tsx`
- **Clerk** (`@clerk/nextjs` v7 / Core 3) for auth:
  - Route protection lives in `src/proxy.ts` (Next 16 renamed `middleware.ts` to `proxy.ts`)
  - Use `<Show when="signed-in">` / `<Show when="signed-out">`. `SignedIn`/`SignedOut` were removed.
  - Server side: `auth()` / `currentUser()` from `@clerk/nextjs/server`
  - Clerk is optional: `clerkEnabled` (`src/lib/clerk.ts`, server-only) gates `ClerkProvider`, the proxy and the auth pages, so the site runs with no env vars. Never make a page depend on Clerk without that check.

# Commands

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm run lint`: ESLint

# This project: Baluti & Co. Advocates website

Marketing site for a Kampala law firm, rebuilt from the Claude Design handoff in `design/` (read `design/README.md`; the `.dc.html` files are the high-fidelity reference, so match their colours, type, spacing and copy).

- **Content** lives in `src/content/` (practice areas, people, insights, contact details). Pages read from there; don't hard-code copy that already exists in it.
- **Design tokens** are in `src/app/globals.css`: brand colours (`crimson`, `paper`, `sand`, `field`, `ink-*`), fonts (`font-serif` = Roboto Serif, `font-sans` = Figtree) and utilities `gutter`, `site-container`, `py-section`, `py-section-sm`, `eyebrow`, `no-scrollbar`.
- **Breakpoints** follow the handoff: `sm` = 640px, `md` = **900px** (overridden), `lg` = 1024px. Use CSS breakpoints, never JS width checks.
- **Shared pieces** are in `src/components/site/`: `PageHero`, `CtaBand`, `Rings` (the concentric-ring motif), `Eyebrow`, `Breadcrumbs`, `Wordmark`, `Silhouette`/`Avatar` (photo placeholders), `MaybeLink`.
- Buttons use the re-skinned shadcn `Button`: `primary` (black, for light backgrounds), `light` (white, for dark backgrounds), `ghost`, `ghostOnDark`, `outlineWhite`; size `cta` is the standalone CTA.
- **Keep red minimal** (client request, overrides the handoff): crimson only for the wordmark, the active nav item, hover/focus states and thin accent rules (eyebrow rule, underline links, article quote/disclaimer edge, map pin). No red section backgrounds, buttons at rest, labels, numbers, tags or icons; use black/white/greys instead.
- `SiteUIProvider` (`src/context/site-ui-context.tsx`) owns the mobile menu and contact slide-over state.
- Photos are Unsplash placeholders; people named "Name" are placeholders awaiting real names.
