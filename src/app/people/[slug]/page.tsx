import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { site } from "@/content/site";
import { attorneys, bioOtherPeople, getAttorney, personHref } from "@/content/people";
import { getPracticeArea, practiceAreaHref } from "@/content/practice-areas";
import { Button } from "@/components/ui/button";
import { MaybeLink } from "@/components/site/maybe-link";
import {
  Breadcrumbs,
  Eyebrow,
  Silhouette,
  UnderlineLink,
} from "@/components/site/primitives";
import { Rings } from "@/components/site/rings";

export function generateStaticParams() {
  return attorneys.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/people/[slug]">): Promise<Metadata> {
  const attorney = getAttorney((await params).slug);
  return attorney
    ? { title: `${attorney.name} — ${attorney.role}`, description: attorney.tagline }
    : {};
}

export default async function AttorneyPage({ params }: PageProps<"/people/[slug]">) {
  const attorney = getAttorney((await params).slug);
  if (!attorney) notFound();

  const office = site.phones[0];

  return (
    <>
      {/* HERO */}
      <section className="gutter relative overflow-hidden bg-ink py-[clamp(48px,6vw,80px)] text-white">
        <Rings preset="dark" />
        <div className="site-container relative">
          <Breadcrumbs
            className="mb-7"
            items={[
              { label: "Home", href: "/" },
              { label: "People", href: "/people" },
              { label: attorney.name },
            ]}
          />
          <div className="grid grid-cols-1 items-center gap-[clamp(28px,4vw,56px)] md:grid-cols-[0.5fr_1fr]">
            <Silhouette
              label="portrait"
              className="aspect-[4/5]"
              head={{ top: "17%", width: "32%" }}
              body={{ top: "48%", width: "72%" }}
            />
            <div>
              <Eyebrow rule className="mb-[18px]">
                {attorney.role}
              </Eyebrow>
              <h1 className="m-0 mb-[18px] font-serif text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.05] font-bold">
                {attorney.name}
              </h1>
              <p className="m-0 mb-7 max-w-[52ch] text-[clamp(1.02rem,1.4vw,1.2rem)] text-white/74">
                {attorney.tagline}
              </p>
              <div className="flex flex-nowrap gap-3">
                <Button
                  asChild
                  className="min-w-0 flex-[1_1_0] truncate px-[clamp(12px,3.5vw,26px)] py-[13px] text-[14.5px]"
                >
                  <a href={`mailto:${attorney.email}`}>Email {attorney.first}</a>
                </Button>
                <Button
                  asChild
                  variant="ghostOnDark"
                  className="flex-none px-[clamp(12px,3.5vw,26px)] py-[13px] text-[14.5px]"
                >
                  <a href={office.href}>{office.label}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="gutter bg-paper py-section-sm">
        <div className="site-container grid grid-cols-1 items-start gap-[clamp(36px,5vw,64px)] md:grid-cols-[1.7fr_1fr]">
          <div>
            <h2 className="m-0 mb-[18px] font-serif text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold">
              About {attorney.first}
            </h2>
            {attorney.about.map((para) => (
              <p key={para.slice(0, 24)} className="m-0 mb-[18px] text-[16.5px] text-ink-soft">
                {para}
              </p>
            ))}

            <h3 className="m-0 mt-[38px] mb-5 font-serif text-[1.4rem] font-semibold">
              Representative work
            </h3>
            <ul className="m-0 flex list-none flex-col border-t border-black/14 p-0">
              {attorney.matters.map((matter) => (
                <li
                  key={matter}
                  className="grid grid-cols-[24px_1fr] gap-3.5 border-b border-black/14 py-[18px]"
                >
                  <span aria-hidden="true" className="mt-0.5 text-crimson">
                    ◈
                  </span>
                  <span className="text-[15.5px] text-ink-body">{matter}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col gap-6 md:sticky md:top-[100px]">
            <div className="border border-black/10 bg-white p-7">
              <h3 className="m-0 mb-4 font-serif text-[1.15rem] font-semibold">
                Practice areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {attorney.areas.map((slug) => (
                  <Link
                    key={slug}
                    href={practiceAreaHref(slug)}
                    className="rounded-full border border-black/18 px-3.5 py-[7px] text-[13px] text-ink-body hover:border-crimson hover:text-crimson"
                  >
                    {getPracticeArea(slug)?.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border border-black/10 bg-sand p-7">
              <h3 className="m-0 mb-4 font-serif text-[1.15rem] font-semibold">
                Credentials
              </h3>
              <div className="flex flex-col gap-3.5">
                {attorney.credentials.map((c) => (
                  <div key={c.title}>
                    <div className="text-[14.5px] font-semibold">{c.title}</div>
                    <div className="text-[13.5px] text-muted-foreground">{c.detail}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-ink p-7 text-white">
              <h3 className="m-0 mb-2 font-serif text-[1.15rem] font-semibold">Languages</h3>
              <p className="m-0 text-[14.5px] text-white/72">{attorney.languages}</p>
            </div>
          </aside>
        </div>
      </section>

      {/* OTHER PEOPLE */}
      <section className="gutter bg-sand py-section-sm">
        <div className="site-container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <h2 className="m-0 font-serif text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold">
              More from our team
            </h2>
            <UnderlineLink href="/people">View all people</UnderlineLink>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[26px]">
            {bioOtherPeople.map((person, i) => (
              <MaybeLink key={i} href={personHref(person)} className="text-ink">
                <Silhouette
                  className="mb-4 h-[240px]"
                  head={{ top: "24%", width: "30%" }}
                  body={{ bottom: "-16%", width: "58%" }}
                />
                <h3 className="m-0 mb-[3px] font-serif text-[1.2rem] font-semibold">
                  {person.name}
                </h3>
                <div className="text-[12.5px] font-semibold tracking-[.06em] text-crimson uppercase">
                  {person.role}
                </div>
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
