"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { practiceAreas } from "@/content/practice-areas";
import { Button } from "@/components/ui/button";

const areaNames = practiceAreas.map((a) => a.title).sort();

const field =
  "w-full min-w-0 rounded-[2px] border border-black/12 bg-field p-3.5 text-[15px] leading-[normal] text-ink placeholder:text-ink-helper focus:border-crimson focus:outline-none";

// TODO: send enquiries to the firm (email service or CRM) instead of only
// showing the success state.
export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [area, setArea] = useState("");
  const [areaOpen, setAreaOpen] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  // Close the practice-area menu on an outside click.
  useEffect(() => {
    if (!areaOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!areaRef.current?.contains(e.target as Node)) setAreaOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [areaOpen]);

  if (submitted) {
    return (
      <div
        role="status"
        className="flex min-h-[440px] flex-col items-center justify-center gap-4 text-center"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-crimson text-white">
          <Check size={32} strokeWidth={2.5} />
        </span>
        <h3 className="m-0 font-serif text-[1.6rem]">Thank you</h3>
        <p className="m-0 max-w-[34ch] text-muted-foreground">
          We’ve received your request. A member of our team will be in touch
          within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex min-w-0 flex-col gap-4"
    >
      {/* Email and phone share a row only when each can be ≥180px wide. */}
      <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <input
          required
          name="name"
          autoComplete="name"
          aria-label="Full name"
          placeholder="Full name"
          className={cn(field, "col-span-full")}
        />
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          aria-label="Email"
          placeholder="Email"
          className={field}
        />
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          aria-label="Phone"
          placeholder="Phone"
          className={field}
        />
      </div>

      <div ref={areaRef} className="relative min-w-0">
        <input type="hidden" name="practiceArea" value={area} />
        <button
          type="button"
          onClick={() => setAreaOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={areaOpen}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3.5 text-left text-[15px] leading-[normal] transition-colors duration-200",
            areaOpen ? "border-crimson" : "border-black/15",
            area ? "text-ink" : "text-[#8a8a8a]"
          )}
        >
          <span>{area || "Select a practice area…"}</span>
          <ChevronDown
            size={18}
            strokeWidth={2.5}
            className={cn(
              "text-crimson transition-transform duration-200",
              areaOpen && "rotate-180"
            )}
          />
        </button>
        {areaOpen && (
          <div
            role="listbox"
            aria-label="Practice area"
            className="absolute top-[calc(100%+6px)] right-0 left-0 z-30 max-h-[264px] overflow-y-auto rounded-[10px] border border-black/10 bg-white p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,.28)]"
          >
            {areaNames.map((name) => {
              const selected = name === area;
              return (
                <button
                  key={name}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setArea(name);
                    setAreaOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-md px-3 py-[11px] text-left text-[14.5px] transition-colors hover:bg-black/5",
                    selected ? "bg-[rgba(158,27,47,.1)] text-crimson" : "text-[#3a3a3a]"
                  )}
                >
                  <span>{name}</span>
                  {selected && <Check size={16} strokeWidth={3} className="text-crimson" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <textarea
        required
        name="message"
        rows={5}
        aria-label="How can we help you?"
        placeholder="How can we help you?"
        className={cn(field, "resize-y")}
      />
      <Button type="submit" size="full" className="cursor-pointer p-4">
        Book an appointment
      </Button>
      <p className="m-0 text-center text-[12.5px] text-ink-helper">
        Your enquiry is confidential and protected.
      </p>
    </form>
  );
}
