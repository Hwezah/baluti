import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Copy as C } from "@/components/site/copy";
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
        crumbs={[
          { label: <C id="nav.home" />, href: "/" },
          { label: <C id="nav.practice" /> },
        ]}
        eyebrow={<C id="practiceIndex.hero.eyebrow" />}
        title={<C id="practiceIndex.hero.title" />}
        titleClassName="max-w-[20ch]"
        intro={<C id="practiceIndex.hero.intro" />}
      />

      <section className="gutter bg-paper py-section-sm">
        <PracticeGroups />
      </section>

      {/* PROCESS */}
      <section className="gutter bg-ink py-section text-white">
        <div className="site-container">
          <div className="mb-[52px] max-w-[52ch]">
            <Eyebrow className="mb-3.5">
              <C id="practiceIndex.process.eyebrow" />
            </Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.12] font-bold">
              <C id="practiceIndex.process.title" />
            </h2>
          </div>
          <StepsGrid
            steps={[0, 1, 2, 3].map((i) => ({
              title: <C id={`practiceIndex.steps.${i}.title`} />,
              body: <C id={`practiceIndex.steps.${i}.body`} />,
            }))}
          />
        </div>
      </section>

      <CtaBand
        className="bg-sand"
        title={<C id="practiceIndex.cta.title" />}
        body={<C id="practiceIndex.cta.body" />}
      >
        <Button asChild size="cta">
          <Link href="/contact">
            <C id="common.getInTouch" />
          </Link>
        </Button>
      </CtaBand>
    </>
  );
}
