import type { Metadata } from "next";
import Link from "next/link";

import { leaders, people, personHref, team } from "@/content/people";
import { Button } from "@/components/ui/button";
import { Copy as C } from "@/components/site/copy";
import { MaybeLink } from "@/components/site/maybe-link";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { Eyebrow, Silhouette } from "@/components/site/primitives";
import { StickyColumn } from "@/components/site/sticky-column";

export const metadata: Metadata = {
  title: "Our People",
  description:
    "Meet the advocates of Baluti & Co. — experienced lawyers who combine deep technical knowledge with genuine care for their clients.",
};

const h2 = "m-0 font-serif text-[clamp(1.9rem,3.2vw,2.7rem)] font-bold";

export default function PeoplePage() {
  return (
    <>
      <PageHero
        crumbs={[
          { label: <C id="nav.home" />, href: "/" },
          { label: <C id="nav.people" /> },
        ]}
        eyebrow={<C id="people.hero.eyebrow" />}
        title={<C id="people.hero.title" />}
        intro={<C id="people.hero.intro" />}
      />

      {/* LEADERSHIP */}
      <section className="gutter bg-paper py-section">
        <div className="site-container">
          <div className="mb-11">
            <Eyebrow className="mb-3.5">
              <C id="people.leadership.eyebrow" />
            </Eyebrow>
            <h2 className={h2}>
              <C id="people.leadership.title" />
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7">
            {leaders.map((key) => (
              <MaybeLink
                key={key}
                href={personHref(key)}
                className="block overflow-hidden border border-black/9 bg-white text-ink transition-shadow duration-300 hover:text-ink hover:shadow-[0_22px_44px_-26px_rgba(20,20,24,.45)]"
              >
                <Silhouette
                  className="h-[340px]"
                  head={{ top: "19%", width: "34%" }}
                  body={{ top: "51%", width: "78%" }}
                />
                <div className="px-7 pt-[26px] pb-[30px]">
                  <h3 className="m-0 mb-1 font-serif text-[1.4rem] font-semibold">
                    <C id={`person.${key}.name`} />
                  </h3>
                  <div className="mb-3.5 text-[13px] font-semibold tracking-[.08em] text-muted-foreground uppercase">
                    <C id={`person.${key}.role`} />
                  </div>
                  <p className="m-0 text-[14.5px] text-muted-foreground">
                    <C id={`person.${key}.bio`} />
                  </p>
                </div>
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM GRID — swipe row in mobile portrait, grid otherwise */}
      <section className="gutter bg-sand py-section">
        <div className="site-container">
          <div className="mb-11">
            <Eyebrow className="mb-3.5">
              <C id="people.team.eyebrow" />
            </Eyebrow>
            <h2 className={h2}>
              <C id="people.team.title" />
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-[26px] md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] max-sm:portrait:no-scrollbar max-sm:portrait:flex max-sm:portrait:snap-x max-sm:portrait:snap-mandatory max-sm:portrait:flex-nowrap max-sm:portrait:gap-4 max-sm:portrait:overflow-x-auto max-sm:portrait:pb-3">
            {team.map((key) => (
              <MaybeLink
                key={key}
                href={personHref(key)}
                className="block text-ink max-sm:portrait:flex-[0_0_72%] max-sm:portrait:snap-start"
              >
                <Silhouette
                  className="mb-[18px] h-[280px]"
                  head={{ top: "20%", width: "36%" }}
                  body={{ top: "52%", width: "82%" }}
                />
                <h3 className="m-0 mb-[3px] font-serif text-[1.25rem] font-semibold">
                  <C id={`person.${key}.name`} />
                </h3>
                <div className="mb-1 text-[12.5px] font-semibold tracking-[.06em] text-muted-foreground uppercase">
                  <C id={`person.${key}.role`} />
                </div>
                {"area" in people[key] && (
                  <div className="text-sm text-muted-foreground">
                    <C id={`person.${key}.area`} />
                  </div>
                )}
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section
        id="careers"
        className="gutter scroll-mt-header bg-ink py-section text-white"
      >
        <div className="site-container grid grid-cols-1 items-start gap-[clamp(36px,5vw,72px)] md:grid-cols-2">
          <StickyColumn>
            <Eyebrow className="mb-3.5">
              <C id="people.careers.eyebrow" />
            </Eyebrow>
            <h2 className={`${h2} mb-5 leading-[1.12]`}>
              <C id="people.careers.title" />
            </h2>
            <p className="m-0 mb-7 max-w-[48ch] text-base text-white/72">
              <C id="people.careers.body" />
            </p>
            <Button asChild variant="light" size="cta">
              <Link href="/contact">
                <C id="people.careers.cta" />
              </Link>
            </Button>
          </StickyColumn>
          <div className="grid grid-cols-2 gap-0.5 border border-white/12 bg-white/12">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} data-tight-x className="bg-ink px-6 py-7">
                <h3 className="m-0 mb-2 font-serif text-[1.15rem] font-semibold">
                  <C id={`people.perks.${i}.title`} />
                </h3>
                <p className="m-0 text-sm text-white/64">
                  <C id={`people.perks.${i}.body`} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={<C id="people.cta.title" />}
        body={<C id="people.cta.body" />}
      >
        <Button asChild size="cta">
          <Link href="/contact">
            <C id="common.freeConsultation" />
          </Link>
        </Button>
      </CtaBand>
    </>
  );
}
