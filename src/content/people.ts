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

/**
 * Everyone shown on the site, by key. Pages list people by key so a name
 * edited once (e.g. replacing a "Name" placeholder) updates everywhere.
 */
export const people = {
  emmanuel,
  partner1: {
    name: "Name",
    role: "Partner",
    bio: "Heads corporate and commercial matters, advising businesses through growth and transactions.",
  },
  partner2: {
    name: "Name",
    role: "Partner",
    bio: "Specialises in banking, finance, and regulatory work for institutions across the region.",
  },
  senior1: {
    name: "Name",
    role: "Senior Associate",
    area: "Litigation & Disputes",
  },
  associate1: { name: "Name", role: "Associate", area: "Labour & Employment" },
  associate2: {
    name: "Name",
    role: "Associate",
    area: "Property & Development",
  },
  associate3: { name: "Name", role: "Associate", area: "Family Law" },
} satisfies Record<string, Person>;

export type PersonKey = keyof typeof people;

export const personKeys = Object.keys(people) as PersonKey[];

export const attorneys: Attorney[] = [emmanuel];

/** Attorney bio pages, by slug, with the key used for their copy. */
export const attorneyKeys: Record<string, PersonKey> = {
  [emmanuel.slug]: "emmanuel",
};

export function getAttorney(slug: string) {
  return attorneys.find((a) => a.slug === slug);
}

export function personHref(key: PersonKey) {
  const person: Person = people[key];
  return person.slug ? `/people/${person.slug}` : undefined;
}

export const leaders: PersonKey[] = ["emmanuel", "partner1", "partner2"];
export const team: PersonKey[] = [
  "senior1",
  "associate1",
  "associate2",
  "associate3",
];
export const homeAttorneys: PersonKey[] = [
  "emmanuel",
  "senior1",
  "associate1",
  "associate2",
];
export const bioOtherPeople: PersonKey[] = [
  "partner1",
  "partner2",
  "senior1",
  "associate1",
];
export const practiceLeads: PersonKey[] = ["emmanuel", "senior1", "associate1"];
