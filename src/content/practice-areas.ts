export type PracticeArea = {
  slug: string;
  group: string;
  title: string;
  /** One-line summary used on cards and listings. */
  summary: string;
  intro: string;
  overview: [string, string];
  services: string[];
  related: string[];
  steps?: { title: string; body: string }[];
};

export const practiceAreas: PracticeArea[] = [
  {
    slug: "litigation",
    group: "Disputes & Litigation",
    title: "Litigation and Dispute Resolution",
    summary:
      "Strategic advocacy in negotiation, arbitration, and the courtroom.",
    intro:
      "When a dispute cannot be avoided, you want advocates who are strategic, prepared, and unafraid. We represent clients through negotiation, arbitration, and the courtroom.",
    overview: [
      "Disputes are disruptive, costly, and personal. Our litigation team combines sharp legal analysis with practical judgement — resolving matters efficiently where possible, and fighting hard where necessary.",
      "From commercial disputes and debt recovery to employment and property conflicts, we guide clients through every stage of the process, always with a clear view of the outcome that matters most to you.",
    ],
    services: [
      "Commercial and contract disputes",
      "Debt recovery and enforcement",
      "Arbitration and mediation",
      "Employment and labour disputes",
      "Property and land litigation",
      "Injunctions and urgent relief",
      "Appeals and judicial review",
      "Regulatory and administrative hearings",
    ],
    related: ["labour", "property", "business", "banking"],
    steps: [
      {
        title: "Assess",
        body: "We review the facts, the law, and the realistic range of outcomes.",
      },
      {
        title: "Strategise",
        body: "We agree a clear plan — settlement, arbitration, or trial.",
      },
      {
        title: "Advocate",
        body: "We represent you firmly and prepare every matter to win.",
      },
      {
        title: "Resolve",
        body: "We pursue the result that best protects your interests.",
      },
    ],
  },
  {
    slug: "banking",
    group: "Corporate & Commercial",
    title: "Banking and Financial Services",
    summary:
      "Counsel on lending, regulation, and complex financial transactions.",
    intro:
      "Financial institutions and borrowers operate in a demanding regulatory environment. We advise banks, lenders, and businesses on financing, compliance, and the transactions that keep capital moving.",
    overview: [
      "From syndicated facilities to everyday lending, our banking practice combines technical precision with commercial awareness. We structure and document transactions that protect our clients and withstand scrutiny.",
      "We act for licensed institutions, microfinance providers, and corporate borrowers — guiding them through Bank of Uganda regulation, security arrangements, and enforcement when facilities fall into default.",
    ],
    services: [
      "Loan and facility agreements",
      "Security and collateral documentation",
      "Regulatory and licensing compliance",
      "Debt recovery and enforcement",
      "Project and asset finance",
      "Syndicated and cross-border lending",
      "Restructuring of distressed facilities",
      "Advice on Bank of Uganda requirements",
    ],
    related: ["business", "ma", "tax", "litigation"],
  },
  {
    slug: "business",
    group: "Corporate & Commercial",
    title: "Business",
    summary:
      "Formation, governance, and day-to-day commercial advisory for companies.",
    intro:
      "Every business decision carries legal consequences. We are the counsel companies turn to for formation, governance, contracts, and the day-to-day advice that keeps them running.",
    overview: [
      "We act as outside counsel to companies of every size — from start-ups finding their footing to established enterprises managing complex operations. Our advice is practical, commercial, and delivered in plain language.",
      "Whether you are incorporating, negotiating a supply contract, resolving a shareholder question, or expanding into new markets, we help you move with confidence and stay on the right side of the law.",
    ],
    services: [
      "Company formation and structuring",
      "Shareholder and partnership agreements",
      "Commercial contracts and negotiations",
      "Corporate governance and compliance",
      "Joint ventures and strategic alliances",
      "Regulatory and licensing matters",
      "Company secretarial support",
      "Ongoing outside general counsel",
    ],
    related: ["ma", "banking", "tax", "litigation"],
  },
  {
    slug: "ma",
    group: "Corporate & Commercial",
    title: "Mergers and Acquisitions",
    summary: "End-to-end deal support from due diligence to completion.",
    intro:
      "Deals are won or lost in the detail. We guide buyers and sellers through every stage of a transaction — from first approach to completion — protecting value and managing risk throughout.",
    overview: [
      "Our M&A practice supports acquisitions, disposals, mergers, and restructurings across sectors. We combine rigorous due diligence with sharp negotiation to get deals done on the right terms.",
      "We coordinate the legal, regulatory, and commercial threads of a transaction, working alongside your other advisers to keep momentum without compromising on the protections that matter.",
    ],
    services: [
      "Due diligence and risk assessment",
      "Transaction structuring",
      "Sale and purchase agreements",
      "Shareholder and investment agreements",
      "Regulatory and competition clearances",
      "Warranties, indemnities and disclosure",
      "Post-completion integration",
      "Corporate restructuring",
    ],
    related: ["business", "banking", "tax", "litigation"],
  },
  {
    slug: "tax",
    group: "Corporate & Commercial",
    title: "Tax",
    summary: "Planning, compliance, and dispute support across tax matters.",
    intro:
      "Tax touches every transaction and every business. We help clients plan efficiently, stay compliant, and resolve disputes with the revenue authority when they arise.",
    overview: [
      "Our tax practice offers clear, commercial advice on the tax dimensions of doing business in Uganda — from structuring transactions to managing obligations and defending assessments.",
      "We advise on income tax, VAT, and duties, and represent clients in engagements and disputes with the Uganda Revenue Authority, always seeking the most efficient and defensible position.",
    ],
    services: [
      "Tax planning and structuring",
      "VAT and income tax advisory",
      "Transaction tax advice",
      "URA assessments and objections",
      "Tax dispute resolution and appeals",
      "Compliance and filing support",
      "Withholding tax matters",
      "Cross-border and transfer pricing",
    ],
    related: ["business", "ma", "banking", "litigation"],
  },
  {
    slug: "labour",
    group: "People & Workplace",
    title: "Labour and Employment",
    summary:
      "Advising employers and employees across the full workplace lifecycle.",
    intro:
      "The relationship between employer and employee is governed by law at every turn. We advise both sides on their rights, obligations, and the disputes that can arise.",
    overview: [
      "Our employment practice supports employers in building compliant, well-run workplaces — and represents employees when their rights are at stake. We handle the sensitive and the contentious with equal care.",
      "From drafting contracts and policies to managing terminations and defending claims, we help clients navigate the Employment Act and resolve workplace disputes efficiently.",
    ],
    services: [
      "Employment contracts and policies",
      "Terminations and redundancies",
      "Disciplinary and grievance processes",
      "Workplace investigations",
      "Employment disputes and claims",
      "Executive and severance arrangements",
      "Compliance with the Employment Act",
      "Collective and union matters",
    ],
    related: ["litigation", "family", "business", "property"],
  },
  {
    slug: "family",
    group: "People & Workplace",
    title: "Family",
    summary: "Sensitive guidance through separation, custody, and family matters.",
    intro:
      "Family matters are among the most personal a person can face. We offer sensitive, discreet guidance through separation, custody, succession, and the decisions that shape family life.",
    overview: [
      "Our family practice combines legal skill with genuine compassion. We understand that behind every matter is a family, and we work to resolve issues with as little conflict as possible.",
      "We advise on marriage and divorce, child custody and maintenance, succession and estate matters, and the agreements that protect families and the assets they build together.",
    ],
    services: [
      "Divorce and separation",
      "Child custody and maintenance",
      "Division of matrimonial property",
      "Wills and succession planning",
      "Estate administration",
      "Prenuptial and family agreements",
      "Adoption and guardianship",
      "Family dispute mediation",
    ],
    related: ["property", "litigation", "labour"],
  },
  {
    slug: "property",
    group: "Property & Real Estate",
    title: "Property",
    summary: "Real estate, development, leasing, and land transactions.",
    intro:
      "Land and property are among the most valuable assets people and businesses own — and among the most disputed. We advise on every stage of a property matter, from acquisition to conflict.",
    overview: [
      "Our property practice supports individuals, developers, and businesses in buying, selling, leasing, and developing land. We conduct thorough due diligence and document transactions that stand up over time.",
      "We also act in land disputes — a common and complex feature of the Ugandan landscape — guiding clients through title, boundary, and ownership conflicts with clarity and resolve.",
    ],
    services: [
      "Sale and purchase of land",
      "Title searches and due diligence",
      "Leases and tenancy agreements",
      "Property development and financing",
      "Land disputes and litigation",
      "Conveyancing and transfers",
      "Landlord and tenant matters",
      "Mortgages and securities",
    ],
    related: ["business", "family", "litigation", "banking"],
  },
  {
    slug: "ip",
    group: "Intellectual Property",
    title: "Intellectual Property",
    summary: "Protecting and commercialising your ideas and creative work.",
    intro:
      "Ideas, brands, and creative work are valuable assets that deserve protection. We help clients secure, manage, and enforce their intellectual property in Uganda and beyond.",
    overview: [
      "Our IP practice helps businesses and creators protect what makes them distinctive — their names, inventions, designs, and content — and turn those assets into commercial value.",
      "We handle registration, licensing, and enforcement, acting decisively when a client’s rights are infringed and advising on how to build IP into a broader commercial strategy.",
    ],
    services: [
      "Trademark registration and strategy",
      "Copyright protection and advice",
      "Patents and industrial designs",
      "IP licensing and assignments",
      "Enforcement and anti-counterfeiting",
      "IP due diligence in transactions",
      "Brand-protection strategy",
      "Domain and online IP matters",
    ],
    related: ["business", "ma", "litigation"],
  },
];

export function getPracticeArea(slug: string) {
  return practiceAreas.find((area) => area.slug === slug);
}

export function practiceAreaHref(slug: string) {
  return `/practice-areas/${slug}`;
}

/** Groupings shown on the Practice Areas index page. */
export const practiceGroups = [
  { name: "Corporate & Commercial", slugs: ["business", "banking", "ma", "tax"] },
  { name: "Disputes & Litigation", slugs: ["litigation"] },
  { name: "People & Workplace", slugs: ["labour", "family"] },
  { name: "Property & Intellectual Property", slugs: ["property", "ip"] },
];

/** Cards in the home page "Legal practice areas" carousel. */
export const featuredPracticeAreas = [
  {
    slug: "banking",
    tag: "Corporate & Commercial",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    slug: "litigation",
    tag: "Disputes",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
  },
  {
    slug: "labour",
    tag: "Workplace",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  },
  {
    slug: "property",
    tag: "Property",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  },
  {
    slug: "family",
    tag: "People",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
  },
  {
    slug: "ma",
    tag: "Corporate & Commercial",
    img: "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=800&q=80",
  },
];

/** Shorter labels used in the footer. */
export const footerPracticeAreas = [
  { label: "Litigation & Disputes", slug: "litigation" },
  { label: "Banking & Financial", slug: "banking" },
  { label: "Business & Corporate", slug: "business" },
  { label: "Labour & Employment", slug: "labour" },
  { label: "Property & Land", slug: "property" },
];
