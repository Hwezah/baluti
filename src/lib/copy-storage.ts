// Site text edits made in the admin panel, kept in this browser's
// localStorage (no database). Each text id keeps its full history so any
// earlier version, or the original demo text, can be restored.
//
// Exposed as an external store for React's useSyncExternalStore.

export type CopyEntry = {
  /** The submitted text, or null for "reverted to the demo text". */
  text: string | null;
  /** ISO timestamp. */
  at: string;
};

export type CopyHistory = Record<string, CopyEntry[]>;

const STORAGE_KEY = "baluti-site-text-v1";
const MAX_ENTRIES = 30;
const EMPTY: CopyHistory = {};

let cache: CopyHistory | null = null;
const listeners = new Set<() => void>();

function read(): CopyHistory {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as CopyHistory) : {};
  } catch {
    // Storage blocked (private mode, disabled cookies) or corrupt.
    return {};
  }
}

function write(next: CopyHistory) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep the in-memory copy so the session still works.
  }
  listeners.forEach((l) => l());
}

export const copyStorage = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    // Another tab saved a change.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        cache = read();
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot(): CopyHistory {
    if (cache === null) cache = read();
    return cache;
  },
  getServerSnapshot(): CopyHistory {
    return EMPTY;
  },
  /** Record new text for an id (null reverts to the demo text). */
  push(id: string, text: string | null) {
    const history = copyStorage.getSnapshot();
    const entries = [
      ...(history[id] ?? []),
      { text, at: new Date().toISOString() },
    ];
    write({ ...history, [id]: entries.slice(-MAX_ENTRIES) });
  },
  /** Replace everything, e.g. when importing a saved file. */
  replaceAll(next: CopyHistory) {
    write(next);
  },
  isAvailable() {
    try {
      const probe = "__baluti_probe__";
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  },
};

/** The text currently in effect for an id, or undefined for the demo text. */
export function currentText(history: CopyHistory, id: string) {
  const entries = history[id];
  const last = entries?.[entries.length - 1];
  return last?.text ?? undefined;
}
