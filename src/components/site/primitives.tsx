import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  rule = false,
  onCrimson = false,
  className,
}: {
  children: ReactNode;
  /** Precede the label with a 34×1px rule. */
  rule?: boolean;
  onCrimson?: boolean;
  className?: string;
}) {
  if (!rule) {
    return (
      <div className={cn("eyebrow", onCrimson && "text-white/85", className)}>
        {children}
      </div>
    );
  }
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "h-px w-[34px]",
          onCrimson ? "bg-white/70" : "bg-crimson",
        )}
      />
      <span className={cn("eyebrow", onCrimson && "text-white")}>
        {children}
      </span>
    </div>
  );
}

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  const muted = "text-white/55";
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("text-[13px]", muted, className)}
    >
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && <>&nbsp;/&nbsp; </>}
          {item.href ? (
            <Link href={item.href} className={muted}>
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-white">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** "BALUTI & Co." over a tracked "ADVOCATES" — the live-text wordmark. */
export function Wordmark({
  subColor = "text-ink",
  small = false,
}: {
  subColor?: string;
  small?: boolean;
}) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span
        className={cn(
          "border-b-[1.5px] border-crimson pb-[3px] font-serif font-bold tracking-[.01em] text-crimson",
          small ? "text-[19px]" : "text-[20px]",
        )}
      >
        BALUTI &amp; Co.
      </span>
      <span
        aria-label="Advocates"
        className={cn(
          "mt-1 flex justify-between font-semibold",
          small ? "text-[9.5px]" : "text-[10.5px]",
          subColor,
        )}
      >
        {"ADVOCATES".split("").map((letter, i) => (
          <span key={i} aria-hidden="true">
            {letter}
          </span>
        ))}
      </span>
    </span>
  );
}

type Blob = { top?: string; bottom?: string; width: string };

/**
 * Grey head-and-shoulders placeholder standing in for portraits and team
 * photos until real firm photography is supplied.
 */
export function Silhouette({
  head,
  body,
  label,
  avatar = false,
  className,
}: {
  head: Blob;
  body: Blob;
  label?: string;
  /** Round avatar tones (#D0D0D0 / #BEBEBE). */
  avatar?: boolean;
  className?: string;
}) {
  const blob = avatar ? "bg-[#BEBEBE]" : "bg-placeholder";
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        avatar
          ? "rounded-full bg-[linear-gradient(165deg,#EAEAEA,#D0D0D0)]"
          : "bg-[linear-gradient(165deg,#EAEAEA,#D8D8D8)]",
        className,
      )}
    >
      <div
        className={cn(
          "absolute left-1/2 aspect-square -translate-x-1/2 rounded-full",
          blob,
        )}
        style={head}
      />
      <div
        className={cn(
          "absolute left-1/2 aspect-square -translate-x-1/2 rounded-full",
          blob,
        )}
        style={body}
      />
      {label && (
        <span className="absolute right-3.5 bottom-3 font-mono text-[10.5px] tracking-[.08em] text-ink-faint">
          {label}
        </span>
      )}
    </div>
  );
}

/** Round portrait placeholder used for article authors and key contacts. */
export function Avatar({
  size,
  head = { top: "20%", width: "38%" },
  body = { bottom: "-20%", width: "70%" },
}: {
  size: number;
  head?: Blob;
  body?: Blob;
}) {
  return (
    <span className="shrink-0" style={{ width: size, height: size }}>
      <Silhouette avatar className="size-full" head={head} body={body} />
    </span>
  );
}

/** Section title row with a "View all" style underlined link on the right. */
export function SectionHeader({
  eyebrow,
  title,
  link,
  onDark = false,
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  link?: { label: string; href: string };
  onDark?: boolean;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-6",
        className,
      )}
    >
      <div>
        {eyebrow && <Eyebrow className="mb-3.5">{eyebrow}</Eyebrow>}
        <h2
          className={cn(
            "m-0 font-serif text-[clamp(1.9rem,3.4vw,2.9rem)] font-bold",
            titleClassName,
          )}
        >
          {title}
        </h2>
      </div>
      {link && (
        <UnderlineLink href={link.href} onDark={onDark}>
          {link.label}
        </UnderlineLink>
      )}
    </div>
  );
}

export function UnderlineLink({
  href,
  children,
  onDark = false,
}: {
  href: string;
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 border-crimson pb-1 text-sm font-semibold",
        onDark ? "text-white" : "text-ink",
      )}
    >
      {children}
    </Link>
  );
}
