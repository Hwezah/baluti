"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Copy as C } from "@/components/site/copy";

const FAQ_COUNT = 5;

/** Single-open accordion; the first question starts open. */
export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="border-t border-black/14">
      {Array.from({ length: FAQ_COUNT }, (_, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-black/14">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              className="flex w-full cursor-pointer items-center justify-between gap-5 py-6 text-left"
            >
              <span className="font-serif text-[1.2rem] leading-[normal] font-semibold text-ink">
                <C id={`faq.${i}.q`} />
              </span>
              <span className="flex shrink-0 items-center text-ink">
                {isOpen ? <Minus size={24} /> : <Plus size={24} />}
              </span>
            </button>
            {isOpen && (
              <p
                id={`faq-${i}`}
                className="m-0 max-w-[70ch] pb-[26px] text-[15.5px] text-muted-foreground"
              >
                <C id={`faq.${i}.a`} />
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
