import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { site } from "@/content/site";
import { getInsight, insightHref, insights } from "@/content/insights";
import { Avatar, Breadcrumbs, UnderlineLink } from "@/components/site/primitives";
import { Rings } from "@/components/site/rings";

export function generateStaticParams() {
  return insights.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const post = getInsight((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

function shareLinks(url: string, title: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { label: "in", name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", name: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { label: "f", name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const post = getInsight((await params).slug);
  if (!post) notFound();

  const related = insights.filter((p) => p.slug !== post.slug).slice(0, 3);
  const shares = shareLinks(`${site.url}${insightHref(post.slug)}`, post.title);

  return (
    <>
      {/* ARTICLE HEAD */}
      <section className="gutter relative overflow-hidden bg-ink py-[clamp(48px,6vw,84px)] text-white">
        <Rings preset="dark" />
        <div className="relative mx-auto max-w-[820px]">
          <Breadcrumbs
            className="mb-[26px]"
            items={[
              { label: "Home", href: "/" },
              { label: "Insights", href: "/insights" },
              { label: "Article" },
            ]}
          />
          <span className="mb-[22px] inline-block rounded-full border border-[rgba(158,27,47,.5)] px-3 py-[5px] text-[11.5px] font-semibold tracking-[.12em] text-crimson uppercase">
            {post.category}
          </span>
          <h1 className="m-0 mb-6 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] font-bold">
            {post.title}
          </h1>
          <div className="flex items-center gap-3.5">
            <Avatar size={46} />
            <div className="text-sm">
              <div className="font-semibold">{post.author}</div>
              <div className="text-white/55">
                {post.date} · {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE IMAGE */}
      <div className="gutter mx-auto max-w-[1000px]">
        <div className="relative mt-[clamp(-40px,-4vw,-56px)] h-[clamp(240px,34vw,420px)] overflow-hidden border border-black/10 bg-[#EAEAEA]">
          <Image
            src={post.img}
            alt=""
            fill
            priority
            sizes="(min-width: 1000px) 1000px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* BODY */}
      <article className="gutter bg-paper pt-[clamp(44px,5vw,72px)] pb-[clamp(56px,7vw,96px)]">
        <div className="mx-auto max-w-[720px]">
          <p className="m-0 mb-[34px] font-serif text-[clamp(1.15rem,1.8vw,1.4rem)] leading-[1.5] italic">
            {post.lede ?? post.excerpt}
          </p>
          {post.blocks?.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2
                  key={i}
                  className="m-0 mt-[38px] mb-4 font-serif text-[clamp(1.4rem,2.4vw,1.8rem)] leading-[1.2] font-semibold"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={i}
                  className="my-8 border-l-[3px] border-crimson py-1 pl-[26px] font-serif text-[1.3rem] leading-[1.4] italic"
                >
                  {block.text}
                </blockquote>
              );
            }
            return (
              <p key={i} className="m-0 mb-[22px] text-[17px] text-ink-body">
                {block.text}
              </p>
            );
          })}

          {/* DISCLAIMER */}
          <div className="mt-9 border-l-[3px] border-crimson bg-sand px-[22px] py-[18px]">
            <p className="m-0 text-[13.5px] leading-[1.6] text-muted-foreground">
              <strong className="font-semibold text-ink">Disclaimer:</strong> This
              article is provided for general information only and does not
              constitute legal advice. Laws and regulations change, and their
              application depends on your specific circumstances. You should seek
              advice from a qualified advocate before acting on anything set out
              here. Baluti &amp; Co. Advocates accepts no liability for actions
              taken in reliance on this content.
            </p>
          </div>

          {/* SHARE + AUTHOR */}
          <div className="mt-10 flex flex-col items-center gap-6 border-t border-black/14 pt-8 sm:mt-11 sm:flex-row sm:flex-wrap sm:justify-between">
            <div className="flex items-center justify-center gap-4">
              <Avatar size={60} />
              <div>
                <div className="text-[15px] font-semibold">{post.author}</div>
                <div className="text-[13.5px] text-muted-foreground">{post.authorRole}</div>
              </div>
            </div>
            <div className="flex w-full justify-center gap-[18px] sm:w-auto sm:gap-2.5">
              {shares.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${s.name}`}
                  className="flex size-11 shrink-0 items-center justify-center border border-black/18 text-xs font-semibold text-muted-foreground hover:border-crimson hover:text-crimson"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* RELATED */}
      <section className="gutter bg-sand py-section-sm">
        <div className="site-container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <h2 className="m-0 font-serif text-[clamp(1.6rem,2.8vw,2.2rem)] font-bold">
              Related insights
            </h2>
            <UnderlineLink href="/insights">View all</UnderlineLink>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={insightHref(p.slug)}
                className="flex flex-col overflow-hidden border border-black/9 bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-24px_rgba(20,20,24,.4)]"
              >
                <div className="relative h-[150px] bg-[#EAEAEA]">
                  <Image src={p.img} alt="" fill sizes="(min-width: 900px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col px-6 pt-6 pb-[26px]">
                  <span className="mb-3 self-start text-[11px] font-semibold tracking-[.12em] text-crimson uppercase">
                    {p.category}
                  </span>
                  <h3 className="m-0 mb-auto font-serif text-[1.15rem] leading-[1.3] font-semibold">
                    {p.shortTitle ?? p.title}
                  </h3>
                  <div className="mt-[18px] text-[13px] text-ink-faint">
                    {p.date} · {p.readTime.replace(" read", "")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
