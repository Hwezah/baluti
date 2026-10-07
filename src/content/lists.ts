// Lists of items on the site that the client can hide items from or add
// items to in the admin panel (reviews, FAQs, services…). Each item's text
// lives in the copy registry under `${prefix}.${key}.${part}` (or
// `${prefix}.${key}` for one-part items). Built-in items have the keys
// below; items the client adds get keys like "n1a2b3c" and are recorded in
// src/content/site-text.json, along with which items are hidden.

import { emmanuel, personKeys } from "@/content/people";
import { insights } from "@/content/insights";
import { practiceAreas } from "@/content/practice-areas";
import { listState, publishedText, type SiteTextFile } from "@/lib/site-text";

export type ListPart = {
  /** "" for one-part items, whose id is `${prefix}.${key}`. */
  part: string;
  label: string;
  /** Use a larger box when adding. */
  long?: boolean;
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
    parts: [],
    builtIn: [...personKeys],
    canAdd: false,
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

export const ADDED_KEY = /^n[0-9a-z]{4,16}$/;

/** A text id belonging to an item the client added (shape only). */
export function isAddedItemId(id: string) {
  return listDefs.some(
    (def) =>
      def.canAdd &&
      def.parts.some((p) => {
        const head = `${def.prefix}.`;
        if (!id.startsWith(head)) return false;
        const rest = id.slice(head.length).split(".");
        return (
          ADDED_KEY.test(rest[0]) &&
          (p.part ? rest.length === 2 && rest[1] === p.part : rest.length === 1)
        );
      }),
  );
}

/** People in `keys` who aren't hidden. */
export function shownPeople<K extends string>(keys: K[]) {
  return keys.filter((key) => isVisible("people", key));
}

/** Articles that aren't hidden, newest first. */
export function shownInsights() {
  return insights.filter((post) => isVisible("articles", post.slug));
}
