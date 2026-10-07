import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  attorneyKeys,
  attorneys,
  bioOtherPeople,
  getAttorney,
  personHref,
} from "@/content/people";
import { practiceAreaHref } from "@/content/practice-areas";
import { isVisible, shownPeople, visibleKeys } from "@/content/lists";
import { Button } from "@/components/ui/button";
import { Copy as C, EmailLink, PhoneLink } from "@/components/site/copy";
import { MaybeLink } from "@/components/site/maybe-link";
import {
  Breadcrumbs,
  Eyebrow,
  Silhouette,
  UnderlineLink,
} from "@/components/site/primitives";
import { Rings } from "@/components/site/rings";
import { StickyColumn } from "@/components/site/sticky-column";

export function generateStaticParams() {
  return attorneys
    .filter((a) => isVisible("people", attorneyKeys[a.slug]))
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/people/[slug]">): Promise<Metadata> {
  const attorney = getAttorney((await params).slug);
  return attorney
    ? {
        title: `${attorney.name} — ${attorney.role}`,
        description: attorney.tagline,
      }
    : {};
}

export default async function AttorneyPage({
  params,
}: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const attorney = getAttorney(slug);
  if (!attorney) notFound();

  const key = attorneyKeys[slug];
  if (!isVisible("people", key)) notFound();
  const a = (field: string) => `attorney.${key}.${field}`;

  return (
    <>
      {/* HERO */}
      <section className="gutter relative overflow-hidden bg-ink py-[clamp(48px,6vw,80px)] text-white">
        <Rings preset="dark" />
        <div className="site-container relative">
          <Breadcrumbs
            className="mb-7"
            items={[
              { label: <C id="nav.home" />, href: "/" },
              { label: <C id="nav.people" />, href: "/people" },
              { label: <C id={`person.${key}.name`} /> },
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
                <C id={`person.${key}.role`} />
              </Eyebrow>
              <h1 className="m-0 mb-[18px] font-serif text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.05] font-bold">
                <C id={`person.${key}.name`} />
              </h1>
              <p className="m-0 mb-7 max-w-[52ch] text-[clamp(1.02rem,1.4vw,1.2rem)] text-white/74">
                <C id={a("tagline")} />
              </p>
              <div className="flex flex-nowrap gap-3">
                <Button
                  asChild
                  variant="light"
                  className="min-w-0 flex-[1_1_0] truncate px-[clamp(12px,3.5vw,26px)] py-[13px] text-[14.5px]"
                >
                  <EmailLink id={a("email")}>
                    <C id="attorney.label.email" /> <C id={a("first")} />
                  </EmailLink>
                </Button>
                <Button
                  asChild
                  variant="ghostOnDark"
                  className="flex-none px-[clamp(12px,3.5vw,26px)] py-[13px] text-[14.5px]"
                >
                  <PhoneLink id="contact.phone.0" />
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
              <C id="attorney.label.about" /> <C id={a("first")} />
            </h2>
            {attorney.about.map((_, i) => (
              <p key={i} className="m-0 mb-[18px] text-[16.5px] text-ink-soft">
                <C id={a(`about.${i}`)} />
              </p>
            ))}

            <h3 className="m-0 mt-[38px] mb-5 font-serif text-[1.4rem] font-semibold">
              <C id="attorney.label.work" />
            </h3>
            <ul className="m-0 flex list-none flex-col border-t border-black/14 p-0">
              {visibleKeys("matters").map((i) => (
                <li
                  key={i}
                  className="grid grid-cols-[24px_1fr] gap-3.5 border-b border-black/14 py-[18px]"
                >
                  <span aria-hidden="true" className="mt-0.5 text-ink-faint">
                    ◈
                  </span>
                  <span className="text-[15.5px] text-ink-body">
                    <C id={a(`matters.${i}`)} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <StickyColumn as="aside" className="flex flex-col gap-6">
            <div className="border border-black/10 bg-white p-7">
              <h3 className="m-0 mb-4 font-serif text-[1.15rem] font-semibold">
                <C id="attorney.label.areas" />
              </h3>
              <div className="flex flex-wrap gap-2">
                {attorney.areas
                  .filter((area) => isVisible("areas", area))
                  .map((area) => (
                    <Link
                      key={area}
                      href={practiceAreaHref(area)}
                      className="rounded-full border border-black/18 px-3.5 py-[7px] text-[13px] text-ink-body hover:border-crimson hover:text-crimson"
                    >
                      <C id={`practice.${area}.title`} />
                    </Link>
                  ))}
              </div>
            </div>
            <div className="border border-black/10 bg-sand p-7">
              <h3 className="m-0 mb-4 font-serif text-[1.15rem] font-semibold">
                <C id="attorney.label.credentials" />
              </h3>
              <div className="flex flex-col gap-3.5">
                {visibleKeys("credentials").map((i) => (
                  <div key={i}>
                    <div className="text-[14.5px] font-semibold">
                      <C id={a(`credentials.${i}.title`)} />
                    </div>
                    <div className="text-[13.5px] text-muted-foreground">
                      <C id={a(`credentials.${i}.detail`)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-ink p-7 text-white">
              <h3 className="m-0 mb-2 font-serif text-[1.15rem] font-semibold">
                <C id="attorney.label.languages" />
              </h3>
              <p className="m-0 text-[14.5px] text-white/72">
                <C id={a("languages")} />
              </p>
            </div>
          </StickyColumn>
        </div>
      </section>

      {/* OTHER PEOPLE */}
      <section className="gutter bg-sand py-section-sm">
        <div className="site-container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <h2 className="m-0 font-serif text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold">
              <C id="attorney.label.more" />
            </h2>
            <UnderlineLink href="/people">
              <C id="common.viewAllPeople" />
            </UnderlineLink>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[26px]">
            {shownPeople(bioOtherPeople).map((other) => (
              <MaybeLink
                key={other}
                href={personHref(other)}
                className="text-ink"
              >
                <Silhouette
                  className="mb-4 h-[240px]"
                  head={{ top: "24%", width: "30%" }}
                  body={{ bottom: "-16%", width: "58%" }}
                />
                <h3 className="m-0 mb-[3px] font-serif text-[1.2rem] font-semibold">
                  <C id={`person.${other}.name`} />
                </h3>
                <div className="text-[12.5px] font-semibold tracking-[.06em] text-muted-foreground uppercase">
                  <C id={`person.${other}.role`} />
                </div>
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
