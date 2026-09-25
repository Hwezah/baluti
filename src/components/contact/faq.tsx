"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqs = [
  {
    q: "Is the first consultation really free?",
    a: "Yes. Your initial consultation is free and confidential — it lets us understand your situation and lets you decide whether we’re the right fit, with no obligation.",
  },
  {
    q: "How quickly will someone respond?",
    a: "We aim to respond to every enquiry within one business day. Urgent matters are prioritised — please call us directly if the situation is time-sensitive.",
  },
  {
    q: "Which areas of law do you handle?",
    a: "We practise across eighteen areas, from banking and corporate matters to litigation, employment, family, and property law. If we’re not the right fit, we’ll point you in the right direction.",
  },
  {
    q: "Do you work with businesses as well as individuals?",
    a: "Absolutely. We advise individuals, growing businesses, and established institutions — tailoring our approach to the needs of each client.",
  },
  {
    q: "Is my enquiry kept confidential?",
    a: "Every enquiry is treated in strict confidence and protected. Your information is only ever used to help us advise you.",
  },
];

/** Single-open accordion; the first question starts open. */
export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="border-t border-black/14">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q} className="border-b border-black/14">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              className="flex w-full cursor-pointer items-center justify-between gap-5 py-6 text-left"
            >
              <span className="font-serif text-[1.2rem] leading-[normal] font-semibold text-ink">{faq.q}</span>
              <span className="flex shrink-0 items-center text-ink">
                {isOpen ? <Minus size={24} /> : <Plus size={24} />}
              </span>
            </button>
            {isOpen && (
              <p id={`faq-${i}`} className="m-0 max-w-[70ch] pb-[26px] text-[15.5px] text-muted-foreground">
                {faq.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
