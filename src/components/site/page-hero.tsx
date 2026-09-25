import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Breadcrumbs, Eyebrow, type Crumb } from "@/components/site/primitives";
import { Rings } from "@/components/site/rings";

/** Black page hero with breadcrumbs, eyebrow, H1 and intro. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  titleClassName = "max-w-[18ch]",
  className = "py-[clamp(56px,7vw,104px)]",
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  titleClassName?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "gutter relative overflow-hidden bg-ink text-white",
        className,
      )}
    >
      <Rings preset="dark" />
      <div className="site-container relative">
        <Breadcrumbs items={crumbs} className="mb-[22px]" />
        <Eyebrow rule className="mb-[22px]">
          {eyebrow}
        </Eyebrow>
        <h1
          className={cn(
            "m-0 mb-5 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] font-bold",
            titleClassName,
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "m-0 max-w-[60ch] text-[clamp(1.05rem,1.5vw,1.25rem)] text-white/74",
          )}
        >
          {intro}
        </p>
      </div>
    </section>
  );
}

/** Centred closing call to action used at the foot of most pages. */
export function CtaBand({
  title,
  body,
  children,
  className = "border-t border-black/8 bg-paper",
}: {
  title: string;
  body: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("gutter py-section-sm", className)}>
      <div className="mx-auto max-w-[820px] text-center">
        <h2 className="m-0 mb-5 font-serif text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.12] font-bold">
          {title}
        </h2>
        <p className="m-0 mb-8 text-base text-muted-foreground">{body}</p>
        {children}
      </div>
    </section>
  );
}
