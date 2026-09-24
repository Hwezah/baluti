"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { insightCategories, insightHref, type Insight } from "@/content/insights";

/** Category filter chips plus the article card grid. */
export function InsightsBrowser({ articles }: { articles: Insight[] }) {
  const [category, setCategory] = useState("All");
  const visible =
    category === "All" ? articles : articles.filter((a) => a.category === category);

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2.5" role="group" aria-label="Filter by category">
        {insightCategories.map((label) => {
          const active = label === category;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setCategory(label)}
              aria-pressed={active}
              className={cn(
                "cursor-pointer rounded-full border px-[18px] py-[9px] text-[13.5px] font-medium",
                active
                  ? "border-ink bg-ink text-white"
                  : "border-black/20 bg-transparent text-muted-foreground hover:border-ink"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7 max-sm:grid-cols-1">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={insightHref(post.slug)}
            className="flex flex-col overflow-hidden border border-black/9 bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-24px_rgba(20,20,24,.4)]"
          >
            <div className="relative h-[230px] bg-[#EAEAEA]">
              <Image src={post.img} alt="" fill sizes="(min-width: 900px) 33vw, 100vw" className="object-cover" />
              <span className="absolute top-3.5 left-3.5 rounded-[3px] bg-crimson px-3 py-1.5 text-[11px] font-semibold tracking-[.1em] text-white uppercase">
                {post.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col px-6 pt-[22px] pb-6">
              <h3 className="m-0 mb-2.5 font-serif text-[1.22rem] leading-[1.3] font-semibold">
                {post.title}
              </h3>
              <p className="m-0 mb-auto text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="mt-3.5 text-[13px] text-ink-faint">
                {post.date} · {post.readTime}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
