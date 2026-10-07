// Text edits saved from the admin panel. They live in the repository
// (src/content/site-text.json), so they are built into the site like any
// other code and travel with it. The admin panel's save endpoint commits
// changes to that file, which triggers a redeploy.

import data from "@/content/site-text.json";

export type TextEntry = {
  /** The submitted text, or null for "reverted to the demo text". */
  text: string | null;
  /** ISO timestamp. */
  at: string;
};

export type SiteTextFile = {
  /** id → text currently in effect (only ids that differ from the demo text). */
  texts: Record<string, string>;
  /** id → every change, oldest first, for revert / earlier versions. */
  history: Record<string, TextEntry[]>;
};

/** Repository path of the file, relative to the project root. */
export const SITE_TEXT_PATH = "src/content/site-text.json";

const MAX_HISTORY = 30;

/** The edits this build of the site was made with. */
export const publishedText = data as SiteTextFile;

export function emptySiteText(): SiteTextFile {
  return { texts: {}, history: {} };
}

/** Return a new file with `text` recorded for `id` (null reverts it). */
export function applyEdit(
  file: SiteTextFile,
  id: string,
  text: string | null,
  at = new Date().toISOString(),
): SiteTextFile {
  const history = {
    ...file.history,
    [id]: [...(file.history[id] ?? []), { text, at }].slice(-MAX_HISTORY),
  };
  const texts = { ...file.texts };
  if (text === null) delete texts[id];
  else texts[id] = text;
  return { texts, history };
}

export function isSiteTextFile(value: unknown): value is SiteTextFile {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<SiteTextFile>;
  return (
    !!v.texts &&
    typeof v.texts === "object" &&
    !!v.history &&
    typeof v.history === "object"
  );
}
