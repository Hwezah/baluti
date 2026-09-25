import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { featuredInsight, insightHref, insights } from "@/content/insights";
import { InsightsBrowser } from "@/components/insights/insights-browser";
import { NewsletterForm } from "@/components/insights/newsletter-form";
import { PageHero } from "@/components/site/page-hero";
import { Avatar, Eyebrow } from "@/components/site/primitives";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Analysis, commentary, and firm news from the advocates at Baluti & Co.",
};

export default function InsightsPage() {
  const featured = featuredInsight;
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        eyebrow="News & insights"
        title="Perspectives on the law that affects you"
        titleClassName="max-w-[20ch]"
        intro="Analysis, commentary, and firm news from the advocates at Baluti & Co. — written to keep you informed and ahead."
      />

      {/* FEATURED */}
      <section className="gutter bg-paper pt-[clamp(56px,7vw,88px)] pb-[clamp(32px,4vw,48px)]">
        <div className="site-container">
          <Link
            href={insightHref(featured.slug)}
            className="grid grid-cols-1 overflow-hidden border border-black/10 bg-white transition-shadow duration-300 hover:shadow-[0_24px_48px_-28px_rgba(20,20,24,.45)] min-[860px]:grid-cols-[1fr_1.1fr]"
          >
            <div className="relative min-h-[300px] overflow-hidden">
              <Image
                src={featured.img}
                alt="Gavel and law books"
                fill
                sizes="(min-width: 860px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-[clamp(28px,3.5vw,48px)]">
              <span className="mb-5 self-start rounded-full border border-black/20 px-[11px] py-[5px] text-[11.5px] font-semibold tracking-[.12em] text-ink-soft uppercase">
                Featured · {featured.category}
              </span>
              <h2 className="m-0 mb-4 font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.2] font-bold">
                {featured.title}
              </h2>
              <p className="m-0 mb-[22px] max-w-[52ch] text-[15.5px] text-muted-foreground">
                The most significant reform of Uganda’s labour law since 2006
                widens who counts as an employee, reshapes termination, and
                raises the cost of getting it wrong. Here’s what to act on.
              </p>
              <div className="flex items-center gap-3.5">
                <Avatar size={40} />
                <div className="text-[13.5px]">
                  <div className="font-semibold text-ink">{featured.author}</div>
                  <div className="text-ink-faint">
                    {featured.date} · {featured.readTime}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* FILTER + GRID */}
      <section className="gutter bg-paper pt-[clamp(24px,3vw,40px)] pb-[clamp(64px,8vw,110px)]">
        <div className="site-container">
          <InsightsBrowser articles={insights} />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="gutter bg-ink py-section-sm text-white">
        <div className="mx-auto max-w-[920px] text-center">
          <Eyebrow className="mb-4">Stay informed</Eyebrow>
          <h2 className="m-0 mb-4 font-serif text-[clamp(1.8rem,3.4vw,2.7rem)] leading-[1.14] font-bold">
            Get our insights in your inbox
          </h2>
          <p className="m-0 mb-8 text-base text-white/70">
            Occasional, considered updates on the legal developments that matter
            to you. No noise.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
