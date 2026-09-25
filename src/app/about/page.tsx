import type { Metadata } from "next";
import Link from "next/link";

import { approachSteps, values } from "@/content/site";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { Eyebrow, Silhouette } from "@/components/site/primitives";
import { StepsGrid } from "@/components/site/steps-grid";
import { StickyColumn } from "@/components/site/sticky-column";

export const metadata: Metadata = {
  title: "About",
  description:
    "Baluti & Co. Advocates is a full-service law firm serving individuals, businesses, and institutions across Uganda.",
};

const milestones = [
  {
    year: "2009",
    title: "The firm is founded",
    body: "Baluti & Co. opens its doors with a focus on litigation and commercial advisory.",
  },
  {
    year: "2014",
    title: "Practice expands",
    body: "New partners join, broadening our reach across banking, employment, and property law.",
  },
  {
    year: "2019",
    title: "Regional recognition",
    body: "The firm is recognised among leading practitioners in the region for client service.",
  },
  {
    year: "Today",
    title: "A full-service firm",
    body: "Eighteen practice areas and a team of over forty advocates and support staff.",
  },
];

const h2 =
  "m-0 font-serif text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.12] font-bold";

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About the firm"
        title="Applying law to facts, with people at the centre"
        intro="Baluti & Co. Advocates is a full-service law firm serving individuals, businesses, and institutions across Uganda — combining technical excellence with genuine care for the people we represent."
      />

      {/* MISSION */}
      <section className="gutter bg-paper py-section">
        <div className="site-container grid grid-cols-1 items-start gap-[clamp(36px,5vw,72px)] md:grid-cols-[1.1fr_1fr]">
          <StickyColumn>
            <Eyebrow className="mb-3.5">Who we are</Eyebrow>
            <h2 className={`${h2} mb-[22px] leading-[1.14]`}>
              A firm built on trust, clarity, and results
            </h2>
            <p className="m-0 mb-[18px] text-[16.5px] text-ink-soft">
              Our standard of excellence is fuelled by a single desire: to
              protect you. We take the time to understand each client’s
              circumstances, explain the law in plain terms, and pursue the
              outcome that matters most to them.
            </p>
            <p className="m-0 mb-7 text-base text-muted-foreground">
              Whether we’re advising a growing business, resolving a dispute, or
              guiding a family through a difficult moment, we bring the same
              rigour, discretion, and commitment to every matter.
            </p>
            <div className="flex flex-wrap gap-9">
              {[
                { value: "35+", label: "Years of combined practice" },
                { value: "18", label: "Practice areas" },
                { value: "40+", label: "Attorneys & staff" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-[2.2rem] font-bold">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
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
            <Eyebrow className="mb-3.5">Our story</Eyebrow>
            <h2 className={h2}>From a small practice to a trusted name</h2>
          </div>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-0.5 border border-black/12 bg-black/12 p-0">
            {milestones.map((m) => (
              <li key={m.year} className="flex min-h-[210px] flex-col bg-sand px-[30px] py-[38px]">
                <span className="mb-3.5 font-serif text-[1.6rem] font-bold text-ink">
                  {m.year}
                </span>
                <h3 className="m-0 mb-2.5 font-serif text-[1.2rem] font-semibold">
                  {m.title}
                </h3>
                <p className="m-0 text-[14.5px] text-muted-foreground">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* VALUES */}
      <section className="gutter bg-paper py-section">
        <div className="site-container">
          <div className="mx-auto mb-[52px] max-w-[52ch] text-center">
            <Eyebrow className="mb-3.5">Our values</Eyebrow>
            <h2 className={h2}>Fundamental principles that define our practice</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[26px]">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="flex min-h-[230px] flex-col border border-black/9 bg-white px-[30px] py-[34px]"
              >
                <span className="mb-auto font-serif text-[1.6rem] text-ink-faint">0{i + 1}</span>
                <h3 className="m-0 mt-5 mb-2.5 font-serif text-[1.3rem] font-semibold">
                  {v.title}
                </h3>
                <p className="m-0 text-[14.5px] text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="gutter bg-ink py-section text-white">
        <div className="site-container">
          <div className="mb-[52px] max-w-[52ch]">
            <Eyebrow className="mb-3.5">How we work</Eyebrow>
            <h2 className={h2}>A clear, considered approach to every matter</h2>
          </div>
          <StepsGrid steps={approachSteps} />
        </div>
      </section>

      {/* LEADERSHIP QUOTE */}
      <section className="gutter bg-sand py-[clamp(64px,8vw,104px)]">
        <figure className="m-0 mx-auto max-w-[900px] text-center">
          <div aria-hidden="true" className="mb-2.5 font-serif text-5xl leading-none text-ink-faint">
            “
          </div>
          <blockquote className="m-0 mb-[26px] font-serif text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.4] italic">
            We don’t just want to do well — we want our clients to get what
            they’re entitled to, and the defendants to face real accountability.
          </blockquote>
          <figcaption>
            <div className="text-base font-semibold">Emmanuel Baluti</div>
            <div className="text-sm text-muted-foreground">
              Founder &amp; Principal Attorney
            </div>
          </figcaption>
        </figure>
      </section>

      <CtaBand
        title="Let’s talk about how we can help"
        body="Book a free consultation and speak with an advocate about your situation."
      >
        <div className="flex flex-nowrap justify-center gap-3">
          <Button asChild className="shrink px-[clamp(14px,4vw,32px)]">
            <Link href="/contact">Free consultation</Link>
          </Button>
          <Button asChild variant="ghost" className="shrink px-[clamp(14px,4vw,32px)]">
            <Link href="/people">Meet our people</Link>
          </Button>
        </div>
      </CtaBand>
    </>
  );
}
