"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { navLinks, site } from "@/content/site";
import { practiceAreaHref, practiceAreas } from "@/content/practice-areas";
import { useSiteUI } from "@/context/site-ui-context";
import { Wordmark } from "@/components/site/primitives";

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function Burger({ wide = false }: { wide?: boolean }) {
  return (
    <>
      <span
        className={cn("block h-0.5 bg-current", wide ? "w-[30px]" : "w-7")}
      />
      <span
        className={cn("block h-0.5 bg-current", wide ? "w-[30px]" : "w-7")}
      />
      <span
        className={cn("block h-0.5 bg-current", wide ? "w-[22px]" : "w-5")}
      />
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { panel, openPanel, closePanel } = useSiteUI();
  const [areasOpen, setAreasOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const barsRef = useRef<HTMLDivElement>(null);

  // Publish the header's real height (the top bar can wrap) as --header-h,
  // which sticky columns and anchor offsets use. The dropdown is excluded.
  useEffect(() => {
    const bars = barsRef.current;
    if (!bars) return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.ceil(bars.getBoundingClientRect().height)}px`,
      );
    });
    observer.observe(bars);
    return () => observer.disconnect();
  }, []);

  // A short delay lets the pointer travel from the trigger to the panel.
  const showAreas = () => {
    clearTimeout(closeTimer.current);
    setAreasOpen(true);
  };
  const hideAreas = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setAreasOpen(false), 150);
  };

  return (
    <div className="sticky top-0 z-60">
      <header className="relative border-b border-black/10 bg-paper/92 backdrop-blur-md">
        <div ref={barsRef} id="site-header-bars">
          {/* Top bar (desktop only) */}
          <div className="hidden bg-ink text-[13px] text-white/72 lg:block">
            <div className="gutter flex flex-wrap items-center justify-between gap-5 py-[9px]">
              <span className="tracking-[.02em]">
                {site.hours.weekdays} · {site.address.short}
              </span>
              <div className="flex flex-wrap items-center gap-[22px]">
                {site.emails.map((e) => (
                  <a
                    key={e.href}
                    href={e.href}
                    className="text-white/72 hover:text-white"
                  >
                    {e.label}
                  </a>
                ))}
                <span className="opacity-30">|</span>
                {site.phones.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    className="text-white/72 hover:text-white"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="gutter flex h-[74px] items-center justify-between gap-6">
            <Link
              href="/"
              aria-label="Baluti & Co. Advocates — home"
              className="text-ink"
            >
              <Wordmark />
            </Link>

            {/* Full navigation from 640px */}
            <nav className="hidden flex-nowrap items-center gap-[18px] sm:flex lg:gap-8">
              {navLinks.map((link) =>
                link.href === "/practice-areas" ? (
                  <div
                    key={link.href}
                    className="relative flex items-center gap-1"
                    onMouseEnter={showAreas}
                    onMouseLeave={hideAreas}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[15px] font-medium hover:text-crimson",
                        isCurrent(pathname, link.href)
                          ? "text-crimson"
                          : "text-ink",
                      )}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setAreasOpen((open) => !open)}
                      aria-label="Toggle practice areas menu"
                      aria-expanded={areasOpen}
                      className="flex cursor-pointer items-center p-1"
                    >
                      <ChevronDown
                        size={15}
                        strokeWidth={2.5}
                        className={cn(
                          "text-crimson transition-transform duration-250",
                          areasOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-[15px] font-medium whitespace-nowrap hover:text-crimson",
                      isCurrent(pathname, link.href)
                        ? "text-crimson"
                        : "text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <button
                type="button"
                onClick={() => openPanel("contact")}
                aria-label="Open contact panel"
                className="hidden cursor-pointer flex-col items-end gap-1.5 px-0.5 py-1.5 text-ink hover:text-crimson lg:flex"
              >
                <Burger wide />
              </button>
            </nav>

            {/* Drawer trigger below 640px */}
            <button
              type="button"
              onClick={() => openPanel("menu")}
              aria-label="Menu"
              className="flex cursor-pointer flex-col items-end gap-1.5 px-1 py-2 text-ink sm:hidden"
            >
              <Burger />
            </button>
          </div>
        </div>

        {areasOpen && (
          <div
            onMouseEnter={showAreas}
            onMouseLeave={hideAreas}
            className="hidden border-t border-black/10 bg-paper shadow-[0_24px_48px_-24px_rgba(20,20,24,.35)] sm:block"
          >
            <div className="gutter pt-7 pb-9">
              <div className="mb-4 text-xs font-semibold tracking-[.2em] text-crimson uppercase">
                Our Practice Areas
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-x-[30px] gap-y-0.5">
                {practiceAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={practiceAreaHref(area.slug)}
                    onClick={() => setAreasOpen(false)}
                    className="block border-b border-black/7 py-2.5 text-[15px] text-ink-body hover:text-crimson"
                  >
                    {area.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {panel === "menu" && (
        <MobileMenu pathname={pathname} onClose={closePanel} />
      )}
      {panel === "contact" && <ContactPanel onClose={closePanel} />}
    </div>
  );
}

function Overlay({
  onClose,
  label,
  className,
  children,
}: {
  onClose: () => void;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-80 animate-overlay-in bg-[rgba(10,10,12,.6)] backdrop-blur-[3px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute top-0 right-0 bottom-0 flex animate-sheet-in flex-col overflow-y-auto bg-ink shadow-[-30px_0_60px_-20px_rgba(0,0,0,.6)]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function MobileMenu({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <Overlay
      onClose={onClose}
      label="Menu"
      className="w-[min(380px,90vw)] px-[30px] pt-12 pb-[34px]"
    >
      <div className="mb-8 flex items-center justify-between">
        <Wordmark small subColor="text-white" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-11 cursor-pointer items-center justify-center text-white hover:text-crimson"
        >
          <X size={28} strokeWidth={1.6} />
        </button>
      </div>
      <nav className="flex flex-col">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "block py-2.5 text-left font-serif text-2xl font-semibold hover:text-crimson",
              isCurrent(pathname, link.href) ? "text-crimson" : "text-white/92",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-[30px]">
        <Link
          href="/contact"
          onClick={onClose}
          className="flex items-center justify-center gap-2 rounded-[2px] bg-crimson p-[15px] text-center text-[15px] font-semibold text-white hover:bg-crimson-light hover:text-white"
        >
          Free consultation
        </Link>
        <div className="mt-[22px] flex flex-col items-center gap-2.5 text-center text-sm">
          {[...site.phones, ...site.emails].map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="whitespace-nowrap text-white/70 hover:text-crimson"
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </Overlay>
  );
}

function ContactPanel({ onClose }: { onClose: () => void }) {
  const tile =
    "flex size-10 shrink-0 items-center justify-center rounded-[2px] bg-crimson text-white";
  const link = "text-[14.5px] text-white/80 hover:text-crimson";
  return (
    <Overlay
      onClose={onClose}
      label="Contact"
      className="w-[min(440px,92vw)] p-[clamp(28px,4vw,44px)] text-white"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="mb-5 flex size-[60px] cursor-pointer items-center justify-center self-end text-white hover:text-crimson"
      >
        <X size={40} strokeWidth={1.4} />
      </button>
      <div className="eyebrow mb-3.5">Need help?</div>
      <h2 className="m-0 mb-[30px] font-serif text-[clamp(2rem,4vw,2.6rem)] leading-[1.08] font-bold">
        Receive legal help today
      </h2>
      <div className="mb-[34px] flex flex-col gap-[22px]">
        <div className="grid grid-cols-[40px_1fr] items-center gap-3.5">
          <span className={tile}>
            <MapPin size={19} />
          </span>
          <span className="text-[14.5px] text-white/80">
            {site.address.line1}
            <br />
            {site.address.line2}
          </span>
        </div>
        <div className="grid grid-cols-[40px_1fr] items-center gap-3.5">
          <span className={tile}>
            <Phone size={19} />
          </span>
          <div className="flex flex-col gap-[3px]">
            {site.phones.map((p) => (
              <a key={p.href} href={p.href} className={link}>
                {p.label}
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[40px_1fr] items-center gap-3.5">
          <span className={tile}>
            <Mail size={19} />
          </span>
          <span className="flex flex-col">
            {site.emails.map((e) => (
              <a key={e.href} href={e.href} className={link}>
                {e.label}
              </a>
            ))}
          </span>
        </div>
        <div className="grid grid-cols-[40px_1fr] items-center gap-3.5">
          <span className={tile}>
            <Clock size={19} />
          </span>
          <span className="text-[14.5px] text-white/80">
            {site.hours.compact}
          </span>
        </div>
      </div>
      <Link
        href="/contact"
        onClick={onClose}
        className="flex items-center justify-center gap-2.5 rounded-[2px] bg-crimson p-4 text-[15px] font-semibold text-white hover:bg-crimson-light hover:text-white"
      >
        Free consultation <ArrowUpRight size={17} />
      </Link>
    </Overlay>
  );
}
