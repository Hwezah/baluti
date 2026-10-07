"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { copyDefaults } from "@/content/copy";
import { PENDING_TTL, pendingEdits } from "@/lib/copy-storage";
import { publishedText } from "@/lib/site-text";

type CopyContextValue = {
  /**
   * Text for an id: a just-saved edit that isn't live yet (this browser
   * only), else the published edit, else the demo text.
   */
  t: (id: string) => string;
};

const CopyContext = createContext<CopyContextValue | null>(null);

/** The text the published site shows for an id. */
export function publishedValue(id: string) {
  return publishedText.texts[id] ?? copyDefaults[id];
}

export function CopyProvider({ children }: { children: ReactNode }) {
  const pending = useSyncExternalStore(
    pendingEdits.subscribe,
    pendingEdits.getSnapshot,
    pendingEdits.getServerSnapshot,
  );

  const t = useCallback(
    (id: string) => {
      let text = publishedValue(id);
      const edit = pending[id];
      if (edit && Date.now() - edit.at < PENDING_TTL) {
        text = edit.text ?? copyDefaults[id];
      }
      if (text === undefined) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[copy] Unknown text id "${id}"`);
        }
        return "";
      }
      return text.replaceAll("{year}", String(new Date().getFullYear()));
    },
    [pending],
  );

  const value = useMemo(() => ({ t }), [t]);

  return <CopyContext.Provider value={value}>{children}</CopyContext.Provider>;
}

export function useCopy() {
  const context = useContext(CopyContext);
  if (!context) {
    throw new Error("useCopy must be used within a CopyProvider");
  }
  return context;
}
