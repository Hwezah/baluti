import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { site } from "@/content/site";
import { footerPracticeAreas, practiceAreaHref } from "@/content/practice-areas";
import { Wordmark } from "@/components/site/primitives";

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our People", href: "/people" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

// Placeholder profile links until the firm's accounts are confirmed.
const socials = ["in", "X", "f", "YT"];

const heading =
  "m-0 mb-[18px] text-sm font-semibold tracking-[.06em] text-white uppercase";
const list =
  "flex flex-col items-center gap-[11px] text-[14.5px] min-[800px]:items-stretch";
const link = "text-white/62 hover:text-crimson";

/**
 * ≥800px: four columns. Below that, a single centred column in portrait or
 * two columns in landscape, with the Company column hidden and the booking
 * button spanning the full row.
 */
export function SiteFooter() {
  return (
    <footer className="gutter bg-ink pt-[clamp(56px,6vw,84px)] text-white/62">
      <div className="site-container grid grid-cols-1 gap-x-11 gap-y-10 border-b border-white/10 pb-[52px] text-center landscape:max-[799px]:grid-cols-2 min-[800px]:grid-cols-4 min-[800px]:text-left">
        <div className="col-span-full min-[800px]:col-span-1">
          <div className="mb-5">
            <Wordmark subColor="text-white" />
          </div>
          <p className="m-0 mb-5 text-[14.5px]">
            Applying law to facts. Caring, dedicated representation for
            individuals and businesses across Uganda and the region.
          </p>
          <div className="m-0 mb-[22px] text-sm leading-[1.7] text-white/50">
            {site.address.short}
            <br />
            {site.hours.compact}
          </div>
          <div className="flex justify-center gap-3 min-[800px]:justify-start">
            {socials.map((s) => (
              <Link
                key={s}
                href="/"
                aria-label={s}
                className="flex size-[38px] items-center justify-center rounded-[2px] border border-white/18 text-xs font-semibold text-white/70 hover:border-crimson hover:text-crimson"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden min-[800px]:block">
          <h4 className={heading}>Company</h4>
          <div className={list}>
            {companyLinks.map((l) => (
              <Link key={l.href} href={l.href} className={link}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className={heading}>Practice Areas</h4>
          <div className={list}>
            {footerPracticeAreas.map((a) => (
              <Link key={a.slug} href={practiceAreaHref(a.slug)} className={link}>
                {a.label}
              </Link>
            ))}
            <Link
              href="/practice-areas"
              className="mt-1 inline-flex items-center gap-1.5 font-semibold text-white hover:text-crimson"
            >
              View all areas <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div>
          <h4 className={heading}>Get in touch</h4>
          <div className={list}>
            {[...site.phones, ...site.emails].map((c) => (
              <a key={c.href} href={c.href} className={link}>
                {c.label}
              </a>
            ))}
            <BookButton className="mt-2 hidden self-start px-[22px] py-3 text-sm min-[800px]:inline-block" />
          </div>
        </div>

        <BookButton className="col-span-full block px-[22px] py-[15px] text-center text-[15px] min-[800px]:hidden" />
      </div>

      <div className="site-container flex flex-col items-center justify-center gap-3 pt-6 pb-[30px] text-center text-[13px] min-[800px]:flex-row min-[800px]:justify-between min-[800px]:text-left">
        <span>
          © Copyright {new Date().getFullYear()} Baluti &amp; Co. Advocates. All
          Rights Reserved.
        </span>
        <div className="flex gap-[22px]">
          <Link href="/" className={link}>
            Terms of Service
          </Link>
          <Link href="/" className={link}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

function BookButton({ className }: { className: string }) {
  return (
    <Link
      href="/contact"
      className={cn(
        "rounded-[2px] bg-white font-semibold text-ink hover:bg-crimson hover:text-white",
        className
      )}
    >
      Book an appointment
    </Link>
  );
}
