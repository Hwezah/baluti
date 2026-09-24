"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Panel = "menu" | "contact" | null;

type SiteUIContextValue = {
  /** Which slide-over panel is open: the mobile menu or the contact panel. */
  panel: Panel;
  openPanel: (panel: Exclude<Panel, null>) => void;
  closePanel: () => void;
};

const SiteUIContext = createContext<SiteUIContextValue | null>(null);

export function SiteUIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);

  const openPanel = useCallback(
    (next: Exclude<Panel, null>) => setPanel(next),
    []
  );
  const closePanel = useCallback(() => setPanel(null), []);

  // Lock page scroll and allow Escape to close while a panel is open.
  useEffect(() => {
    if (!panel) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  const value = useMemo(
    () => ({ panel, openPanel, closePanel }),
    [panel, openPanel, closePanel]
  );

  return (
    <SiteUIContext.Provider value={value}>{children}</SiteUIContext.Provider>
  );
}

export function useSiteUI() {
  const context = useContext(SiteUIContext);
  if (!context) {
    throw new Error("useSiteUI must be used within a SiteUIProvider");
  }
  return context;
}
