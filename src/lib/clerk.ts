// Environment configuration. Everything here is optional: the marketing site
// must build and serve even when no variables are set (e.g. Vercel preview
// deployments), so missing or malformed values fall back instead of throwing.
// Server-only: import from the proxy, layouts and server pages.

/**
 * A Clerk key is `pk_test_…`/`pk_live_…` (or `sk_…`). Publishable keys encode
 * the Frontend API host followed by `$`, so placeholders like `pk_test_xxx`
 * are rejected here instead of crashing Clerk at request time.
 */
function isValidPublishableKey(key: string | undefined): key is string {
  const match = key?.match(/^pk_(test|live)_(.+)$/);
  if (!match) return false;
  try {
    return atob(match[2]).endsWith("$");
  } catch {
    return false;
  }
}

function isValidSecretKey(key: string | undefined): key is string {
  return /^sk_(test|live)_\w{10,}/.test(key ?? "");
}

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;

/**
 * Clerk is only switched on when both keys are present and well formed.
 * Server-only: the secret key is not available in client bundles.
 */
export const clerkEnabled =
  isValidPublishableKey(publishableKey) && isValidSecretKey(secretKey);

if (!clerkEnabled && (publishableKey || secretKey)) {
  console.warn(
    "[clerk] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY are missing or invalid; auth is disabled."
  );
}
