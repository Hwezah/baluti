import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";

import { cn } from "@/lib/utils";
import { isVisible, visibleKeys } from "@/content/lists";
import {
  footerPracticeAreas,
  practiceAreaHref,
} from "@/content/practice-areas";
import { Copy as C, EmailLink, PhoneLink } from "@/components/site/copy";
import { Wordmark } from "@/components/site/primitives";

const companyLinks = [
  { copyId: "footer.link.home", href: "/" },
  { copyId: "footer.link.about", href: "/about" },
  { copyId: "footer.link.people", href: "/people" },
  { copyId: "footer.link.insights", href: "/insights" },
  { copyId: "footer.link.contact", href: "/contact" },
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
            <C id="footer.blurb" />
          </p>
          <div className="m-0 mb-[22px] text-sm leading-[1.7] text-white/50">
            <C id="contact.address.short" />
            <br />
            <C id="contact.hours.compact" />
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
          <h4 className={heading}>
            <C id="footer.companyHeading" />
          </h4>
          <div className={list}>
            {companyLinks.map((l) => (
              <Link key={l.href} href={l.href} className={link}>
                <C id={l.copyId} />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className={heading}>
            <C id="footer.areasHeading" />
          </h4>
          <div className={list}>
            {footerPracticeAreas
              .filter((a) => isVisible("areas", a.slug))
              .map((a) => (
                <Link
                  key={a.slug}
                  href={practiceAreaHref(a.slug)}
                  className={link}
                >
                  <C id={`footer.area.${a.slug}`} />
                </Link>
              ))}
            <Link
              href="/practice-areas"
              className="mt-1 inline-flex items-center gap-1.5 font-semibold text-white hover:text-crimson"
            >
              <C id="footer.viewAll" /> <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div>
          <h4 className={heading}>
            <C id="footer.contactHeading" />
          </h4>
          <div className={list}>
            {visibleKeys("phones").map((k, i) => (
              <PhoneLink
                key={`p${i}`}
                id={`contact.phone.${k}`}
                className={link}
              />
            ))}
            {visibleKeys("emails").map((k, i) => (
              <EmailLink
                key={`e${i}`}
                id={`contact.email.${k}`}
                className={link}
              />
            ))}
            <BookButton className="mt-2 hidden self-start px-[22px] py-3 text-sm min-[800px]:inline-block" />
          </div>
        </div>

        <BookButton className="col-span-full block px-[22px] py-[15px] text-center text-[15px] min-[800px]:hidden" />
      </div>

      <div className="site-container flex flex-col items-center justify-center gap-3 pt-6 pb-[30px] text-center text-[13px] min-[800px]:flex-row min-[800px]:justify-between min-[800px]:text-left">
        <span>
          <C id="footer.copyright" />
        </span>
        <div className="flex flex-wrap items-center justify-center gap-[22px]">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-[7px] text-[13px] font-semibold text-white shadow-[0_6px_18px_-8px_rgba(200,16,46,.9)] hover:bg-crimson-light hover:text-white"
          >
            <PenLine size={14} aria-hidden="true" /> Admin panel
          </Link>
          <Link href="/" className={link}>
            <C id="footer.terms" />
          </Link>
          <Link href="/" className={link}>
            <C id="footer.privacy" />
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
        className,
      )}
    >
      <C id="footer.book" />
    </Link>
  );
}
