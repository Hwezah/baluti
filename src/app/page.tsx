import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";

import {
  featuredPracticeAreas,
  practiceAreaHref,
} from "@/content/practice-areas";
import { homeAttorneys, personHref } from "@/content/people";
import { insightHref, insights } from "@/content/insights";
import { Button } from "@/components/ui/button";
import { Copy as C } from "@/components/site/copy";
import { ReviewInitial } from "@/components/home/review-initial";
import { RotatingWord } from "@/components/home/rotating-word";
import { MaybeLink } from "@/components/site/maybe-link";
import {
  Eyebrow,
  SectionHeader,
  Silhouette,
} from "@/components/site/primitives";
import { Rings } from "@/components/site/rings";
import { StickyColumn } from "@/components/site/sticky-column";

const HERO_IMG =
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80";

const whyUsLinks = ["#reviews", "/about", "/people#careers", "/contact"];

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
          <Image
            src={HERO_IMG}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(18,18,22,.74)]" />
        </div>
        <Rings preset="home" />
        <div className="site-container relative grid min-h-[min(84vh,740px)] grid-cols-1 md:grid-cols-[1.05fr_1fr]">
          <div className="gutter flex animate-fade-up flex-col justify-center py-[clamp(48px,7vw,96px)]">
            <Eyebrow rule className="mb-[26px]">
              <C id="home.hero.eyebrow" />
            </Eyebrow>
            <h1 className="m-0 mb-6 font-serif text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[1.04] font-bold tracking-[-.01em]">
              <C id="home.hero.line1" />
              <br />
              <C id="home.hero.line2" /> <RotatingWord />.
            </h1>
            <p className="m-0 mb-[38px] max-w-[52ch] text-[clamp(1.02rem,1.4vw,1.2rem)] text-white/74">
              <C id="home.hero.body" />
            </p>
            <div className="flex flex-nowrap items-stretch gap-3.5">
              <Button
                asChild
                variant="light"
                className="flex-[1_1_0] px-[18px] md:flex-none md:px-[30px]"
              >
                <Link href="/people">
                  <span className="md:hidden">
                    <C id="home.hero.ctaPeopleShort" />
                  </span>
                  <span className="hidden md:inline">
                    <C id="home.hero.ctaPeople" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghostOnDark"
                className="flex-[1_1_0] px-[18px] md:flex-none md:px-[30px]"
              >
                <Link href="/practice-areas">
                  <span className="md:hidden">
                    <C id="home.hero.ctaAreasShort" />
                  </span>
                  <span className="hidden md:inline">
                    <C id="home.hero.ctaAreas" />
                  </span>
                </Link>
              </Button>
            </div>
            <div className="no-scrollbar mt-10 flex w-full flex-nowrap justify-between gap-2 overflow-x-auto sm:w-auto sm:justify-start">
              {[
                { slug: "business", label: "home.hero.chip.business" },
                {
                  slug: "banking",
                  label: "home.hero.chip.bankingShort",
                  wide: "home.hero.chip.banking",
                },
                { slug: "litigation", label: "home.hero.chip.litigation" },
              ].map((chip) => (
                <Link
                  key={chip.slug}
                  href={practiceAreaHref(chip.slug)}
                  className="shrink-0 rounded-full border border-white/18 px-[15px] py-2 text-[13.5px] whitespace-nowrap text-white/82 hover:border-crimson hover:text-white"
                >
                  {chip.wide ? (
                    <>
                      <span className="md:hidden">
                        <C id={chip.label} />
                      </span>
                      <span className="hidden md:inline">
                        <C id={chip.wide} />
                      </span>
                    </>
                  ) : (
                    <C id={chip.label} />
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
            <Eyebrow className="mb-3.5">
              <C id="home.why.eyebrow" />
            </Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.1] font-bold">
              <C id="home.why.title" />
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:gap-0.5 md:border md:border-black/10 md:bg-black/10">
            {[
              [0, 1],
              [2, 3],
            ].map((row, r) => (
              <div
                key={r}
                className="no-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto md:gap-0.5 md:overflow-visible"
              >
                {row.map((n) => (
                  <Link
                    key={n}
                    href={whyUsLinks[n]}
                    className="flex min-h-[230px] flex-[0_0_82%] snap-start flex-col border border-black/12 bg-paper px-[26px] pt-8 pb-[30px] transition-[background-color,box-shadow] duration-300 hover:bg-white hover:shadow-[inset_0_-3px_0_#C8102E] md:flex-[1_1_0] md:border-0 md:px-8 md:pt-[38px] md:pb-[34px]"
                  >
                    <span className="mb-auto font-serif text-[22px] text-ink-faint">
                      0{n + 1}
                    </span>
                    <h3 className="m-0 mt-[22px] mb-3 font-serif text-[1.4rem] font-semibold">
                      <C id={`home.why.${n}.title`} />
                    </h3>
                    <p className="m-0 mb-4 text-[15px] text-muted-foreground">
                      <C id={`home.why.${n}.body`} />
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                      <C id="common.learnMore" /> <ArrowRight size={16} />
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
            eyebrow={<C id="home.practice.eyebrow" />}
            title={<C id="home.practice.title" />}
            link={{
              label: <C id="common.viewAllAreas" />,
              href: "/practice-areas",
            }}
            className="mb-12"
          />
          <div className="-mx-[clamp(16px,4vw,40px)] flex snap-x snap-mandatory scroll-pl-[clamp(16px,4vw,40px)] gap-[26px] overflow-x-auto px-[clamp(16px,4vw,40px)] pb-3.5 [scrollbar-width:thin]">
            {featuredPracticeAreas.map((card) => {
              return (
                <Link
                  key={card.slug}
                  href={practiceAreaHref(card.slug)}
                  className={`flex w-[clamp(280px,80vw,320px)] shrink-0 snap-start flex-col overflow-hidden border border-black/9 bg-white ${cardHover}`}
                >
                  <div className="relative h-[200px] bg-[#EAEAEA]">
                    <Image
                      src={card.img}
                      alt=""
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                    <span className="absolute top-3.5 left-3.5 rounded-[3px] bg-ink px-3 py-1.5 text-[11px] font-semibold tracking-[.1em] text-white uppercase">
                      <C id={`home.practice.tag.${card.slug}`} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-6 pt-[22px] pb-6">
                    <h3 className="m-0 mb-2.5 font-serif text-[1.25rem] leading-[1.25] font-semibold">
                      <C id={`practice.${card.slug}.title`} />
                    </h3>
                    <p className="m-0 mb-auto text-sm text-muted-foreground">
                      <C id={`practice.${card.slug}.summary`} />
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                      <C id="common.learnMore" /> <ArrowRight size={16} />
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
            <C id="home.trust.title" />
          </h2>
          <Button asChild variant="light" size="cta">
            <Link href="/contact">
              <C id="home.trust.cta" />
            </Link>
          </Button>
        </div>
      </section>

      {/* VALUES PREVIEW */}
      <section className="gutter bg-paper py-section">
        <div className="site-container grid grid-cols-1 items-start gap-[clamp(36px,5vw,72px)] md:grid-cols-[1fr_1.15fr]">
          <StickyColumn>
            <Eyebrow className="mb-3.5">
              <C id="home.values.eyebrow" />
            </Eyebrow>
            <h2 className="m-0 mb-[22px] font-serif text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.12] font-bold">
              <C id="home.values.title" />
            </h2>
            <p className="m-0 mb-7 max-w-[44ch] text-base text-muted-foreground">
              <C id="home.values.body" />
            </p>
            <Button asChild size="cta">
              <Link href="/about">
                <C id="home.values.cta" />
              </Link>
            </Button>
            <Silhouette
              label="team photo"
              className="mt-[34px] h-[280px] border border-black/12"
              head={{ top: "20%", width: "22%" }}
              body={{ bottom: "-14%", width: "42%" }}
            />
          </StickyColumn>
          <div className="flex flex-col">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[56px_1fr] gap-5 border-t border-black/14 py-[30px]"
              >
                <span className="font-serif text-[1.6rem] text-ink-faint">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="m-0 mb-2.5 font-serif text-[1.4rem] font-semibold">
                    <C id={`values.${i}.title`} />
                  </h3>
                  <p className="m-0 text-[15.5px] text-muted-foreground">
                    <C id={`values.${i}.short`} />
                  </p>
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
            eyebrow={<C id="home.team.eyebrow" />}
            title={<C id="home.team.title" />}
            link={{ label: <C id="common.viewAllPeople" />, href: "/people" }}
            onDark
            className="mb-11"
          />
          <div className={swipeRow}>
            {homeAttorneys.map((key) => (
              <div
                key={key}
                className="flex-[0_0_72%] snap-start md:flex-[1_1_220px]"
              >
                <MaybeLink
                  href={personHref(key)}
                  className="block w-full text-white"
                >
                  <Silhouette
                    className="mb-[18px] h-[320px]"
                    head={{ top: "20%", width: "35%" }}
                    body={{ top: "52%", width: "80%" }}
                  />
                  <h3 className="m-0 mb-1 font-serif text-[1.3rem] font-semibold">
                    <C id={`person.${key}.name`} />
                  </h3>
                  <span className="text-[13px] font-semibold tracking-[.08em] text-white/55 uppercase">
                    <C id={`person.${key}.role`} />
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
            <Eyebrow className="mb-3.5">
              <C id="home.stats.eyebrow" />
            </Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.8rem,3.2vw,2.6rem)] font-bold">
              <C id="home.stats.title" />
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-0.5 border border-black/12 bg-black/12 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-sand px-[26px] py-11 text-center">
                <div className="mb-3 font-serif text-[clamp(2rem,3.6vw,2.9rem)] leading-none font-bold">
                  <C id={`home.stats.${i}.value`} />
                </div>
                <div className="text-[14.5px] text-muted-foreground">
                  <C id={`home.stats.${i}.label`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT REVIEWS */}
      <section
        id="reviews"
        className="gutter scroll-mt-header bg-paper py-section"
      >
        <div className="site-container">
          <div className="mb-11 max-w-[640px]">
            <Eyebrow className="mb-3.5">
              <C id="home.reviews.eyebrow" />
            </Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.1] font-bold">
              <C id="home.reviews.title" />
            </h2>
          </div>
          <div className={swipeRow}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-[0_0_82%] snap-start md:flex-[1_1_280px]"
              >
                <figure className="m-0 flex size-full flex-col border border-black/9 bg-white px-[30px] py-8">
                  <div
                    className="mb-[18px] flex gap-[3px] text-ink"
                    aria-label="5 out of 5 stars"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill="currentColor"
                        strokeWidth={1}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="m-0 mb-6 flex-1 font-serif text-[1.05rem] leading-[1.5] italic">
                    “<C id={`home.reviews.${i}.quote`} />”
                  </blockquote>
                  <figcaption className="flex items-center gap-3.5 border-t border-black/10 pt-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-[1.1rem] font-semibold text-white">
                      <ReviewInitial id={`home.reviews.${i}.name`} />
                    </span>
                    <div>
                      <div className="text-[14.5px] font-semibold">
                        <C id={`home.reviews.${i}.name`} />
                      </div>
                      <div className="text-[13px] text-ink-faint">
                        <C id={`home.reviews.${i}.place`} />
                      </div>
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
            eyebrow={<C id="home.insights.eyebrow" />}
            title={<C id="home.insights.title" />}
            link={{ label: <C id="common.viewAll" />, href: "/insights" }}
            className="mb-12"
          />
          <div className={swipeRow}>
            {insights.slice(0, 3).map((post) => (
              <div
                key={post.slug}
                className="flex-[0_0_84%] snap-start md:flex-[1_1_300px]"
              >
                <Link
                  href={insightHref(post.slug)}
                  className={`flex size-full min-h-[220px] flex-col border border-black/9 bg-paper p-[30px] ${cardHover}`}
                >
                  <span className="mb-5 self-start rounded-full border border-black/20 px-[11px] py-[5px] text-[11.5px] font-semibold tracking-[.12em] text-ink-soft uppercase">
                    {post.category}
                  </span>
                  <h3 className="m-0 mb-auto font-serif text-[1.22rem] leading-[1.3] font-semibold">
                    <C
                      id={`insight.${post.slug}.${post.shortTitle ? "shortTitle" : "title"}`}
                    />
                  </h3>
                  <span className="mt-[22px] inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                    <C id="common.readArticle" /> <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gutter relative overflow-hidden bg-ink py-[clamp(72px,9vw,124px)] text-white">
        <Rings preset="cta" />
        <div className="relative mx-auto max-w-[1000px]">
          <Eyebrow onCrimson className="mb-7">
            <C id="home.cta.eyebrow" />
          </Eyebrow>
          <h2 className="m-0 mb-[26px] max-w-[16ch] font-serif text-[clamp(2.4rem,6vw,4rem)] leading-[1.05] font-bold">
            <C id="home.cta.title" />
          </h2>
          <p className="m-0 mb-[42px] max-w-[52ch] text-[clamp(1rem,1.4vw,1.15rem)] text-white/88">
            <C id="home.cta.body" />
          </p>
          <Button
            asChild
            variant="outlineWhite"
            className="flex w-full gap-3 rounded-none px-[26px] py-[17px] sm:inline-flex sm:w-auto sm:min-w-[340px] sm:px-[34px] sm:py-[18px]"
          >
            <Link href="/contact">
              <C id="home.cta.button" /> <ArrowUpRight size={17} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
