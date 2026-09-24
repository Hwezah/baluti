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

# Commands

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm run lint`: ESLint
