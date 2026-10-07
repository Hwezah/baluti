# Baluti & Co. Advocates

Marketing website for Baluti & Co. Advocates, Kampala. Built with Next.js (App Router), Tailwind CSS v4, shadcn/ui, the React Context API and Clerk.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are required.

## Environment variables

All optional; see `.env.example`.

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`: turn Clerk auth on. Both must be set and valid, otherwise auth stays off and the site still runs (`/sign-in` and `/sign-up` return 404). On Vercel, add them to every environment you deploy (Production **and** Preview) and redeploy, because `NEXT_PUBLIC_` values are baked in at build time.
- `NEXT_PUBLIC_SITE_URL`: canonical URL for metadata and share links. Defaults to the Vercel production domain, then `https://baluti.co.ug`.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/practice-areas`, `/practice-areas/[slug]` | Practice areas and detail |
| `/people`, `/people/[slug]` | People and attorney bio |
| `/insights`, `/insights/[slug]` | Insights and article |
| `/contact` | Contact form, details and FAQ |

Content (practice areas, people, articles, contact details) lives in `src/content/`. The original design handoff is in `design/`.

## Admin panel (editing the site text)

The coloured **Admin panel** pill in the footer opens `/admin`, which lists the text the client owns (firm and contact details, people and credentials, practice areas, articles, reviews, FAQs; menus, buttons and small headings stay in code, see `isClientField` in `src/content/copy.ts`) in sections that explain what each part is for and what it should cover. The client types a replacement under any text and presses **Save to site**. Every field keeps its history, so they can **undo the last save**, **revert to the demo text** or restore any earlier version. **Reset everything** (it asks for the passcode again, with a warning) wipes all edits and their history and puts the whole site back to the demo text; the repo's commit history still has the old text if it's ever needed.

**Search.** The search box forgives typos, accents, punctuation and word order, knows related words ("phone" finds "call", "lawyers" finds "advocates") and ranks the best matches first with the matching words highlighted (`src/lib/smart-search.ts`).

**Saving writes into the site's own code.** Each save is committed to `src/content/site-text.json` in this repository, and Vercel rebuilds the site (live for everyone in about 1–2 minutes; the client sees it immediately). There is no database: the text lives in the repo, so moving the code moves the text.

Setup (Vercel → Settings → Environment Variables, then redeploy):

| Variable | Value |
| --- | --- |
| `GITHUB_TOKEN` | A GitHub token with write access to this repo's contents |
| `ADMIN_PASSCODE` | The passcode the client types to unlock the admin panel |
| `GITHUB_REPO`, `GITHUB_BRANCH` | Optional; Vercel provides the repo and branch automatically |

Until these are set, the admin panel is read-only. In `npm run dev` it saves straight to the file on disk.

## Still to do

- Replace the Unsplash placeholder photos and grey portrait placeholders with firm photography.
- Fill in the placeholder "Name" entries on the People pages.
- Wire the contact and newsletter forms to a backend (they currently show a success state only).
- Write full bodies for the five articles that only have an excerpt.
- Add real social profile, Terms and Privacy links in the footer.
