"use client";

import { Check } from "lucide-react";

import { useCopy } from "@/context/copy-context";

/**
 * The services on a practice area page: one text per service (built-in
 * areas) or, for areas the client added, one text with a service per line.
 */
export function ServiceList({
  ids,
  linesId,
}: {
  ids?: string[];
  linesId?: string;
}) {
  const { t } = useCopy();
  const services = linesId
    ? t(linesId)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    : (ids ?? []).map((id) => t(id));

  return (
    <ul className="m-0 mb-11 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-0.5 border border-black/10 bg-black/10 p-0">
      {services.map((service, i) => (
        <li
          key={i}
          className="flex items-center gap-3.5 bg-paper px-6 py-[22px]"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black/6">
            <Check size={16} strokeWidth={2.6} className="text-ink" />
          </span>
          <span className="text-[15px] text-ink-body">{service}</span>
        </li>
      ))}
    </ul>
  );
}
