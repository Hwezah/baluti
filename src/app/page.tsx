import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";

import { values } from "@/content/site";
import {
  featuredPracticeAreas,
  getPracticeArea,
  practiceAreaHref,
} from "@/content/practice-areas";
import { homeAttorneys, personHref } from "@/content/people";
import { insightHref, insights } from "@/content/insights";
import { Button } from "@/components/ui/button";
import { RotatingWord } from "@/components/home/rotating-word";
import { MaybeLink } from "@/components/site/maybe-link";
import { Eyebrow, SectionHeader, Silhouette } from "@/components/site/primitives";
import { Rings } from "@/components/site/rings";

const HERO_IMG =
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80";

const whyUs = [
  {
    title: "Reviews",
    body: "Clients consistently recommend us to anyone needing a trusted advocate.",
    href: "#reviews",
  },
  {
    title: "About",
    body: "Our standard of excellence is fuelled by the desire to protect you.",
    href: "/about",
  },
  {
    title: "Careers",
    body: "We hire people who believe in caring, dedicated representation.",
    href: "/people#careers",
  },
  {
    title: "Contact",
    body: "Connect with us in person, by phone, by email, or 24/7 online.",
    href: "/contact",
  },
];

const stats = [
  { value: "35+", label: "Years of combined practice" },
  { value: "18", label: "Distinct practice areas" },
  { value: "40+", label: "Attorneys and staff" },
  { value: "1,000+", label: "Matters handled" },
];

const reviews = [
  {
    name: "Megan A.",
    location: "Kampala",
    quote:
      "I was nervous when I first called, but they were genuinely friendly and put me at ease. They handled everything with real care.",
  },
  {
    name: "James O.",
    location: "Entebbe",
    quote:
      "An amazing experience from start to finish. They kept me informed at every step, and I’ll happily refer my family and friends.",
  },
  {
    name: "Jonathan K.",
    location: "Jinja",
    quote:
      "Professional, responsive, and thorough. They explained my options in plain language and fought hard for the outcome I needed.",
  },
  {
    name: "Logan M.",
    location: "Kampala",
    quote:
      "I was very happy with the communication between counsel and myself throughout. I always knew exactly where things stood.",
  },
];

/** Horizontal swipe row below 900px, wrapping row above. */
const swipeRow =
  "-mx-4 flex snap-x snap-mandatory scroll-pl-4 flex-nowrap gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:flex-wrap md:gap-6 md:overflow-visible md:p-0";
const cardHover =
  "transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-24px_rgba(20,20,24,.4)]";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* 640–899px: library photo behind a dark overlay. */}
        <div className="absolute inset-0 hidden sm:block md:hidden">
          <Image src={HERO_IMG} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[rgba(18,18,22,.74)]" />
        </div>
        <Rings preset="home" />
        <div className="site-container relative grid min-h-[min(84vh,740px)] grid-cols-1 md:grid-cols-[1.05fr_1fr]">
          <div className="gutter flex animate-fade-up flex-col justify-center py-[clamp(48px,7vw,96px)]">
            <Eyebrow rule className="mb-[26px]">
              Baluti &amp; Co. Advocates
            </Eyebrow>
            <h1 className="m-0 mb-6 font-serif text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[1.04] font-bold tracking-[-.01em]">
              Defending your rights.
              <br />
              Protecting your <RotatingWord />.
            </h1>
            <p className="m-0 mb-[38px] max-w-[52ch] text-[clamp(1.02rem,1.4vw,1.2rem)] text-white/74">
              We respect our clients. We listen, engage, and care deeply —
              applying law to facts to deliver outcomes that stand.
            </p>
            <div className="flex flex-nowrap items-stretch gap-3.5">
              <Button asChild className="flex-[1_1_0] px-[18px] md:flex-none md:px-[30px]">
                <Link href="/people">
                  <span className="md:hidden">Our lawyers</span>
                  <span className="hidden md:inline">Meet our lawyers</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghostOnDark"
                className="flex-[1_1_0] px-[18px] md:flex-none md:px-[30px]"
              >
                <Link href="/practice-areas">
                  <span className="md:hidden">Practice areas</span>
                  <span className="hidden md:inline">Our practice areas</span>
                </Link>
              </Button>
            </div>
            <div className="no-scrollbar mt-10 flex w-full flex-nowrap justify-between gap-2 overflow-x-auto sm:w-auto sm:justify-start">
              {[
                { slug: "business", label: "Business" },
                { slug: "banking", label: "Banking", wide: "Banking & Financial" },
                { slug: "litigation", label: "Litigation" },
              ].map((chip) => (
                <Link
                  key={chip.slug}
                  href={practiceAreaHref(chip.slug)}
                  className="shrink-0 rounded-full border border-white/18 px-[15px] py-2 text-[13.5px] whitespace-nowrap text-white/82 hover:border-crimson hover:text-white"
                >
                  {chip.wide ? (
                    <>
                      <span className="md:hidden">{chip.label}</span>
                      <span className="hidden md:inline">{chip.wide}</span>
                    </>
                  ) : (
                    chip.label
                  )}
                </Link>
              ))}
            </div>
          </div>
          {/* ≥900px: photo column bleeding to the viewport edge. */}
          <div className="relative hidden min-h-[360px] overflow-hidden md:mr-[min(0px,calc(640px_-_50vw))] md:block">
            <Image
              src={HERO_IMG}
              alt="Law library"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHY HIRE US */}
      <section className="gutter bg-paper py-section">
        <div className="site-container">
          <div className="mb-12 max-w-[60ch]">
            <Eyebrow className="mb-3.5">Why hire us?</Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.1] font-bold">
              Our standard of excellence is fuelled by the desire to protect you
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:gap-0.5 md:border md:border-black/10 md:bg-black/10">
            {[whyUs.slice(0, 2), whyUs.slice(2)].map((row, r) => (
              <div
                key={r}
                className="no-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto md:gap-0.5 md:overflow-visible"
              >
                {row.map((card, i) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="flex min-h-[230px] flex-[0_0_82%] snap-start flex-col border border-black/12 bg-paper px-[26px] pt-8 pb-[30px] transition-[background-color,box-shadow] duration-300 hover:bg-white hover:shadow-[inset_0_-3px_0_#C8102E] md:flex-[1_1_0] md:border-0 md:px-8 md:pt-[38px] md:pb-[34px]"
                  >
                    <span className="mb-auto font-serif text-[22px] text-crimson">
                      0{r * 2 + i + 1}
                    </span>
                    <h3 className="m-0 mt-[22px] mb-3 font-serif text-[1.4rem] font-semibold">
                      {card.title}
                    </h3>
                    <p className="m-0 mb-4 text-[15px] text-muted-foreground">
                      {card.body}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                      Learn more <ArrowRight size={16} />
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS PREVIEW */}
      <section className="gutter bg-sand py-section">
        <div className="site-container">
          <SectionHeader
            eyebrow="What we do"
            title="Legal practice areas"
            link={{ label: "View all areas", href: "/practice-areas" }}
            className="mb-12"
          />
          <div className="-mx-[clamp(16px,4vw,40px)] flex snap-x snap-mandatory scroll-pl-[clamp(16px,4vw,40px)] gap-[26px] overflow-x-auto px-[clamp(16px,4vw,40px)] pb-3.5 [scrollbar-width:thin]">
            {featuredPracticeAreas.map((card) => {
              const area = getPracticeArea(card.slug)!;
              return (
                <Link
                  key={card.slug}
                  href={practiceAreaHref(card.slug)}
                  className={`flex w-[clamp(280px,80vw,320px)] shrink-0 snap-start flex-col overflow-hidden border border-black/9 bg-white ${cardHover}`}
                >
                  <div className="relative h-[200px] bg-[#EAEAEA]">
                    <Image src={card.img} alt="" fill sizes="320px" className="object-cover" />
                    <span className="absolute top-3.5 left-3.5 rounded-[3px] bg-crimson px-3 py-1.5 text-[11px] font-semibold tracking-[.1em] text-white uppercase">
                      {card.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-6 pt-[22px] pb-6">
                    <h3 className="m-0 mb-2.5 font-serif text-[1.25rem] leading-[1.25] font-semibold">
                      {area.title}
                    </h3>
                    <p className="m-0 mb-auto text-sm text-muted-foreground">
                      {area.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-crimson">
                      Learn more <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="gutter bg-ink py-section-sm text-white">
        <div className="mx-auto max-w-[1000px] text-center">
          <h2 className="m-0 mb-[30px] font-serif text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.18] font-semibold">
            We build trust, understand needs and provide solutions
          </h2>
          <Button asChild size="cta">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </section>

      {/* VALUES PREVIEW */}
      <section className="gutter bg-paper py-section">
        <div className="site-container grid grid-cols-1 items-start gap-[clamp(36px,5vw,72px)] md:grid-cols-[1fr_1.15fr]">
          <div>
            <Eyebrow className="mb-3.5">Our values</Eyebrow>
            <h2 className="m-0 mb-[22px] font-serif text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.12] font-bold">
              Fundamental principles that define our practice
            </h2>
            <p className="m-0 mb-7 max-w-[44ch] text-base text-muted-foreground">
              The way we work is shaped by a simple commitment: to treat every
              client, colleague, and matter with the care it deserves.
            </p>
            <Button asChild variant="dark" size="cta">
              <Link href="/about">Learn more about us</Link>
            </Button>
            <Silhouette
              label="team photo"
              className="mt-[34px] h-[280px] border border-black/12"
              head={{ top: "20%", width: "22%" }}
              body={{ bottom: "-14%", width: "42%" }}
            />
          </div>
          <div className="flex flex-col">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="grid grid-cols-[56px_1fr] gap-5 border-t border-black/14 py-[30px]"
              >
                <span className="font-serif text-[1.6rem] text-crimson">0{i + 1}</span>
                <div>
                  <h3 className="m-0 mb-2.5 font-serif text-[1.4rem] font-semibold">
                    {v.title}
                  </h3>
                  <p className="m-0 text-[15.5px] text-muted-foreground">{v.short}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATTORNEYS PREVIEW */}
      <section className="gutter bg-ink py-section text-white">
        <div className="site-container">
          <SectionHeader
            eyebrow="Our team"
            title="Meet our attorneys"
            link={{ label: "View all people", href: "/people" }}
            onDark
            className="mb-11"
          />
          <div className={swipeRow}>
            {homeAttorneys.map((person, i) => (
              <div key={i} className="flex-[0_0_72%] snap-start md:flex-[1_1_220px]">
                <MaybeLink href={personHref(person)} className="block w-full text-white">
                  <Silhouette
                    className="mb-[18px] h-[320px]"
                    head={{ top: "20%", width: "35%" }}
                    body={{ top: "52%", width: "80%" }}
                  />
                  <h3 className="m-0 mb-1 font-serif text-[1.3rem] font-semibold">
                    {person.name}
                  </h3>
                  <span className="text-[13px] font-semibold tracking-[.08em] text-crimson uppercase">
                    {person.role}
                  </span>
                </MaybeLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="gutter bg-sand py-section-sm">
        <div className="site-container">
          <div className="mb-[52px] text-center">
            <Eyebrow className="mb-3.5">Track record</Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.8rem,3.2vw,2.6rem)] font-bold">
              Results that speak for themselves
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-0.5 border border-black/12 bg-black/12 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            {stats.map((s) => (
              <div key={s.label} className="bg-sand px-[26px] py-11 text-center">
                <div className="mb-3 font-serif text-[clamp(2rem,3.6vw,2.9rem)] leading-none font-bold">
                  {s.value}
                </div>
                <div className="text-[14.5px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT REVIEWS */}
      <section id="reviews" className="gutter scroll-mt-24 bg-paper py-section">
        <div className="site-container">
          <div className="mb-11 max-w-[640px]">
            <Eyebrow className="mb-3.5">Client reviews</Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.1] font-bold">
              What our clients say about us
            </h2>
          </div>
          <div className={swipeRow}>
            {reviews.map((review) => (
              <div key={review.name} className="flex-[0_0_82%] snap-start md:flex-[1_1_280px]">
                <figure className="m-0 flex size-full flex-col border border-black/9 bg-white px-[30px] py-8">
                  <div className="mb-[18px] flex gap-[3px] text-crimson" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={16} fill="currentColor" strokeWidth={1} aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="m-0 mb-6 flex-1 font-serif text-[1.05rem] leading-[1.5] italic">
                    “{review.quote}”
                  </blockquote>
                  <figcaption className="flex items-center gap-3.5 border-t border-black/10 pt-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-crimson font-serif text-[1.1rem] font-semibold text-white">
                      {review.name[0]}
                    </span>
                    <div>
                      <div className="text-[14.5px] font-semibold">{review.name}</div>
                      <div className="text-[13px] text-ink-faint">{review.location}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSIGHTS PREVIEW */}
      <section className="gutter bg-sand py-section">
        <div className="site-container">
          <SectionHeader
            eyebrow="Insights"
            title="Latest news & insights"
            link={{ label: "View all", href: "/insights" }}
            className="mb-12"
          />
          <div className={swipeRow}>
            {insights.slice(0, 3).map((post) => (
              <div key={post.slug} className="flex-[0_0_84%] snap-start md:flex-[1_1_300px]">
                <Link
                  href={insightHref(post.slug)}
                  className={`flex size-full min-h-[220px] flex-col border border-black/9 bg-paper p-[30px] ${cardHover}`}
                >
                  <span className="mb-5 self-start rounded-full border border-[rgba(158,27,47,.4)] px-[11px] py-[5px] text-[11.5px] font-semibold tracking-[.12em] text-crimson uppercase">
                    {post.category}
                  </span>
                  <h3 className="m-0 mb-auto font-serif text-[1.22rem] leading-[1.3] font-semibold">
                    {post.shortTitle ?? post.title}
                  </h3>
                  <span className="mt-[22px] inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                    Read article <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gutter relative overflow-hidden bg-crimson py-[clamp(72px,9vw,124px)] text-white">
        <Rings preset="cta" />
        <div className="relative mx-auto max-w-[1000px]">
          <Eyebrow onCrimson className="mb-7">
            Need help?
          </Eyebrow>
          <h2 className="m-0 mb-[26px] max-w-[16ch] font-serif text-[clamp(2.4rem,6vw,4rem)] leading-[1.05] font-bold">
            Find your best fit out of top-notch lawyers.
          </h2>
          <p className="m-0 mb-[42px] max-w-[52ch] text-[clamp(1rem,1.4vw,1.15rem)] text-white/88">
            Contact us anytime for a consultation — available 24/7 online, and in
            person at our Ntinda chambers.
          </p>
          <Button
            asChild
            variant="outlineWhite"
            className="flex w-full gap-3 rounded-none px-[26px] py-[17px] sm:inline-flex sm:w-auto sm:min-w-[340px] sm:px-[34px] sm:py-[18px]"
          >
            <Link href="/contact">
              Request a consultation <ArrowUpRight size={17} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
