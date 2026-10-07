import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { site } from "@/content/site";
import { ConsultationForm } from "@/components/contact/consultation-form";
import { Copy as C, EmailLink, PhoneLink } from "@/components/site/copy";
import { Faq } from "@/components/contact/faq";
import { visibleKeys } from "@/content/lists";
import { PageHero } from "@/components/site/page-hero";
import { Eyebrow } from "@/components/site/primitives";
import { StickyColumn } from "@/components/site/sticky-column";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free consultation with Baluti & Co. Advocates in Ntinda, Kampala. Available 24/7 online, and by phone and in person during office hours.",
};

function ContactItem({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[44px_1fr] items-center gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-[2px] bg-ink text-white">
        {icon}
      </span>
      <div>
        <div className="mb-0.5 font-semibold">{title}</div>
        {children}
      </div>
    </div>
  );
}

const detail = "text-[14.5px] text-muted-foreground";

export default function ContactPage() {
  return (
    <>
      <PageHero
        className="py-[clamp(56px,7vw,96px)]"
        crumbs={[
          { label: <C id="nav.home" />, href: "/" },
          { label: <C id="nav.contact" /> },
        ]}
        eyebrow={<C id="contact.hero.eyebrow" />}
        title={<C id="contact.hero.title" />}
        intro={<C id="contact.hero.intro" />}
      />

      {/* FORM + DETAILS */}
      <section className="gutter bg-paper py-section-sm">
        <div className="site-container grid grid-cols-[minmax(0,1fr)] items-start gap-[clamp(36px,5vw,64px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <h2 className="m-0 mb-[18px] font-serif text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.14] font-bold">
              <C id="contact.book.title" />
            </h2>
            <p className="m-0 mb-7 max-w-[48ch] text-base text-muted-foreground">
              <C id="contact.book.body" />
            </p>
            <div className="flex flex-col gap-[22px]">
              <ContactItem
                icon={<MapPin size={21} />}
                title={<C id="contact.label.visit" />}
              >
                <a href={site.address.mapUrl} className={detail}>
                  <C id="contact.address.line1" />
                  <br />
                  <C id="contact.address.line2" />
                </a>
              </ContactItem>
              <ContactItem
                icon={<Phone size={21} />}
                title={<C id="contact.label.call" />}
              >
                {visibleKeys("phones").map((k, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    <PhoneLink id={`contact.phone.${k}`} className={detail} />
                  </span>
                ))}
              </ContactItem>
              <ContactItem
                icon={<Mail size={21} />}
                title={<C id="contact.label.email" />}
              >
                {visibleKeys("emails").map((k, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    <EmailLink id={`contact.email.${k}`} className={detail} />
                  </span>
                ))}
              </ContactItem>
              <ContactItem
                icon={<Clock size={21} />}
                title={<C id="contact.label.hours" />}
              >
                <div className={detail}>
                  <C id="contact.hours.weekdays" />
                  <br />
                  <C id="contact.hours.saturday" />
                </div>
              </ContactItem>
            </div>
          </div>

          <StickyColumn className="border border-black/10 bg-white p-[clamp(16px,2vw,24px)]">
            <ConsultationForm />
          </StickyColumn>
        </div>
      </section>

      {/* MAP PLACEHOLDER */}
      <section className="bg-sand p-0">
        <a
          href={site.address.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-[clamp(280px,34vw,420px)] items-center justify-center border-y border-black/10 bg-[linear-gradient(160deg,#E4E4E4,#CFCFCF)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.06)_1px,transparent_1px)] bg-size-[44px_44px]" />
          <div className="relative text-center">
            <div className="mx-auto mb-3.5 size-[52px] -rotate-45 rounded-[50%_50%_50%_0] bg-crimson shadow-[0_12px_24px_-8px_rgba(20,20,24,.5)]" />
            <div className="font-semibold text-ink">
              <C id="contact.map.name" />
            </div>
            <div className="text-sm text-muted-foreground">
              <C id="contact.address.short" />
            </div>
          </div>
        </a>
      </section>

      {/* FAQ */}
      <section className="gutter bg-paper py-section">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-11 text-center">
            <Eyebrow className="mb-3.5">
              <C id="faq.eyebrow" />
            </Eyebrow>
            <h2 className="m-0 font-serif text-[clamp(1.8rem,3.2vw,2.6rem)] font-bold">
              <C id="faq.title" />
            </h2>
          </div>
          <Faq items={visibleKeys("faq")} />
        </div>
      </section>
    </>
  );
}
