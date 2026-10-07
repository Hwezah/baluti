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

/** Changes to a list of items (reviews, FAQs, services…). */
export type ListState = {
  /** Keys of items the client added, in order. */
  added: string[];
  /** Keys of items hidden from the site. */
  hidden: string[];
};

export type SiteTextFile = {
  /** id → text currently in effect (only ids that differ from the demo text). */
  texts: Record<string, string>;
  /** id → every change, oldest first, for revert / earlier versions. */
  history: Record<string, TextEntry[]>;
  /** list id → added and hidden items. */
  lists?: Record<string, ListState>;
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
  return { ...file, texts, history };
}

export function listState(file: SiteTextFile, list: string): ListState {
  return file.lists?.[list] ?? { added: [], hidden: [] };
}

function withList(file: SiteTextFile, list: string, state: ListState) {
  return { ...file, lists: { ...file.lists, [list]: state } };
}

/** Hide an item from the site, or (hidden: false) show it again. */
export function setItemHidden(
  file: SiteTextFile,
  list: string,
  key: string,
  hidden: boolean,
): SiteTextFile {
  const state = listState(file, list);
  const rest = state.hidden.filter((k) => k !== key);
  return withList(file, list, {
    ...state,
    hidden: hidden ? [...rest, key] : rest,
  });
}

/** Add an item: `texts` maps each of its text ids to the client's text. */
export function addItem(
  file: SiteTextFile,
  list: string,
  key: string,
  texts: Record<string, string>,
  at = new Date().toISOString(),
): SiteTextFile {
  let next = file;
  for (const [id, text] of Object.entries(texts)) {
    next = applyEdit(next, id, text, at);
  }
  const state = listState(next, list);
  return withList(next, list, { ...state, added: [...state.added, key] });
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
