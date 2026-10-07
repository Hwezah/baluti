// Lists of items on the site that the client can hide items from or add
// items to in the admin panel (reviews, FAQs, services…). Each item's text
// lives in the copy registry under `${prefix}.${key}.${part}` (or
// `${prefix}.${key}` for one-part items). Built-in items have the keys
// below; items the client adds get keys like "n1a2b3c" (or, for practice
// areas, a slug made from the name, which becomes the page address) and are
// recorded in
// src/content/site-text.json, along with which items are hidden.

import { emmanuel, personKeys } from "@/content/people";
import { insights } from "@/content/insights";
import { getPracticeArea, practiceAreas } from "@/content/practice-areas";
import { site } from "@/content/site";
import { listState, publishedText, type SiteTextFile } from "@/lib/site-text";

export type ListPart = {
  /** "" for one-part items, whose id is `${prefix}.${key}`. */
  part: string;
  label: string;
  /** Use a larger box when adding. */
  long?: boolean;
  /** Help shown under the box when adding. */
  help?: string;
};

export type ListDef = {
  id: string;
  /** Admin section the items are edited in. */
  section: string;
  /** One item, in plain words ("review"). */
  noun: string;
  prefix: string;
  parts: ListPart[];
  builtIn: string[];
  /** Whether the client can add items (otherwise only hide them). */
  canAdd: boolean;
  /** Items are whole admin sections (articles), keyed by this section id. */
  itemSection?: (key: string) => string;
  /** Make added items' keys from this part's text (a URL slug). */
  keyFrom?: string;
};

const keys = (n: number) => Array.from({ length: n }, (_, i) => String(i));

export const listDefs: ListDef[] = [
  {
    id: "reviews",
    section: "home-reviews",
    noun: "review",
    prefix: "home.reviews",
    parts: [
      { part: "quote", label: "Quote", long: true },
      { part: "name", label: "Client name" },
      { part: "place", label: "Town" },
    ],
    builtIn: keys(4),
    canAdd: true,
  },
  {
    id: "story",
    section: "about-story",
    noun: "milestone",
    prefix: "about.story",
    parts: [
      { part: "year", label: "Year" },
      { part: "title", label: "Title" },
      { part: "body", label: "Description", long: true },
    ],
    builtIn: keys(4),
    canAdd: true,
  },
  {
    id: "people",
    section: "team-members",
    noun: "person",
    prefix: "person",
    parts: [
      { part: "name", label: "Full name" },
      { part: "role", label: "Job title" },
      { part: "area", label: "Main area of practice" },
    ],
    builtIn: [...personKeys],
    canAdd: true,
  },
  {
    id: "perks",
    section: "people-careers",
    noun: "reason to join",
    prefix: "people.perks",
    parts: [
      { part: "title", label: "Title" },
      { part: "body", label: "Text", long: true },
    ],
    builtIn: keys(4),
    canAdd: true,
  },
  {
    id: "matters",
    section: "attorney-emmanuel",
    noun: "example of representative work",
    prefix: "attorney.emmanuel.matters",
    parts: [{ part: "", label: "Description", long: true }],
    builtIn: keys(emmanuel.matters.length),
    canAdd: true,
  },
  {
    id: "credentials",
    section: "attorney-emmanuel",
    noun: "credential",
    prefix: "attorney.emmanuel.credentials",
    parts: [
      { part: "title", label: "Credential" },
      { part: "detail", label: "Detail" },
    ],
    builtIn: keys(emmanuel.credentials.length),
    canAdd: true,
  },
  {
    id: "phones",
    section: "contact-details",
    noun: "phone number",
    prefix: "contact.phone",
    parts: [{ part: "", label: "Phone number" }],
    builtIn: keys(site.phones.length),
    canAdd: true,
  },
  {
    id: "emails",
    section: "contact-details",
    noun: "email address",
    prefix: "contact.email",
    parts: [{ part: "", label: "Email address" }],
    builtIn: keys(site.emails.length),
    canAdd: true,
  },
  {
    id: "areas",
    section: "practice-index",
    noun: "practice area",
    prefix: "practice",
    parts: [
      { part: "title", label: "Name of the area" },
      { part: "summary", label: "One-line summary" },
      { part: "intro", label: "Introduction", long: true },
      { part: "help", label: "How the firm helps", long: true },
      {
        part: "services",
        label: "Services",
        long: true,
        help: "One service per line.",
      },
    ],
    builtIn: practiceAreas.map((area) => area.slug),
    canAdd: true,
    itemSection: (slug) => `practice-${slug}`,
    keyFrom: "title",
  },
  ...practiceAreas.map(
    (area): ListDef => ({
      id: `services-${area.slug}`,
      section: `practice-${area.slug}`,
      noun: "service",
      prefix: `practice.${area.slug}.services`,
      parts: [{ part: "", label: "Service" }],
      builtIn: keys(area.services.length),
      canAdd: true,
    }),
  ),
  {
    id: "articles",
    section: "",
    noun: "article",
    prefix: "insight",
    parts: [],
    builtIn: insights.map((post) => post.slug),
    canAdd: false,
    itemSection: (slug) => `article-${slug}`,
  },
  {
    id: "faq",
    section: "contact-faq",
    noun: "question",
    prefix: "faq",
    parts: [
      { part: "q", label: "Question" },
      { part: "a", label: "Answer", long: true },
    ],
    builtIn: keys(5),
    canAdd: true,
  },
];

const byId = new Map(listDefs.map((d) => [d.id, d]));

export function getList(id: string) {
  return byId.get(id);
}

/** Text id of one part of an item. */
export const itemId = (def: ListDef, key: string, part: string) =>
  part ? `${def.prefix}.${key}.${part}` : `${def.prefix}.${key}`;

/** Every item, built-in then added, with whether it is hidden. */
export function listItems(id: string, file: SiteTextFile = publishedText) {
  const def = byId.get(id);
  if (!def) return [];
  const state = listState(file, id);
  return [...def.builtIn, ...state.added].map((key) => ({
    key,
    added: !def.builtIn.includes(key),
    hidden: state.hidden.includes(key),
  }));
}

/** Keys of the items the site shows, in order. */
export function visibleKeys(id: string, file: SiteTextFile = publishedText) {
  return listItems(id, file)
    .filter((item) => !item.hidden)
    .map((item) => item.key);
}

/** Whether a built-in or added item is shown on the site. */
export function isVisible(
  id: string,
  key: string,
  file: SiteTextFile = publishedText,
) {
  return !listState(file, id).hidden.includes(key);
}

/** Shape of a list item key (built-in or added). */
export const ITEM_KEY = /^[a-z0-9][a-z0-9-]{0,60}$/;

/** The list and key an added item's text id belongs to (by shape only). */
export function addedItemOf(id: string) {
  for (const def of listDefs) {
    if (!def.canAdd) continue;
    const head = `${def.prefix}.`;
    if (!id.startsWith(head)) continue;
    const rest = id.slice(head.length).split(".");
    if (!ITEM_KEY.test(rest[0]) || def.builtIn.includes(rest[0])) continue;
    const fits = def.parts.some((p) =>
      p.part ? rest.length === 2 && rest[1] === p.part : rest.length === 1,
    );
    if (fits) return { def, key: rest[0] };
  }
  return null;
}

/** Lower-case words joined by dashes, for page addresses. */
export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
    .replace(/-+$/, "");
}

/** A key for a new item that no other item of the list uses. */
export function newItemKey(
  def: ListDef,
  values: Record<string, string>,
  file: SiteTextFile,
) {
  const taken = new Set([...def.builtIn, ...listState(file, def.id).added]);
  const base = def.keyFrom ? slugify(values[def.keyFrom] ?? "") : "";
  if (base && ITEM_KEY.test(base)) {
    let key = base;
    for (let n = 2; taken.has(key); n++) key = `${base}-${n}`;
    return key;
  }
  let key = `n${Date.now().toString(36)}`;
  while (taken.has(key)) key = `${key}x`;
  return key;
}

/** People in `keys` who aren't hidden. */
export function shownPeople<K extends string>(keys: K[]) {
  return keys.filter((key) => isVisible("people", key));
}

/** Articles that aren't hidden, newest first. */
export function shownInsights() {
  return insights.filter((post) => isVisible("articles", post.slug));
}

/** Practice areas the site shows: built-in ones first, then added ones. */
export function shownAreas(file: SiteTextFile = publishedText) {
  return visibleKeys("areas", file);
}

/** Whether a practice area was added by the client (no built-in page data). */
export function isAddedArea(slug: string) {
  return !getPracticeArea(slug);
}

/** People the client added, who aren't hidden. */
export function addedPeople(file: SiteTextFile = publishedText) {
  return listItems("people", file)
    .filter((item) => item.added && !item.hidden)
    .map((item) => item.key);
}
