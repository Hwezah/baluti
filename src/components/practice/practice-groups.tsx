"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getPracticeArea,
  practiceAreaHref,
  practiceGroups,
} from "@/content/practice-areas";

/**
 * Practice areas grouped under headings. Below 780px each group collapses
 * behind its heading (closed by default); above that every group is open.
 */
export function PracticeGroups() {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <div className="site-container flex flex-col gap-[clamp(48px,6vw,80px)]">
      {practiceGroups.map((group, i) => {
        const isOpen = !!open[i];
        const panelId = `practice-group-${i}`;
        return (
          <div key={group.name}>
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="mb-7 flex w-full cursor-pointer items-center justify-between gap-4 border-b border-black/14 pb-4 text-left text-ink min-[780px]:pointer-events-none min-[780px]:cursor-default"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold">
                  {group.name}
                </span>
                <span className="font-mono text-xs text-ink-faint">
                  {String(group.slugs.length).padStart(2, "0")}
                </span>
              </span>
              <ChevronDown
                size={20}
                strokeWidth={2.5}
                className={cn(
                  "text-ink transition-transform duration-250 min-[780px]:hidden",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <div
              id={panelId}
              className={cn(
                "grid-cols-1 gap-0.5 border border-black/10 bg-black/10 min-[780px]:grid min-[780px]:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]",
                isOpen ? "grid" : "hidden"
              )}
            >
              {group.slugs.map((slug) => {
                const area = getPracticeArea(slug)!;
                return (
                  <Link
                    key={slug}
                    href={practiceAreaHref(slug)}
                    className="flex min-h-[170px] flex-col bg-paper px-7 pt-7 pb-[30px] transition-[background-color,box-shadow] duration-300 hover:bg-white hover:shadow-[inset_0_-3px_0_#C8102E]"
                  >
                    <h3 className="m-0 mb-2.5 font-serif text-[1.22rem] leading-[1.25] font-semibold">
                      {area.title}
                    </h3>
                    <p className="m-0 mb-4 text-[14.5px] text-muted-foreground">
                      {area.summary}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                      Learn more <ArrowRight size={16} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
