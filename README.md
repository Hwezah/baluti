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

## Still to do

- Replace the Unsplash placeholder photos and grey portrait placeholders with firm photography.
- Fill in the placeholder "Name" entries on the People pages.
- Wire the contact and newsletter forms to a backend (they currently show a success state only).
- Write full bodies for the five articles that only have an excerpt.
- Add real social profile, Terms and Privacy links in the footer.
