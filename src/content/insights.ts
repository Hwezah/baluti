export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export type Insight = {
  slug: string;
  category: string;
  title: string;
  /** Shorter title used on the home page preview cards. */
  shortTitle?: string;
  excerpt: string;
  date: string;
  readTime: string;
  img: string;
  author: string;
  authorRole: string;
  lede?: string;
  blocks?: ArticleBlock[];
};

export const insightCategories = [
  "All",
  "Data Protection",
  "Employment",
  "Property",
  "Corporate",
];

export const insights: Insight[] = [
  {
    slug: "employment-amendment-act-2025",
    category: "Employment",
    title:
      "The Employment (Amendment) Act, 2025: what every Ugandan employer must change now",
    shortTitle:
      "The Employment (Amendment) Act, 2025: what employers must change now",
    excerpt:
      "The biggest overhaul of Uganda’s labour framework since 2006 — broader definition of “employee”, new termination grounds, and greater exposure for non-compliance.",
    date: "June 2026",
    readTime: "7 min read",
    img: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1400&q=80",
    author: "Emmanuel Baluti",
    authorRole: "Founder & Principal Attorney",
    lede: "The most significant reform of Uganda’s labour law since the Employment Act of 2006 has arrived. It widens who counts as an employee, reshapes how contracts end, and raises the cost of getting it wrong.",
    blocks: [
      {
        type: "p",
        text: "For nearly two decades, the Employment Act, 2006 set the baseline for the employer–employee relationship in Uganda. The 2025 amendments update that framework for a very different labour market — one shaped by digital platforms, agency work, and heightened expectations around fair treatment.",
      },
      { type: "h2", text: "A broader definition of “employee”" },
      {
        type: "p",
        text: "The amendments expand who falls within the protection of the Act, capturing working arrangements that previously sat in a grey area. Employers who rely on contractors, casual workers, or platform-based labour should review those relationships now, because misclassification carries real exposure.",
      },
      {
        type: "p",
        text: "Recruitment agencies face new licensing obligations, and employers placing workers through them should confirm that any agency they use is properly licensed before engaging its services.",
      },
      {
        type: "quote",
        text: "The safest assumption under the 2025 amendments is that more of your workforce is protected than was the case before — not less.",
      },
      { type: "h2", text: "Termination and new day-one duties" },
      {
        type: "p",
        text: "The grounds and procedure for ending employment have been tightened, and the consequences of an unfair or procedurally flawed termination are more significant. Documented, consistent processes are no longer good practice — they are a legal necessity.",
      },
      {
        type: "p",
        text: "The amendments also introduce practical obligations, including provision for breastfeeding employees. Employers should audit their policies, contracts, and handbooks against the new requirements rather than waiting for a dispute to expose the gaps.",
      },
      { type: "h2", text: "What employers should do next" },
      {
        type: "p",
        text: "We recommend a structured review: update template contracts, reassess worker classifications, refresh termination procedures, and train managers on the new standards. Our employment team is helping clients across Uganda make these changes efficiently — we would be glad to help you scope yours.",
      },
    ],
  },
  {
    slug: "cross-border-data-transfers-pdpo",
    category: "Data Protection",
    title:
      "Cross-border data transfers: lessons from the PDPO’s orders against Google and Meta",
    shortTitle:
      "Cross-border data transfers after the PDPO’s orders against Google and Meta",
    excerpt:
      "Why blanket reliance on global privacy policies no longer satisfies Section 19 of the Data Protection and Privacy Act.",
    date: "May 2026",
    readTime: "6 min read",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    author: "Emmanuel Baluti",
    authorRole: "Founder & Principal Attorney",
  },
  {
    slug: "health-facilities-data-protection-officers",
    category: "Data Protection",
    title:
      "Health facilities must now appoint DPOs: the Ministry of Health directive explained",
    excerpt:
      "What the April 2026 mandate means for hospitals, clinics and the data they hold.",
    date: "May 2026",
    readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    author: "Emmanuel Baluti",
    authorRole: "Founder & Principal Attorney",
  },
  {
    slug: "new-duties-for-employers",
    category: "Employment",
    title:
      "New duties for employers: breastfeeding facilities and recruitment-agency licensing",
    excerpt:
      "A closer look at the day-one obligations introduced by the 2025 amendments.",
    date: "April 2026",
    readTime: "6 min read",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    author: "Emmanuel Baluti",
    authorRole: "Founder & Principal Attorney",
  },
  {
    slug: "joint-tenancy-vs-tenancy-in-common",
    category: "Property",
    title:
      "Joint tenancy vs tenancy in common: when registration overrides intention",
    excerpt:
      "How Uganda’s land registration regime can defeat what co-owners believed they had agreed.",
    date: "March 2026",
    readTime: "8 min read",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    author: "Emmanuel Baluti",
    authorRole: "Founder & Principal Attorney",
  },
  {
    slug: "pdpo-first-criminal-conviction",
    category: "Corporate",
    title: "PDPO secures its first criminal conviction: the compliance takeaways",
    excerpt:
      "The conviction of a lending director signals a shift from awareness-building to active enforcement.",
    date: "February 2026",
    readTime: "4 min read",
    img: "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=800&q=80",
    author: "Emmanuel Baluti",
    authorRole: "Founder & Principal Attorney",
  },
];

export const featuredInsight = insights[0];

export function getInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}

export function insightHref(slug: string) {
  return `/insights/${slug}`;
}
