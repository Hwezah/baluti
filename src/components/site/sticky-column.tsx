"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Gap kept between the sticky header and a stuck column. */
const GAP = 24;

/**
 * The shorter column of a two-column section: from 900px it sticks below the
 * header while the taller column scrolls past. It only sticks while it fits
 * in the viewport, so its bottom is never hidden on short screens.
 * The parent grid must align this column to the start (`items-start`).
 */
export function StickyColumn({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "aside";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const header = document.getElementById("site-header-bars");
    const check = () => {
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      setFits(el.offsetHeight + headerHeight + GAP * 2 <= window.innerHeight);
    };
    // The observer fires once on observe, then on every size change of the
    // column or the header (whose top bar can wrap).
    const observer = new ResizeObserver(check);
    observer.observe(el);
    if (header) observer.observe(header);
    window.addEventListener("resize", check);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      data-fits={fits || undefined}
      className={cn("sticky-col", className)}
    >
      {children}
    </Tag>
  );
}
