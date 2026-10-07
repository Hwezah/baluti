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
- **Keep red minimal** (client request, overrides the handoff): crimson only for the wordmark, the home hero's rotating word, the footer “Admin panel” pill, the admin panel’s active section in its side nav, the admin panel’s banner above each of its two lists, the active nav item, hover/focus states and thin accent rules (eyebrow rule, underline links, article quote/disclaimer edge, map pin). No red section backgrounds, buttons at rest, labels, numbers, tags or icons; use black/white/greys instead.
- `SiteUIProvider` (`src/context/site-ui-context.tsx`) owns the mobile menu and contact slide-over state.
- **All visible text is editable** through the admin panel (`/admin`, linked from the footer pill). Every string lives in `src/content/copy.ts` (sections with purpose/coverage notes, built partly from the other `src/content` files); pages render it with `<Copy id="…" />` (or `useCopy().t(id)` / `PhoneLink` / `EmailLink`) from `src/components/site/copy.tsx`. Never hard-code visible text in a page: add a field to the registry instead. The admin panel shows only client-owned text (`adminSections`, filtered by `isClientField`): firm facts, contact details, people and credentials, legal content, articles, reviews and promises. Menus, buttons, small labels, section headings and form hints match the `developerManaged` patterns in `copy.ts` and are edited in code; when adding a field, decide which it is and update the patterns if needed.
- **Client edits are committed to the repo**: `src/content/site-text.json` (`texts` + full `history`) overrides the demo text at build time. `POST /api/site-text` (passcode in `x-admin-passcode`) commits it via the GitHub API (`src/lib/site-text-store.ts`; needs `GITHUB_TOKEN` + `ADMIN_PASSCODE`, repo/branch default to Vercel's), which triggers a redeploy; in `next dev` it writes the file directly. No database by design. Don't hand-edit `site-text.json` while the client is editing; a short-lived localStorage "pending" layer (`src/lib/copy-storage.ts`) previews saves in the client's browser until the redeploy lands. SEO metadata, alt text and article categories are not editable. `DELETE /api/site-text` (passcode re-typed in the body) resets everything to the demo text.
- **Lists the client can hide items from or add to** (reviews, FAQs, milestones, careers reasons, credentials, representative work, practice-area services; hide-only for people and articles) are defined in `src/content/lists.ts`. `site-text.json` records `lists[id] = { added, hidden }`; added items get keys like `n1a2b3c` and their text lives in `texts` as `${prefix}.${key}.${part}`. Pages must render these lists with `visibleKeys(id)` / `shownPeople()` / `shownInsights()` / `isVisible()` rather than fixed counts or the raw content arrays. `POST /api/site-text` takes `{ op: "hide" | "show", list, key }` or `{ op: "add", list, values }`.
- **Admin tiers**: the panel opens on “Must check first” (`isEssentialField` / `mustCheck` in `copy.ts`: invented facts such as contact details, practice areas and services, people and credentials, figures, reviews, history, quotes, client promises, the disclaimer) and has a second “Fine-tuning” list for the rest; a search covers both.
- **Admin search**: `src/lib/smart-search.ts` (normalising, stemming, typo-tolerant, related-word families, weighted ranking, highlighting). No AI search by design.
- Photos are Unsplash placeholders; people named "Name" are placeholders awaiting real names.
