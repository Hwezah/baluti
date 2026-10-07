// Every piece of text on the site, organised into sections. Pages render
// text by id through <Copy> / useCopy(), which return the client's latest
// edit or this demo text. The admin panel (/admin) shows only the fields the
// client should own (see `isClientField`); the rest stays developer-managed.
//
// Data-backed text (practice areas, people, articles, contact details) is
// generated from src/content so there is still one source of demo text.

import { approachSteps, site, values } from "@/content/site";
import {
  featuredPracticeAreas,
  footerPracticeAreas,
  practiceAreas,
  practiceGroups,
} from "@/content/practice-areas";
import { emmanuel, people, personKeys, type Person } from "@/content/people";
import { featuredInsight, insights } from "@/content/insights";

export type CopyField = {
  id: string;
  label: string;
  /** The original demo text. */
  text: string;
};

export type CopySection = {
  id: string;
  /** Page grouping shown in the admin navigation. */
  group: string;
  title: string;
  /** Where to see it on the site. */
  href: string;
  /** What the section is for. */
  purpose: string;
  /** What good text here should cover. */
  covers: string;
  fields: CopyField[];
};

const f = (id: string, label: string, text: string): CopyField => ({
  id,
  label,
  text,
});

// ─── Site-wide ────────────────────────────────────────────────────────────

const siteWide: CopySection[] = [
  {
    id: "contact-details",
    group: "Site-wide",
    title: "Contact details",
    href: "/contact",
    purpose:
      "The firm’s address, phone numbers, emails and opening hours. They appear in the top bar, the menus, the footer and the Contact page.",
    covers:
      "Accurate, current details only. Phone numbers and emails become tap-to-call and tap-to-email links automatically, so type them exactly as they should be dialled or written.",
    fields: [
      f("contact.address.line1", "Address — first line", site.address.line1),
      f("contact.address.line2", "Address — second line", site.address.line2),
      f(
        "contact.address.short",
        "Address — one-line version",
        site.address.short,
      ),
      ...site.phones.map((p, i) =>
        f(
          `contact.phone.${i}`,
          i === 0 ? "Main phone number" : "Second phone number",
          p.label,
        ),
      ),
      ...site.emails.map((e, i) =>
        f(
          `contact.email.${i}`,
          i === 0 ? "General enquiries email" : "Founder’s email",
          e.label,
        ),
      ),
      f(
        "contact.hours.weekdays",
        "Opening hours — weekdays",
        site.hours.weekdays,
      ),
      f(
        "contact.hours.saturday",
        "Opening hours — Saturday",
        site.hours.saturday,
      ),
      f(
        "contact.hours.compact",
        "Opening hours — short version (footer & panel)",
        site.hours.compact,
      ),
    ],
  },
  {
    id: "navigation",
    group: "Site-wide",
    title: "Menu & navigation",
    href: "/",
    purpose:
      "The labels in the main menu, the mobile menu and the slide-out contact panel.",
    covers:
      "Short, familiar words (one to three) so visitors know exactly where each link goes. Keep them consistent with the page headings.",
    fields: [
      f("nav.home", "Menu — Home", "Home"),
      f("nav.about", "Menu — About", "About"),
      f("nav.practice", "Menu — Practice Areas", "Practice Areas"),
      f("nav.people", "Menu — People", "People"),
      f("nav.insights", "Menu — Insights", "Insights"),
      f("nav.contact", "Menu — Contact", "Contact"),
      f(
        "nav.areasHeading",
        "Practice areas dropdown heading",
        "Our Practice Areas",
      ),
      f("nav.menuCta", "Mobile menu button", "Free consultation"),
      f("panel.eyebrow", "Contact panel — small label", "Need help?"),
      f("panel.title", "Contact panel — heading", "Receive legal help today"),
      f("panel.cta", "Contact panel — button", "Free consultation"),
    ],
  },
  {
    id: "footer",
    group: "Site-wide",
    title: "Firm description (footer)",
    href: "/",
    purpose:
      "The black band at the bottom of every page: a short description of the firm, quick links and contact details.",
    covers: "A one or two sentence summary of who the firm serves and how.",
    fields: [
      f(
        "footer.blurb",
        "Firm description",
        "Applying law to facts. Caring, dedicated representation for individuals and businesses across Uganda and the region.",
      ),
      f("footer.companyHeading", "Column heading — company links", "Company"),
      f("footer.link.home", "Company link — Home", "Home"),
      f("footer.link.about", "Company link — About", "About Us"),
      f("footer.link.people", "Company link — People", "Our People"),
      f("footer.link.insights", "Company link — Insights", "Insights"),
      f("footer.link.contact", "Company link — Contact", "Contact"),
      f(
        "footer.areasHeading",
        "Column heading — practice areas",
        "Practice Areas",
      ),
      ...footerPracticeAreas.map((a) =>
        f(`footer.area.${a.slug}`, `Practice area link — ${a.label}`, a.label),
      ),
      f("footer.viewAll", "“View all areas” link", "View all areas"),
      f("footer.contactHeading", "Column heading — contact", "Get in touch"),
      f("footer.book", "Booking button", "Book an appointment"),
      f(
        "footer.copyright",
        "Copyright line ({year} becomes the current year)",
        "© Copyright {year} Baluti & Co. Advocates. All Rights Reserved.",
      ),
      f("footer.terms", "Terms link", "Terms of Service"),
      f("footer.privacy", "Privacy link", "Privacy Policy"),
    ],
  },
  {
    id: "common",
    group: "Site-wide",
    title: "Buttons & small labels",
    href: "/",
    purpose:
      "Short labels reused across many pages, such as “Learn more” on cards and “View all” links next to section headings.",
    covers:
      "Action words that tell the visitor what happens next. Keep them short so they fit on buttons and cards on a phone.",
    fields: [
      f("common.learnMore", "Card link — learn more", "Learn more"),
      f("common.readArticle", "Article card link", "Read article"),
      f("common.viewAll", "“View all” link", "View all"),
      f("common.viewAllAreas", "“View all areas” link", "View all areas"),
      f("common.viewAllPeople", "“View all people” link", "View all people"),
      f(
        "common.freeConsultation",
        "“Free consultation” button",
        "Free consultation",
      ),
      f("common.getInTouch", "“Get in touch” button", "Get in touch"),
    ],
  },
];

// ─── Home ─────────────────────────────────────────────────────────────────

const home: CopySection[] = [
  {
    id: "home-hero",
    group: "Home",
    title: "Hero (top of the home page)",
    href: "/",
    purpose:
      "The first thing every visitor sees. It introduces the firm and its promise in a few seconds.",
    covers:
      "Who the firm is, what it protects, and why to trust it — in one bold headline and one supporting sentence. The rotating words complete “Protecting your …”, so each should read naturally after it.",
    fields: [
      f(
        "home.hero.eyebrow",
        "Small label above the headline",
        "Baluti & Co. Advocates",
      ),
      f("home.hero.line1", "Headline — first line", "Defending your rights."),
      f(
        "home.hero.line2",
        "Headline — start of second line",
        "Protecting your",
      ),
      f(
        "home.hero.words",
        "Rotating words (separate with commas)",
        "future, business, legacy, property, reputation, family, investments",
      ),
      f(
        "home.hero.body",
        "Supporting sentence",
        "We respect our clients. We listen, engage, and care deeply — applying law to facts to deliver outcomes that stand.",
      ),
      f("home.hero.ctaPeople", "First button (desktop)", "Meet our lawyers"),
      f("home.hero.ctaPeopleShort", "First button (phones)", "Our lawyers"),
      f("home.hero.ctaAreas", "Second button (desktop)", "Our practice areas"),
      f("home.hero.ctaAreasShort", "Second button (phones)", "Practice areas"),
      f("home.hero.chip.business", "Quick link — Business", "Business"),
      f(
        "home.hero.chip.banking",
        "Quick link — Banking (desktop)",
        "Banking & Financial",
      ),
      f(
        "home.hero.chip.bankingShort",
        "Quick link — Banking (phones)",
        "Banking",
      ),
      f("home.hero.chip.litigation", "Quick link — Litigation", "Litigation"),
    ],
  },
  {
    id: "home-why",
    group: "Home",
    title: "Why hire us",
    href: "/",
    purpose:
      "Four cards giving quick reasons to choose the firm, each linking to more detail.",
    covers:
      "A headline about the firm’s standard of service, then one short benefit per card: reputation, the firm, careers and how to get in touch.",
    fields: [
      f("home.why.eyebrow", "Small label", "Why hire us?"),
      f(
        "home.why.title",
        "Section heading",
        "Our standard of excellence is fuelled by the desire to protect you",
      ),
      f("home.why.0.title", "Card 1 — title", "Reviews"),
      f(
        "home.why.0.body",
        "Card 1 — text",
        "Clients consistently recommend us to anyone needing a trusted advocate.",
      ),
      f("home.why.1.title", "Card 2 — title", "About"),
      f(
        "home.why.1.body",
        "Card 2 — text",
        "Our standard of excellence is fuelled by the desire to protect you.",
      ),
      f("home.why.2.title", "Card 3 — title", "Careers"),
      f(
        "home.why.2.body",
        "Card 3 — text",
        "We hire people who believe in caring, dedicated representation.",
      ),
      f("home.why.3.title", "Card 4 — title", "Contact"),
      f(
        "home.why.3.body",
        "Card 4 — text",
        "Connect with us in person, by phone, by email, or 24/7 online.",
      ),
    ],
  },
  {
    id: "home-practice",
    group: "Home",
    title: "Practice areas carousel",
    href: "/",
    purpose:
      "A sideways-scrolling row of featured practice areas. Each card’s title and summary come from the Practice Areas sections below.",
    covers:
      "A clear heading and a one or two word tag per card that groups the area (e.g. Disputes, Workplace).",
    fields: [
      f("home.practice.eyebrow", "Small label", "What we do"),
      f("home.practice.title", "Section heading", "Legal practice areas"),
      ...featuredPracticeAreas.map((c) => {
        const area = practiceAreas.find((a) => a.slug === c.slug)!;
        return f(
          `home.practice.tag.${c.slug}`,
          `Card tag — ${area.title}`,
          c.tag,
        );
      }),
    ],
  },
  {
    id: "home-trust",
    group: "Home",
    title: "Trust banner",
    href: "/",
    purpose:
      "A single bold statement on black with a button to the Contact page.",
    covers:
      "One confident sentence about how the firm works with clients, and a clear button label.",
    fields: [
      f(
        "home.trust.title",
        "Statement",
        "We build trust, understand needs and provide solutions",
      ),
      f("home.trust.cta", "Button", "Contact us"),
    ],
  },
  {
    id: "home-values",
    group: "Home",
    title: "Values preview",
    href: "/",
    purpose:
      "Introduces the firm’s values next to the numbered list. The four values themselves are edited in “Our values” under About.",
    covers:
      "A heading, one sentence on the firm’s commitment, and a button to the About page.",
    fields: [
      f("home.values.eyebrow", "Small label", "Our values"),
      f(
        "home.values.title",
        "Section heading",
        "Fundamental principles that define our practice",
      ),
      f(
        "home.values.body",
        "Introduction",
        "The way we work is shaped by a simple commitment: to treat every client, colleague, and matter with the care it deserves.",
      ),
      f("home.values.cta", "Button", "Learn more about us"),
    ],
  },
  {
    id: "home-team",
    group: "Home",
    title: "Meet our attorneys",
    href: "/",
    purpose:
      "Previews four team members. Names and roles are edited in “Team members” under People.",
    covers: "A short heading that invites visitors to meet the team.",
    fields: [
      f("home.team.eyebrow", "Small label", "Our team"),
      f("home.team.title", "Section heading", "Meet our attorneys"),
    ],
  },
  {
    id: "home-stats",
    group: "Home",
    title: "Track record (numbers)",
    href: "/",
    purpose:
      "Four headline numbers that show the firm’s experience at a glance.",
    covers:
      "Figures the firm can stand behind: years of practice, practice areas, team size and matters handled. Keep each label to a few words.",
    fields: [
      f("home.stats.eyebrow", "Small label", "Track record"),
      f(
        "home.stats.title",
        "Section heading",
        "Results that speak for themselves",
      ),
      f("home.stats.0.value", "Number 1", "35+"),
      f("home.stats.0.label", "Number 1 — label", "Years of combined practice"),
      f("home.stats.1.value", "Number 2", "18"),
      f("home.stats.1.label", "Number 2 — label", "Distinct practice areas"),
      f("home.stats.2.value", "Number 3", "40+"),
      f("home.stats.2.label", "Number 3 — label", "Attorneys and staff"),
      f("home.stats.3.value", "Number 4", "1,000+"),
      f("home.stats.3.label", "Number 4 — label", "Matters handled"),
    ],
  },
  {
    id: "home-reviews",
    group: "Home",
    title: "Client reviews",
    href: "/#reviews",
    purpose: "Four short testimonials from clients.",
    covers:
      "Real quotes, used with permission, with the client’s first name, initial and town. Two or three sentences each works best.",
    fields: [
      f("home.reviews.eyebrow", "Small label", "Client reviews"),
      f(
        "home.reviews.title",
        "Section heading",
        "What our clients say about us",
      ),
      ...[
        [
          "Megan A.",
          "Kampala",
          "I was nervous when I first called, but they were genuinely friendly and put me at ease. They handled everything with real care.",
        ],
        [
          "James O.",
          "Entebbe",
          "An amazing experience from start to finish. They kept me informed at every step, and I’ll happily refer my family and friends.",
        ],
        [
          "Jonathan K.",
          "Jinja",
          "Professional, responsive, and thorough. They explained my options in plain language and fought hard for the outcome I needed.",
        ],
        [
          "Logan M.",
          "Kampala",
          "I was very happy with the communication between counsel and myself throughout. I always knew exactly where things stood.",
        ],
      ].flatMap(([name, place, quote], i) => [
        f(`home.reviews.${i}.quote`, `Review ${i + 1} — quote`, quote),
        f(`home.reviews.${i}.name`, `Review ${i + 1} — client name`, name),
        f(`home.reviews.${i}.place`, `Review ${i + 1} — town`, place),
      ]),
    ],
  },
  {
    id: "home-insights",
    group: "Home",
    title: "Latest insights",
    href: "/",
    purpose:
      "Shows the three newest articles. Article titles are edited under Insights.",
    covers: "A short heading for the news and articles preview.",
    fields: [
      f("home.insights.eyebrow", "Small label", "Insights"),
      f("home.insights.title", "Section heading", "Latest news & insights"),
    ],
  },
  {
    id: "home-cta",
    group: "Home",
    title: "“Need help?” call to action",
    href: "/",
    purpose:
      "The closing band on the home page that asks visitors to get in touch.",
    covers:
      "When and how visitors can reach the firm (online, by phone, in person). Make sure any promise, like “24/7”, is accurate.",
    fields: [
      f("home.cta.eyebrow", "Small label", "Need help?"),
      f(
        "home.cta.title",
        "Heading",
        "Find your best fit out of top-notch lawyers.",
      ),
      f(
        "home.cta.body",
        "Supporting sentence",
        "Contact us anytime for a consultation — available 24/7 online, and in person at our Ntinda chambers.",
      ),
      f("home.cta.button", "Button", "Request a consultation"),
    ],
  },
];

// ─── About ────────────────────────────────────────────────────────────────

const about: CopySection[] = [
  {
    id: "about-hero",
    group: "About",
    title: "About page heading",
    href: "/about",
    purpose: "The black banner at the top of the About page.",
    covers:
      "What kind of firm this is, who it serves, and what makes its approach different — in a headline and two lines of text.",
    fields: [
      f("about.hero.eyebrow", "Small label", "About the firm"),
      f(
        "about.hero.title",
        "Headline",
        "Applying law to facts, with people at the centre",
      ),
      f(
        "about.hero.intro",
        "Introduction",
        "Baluti & Co. Advocates is a full-service law firm serving individuals, businesses, and institutions across Uganda — combining technical excellence with genuine care for the people we represent.",
      ),
    ],
  },
  {
    id: "about-mission",
    group: "About",
    title: "Who we are",
    href: "/about",
    purpose: "The firm’s mission and three key numbers, next to a team photo.",
    covers:
      "How the firm treats clients and the kinds of matters it handles, in two short paragraphs, plus three figures that back it up.",
    fields: [
      f("about.mission.eyebrow", "Small label", "Who we are"),
      f(
        "about.mission.title",
        "Section heading",
        "A firm built on trust, clarity, and results",
      ),
      f(
        "about.mission.p1",
        "First paragraph",
        "Our standard of excellence is fuelled by a single desire: to protect you. We take the time to understand each client’s circumstances, explain the law in plain terms, and pursue the outcome that matters most to them.",
      ),
      f(
        "about.mission.p2",
        "Second paragraph",
        "Whether we’re advising a growing business, resolving a dispute, or guiding a family through a difficult moment, we bring the same rigour, discretion, and commitment to every matter.",
      ),
      f("about.mission.stat.0.value", "Number 1", "35+"),
      f(
        "about.mission.stat.0.label",
        "Number 1 — label",
        "Years of combined practice",
      ),
      f("about.mission.stat.1.value", "Number 2", "18"),
      f("about.mission.stat.1.label", "Number 2 — label", "Practice areas"),
      f("about.mission.stat.2.value", "Number 3", "40+"),
      f("about.mission.stat.2.label", "Number 3 — label", "Attorneys & staff"),
    ],
  },
  {
    id: "about-story",
    group: "About",
    title: "Our story (timeline)",
    href: "/about",
    purpose: "Four milestones in the firm’s history.",
    covers:
      "Accurate years and events: when the firm was founded, how it grew, recognition received, and where it is today. One sentence per milestone.",
    fields: [
      f("about.story.eyebrow", "Small label", "Our story"),
      f(
        "about.story.title",
        "Section heading",
        "From a small practice to a trusted name",
      ),
      ...[
        [
          "2009",
          "The firm is founded",
          "Baluti & Co. opens its doors with a focus on litigation and commercial advisory.",
        ],
        [
          "2014",
          "Practice expands",
          "New partners join, broadening our reach across banking, employment, and property law.",
        ],
        [
          "2019",
          "Regional recognition",
          "The firm is recognised among leading practitioners in the region for client service.",
        ],
        [
          "Today",
          "A full-service firm",
          "Eighteen practice areas and a team of over forty advocates and support staff.",
        ],
      ].flatMap(([year, title, body], i) => [
        f(`about.story.${i}.year`, `Milestone ${i + 1} — year`, year),
        f(`about.story.${i}.title`, `Milestone ${i + 1} — title`, title),
        f(`about.story.${i}.body`, `Milestone ${i + 1} — description`, body),
      ]),
    ],
  },
  {
    id: "values",
    group: "About",
    title: "Our values (also on Home)",
    href: "/about",
    purpose:
      "The four principles that define the firm. The longer text shows on About; the shorter text shows on the Home page.",
    covers:
      "A short name for each value and a sentence on what it means for clients in practice.",
    fields: [
      f("about.values.eyebrow", "Small label (About page)", "Our values"),
      f(
        "about.values.title",
        "Section heading (About page)",
        "Fundamental principles that define our practice",
      ),
      ...values.flatMap((v, i) => [
        f(`values.${i}.title`, `Value ${i + 1} — name`, v.title),
        f(`values.${i}.body`, `Value ${i + 1} — description (About)`, v.body),
        f(
          `values.${i}.short`,
          `Value ${i + 1} — short description (Home)`,
          v.short,
        ),
      ]),
    ],
  },
  {
    id: "about-approach",
    group: "About",
    title: "How we work",
    href: "/about",
    purpose: "Four numbered steps describing how the firm handles a matter.",
    covers:
      "The stages a client goes through with the firm, one verb and one sentence each.",
    fields: [
      f("about.approach.eyebrow", "Small label", "How we work"),
      f(
        "about.approach.title",
        "Section heading",
        "A clear, considered approach to every matter",
      ),
      ...approachSteps.flatMap((s, i) => [
        f(`about.steps.${i}.title`, `Step ${i + 1} — name`, s.title),
        f(`about.steps.${i}.body`, `Step ${i + 1} — description`, s.body),
      ]),
    ],
  },
  {
    id: "about-quote",
    group: "About",
    title: "Founder’s quote",
    href: "/about",
    purpose:
      "A quote from the founder. The name and role underneath come from “Team members”.",
    covers:
      "A genuine, memorable sentence that captures why the firm does what it does.",
    fields: [
      f(
        "about.quote",
        "Quote",
        "We don’t just want to do well — we want our clients to get what they’re entitled to, and the defendants to face real accountability.",
      ),
    ],
  },
  {
    id: "about-cta",
    group: "About",
    title: "Closing call to action",
    href: "/about",
    purpose: "The invitation at the bottom of the About page.",
    covers: "A friendly prompt to book a consultation, with two button labels.",
    fields: [
      f("about.cta.title", "Heading", "Let’s talk about how we can help"),
      f(
        "about.cta.body",
        "Text",
        "Book a free consultation and speak with an advocate about your situation.",
      ),
      f("about.cta.secondary", "Second button", "Meet our people"),
    ],
  },
];

// ─── People ───────────────────────────────────────────────────────────────

const personFields = (key: string, p: Person, i: number): CopyField[] => {
  const who = p.name === "Name" ? `Person ${i + 1} (placeholder)` : p.name;
  return [
    f(`person.${key}.name`, `${who} — name`, p.name),
    f(`person.${key}.role`, `${who} — role`, p.role),
    ...(p.bio
      ? [f(`person.${key}.bio`, `${who} — short bio (People page)`, p.bio)]
      : []),
    ...(p.area
      ? [f(`person.${key}.area`, `${who} — practice focus`, p.area)]
      : []),
  ];
};

const peopleSections: CopySection[] = [
  {
    id: "people-hero",
    group: "People",
    title: "People page heading",
    href: "/people",
    purpose: "The black banner at the top of the People page.",
    covers:
      "A headline about the team and a sentence on what sets the firm’s advocates apart.",
    fields: [
      f("people.hero.eyebrow", "Small label", "Our team"),
      f("people.hero.title", "Headline", "The advocates behind every outcome"),
      f(
        "people.hero.intro",
        "Introduction",
        "Our strength is our people — experienced advocates who combine deep technical knowledge with genuine care for the clients they serve.",
      ),
      f("people.leadership.eyebrow", "Leadership — small label", "Leadership"),
      f(
        "people.leadership.title",
        "Leadership — heading",
        "Partners & founders",
      ),
      f(
        "people.team.eyebrow",
        "Wider team — small label",
        "Advocates & associates",
      ),
      f("people.team.title", "Wider team — heading", "Meet the wider team"),
    ],
  },
  {
    id: "team-members",
    group: "People",
    title: "Team members",
    href: "/people",
    purpose:
      "Names, roles and short descriptions for everyone shown on the site. Entries named “Name” are placeholders waiting for real people. A change here updates every page the person appears on.",
    covers:
      "Each person’s full name as they want it published, their exact title, and (for partners) one sentence on what they lead.",
    fields: personKeys.flatMap((key, i) => personFields(key, people[key], i)),
  },
  {
    id: "people-careers",
    group: "People",
    title: "Careers",
    href: "/people#careers",
    purpose:
      "Encourages lawyers and staff to apply, with four reasons to join.",
    covers:
      "Who the firm wants to hire and what it offers them: responsibility, variety, growth and culture.",
    fields: [
      f("people.careers.eyebrow", "Small label", "Careers"),
      f("people.careers.title", "Heading", "Build your practice with us"),
      f(
        "people.careers.body",
        "Text",
        "Baluti & Co. is committed to hiring people who believe in providing caring, dedicated representation. If that sounds like you, we’d love to hear from you.",
      ),
      f("people.careers.cta", "Button", "Explore opportunities"),
      ...[
        [
          "Real responsibility",
          "Meaningful client work and mentorship from day one.",
        ],
        [
          "Broad exposure",
          "Experience across eighteen distinct practice areas.",
        ],
        ["Growth support", "Ongoing training and a clear path to progression."],
        [
          "A team that cares",
          "A culture built on respect, trust, and collaboration.",
        ],
      ].flatMap(([title, body], i) => [
        f(`people.perks.${i}.title`, `Reason ${i + 1} — title`, title),
        f(`people.perks.${i}.body`, `Reason ${i + 1} — text`, body),
      ]),
      f("people.cta.title", "Closing heading", "Speak with the right advocate"),
      f(
        "people.cta.body",
        "Closing text",
        "Tell us about your matter and we’ll connect you with the best person for it.",
      ),
    ],
  },
  {
    id: "attorney-emmanuel",
    group: "People",
    title: `${emmanuel.name} — profile page`,
    href: `/people/${emmanuel.slug}`,
    purpose:
      "The founder’s full profile: introduction, biography, notable work, credentials and languages.",
    covers:
      "A one-sentence summary of what he does, a short biography in three paragraphs, four examples of representative work (without confidential details), qualifications and languages.",
    fields: [
      f(
        "attorney.emmanuel.first",
        "First name (used in “About …” and “Email …”)",
        emmanuel.first,
      ),
      f("attorney.emmanuel.email", "Email address", emmanuel.email),
      f(
        "attorney.emmanuel.tagline",
        "Summary under the name",
        emmanuel.tagline,
      ),
      ...emmanuel.about.map((p, i) =>
        f(`attorney.emmanuel.about.${i}`, `Biography — paragraph ${i + 1}`, p),
      ),
      ...emmanuel.matters.map((m, i) =>
        f(`attorney.emmanuel.matters.${i}`, `Representative work ${i + 1}`, m),
      ),
      ...emmanuel.credentials.flatMap((c, i) => [
        f(
          `attorney.emmanuel.credentials.${i}.title`,
          `Credential ${i + 1}`,
          c.title,
        ),
        f(
          `attorney.emmanuel.credentials.${i}.detail`,
          `Credential ${i + 1} — detail`,
          c.detail,
        ),
      ]),
      f("attorney.emmanuel.languages", "Languages", emmanuel.languages),
    ],
  },
  {
    id: "attorney-labels",
    group: "People",
    title: "Profile page labels",
    href: `/people/${emmanuel.slug}`,
    purpose: "Headings and buttons used on every attorney profile page.",
    covers: "Short, clear headings for each part of a profile.",
    fields: [
      f(
        "attorney.label.about",
        "Biography heading (followed by first name)",
        "About",
      ),
      f(
        "attorney.label.email",
        "Email button (followed by first name)",
        "Email",
      ),
      f(
        "attorney.label.work",
        "Representative work heading",
        "Representative work",
      ),
      f("attorney.label.areas", "Practice areas heading", "Practice areas"),
      f("attorney.label.credentials", "Credentials heading", "Credentials"),
      f("attorney.label.languages", "Languages heading", "Languages"),
      f("attorney.label.more", "Other people heading", "More from our team"),
    ],
  },
];

// ─── Practice areas ───────────────────────────────────────────────────────

const practiceIndex: CopySection[] = [
  {
    id: "practice-index",
    group: "Practice areas",
    title: "Practice Areas page",
    href: "/practice-areas",
    purpose:
      "The overview page listing every practice area under four groups, followed by the firm’s process.",
    covers:
      "How broad the firm’s expertise is (keep the number of areas accurate) and the names of the groups.",
    fields: [
      f("practiceIndex.hero.eyebrow", "Small label", "What we do"),
      f(
        "practiceIndex.hero.title",
        "Headline",
        "Legal expertise across nine core practice areas",
      ),
      f(
        "practiceIndex.hero.intro",
        "Introduction",
        "From complex commercial transactions to personal disputes, our advocates bring depth and discretion to every area of the law we practise.",
      ),
      ...practiceGroups.map((g, i) =>
        f(`practiceIndex.group.${i}`, `Group ${i + 1} name`, g.name),
      ),
      f(
        "practiceIndex.process.eyebrow",
        "Process — small label",
        "How we work",
      ),
      f(
        "practiceIndex.process.title",
        "Process — heading",
        "Whatever the matter, the same considered approach",
      ),
      ...[
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
      ].flatMap((s, i) => [
        f(
          `practiceIndex.steps.${i}.title`,
          `Process step ${i + 1} — name`,
          s.title,
        ),
        f(
          `practiceIndex.steps.${i}.body`,
          `Process step ${i + 1} — description`,
          s.body,
        ),
      ]),
      f(
        "practiceIndex.cta.title",
        "Closing heading",
        "Not sure which area fits your situation?",
      ),
      f(
        "practiceIndex.cta.body",
        "Closing text",
        "Tell us what you’re facing and we’ll point you to the right advocate.",
      ),
    ],
  },
  {
    id: "practice-detail-labels",
    group: "Practice areas",
    title: "How we handle a matter (practice area pages)",
    href: "/practice-areas/banking",
    purpose:
      "The four-step approach shown on practice area pages that don’t have their own steps.",
    covers: "The stages a client goes through, one word and one sentence each.",
    fields: [
      f("practiceDetail.help", "“How we can help” heading", "How we can help"),
      f("practiceDetail.services", "Services heading", "Our services include"),
      f("practiceDetail.approach", "Approach heading", "Our approach"),
      ...[
        [
          "Listen",
          "We begin by understanding your situation, your goals, and what a good outcome looks like for you.",
        ],
        [
          "Advise",
          "We set out the law and your options clearly, so you can make informed decisions.",
        ],
        [
          "Act",
          "We move deliberately on your behalf, keeping you informed at every stage of the matter.",
        ],
        [
          "Deliver",
          "We pursue the result that best protects your interests, and stand behind our work.",
        ],
      ].flatMap(([title, body], i) => [
        f(
          `practiceDetail.steps.${i}.title`,
          `Default step ${i + 1} — name`,
          title,
        ),
        f(
          `practiceDetail.steps.${i}.body`,
          `Default step ${i + 1} — description`,
          body,
        ),
      ]),
      f("practiceDetail.sidebar.title", "Sidebar heading", "Speak to our team"),
      f(
        "practiceDetail.sidebar.body",
        "Sidebar text",
        "Book a free, confidential consultation about your matter.",
      ),
      f("practiceDetail.related", "Related areas heading", "Related areas"),
      f(
        "practiceDetail.contacts.eyebrow",
        "Key contacts — small label",
        "Key contacts",
      ),
      f(
        "practiceDetail.contacts.title",
        "Key contacts — heading",
        "Advocates in this practice",
      ),
      f(
        "practiceDetail.cta.title",
        "Closing heading",
        "Facing a matter in this area?",
      ),
      f(
        "practiceDetail.cta.body",
        "Closing text",
        "Tell us what you’re dealing with and we’ll advise on the best way forward.",
      ),
    ],
  },
  ...practiceAreas.map(
    (area): CopySection => ({
      id: `practice-${area.slug}`,
      group: "Practice areas",
      title: area.title,
      href: `/practice-areas/${area.slug}`,
      purpose: `Everything on the ${area.title} page. The title and summary also appear on cards, menus and the footer.`,
      covers:
        "Who this area helps and with what problems, how the firm approaches it, and the specific services offered. Write for a client, not a lawyer.",
      fields: [
        f(`practice.${area.slug}.title`, "Name of the area", area.title),
        f(`practice.${area.slug}.group`, "Small label (group)", area.group),
        f(
          `practice.${area.slug}.summary`,
          "One-line summary (cards)",
          area.summary,
        ),
        f(
          `practice.${area.slug}.intro`,
          "Introduction (top of page)",
          area.intro,
        ),
        f(
          `practice.${area.slug}.overview.0`,
          "How we can help — paragraph 1",
          area.overview[0],
        ),
        f(
          `practice.${area.slug}.overview.1`,
          "How we can help — paragraph 2",
          area.overview[1],
        ),
        ...area.services.map((s, i) =>
          f(`practice.${area.slug}.services.${i}`, `Service ${i + 1}`, s),
        ),
        ...(area.steps ?? []).flatMap((s, i) => [
          f(
            `practice.${area.slug}.steps.${i}.title`,
            `Approach step ${i + 1} — name`,
            s.title,
          ),
          f(
            `practice.${area.slug}.steps.${i}.body`,
            `Approach step ${i + 1} — description`,
            s.body,
          ),
        ]),
      ],
    }),
  ),
];

// ─── Insights ─────────────────────────────────────────────────────────────

const insightSections: CopySection[] = [
  {
    id: "insights-page",
    group: "Insights",
    title: "Insights page",
    href: "/insights",
    purpose:
      "The teaser for the featured article at the top of the Insights page.",
    covers: "Two sentences on why the featured article matters to readers.",
    fields: [
      f("insights.hero.eyebrow", "Small label", "News & insights"),
      f(
        "insights.hero.title",
        "Headline",
        "Perspectives on the law that affects you",
      ),
      f(
        "insights.hero.intro",
        "Introduction",
        "Analysis, commentary, and firm news from the advocates at Baluti & Co. — written to keep you informed and ahead.",
      ),
      f("insights.featured.label", "Featured article label", "Featured"),
      f(
        "insights.featured.teaser",
        "Featured article teaser",
        "The most significant reform of Uganda’s labour law since 2006 widens who counts as an employee, reshapes termination, and raises the cost of getting it wrong. Here’s what to act on.",
      ),
      f(
        "insights.newsletter.eyebrow",
        "Newsletter — small label",
        "Stay informed",
      ),
      f(
        "insights.newsletter.title",
        "Newsletter — heading",
        "Get our insights in your inbox",
      ),
      f(
        "insights.newsletter.body",
        "Newsletter — text",
        "Occasional, considered updates on the legal developments that matter to you. No noise.",
      ),
      f(
        "insights.newsletter.placeholder",
        "Newsletter — email box hint",
        "Your email address",
      ),
      f("insights.newsletter.button", "Newsletter — button", "Subscribe"),
      f(
        "insights.newsletter.done",
        "Newsletter — after subscribing",
        "Subscribed ✓",
      ),
    ],
  },
  {
    id: "article-labels",
    group: "Insights",
    title: "Legal disclaimer (article pages)",
    href: `/insights/${featuredInsight.slug}`,
    purpose: "The disclaimer shown at the end of every article.",
    covers:
      "A disclaimer that the article is general information, not legal advice, reviewed by the firm.",
    fields: [
      f("article.breadcrumb", "Breadcrumb label", "Article"),
      f("article.disclaimer.label", "Disclaimer label", "Disclaimer:"),
      f(
        "article.disclaimer.text",
        "Disclaimer text",
        "This article is provided for general information only and does not constitute legal advice. Laws and regulations change, and their application depends on your specific circumstances. You should seek advice from a qualified advocate before acting on anything set out here. Baluti & Co. Advocates accepts no liability for actions taken in reliance on this content.",
      ),
      f("article.related", "Related articles heading", "Related insights"),
    ],
  },
  ...insights.map(
    (post): CopySection => ({
      id: `article-${post.slug}`,
      group: "Insights",
      title: post.shortTitle ?? post.title,
      href: `/insights/${post.slug}`,
      purpose: post.blocks
        ? "The full article: title, summary, opening paragraph and body."
        : "This article’s title and summary. It has no full text yet — the opening paragraph shows the summary until the body is written.",
      covers:
        "An accurate title, the date, a one or two sentence summary, and body text that explains the change and what readers should do.",
      fields: [
        f(`insight.${post.slug}.title`, "Title", post.title),
        ...(post.shortTitle
          ? [
              f(
                `insight.${post.slug}.shortTitle`,
                "Short title (cards)",
                post.shortTitle,
              ),
            ]
          : []),
        f(`insight.${post.slug}.excerpt`, "Summary (cards)", post.excerpt),
        f(`insight.${post.slug}.date`, "Date", post.date),
        f(`insight.${post.slug}.readTime`, "Reading time", post.readTime),
        ...(post.lede
          ? [f(`insight.${post.slug}.lede`, "Opening paragraph", post.lede)]
          : []),
        ...(post.blocks ?? []).map((b, i) =>
          f(
            `insight.${post.slug}.blocks.${i}`,
            b.type === "h2"
              ? `Subheading (block ${i + 1})`
              : b.type === "quote"
                ? `Pull quote (block ${i + 1})`
                : `Paragraph (block ${i + 1})`,
            b.text,
          ),
        ),
      ],
    }),
  ),
];

// ─── Contact ──────────────────────────────────────────────────────────────

const contact: CopySection[] = [
  {
    id: "contact-page",
    group: "Contact",
    title: "Contact page",
    href: "/contact",
    purpose:
      "The introduction and booking text on the Contact page. The address, numbers and emails themselves are in “Contact details” under Firm details.",
    covers:
      "When the firm can be reached and how quickly it responds. These are promises to clients, so keep them accurate.",
    fields: [
      f("contact.hero.eyebrow", "Small label", "Need help?"),
      f("contact.hero.title", "Headline", "Receive legal help today"),
      f(
        "contact.hero.intro",
        "Introduction",
        "Contact us anytime for a consultation. We’re available 24/7 online, and during office hours by phone and in person.",
      ),
      f("contact.book.title", "Booking heading", "Book a free consultation"),
      f(
        "contact.book.body",
        "Booking text",
        "Tell us a little about your situation and the right advocate will be in touch within one business day.",
      ),
      f("contact.label.visit", "Label — address", "Visit us"),
      f("contact.label.call", "Label — phones", "Call us"),
      f("contact.label.email", "Label — emails", "Email us"),
      f("contact.label.hours", "Label — hours", "Office hours"),
      f("contact.map.name", "Map — firm name", "Baluti & Co. Advocates"),
    ],
  },
  {
    id: "contact-form",
    group: "Contact",
    title: "Consultation form",
    href: "/contact",
    purpose:
      "The confidentiality note under the booking form and the thank-you message shown after sending.",
    covers: "What happens to the enquiry and when the firm will reply.",
    fields: [
      f("form.name", "Box hint — name", "Full name"),
      f("form.email", "Box hint — email", "Email"),
      f("form.phone", "Box hint — phone", "Phone"),
      f("form.area", "Practice area picker hint", "Select a practice area…"),
      f("form.message", "Box hint — message", "How can we help you?"),
      f("form.submit", "Send button", "Book an appointment"),
      f(
        "form.privacy",
        "Note under the button",
        "Your enquiry is confidential and protected.",
      ),
      f("form.thanks.title", "Thank-you heading", "Thank you"),
      f(
        "form.thanks.body",
        "Thank-you text",
        "We’ve received your request. A member of our team will be in touch within one business day.",
      ),
    ],
  },
  {
    id: "contact-faq",
    group: "Contact",
    title: "Frequently asked questions",
    href: "/contact",
    purpose: "Answers to the questions people ask before getting in touch.",
    covers:
      "Cost of the first consultation, response times, areas covered, who the firm works with, and confidentiality. Keep answers to two or three sentences.",
    fields: [
      f("faq.eyebrow", "Small label", "Before you reach out"),
      f("faq.title", "Heading", "Frequently asked questions"),
      ...[
        [
          "Is the first consultation really free?",
          "Yes. Your initial consultation is free and confidential — it lets us understand your situation and lets you decide whether we’re the right fit, with no obligation.",
        ],
        [
          "How quickly will someone respond?",
          "We aim to respond to every enquiry within one business day. Urgent matters are prioritised — please call us directly if the situation is time-sensitive.",
        ],
        [
          "Which areas of law do you handle?",
          "We practise across eighteen areas, from banking and corporate matters to litigation, employment, family, and property law. If we’re not the right fit, we’ll point you in the right direction.",
        ],
        [
          "Do you work with businesses as well as individuals?",
          "Absolutely. We advise individuals, growing businesses, and established institutions — tailoring our approach to the needs of each client.",
        ],
        [
          "Is my enquiry kept confidential?",
          "Every enquiry is treated in strict confidence and protected. Your information is only ever used to help us advise you.",
        ],
      ].flatMap(([q, a], i) => [
        f(`faq.${i}.q`, `Question ${i + 1}`, q),
        f(`faq.${i}.a`, `Answer ${i + 1}`, a),
      ]),
    ],
  },
];

export const copySections: CopySection[] = [
  ...siteWide,
  ...home,
  ...about,
  ...peopleSections,
  ...practiceIndex,
  ...insightSections,
  ...contact,
];

// ─── What the client edits ─────────────────────────────────────────────────
// The admin panel lists the firm's facts and legal content: contact details,
// people and credentials, practice areas, articles, reviews, numbers, the
// firm's story and promises. Menus, buttons, small labels, section headings
// and form hints are site furniture and stay developer-managed (they still
// render through <Copy>, just not in the admin panel).

const developerManaged: RegExp[] = [
  /^nav\./,
  /^panel\./,
  /^common\./,
  /^footer\.(?!blurb$)/,
  /\.eyebrow$/,
  /^home\.hero\.(cta|chip|line2$)/,
  /^home\.(why|practice|trust|values|team|insights)\./,
  /^home\.(stats|reviews)\.title$/,
  /^home\.cta\.(title|button)$/,
  /^about\.hero\.title$/,
  /^about\.(mission|story|values|approach)\.title$/,
  /^about\.cta\./,
  /^people\.(hero|leadership|team|cta)\./,
  /^people\.careers\.(title|cta)$/,
  /^attorney\.label\./,
  /^practiceIndex\.(process|steps|cta)\./,
  /^practiceDetail\.(?!steps\.)/,
  /^practice\.[^.]+\.group$/,
  /^insights\.(hero|newsletter)\./,
  /^insights\.featured\.label$/,
  /^article\.(?!disclaimer\.text$)/,
  /^insight\.[^.]+\.readTime$/,
  /^contact\.(hero\.title|book\.title|label\.|map\.)/,
  /^form\.(?!privacy$|thanks\.body$)/,
  /^faq\.title$/,
];

/** Whether the client edits this text in the admin panel. */
export function isClientField(id: string) {
  return !developerManaged.some((pattern) => pattern.test(id));
}

const groupNames: Record<string, string> = { "Site-wide": "Firm details" };

/** The sections and fields the admin panel shows. */
export const adminSections: CopySection[] = copySections
  .map((section) => ({
    ...section,
    group: groupNames[section.group] ?? section.group,
    fields: section.fields.filter((field) => isClientField(field.id)),
  }))
  .filter((section) => section.fields.length > 0);

export const adminGroups = [...new Set(adminSections.map((s) => s.group))];

/** id → original demo text. */
export const copyDefaults: Record<string, string> = Object.fromEntries(
  copySections.flatMap((s) => s.fields.map((field) => [field.id, field.text])),
);

export function isCopyId(id: string) {
  return Object.prototype.hasOwnProperty.call(copyDefaults, id);
}

/** Turn a phone number as typed into a tel: link. */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
