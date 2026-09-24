import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

import { clerkEnabled } from "@/lib/clerk";

// Every marketing page is public. To protect a route later, match it with
// createRouteMatcher and call `await auth.protect()` for it here.
// Without valid Clerk keys the site must still serve, so fall through.
export default clerkEnabled ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
