import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  SITE_TEXT_PATH,
  emptySiteText,
  isSiteTextFile,
  type SiteTextFile,
} from "@/lib/site-text";

// Where admin-panel saves go:
// - "github": committed to the repository through the GitHub API, which
//   makes Vercel redeploy the site with the new text.
// - "local":  written to the file on disk (`next dev` only), so the dev
//   server picks it up straight away.
// - "off":    not configured; the admin panel is read-only.

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
const repo =
  process.env.GITHUB_REPO ??
  (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : undefined);
/** Branch to commit to; defaults to the branch this deployment came from. */
const branch = process.env.GITHUB_BRANCH ?? process.env.VERCEL_GIT_COMMIT_REF;
const passcode = process.env.ADMIN_PASSCODE;
/** Override for GitHub Enterprise (or a test double). */
const apiBase = (
  process.env.GITHUB_API_URL ?? "https://api.github.com"
).replace(/\/$/, "");

export type PublishingMode = "github" | "local" | "off";

export function publishingMode(): PublishingMode {
  if (token && repo && passcode) return "github";
  if (process.env.NODE_ENV === "development") return "local";
  return "off";
}

/** What is missing for GitHub publishing, for the admin panel's setup note. */
export function missingSettings() {
  return [
    !token && "GITHUB_TOKEN",
    !repo && "GITHUB_REPO",
    !passcode && "ADMIN_PASSCODE",
  ].filter(Boolean) as string[];
}

export function passcodeRequired() {
  return publishingMode() === "github" || Boolean(passcode);
}

const digest = (value: string) => createHash("sha256").update(value).digest();

export function checkPasscode(given: string | null) {
  if (!passcode) return publishingMode() === "local";
  return given !== null && timingSafeEqual(digest(given), digest(passcode));
}

// ─── GitHub ────────────────────────────────────────────────────────────────

const api = (suffix = "") =>
  `${apiBase}/repos/${repo}/contents/${SITE_TEXT_PATH}${suffix}`;

const headers = () => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

export class StoreError extends Error {}

async function readFromGitHub(): Promise<{ file: SiteTextFile; sha?: string }> {
  const query = branch ? `?ref=${encodeURIComponent(branch)}` : "";
  const res = await fetch(api(query), {
    headers: headers(),
    cache: "no-store",
  });
  if (res.status === 404) return { file: emptySiteText() };
  if (!res.ok) {
    throw new StoreError(
      `GitHub read failed (${res.status}). Check GITHUB_TOKEN and GITHUB_REPO.`,
    );
  }
  const body = (await res.json()) as { content: string; sha: string };
  const parsed: unknown = JSON.parse(
    Buffer.from(body.content, "base64").toString("utf8"),
  );
  return {
    file: isSiteTextFile(parsed) ? parsed : emptySiteText(),
    sha: body.sha,
  };
}

async function writeToGitHub(
  file: SiteTextFile,
  sha: string | undefined,
  message: string,
) {
  const res = await fetch(api(), {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(`${JSON.stringify(file, null, 2)}\n`).toString(
        "base64",
      ),
      ...(sha ? { sha } : {}),
      ...(branch ? { branch } : {}),
    }),
  });
  return res;
}

// ─── Local file (next dev) ─────────────────────────────────────────────────

// Only used by `next dev`; kept out of production file tracing.
const localPath = () =>
  path.join(/*turbopackIgnore: true*/ process.cwd(), SITE_TEXT_PATH);

async function readFromDisk(): Promise<SiteTextFile> {
  try {
    const parsed: unknown = JSON.parse(await readFile(localPath(), "utf8"));
    return isSiteTextFile(parsed) ? parsed : emptySiteText();
  } catch {
    return emptySiteText();
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/** The latest saved text, including edits that are not live yet. */
export async function readSiteText(): Promise<SiteTextFile> {
  const mode = publishingMode();
  if (mode === "github") return (await readFromGitHub()).file;
  if (mode === "local") return readFromDisk();
  throw new StoreError("Saving is not set up.");
}

/** Apply `update` to the latest file and save it. Retries once on a conflict. */
export async function updateSiteText(
  update: (file: SiteTextFile) => SiteTextFile,
  message: string,
): Promise<SiteTextFile> {
  const mode = publishingMode();
  if (mode === "local") {
    const next = update(await readFromDisk());
    await writeFile(localPath(), `${JSON.stringify(next, null, 2)}\n`);
    return next;
  }
  if (mode !== "github") throw new StoreError("Saving is not set up.");

  for (let attempt = 0; attempt < 2; attempt++) {
    const { file, sha } = await readFromGitHub();
    const next = update(file);
    const res = await writeToGitHub(next, sha, message);
    if (res.ok) return next;
    // 409/422: the file changed since we read it (e.g. two quick saves).
    if (res.status !== 409 && res.status !== 422) {
      throw new StoreError(
        `GitHub save failed (${res.status}). Check that GITHUB_TOKEN can write to ${repo}.`,
      );
    }
  }
  throw new StoreError(
    "Another save happened at the same time. Please try again.",
  );
}
