import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Copy as C } from "@/components/site/copy";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { Eyebrow, Silhouette } from "@/components/site/primitives";
import { StepsGrid } from "@/components/site/steps-grid";
import { StickyColumn } from "@/components/site/sticky-column";
import { visibleKeys } from "@/content/lists";

export const metadata: Metadata = {
  title: "About",
  description:
    "Baluti & Co. Advocates is a full-service law firm serving individuals, businesses, and institutions across Uganda.",
};

const h2 =
  "m-0 font-serif text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.12] font-bold";
const four = [0, 1, 2, 3];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { label: <C id="nav.home" />, href: "/" },
          { label: <C id="nav.about" /> },
        ]}
        eyebrow={<C id="about.hero.eyebrow" />}
        title={<C id="about.hero.title" />}
        intro={<C id="about.hero.intro" />}
      />

      {/* MISSION */}
      <section className="gutter bg-paper py-section">
        <div className="site-container grid grid-cols-1 items-start gap-[clamp(36px,5vw,72px)] md:grid-cols-[1.1fr_1fr]">
          <StickyColumn>
            <Eyebrow className="mb-3.5">
              <C id="about.mission.eyebrow" />
            </Eyebrow>
            <h2 className={`${h2} mb-[22px] leading-[1.14]`}>
              <C id="about.mission.title" />
            </h2>
            <p className="m-0 mb-[18px] text-[16.5px] text-ink-soft">
              <C id="about.mission.p1" />
            </p>
            <p className="m-0 mb-7 text-base text-muted-foreground">
              <C id="about.mission.p2" />
            </p>
            <div className="flex flex-wrap gap-9">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <div className="font-serif text-[2.2rem] font-bold">
                    <C id={`about.mission.stat.${i}.value`} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <C id={`about.mission.stat.${i}.label`} />
                  </div>
                </div>
              ))}
            </div>
          </StickyColumn>
          {/* Which column is shorter depends on the width, so both can stick. */}
          <StickyColumn>
            <Silhouette
              label="team / office photo"
              className="h-[clamp(320px,42vw,460px)] border border-black/12"
              head={{ top: "22%", width: "20%" }}
              body={{ bottom: "-12%", width: "40%" }}
            />
          </StickyColumn>
        </div>
      </section>

      {/* STORY / TIMELINE */}
      <section className="gutter bg-sand py-section">
        <div className="site-container">
          <div className="mb-[52px] max-w-[52ch]">
            <Eyebrow className="mb-3.5">
              <C id="about.story.eyebrow" />
            </Eyebrow>
            <h2 className={h2}>
              <C id="about.story.title" />
            </h2>
          </div>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-0.5 border border-black/12 bg-black/12 p-0">
            {visibleKeys("story").map((i) => (
              <li
                key={i}
                className="flex min-h-[210px] flex-col bg-sand px-[30px] py-[38px]"
              >
                <span className="mb-3.5 font-serif text-[1.6rem] font-bold text-ink">
                  <C id={`about.story.${i}.year`} />
                </span>
                <h3 className="m-0 mb-2.5 font-serif text-[1.2rem] font-semibold">
                  <C id={`about.story.${i}.title`} />
                </h3>
                <p className="m-0 text-[14.5px] text-muted-foreground">
                  <C id={`about.story.${i}.body`} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* VALUES */}
      <section className="gutter bg-paper py-section">
        <div className="site-container">
          <div className="mx-auto mb-[52px] max-w-[52ch] text-center">
            <Eyebrow className="mb-3.5">
              <C id="about.values.eyebrow" />
            </Eyebrow>
            <h2 className={h2}>
              <C id="about.values.title" />
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[26px]">
            {four.map((i) => (
              <div
                key={i}
                className="flex min-h-[230px] flex-col border border-black/9 bg-white px-[30px] py-[34px]"
              >
                <span className="mb-auto font-serif text-[1.6rem] text-ink-faint">
                  0{i + 1}
                </span>
                <h3 className="m-0 mt-5 mb-2.5 font-serif text-[1.3rem] font-semibold">
                  <C id={`values.${i}.title`} />
                </h3>
                <p className="m-0 text-[14.5px] text-muted-foreground">
                  <C id={`values.${i}.body`} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="gutter bg-ink py-section text-white">
        <div className="site-container">
          <div className="mb-[52px] max-w-[52ch]">
            <Eyebrow className="mb-3.5">
              <C id="about.approach.eyebrow" />
            </Eyebrow>
            <h2 className={h2}>
              <C id="about.approach.title" />
            </h2>
          </div>
          <StepsGrid
            steps={four.map((i) => ({
              title: <C id={`about.steps.${i}.title`} />,
              body: <C id={`about.steps.${i}.body`} />,
            }))}
          />
        </div>
      </section>

      {/* LEADERSHIP QUOTE */}
      <section className="gutter bg-sand py-[clamp(64px,8vw,104px)]">
        <figure className="m-0 mx-auto max-w-[900px] text-center">
          <div
            aria-hidden="true"
            className="mb-2.5 font-serif text-5xl leading-none text-ink-faint"
          >
            “
          </div>
          <blockquote className="m-0 mb-[26px] font-serif text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.4] italic">
            <C id="about.quote" />
          </blockquote>
          <figcaption>
            <div className="text-base font-semibold">
              <C id="person.emmanuel.name" />
            </div>
            <div className="text-sm text-muted-foreground">
              <C id="person.emmanuel.role" />
            </div>
          </figcaption>
        </figure>
      </section>

      <CtaBand
        title={<C id="about.cta.title" />}
        body={<C id="about.cta.body" />}
      >
        <div className="flex flex-nowrap justify-center gap-3">
          <Button asChild className="shrink px-[clamp(14px,4vw,32px)]">
            <Link href="/contact">
              <C id="common.freeConsultation" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="shrink px-[clamp(14px,4vw,32px)]"
          >
            <Link href="/people">
              <C id="about.cta.secondary" />
            </Link>
          </Button>
        </div>
      </CtaBand>
    </>
  );
}
