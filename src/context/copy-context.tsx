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
import { copyStorage, currentText, type CopyHistory } from "@/lib/copy-storage";

type CopyContextValue = {
  /** Text for an id: the latest edit from the admin panel, else the demo text. */
  t: (id: string) => string;
  history: CopyHistory;
};

const CopyContext = createContext<CopyContextValue | null>(null);

export function CopyProvider({ children }: { children: ReactNode }) {
  // The server (and first client render) uses the demo text; saved edits
  // from this browser are applied straight after hydration.
  const history = useSyncExternalStore(
    copyStorage.subscribe,
    copyStorage.getSnapshot,
    copyStorage.getServerSnapshot,
  );

  const t = useCallback(
    (id: string) => {
      const text = currentText(history, id) ?? copyDefaults[id];
      if (text === undefined) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[copy] Unknown text id "${id}"`);
        }
        return "";
      }
      return text.replaceAll("{year}", String(new Date().getFullYear()));
    },
    [history],
  );

  const value = useMemo(() => ({ t, history }), [t, history]);

  return <CopyContext.Provider value={value}>{children}</CopyContext.Provider>;
}

export function useCopy() {
  const context = useContext(CopyContext);
  if (!context) {
    throw new Error("useCopy must be used within a CopyProvider");
  }
  return context;
}
