// Safe for client bundles: only reads public / build-time variables.

function toUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    return new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return undefined;
  }
}

/** Canonical site URL: explicit setting, then Vercel's production domain. */
export const siteUrl =
  toUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  toUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  new URL("https://baluti.co.ug");
