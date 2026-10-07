import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { getPracticeArea, practiceAreaHref } from "@/content/practice-areas";
import { personHref, practiceLeads } from "@/content/people";
import { copyDefaults } from "@/content/copy";
import {
  isAddedArea,
  shownAreas,
  shownPeople,
  visibleKeys,
} from "@/content/lists";
import { publishedText } from "@/lib/site-text";
import { ServiceList } from "@/components/practice/service-list";
import { Button } from "@/components/ui/button";
import { Copy as C, PhoneLink } from "@/components/site/copy";
import { MaybeLink } from "@/components/site/maybe-link";
import { CtaBand, PageHero } from "@/components/site/page-hero";
import { Avatar, Eyebrow } from "@/components/site/primitives";
import { StickyColumn } from "@/components/site/sticky-column";

export function generateStaticParams() {
  return shownAreas().map((slug) => ({ slug }));
}

/** A practice area the site shows: built in, or added by the client. */
function findArea(slug: string) {
  if (!shownAreas().includes(slug)) return null;
  return { slug, area: getPracticeArea(slug), added: isAddedArea(slug) };
}

export async function generateMetadata({
  params,
}: PageProps<"/practice-areas/[slug]">): Promise<Metadata> {
  const slug = (await params).slug;
  const found = findArea(slug);
  if (!found) return {};
  // Added areas: use the text the client wrote.
  const text = (part: string) =>
    publishedText.texts[`practice.${slug}.${part}`] ??
    copyDefaults[`practice.${slug}.${part}`];
  return { title: text("title"), description: text("intro") };
}

export default async function PracticeAreaPage({
  params,
}: PageProps<"/practice-areas/[slug]">) {
  const found = findArea((await params).slug);
  if (!found) notFound();
  const { slug, area, added } = found;

  const p = (field: string) => `practice.${slug}.${field}`;
  // Areas with their own approach use it; the rest share the default steps.
  const stepId = (i: number, part: "title" | "body") =>
    area?.steps ? p(`steps.${i}.${part}`) : `practiceDetail.steps.${i}.${part}`;
  const shown = shownAreas();
  const related = area
    ? area.related.filter((other) => shown.includes(other))
    : shown.filter((other) => other !== slug).slice(0, 4);

  return (
    <>
      <PageHero
        className="py-[clamp(52px,7vw,92px)]"
        crumbs={[
          { label: <C id="nav.home" />, href: "/" },
          { label: <C id="nav.practice" />, href: "/practice-areas" },
          { label: <C id={p("title")} /> },
        ]}
        eyebrow={<C id={added ? "practiceIndex.group.more" : p("group")} />}
        title={<C id={p("title")} />}
        titleClassName="max-w-[20ch] text-[clamp(2.3rem,4.6vw,3.7rem)] leading-[1.06]"
        intro={<C id={p("intro")} />}
      />

      {/* BODY + SIDEBAR */}
      <section className="gutter bg-paper py-section-sm">
        <div className="site-container grid grid-cols-1 items-start gap-[clamp(36px,5vw,64px)] md:grid-cols-[1.7fr_1fr]">
          <div>
            <h2 className="m-0 mb-[18px] font-serif text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold">
              <C id="practiceDetail.help" />
            </h2>
            {added ? (
              <p className="m-0 mb-10 text-[16.5px] text-ink-soft">
                <C id={p("help")} />
              </p>
            ) : (
              <>
                <p className="m-0 mb-[18px] text-[16.5px] text-ink-soft">
                  <C id={p("overview.0")} />
                </p>
                <p className="m-0 mb-10 text-base text-muted-foreground">
                  <C id={p("overview.1")} />
                </p>
              </>
            )}

            <h3 className="m-0 mb-[22px] font-serif text-[1.4rem] font-semibold">
              <C id="practiceDetail.services" />
            </h3>
            {added ? (
              <ServiceList linesId={p("services")} />
            ) : (
              <ServiceList
                ids={visibleKeys(`services-${slug}`).map((k) =>
                  p(`services.${k}`),
                )}
              />
            )}

            <div className="bg-ink p-[clamp(28px,3.5vw,44px)] text-white">
              <h3 className="m-0 mb-[26px] font-serif text-[1.4rem] font-semibold">
                <C id="practiceDetail.approach" />
              </h3>
              <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-7 p-0">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="border-t border-white/25 pt-4">
                    <span className="font-serif text-[1.2rem] text-white/45">
                      0{i + 1}
                    </span>
                    <h4 className="m-0 my-2 font-serif text-[1.1rem] font-semibold">
                      <C id={stepId(i, "title")} />
                    </h4>
                    <p className="m-0 text-[13.5px] text-white/66">
                      <C id={stepId(i, "body")} />
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <StickyColumn as="aside" className="flex flex-col gap-6">
            <div className="border border-black/10 bg-white p-7">
              <h3 className="m-0 mb-1.5 font-serif text-[1.2rem] font-semibold">
                <C id="practiceDetail.sidebar.title" />
              </h3>
              <p className="m-0 mb-[18px] text-sm text-muted-foreground">
                <C id="practiceDetail.sidebar.body" />
              </p>
              <Button asChild size="full" className="p-[13px] text-[14.5px]">
                <Link href="/contact">
                  <C id="common.freeConsultation" />
                </Link>
              </Button>
              {visibleKeys("phones").map((k, i) => (
                <PhoneLink
                  key={i}
                  id={`contact.phone.${k}`}
                  className={`block text-center text-[14.5px] font-semibold text-ink ${i === 0 ? "mt-3" : "mt-1.5"}`}
                />
              ))}
            </div>
            <div className="border border-black/10 bg-sand p-7">
              <h3 className="m-0 mb-4 font-serif text-[1.15rem] font-semibold">
                <C id="practiceDetail.related" />
              </h3>
              <div className="flex flex-col">
                {related.map((slug) => (
                  <Link
                    key={slug}
                    href={practiceAreaHref(slug)}
                    className="flex items-center justify-between border-b border-black/10 py-[11px] text-[14.5px] text-ink-body hover:text-crimson"
                  >
                    <C id={`practice.${slug}.title`} />
                    <ArrowRight size={16} className="text-ink-faint" />
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
            <Eyebrow className="mb-3.5">
              <C id="practiceDetail.contacts.eyebrow" />
            </Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-bold">
              <C id="practiceDetail.contacts.title" />
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[26px]">
            {shownPeople(practiceLeads).map((key) => (
              <MaybeLink
                key={key}
                href={personHref(key)}
                className="flex items-center gap-[18px] border border-black/9 bg-white p-5 transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgba(20,20,24,.4)]"
              >
                <Avatar
                  size={76}
                  head={{ top: "20%", width: "36%" }}
                  body={{ bottom: "-20%", width: "66%" }}
                />
                <div>
                  <h3 className="m-0 mb-[3px] font-serif text-[1.15rem] font-semibold">
                    <C id={`person.${key}.name`} />
                  </h3>
                  <div className="text-xs font-semibold tracking-[.06em] text-muted-foreground uppercase">
                    <C id={`person.${key}.role`} />
                  </div>
                </div>
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={<C id="practiceDetail.cta.title" />}
        body={<C id="practiceDetail.cta.body" />}
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
