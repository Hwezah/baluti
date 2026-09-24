export type Person = {
  /** Only people with a slug have a bio page. */
  slug?: string;
  name: string;
  role: string;
  /** Short line for the People page leadership cards. */
  bio?: string;
  /** Practice focus shown on the People page team grid. */
  area?: string;
};

export type Attorney = Person & {
  slug: string;
  first: string;
  email: string;
  tagline: string;
  about: string[];
  matters: string[];
  areas: string[];
  credentials: { title: string; detail: string }[];
  languages: string;
};

export const emmanuel: Attorney = {
  slug: "emmanuel-baluti",
  name: "Emmanuel Baluti",
  first: "Emmanuel",
  role: "Founder & Principal Attorney",
  email: "emmanuel@baluti.co.ug",
  bio: "Leads the firm’s litigation practice with a focus on accountability and results for clients.",
  tagline:
    "Leads the firm’s litigation practice, representing clients in high-stakes commercial and personal disputes across Uganda.",
  about: [
    "Emmanuel is the founder of Baluti & Co. and heads the firm’s dispute resolution practice. Over more than two decades, he has built a reputation for clear strategy, meticulous preparation, and a genuine commitment to the people he represents.",
    "He acts for businesses, institutions, and individuals in commercial litigation, arbitration, and complex negotiations — always with a focus on the outcome that matters most to the client, not the process for its own sake.",
    "Colleagues and clients describe Emmanuel as measured, direct, and relentless when a matter demands it. He believes accountability matters, and that good advocacy begins with truly listening.",
  ],
  matters: [
    "Represented a regional bank in a multi-party commercial dispute, securing a favourable settlement.",
    "Led arbitration proceedings for a manufacturing client, recovering substantial contractual damages.",
    "Advised an institutional client through a sensitive employment dispute with minimal disruption.",
    "Obtained urgent injunctive relief protecting a client’s commercial interests pending trial.",
  ],
  areas: ["litigation", "business", "banking"],
  credentials: [
    { title: "LL.B, Makerere University", detail: "Bachelor of Laws" },
    {
      title: "Diploma in Legal Practice",
      detail: "Law Development Centre, Kampala",
    },
    {
      title: "Advocate of the High Court",
      detail: "Admitted to the Uganda Bar",
    },
  ],
  languages: "English, Luganda, Swahili",
};

export const attorneys: Attorney[] = [emmanuel];

export function getAttorney(slug: string) {
  return attorneys.find((a) => a.slug === slug);
}

export function personHref(person: Person) {
  return person.slug ? `/people/${person.slug}` : undefined;
}

// Placeholder entries ("Name") are waiting for real names and titles.
export const leaders: Person[] = [
  emmanuel,
  {
    name: "Name",
    role: "Partner",
    bio: "Heads corporate and commercial matters, advising businesses through growth and transactions.",
  },
  {
    name: "Name",
    role: "Partner",
    bio: "Specialises in banking, finance, and regulatory work for institutions across the region.",
  },
];

export const team: Person[] = [
  { name: "Name", role: "Senior Associate", area: "Litigation & Disputes" },
  { name: "Name", role: "Associate", area: "Labour & Employment" },
  { name: "Name", role: "Associate", area: "Property & Development" },
  { name: "Name", role: "Associate", area: "Family Law" },
];

export const homeAttorneys: Person[] = [
  emmanuel,
  { name: "Name", role: "Senior Associate" },
  { name: "Name", role: "Associate" },
  { name: "Name", role: "Associate" },
];

export const bioOtherPeople: Person[] = [
  { name: "Name", role: "Partner" },
  { name: "Name", role: "Partner" },
  { name: "Name", role: "Senior Associate" },
  { name: "Name", role: "Associate" },
];

export const practiceLeads: Person[] = [
  emmanuel,
  { name: "Name", role: "Senior Associate" },
  { name: "Name", role: "Associate" },
];
