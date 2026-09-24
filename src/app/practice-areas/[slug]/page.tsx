import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { site } from "@/content/site";
import {
  getPracticeArea,
  practiceAreaHref,
  practiceAreas,
} from "@/content/practice-areas";
import { personHref, practiceLeads } from "@/content/people";
import { Button } from "@/components/ui/button";
import { MaybeLink } from "@/components/site/maybe-link";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { Avatar, Eyebrow } from "@/components/site/primitives";
import { StickyColumn } from "@/components/site/sticky-column";

export function generateStaticParams() {
  return practiceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/practice-areas/[slug]">): Promise<Metadata> {
  const area = getPracticeArea((await params).slug);
  return area ? { title: area.title, description: area.intro } : {};
}

const defaultSteps = [
  {
    title: "Listen",
    body: "We begin by understanding your situation, your goals, and what a good outcome looks like for you.",
  },
  {
    title: "Advise",
    body: "We set out the law and your options clearly, so you can make informed decisions.",
  },
  {
    title: "Act",
    body: "We move deliberately on your behalf, keeping you informed at every stage of the matter.",
  },
  {
    title: "Deliver",
    body: "We pursue the result that best protects your interests, and stand behind our work.",
  },
];

export default async function PracticeAreaPage({
  params,
}: PageProps<"/practice-areas/[slug]">) {
  const area = getPracticeArea((await params).slug);
  if (!area) notFound();

  const steps = area.steps ?? defaultSteps;
  const related = area.related
    .map((slug) => getPracticeArea(slug))
    .filter((a) => a !== undefined);

  return (
    <>
      <PageHero
        className="py-[clamp(52px,7vw,92px)]"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Practice Areas", href: "/practice-areas" },
          { label: area.title },
        ]}
        eyebrow={area.group}
        title={area.title}
        titleClassName="max-w-[20ch] text-[clamp(2.3rem,4.6vw,3.7rem)] leading-[1.06]"
        intro={area.intro}
      />

      {/* BODY + SIDEBAR */}
      <section className="gutter bg-paper py-section-sm">
        <div className="site-container grid grid-cols-1 items-start gap-[clamp(36px,5vw,64px)] md:grid-cols-[1.7fr_1fr]">
          <div>
            <h2 className="m-0 mb-[18px] font-serif text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold">
              How we can help
            </h2>
            <p className="m-0 mb-[18px] text-[16.5px] text-ink-soft">{area.overview[0]}</p>
            <p className="m-0 mb-10 text-base text-muted-foreground">{area.overview[1]}</p>

            <h3 className="m-0 mb-[22px] font-serif text-[1.4rem] font-semibold">
              Our services include
            </h3>
            <ul className="m-0 mb-11 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-0.5 border border-black/10 bg-black/10 p-0">
              {area.services.map((service) => (
                <li key={service} className="flex items-center gap-3.5 bg-paper px-6 py-[22px]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[rgba(158,27,47,.09)]">
                    <Check size={16} strokeWidth={2.6} className="text-crimson" />
                  </span>
                  <span className="text-[15px] text-ink-body">{service}</span>
                </li>
              ))}
            </ul>

            <div className="bg-ink p-[clamp(28px,3.5vw,44px)] text-white">
              <h3 className="m-0 mb-[26px] font-serif text-[1.4rem] font-semibold">
                Our approach
              </h3>
              <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-7 p-0">
                {steps.map((step, i) => (
                  <li key={step.title} className="border-t-2 border-crimson pt-4">
                    <span className="font-serif text-[1.2rem] text-crimson">0{i + 1}</span>
                    <h4 className="m-0 my-2 font-serif text-[1.1rem] font-semibold">
                      {step.title}
                    </h4>
                    <p className="m-0 text-[13.5px] text-white/66">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <StickyColumn as="aside" className="flex flex-col gap-6">
            <div className="border border-black/10 bg-white p-7">
              <h3 className="m-0 mb-1.5 font-serif text-[1.2rem] font-semibold">
                Speak to our team
              </h3>
              <p className="m-0 mb-[18px] text-sm text-muted-foreground">
                Book a free, confidential consultation about your matter.
              </p>
              <Button asChild size="full" className="p-[13px] text-[14.5px]">
                <Link href="/contact">Free consultation</Link>
              </Button>
              {site.phones.map((phone, i) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className={`block text-center text-[14.5px] font-semibold text-ink ${i === 0 ? "mt-3" : "mt-1.5"}`}
                >
                  {phone.label}
                </a>
              ))}
            </div>
            <div className="border border-black/10 bg-sand p-7">
              <h3 className="m-0 mb-4 font-serif text-[1.15rem] font-semibold">
                Related areas
              </h3>
              <div className="flex flex-col">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={practiceAreaHref(r.slug)}
                    className="flex items-center justify-between border-b border-black/10 py-[11px] text-[14.5px] text-ink-body hover:text-crimson"
                  >
                    {r.title}
                    <ArrowRight size={16} className="text-crimson" />
                  </Link>
                ))}
              </div>
            </div>
          </StickyColumn>
        </div>
      </section>

      {/* KEY CONTACTS */}
      <section className="gutter bg-sand py-section-sm">
        <div className="site-container">
          <div className="mb-10">
            <Eyebrow className="mb-3.5">Key contacts</Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-bold">
              Advocates in this practice
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[26px]">
            {practiceLeads.map((person, i) => (
              <MaybeLink
                key={i}
                href={personHref(person)}
                className="flex items-center gap-[18px] border border-black/9 bg-white p-5 transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgba(20,20,24,.4)]"
              >
                <Avatar
                  size={76}
                  head={{ top: "20%", width: "36%" }}
                  body={{ bottom: "-20%", width: "66%" }}
                />
                <div>
                  <h3 className="m-0 mb-[3px] font-serif text-[1.15rem] font-semibold">
                    {person.name}
                  </h3>
                  <div className="text-xs font-semibold tracking-[.06em] text-crimson uppercase">
                    {person.role}
                  </div>
                </div>
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Facing a matter in this area?"
        body="Tell us what you’re dealing with and we’ll advise on the best way forward."
      >
        <Button asChild variant="dark" size="cta">
          <Link href="/contact">Get in touch</Link>
        </Button>
      </CtaBand>
    </>
  );
}
