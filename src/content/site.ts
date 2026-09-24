import { siteUrl } from "@/lib/site-url";

export const site = {
  name: "Baluti & Co. Advocates",
  url: siteUrl.origin,
  address: {
    line1: "Plot 111 Semawata Road, Ntinda,",
    line2: "P.O Box 24787, Kampala – Uganda",
    short: "Plot 111 Semawata Road, Ntinda, Kampala",
    mapUrl: "https://maps.app.goo.gl/8yr4o216JxDvmozA8",
  },
  phones: [
    { label: "+256 414 344 124", href: "tel:+256414344124" },
    { label: "+256 752 605 525", href: "tel:+256752605525" },
  ],
  emails: [
    { label: "legal@baluti.co.ug", href: "mailto:legal@baluti.co.ug" },
    { label: "emmanuel@baluti.co.ug", href: "mailto:emmanuel@baluti.co.ug" },
  ],
  hours: {
    weekdays: "Mon – Fri: 8:00 – 18:00",
    saturday: "Sat: 10:00 – 16:00",
    compact: "Mon – Fri 8:00–18:00 · Sat 10:00–16:00",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Practice Areas", href: "/practice-areas" },
  { label: "People", href: "/people" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
] as const;

export const values = [
  {
    title: "Cultivating relationships",
    body: "By truly understanding our clients and their unique needs, we forge partnerships that lead to mutual success and growth.",
    short:
      "By truly understanding our clients and their needs, we forge partnerships that lead to mutual success.",
  },
  {
    title: "Embodying respect",
    body: "Everyone we engage with — client, colleague, or partner — is treated with respect and courtesy at every step.",
    short:
      "Everyone we engage with — client, colleague, or partner — is treated with respect and courtesy.",
  },
  {
    title: "Delivering outcomes",
    body: "We combine legal expertise, dedication, and effort to ensure every client’s expectations are met and surpassed.",
    short:
      "We combine expertise, dedication, and effort to ensure every expectation is met and surpassed.",
  },
  {
    title: "Achieving results",
    body: "However intricate your situation, we work tirelessly and diligently to achieve outcomes for your circumstances.",
    short:
      "However intricate your situation, we work tirelessly to achieve outcomes for your circumstances.",
  },
];

export const approachSteps = [
  {
    title: "Listen",
    body: "We start by understanding your circumstances, goals, and concerns in full.",
  },
  {
    title: "Advise",
    body: "We explain the law and your options in clear, practical terms — no jargon.",
  },
  {
    title: "Act",
    body: "We move decisively, keeping you informed and involved at every stage.",
  },
  {
    title: "Deliver",
    body: "We pursue the outcome that matters most to you, and stand behind our work.",
  },
];
