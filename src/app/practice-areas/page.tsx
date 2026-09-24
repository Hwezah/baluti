import type { Metadata } from "next";
import Link from "next/link";

import { approachSteps } from "@/content/site";
import { Button } from "@/components/ui/button";
import { PracticeGroups } from "@/components/practice/practice-groups";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { Eyebrow } from "@/components/site/primitives";
import { StepsGrid } from "@/components/site/steps-grid";

export const metadata: Metadata = {
  title: "Practice Areas",
  description:
    "Legal expertise across nine core practice areas, from complex commercial transactions to personal disputes.",
};

export default function PracticeAreasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Practice Areas" }]}
        eyebrow="What we do"
        title="Legal expertise across nine core practice areas"
        titleClassName="max-w-[20ch]"
        intro="From complex commercial transactions to personal disputes, our advocates bring depth and discretion to every area of the law we practise."
      />

      <section className="gutter bg-paper py-section-sm">
        <PracticeGroups />
      </section>

      {/* PROCESS */}
      <section className="gutter bg-ink py-section text-white">
        <div className="site-container">
          <div className="mb-[52px] max-w-[52ch]">
            <Eyebrow className="mb-3.5">How we work</Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.12] font-bold">
              Whatever the matter, the same considered approach
            </h2>
          </div>
          <StepsGrid
            steps={[
              approachSteps[0],
              {
                ...approachSteps[1],
                body: "We explain the law and your options in clear, practical terms.",
              },
              {
                ...approachSteps[2],
                body: "We move decisively, keeping you informed at every stage.",
              },
              {
                ...approachSteps[3],
                body: "We pursue the outcome that matters most, and stand behind our work.",
              },
            ]}
          />
        </div>
      </section>

      <CtaBand
        className="bg-sand"
        title="Not sure which area fits your situation?"
        body="Tell us what you’re facing and we’ll point you to the right advocate."
      >
        <Button asChild variant="dark" size="cta">
          <Link href="/contact">Get in touch</Link>
        </Button>
      </CtaBand>
    </>
  );
}
