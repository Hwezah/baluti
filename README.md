# Baluti & Co. Advocates

Marketing website for Baluti & Co. Advocates, Kampala. Built with Next.js (App Router), Tailwind CSS v4, shadcn/ui, the React Context API and Clerk.

## Getting started

```bash
cp .env.example .env.local   # add your Clerk keys
npm install
npm run dev
```

Open http://localhost:3000.

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
