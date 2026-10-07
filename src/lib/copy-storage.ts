// Edits saved from the admin panel take a minute or two to go live (they
// are committed to the repository and the site redeploys). Meanwhile this
// browser shows them straight away from this short-lived "pending" list,
// kept in localStorage. Entries stop applying once the published site
// contains them, or after PENDING_TTL as a safety net.
//
// Exposed as an external store for React's useSyncExternalStore.

export type PendingEdit = {
  /** The saved text, or null for "reverted to the demo text". */
  text: string | null;
  /** Epoch milliseconds. */
  at: number;
};

export type PendingEdits = Record<string, PendingEdit>;

const STORAGE_KEY = "baluti-site-text-pending-v1";
export const PENDING_TTL = 30 * 60 * 1000;
const EMPTY: PendingEdits = {};

let cache: PendingEdits | null = null;
const listeners = new Set<() => void>();

function read(): PendingEdits {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as PendingEdits) : {};
  } catch {
    return {};
  }
}

function write(next: PendingEdits) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the preview still works for this page view.
  }
  listeners.forEach((l) => l());
}

export const pendingEdits = {
  subscribe(listener: () => void) {
    listeners.add(listener);
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
  getSnapshot(): PendingEdits {
    if (cache === null) cache = read();
    return cache;
  },
  getServerSnapshot(): PendingEdits {
    return EMPTY;
  },
  set(id: string, text: string | null) {
    write({ ...pendingEdits.getSnapshot(), [id]: { text, at: Date.now() } });
  },
  /** Drop entries the published site already shows, or that are too old. */
  prune(isPublished: (id: string, text: string | null) => boolean) {
    const current = pendingEdits.getSnapshot();
    const now = Date.now();
    const next = Object.fromEntries(
      Object.entries(current).filter(
        ([id, edit]) =>
          now - edit.at < PENDING_TTL && !isPublished(id, edit.text),
      ),
    );
    if (Object.keys(next).length !== Object.keys(current).length) write(next);
  },
};
