"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = [
  "future",
  "business",
  "legacy",
  "property",
  "reputation",
  "family",
  "investments",
];

const TYPE_MS = 95;
const HOLD_MS = 2200;
const ERASE_MS = 45;
const GAP_MS = 380;

/**
 * "Protecting your ___." — types each word, holds, erases and moves on.
 * The cycle restarts whenever the hero scrolls back into view.
 */
export function RotatingWord() {
  const [text, setText] = useState(WORDS[0]);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let index = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let wasOut = true;

    const type = (i: number) => {
      const word = WORDS[index % WORDS.length];
      setText(word.slice(0, i));
      timer =
        i < word.length
          ? setTimeout(() => type(i + 1), TYPE_MS)
          : setTimeout(() => erase(word.length), HOLD_MS);
    };
    const erase = (i: number) => {
      const word = WORDS[index % WORDS.length];
      setText(word.slice(0, i));
      if (i > 0) {
        timer = setTimeout(() => erase(i - 1), ERASE_MS);
      } else {
        index++;
        timer = setTimeout(() => type(0), GAP_MS);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (entry.isIntersecting) {
          if (wasOut) {
            wasOut = false;
            type(0);
          }
        } else {
          wasOut = true;
          setText("");
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <span className="whitespace-nowrap text-crimson italic">
      <span className="sr-only">future</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[0.82em] w-0.5 animate-caret bg-crimson align-baseline"
      />
    </span>
  );
}
