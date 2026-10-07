// Forgiving search for the admin panel. Built in, no setup, no cost.
//
// - Ignores capitals, accents, curly vs straight quotes, dash types and
//   punctuation ("firm’s" finds "firms", "Kampala—Uganda" finds "kampala").
// - Words can come in any order; small words ("the", "how") are ignored.
// - Forgives small typos ("adress", "emial") and partly typed words ("consult").
// - Knows related words ("phone" finds "call" and "telephone", "lawyers"
//   finds "advocates", "house" finds "land" and "property").
// - Scores each text by where the words were found (its label, the current
//   wording, the demo wording, the section it belongs to) so the best
//   matches come first.

export type SearchZone = { text: string; weight: number };

const STOPWORDS = new Set(
  (
    "a an and are as at be but by can do does for from has have how i if in " +
    "into is it its me my of on or our so that the their them then there " +
    "these they this to was we were what when where which who why will with " +
    "you your want wants change changes edit find show text where's whats"
  ).split(" "),
);

/**
 * Families of related words. A search for any word in a family also finds
 * the others. Single words only; they are compared after stemming.
 */
const RELATED: string[][] = [
  ["phone", "telephone", "call", "number", "mobile", "tel", "ring", "whatsapp"],
  ["email", "mail", "inbox", "e-mail", "message"],
  [
    "address",
    "location",
    "office",
    "offices",
    "visit",
    "map",
    "directions",
    "where",
    "street",
    "road",
    "plot",
    "building",
    "find",
  ],
  [
    "hours",
    "opening",
    "open",
    "time",
    "times",
    "closed",
    "weekday",
    "weekend",
    "monday",
    "friday",
    "saturday",
    "schedule",
  ],
  [
    "team",
    "people",
    "lawyer",
    "lawyers",
    "attorney",
    "attorneys",
    "advocate",
    "advocates",
    "staff",
    "partner",
    "partners",
    "associate",
    "counsel",
    "member",
    "members",
    "bio",
    "profile",
  ],
  ["founder", "emmanuel", "baluti", "managing", "principal", "head"],
  [
    "land",
    "property",
    "properties",
    "real",
    "estate",
    "conveyancing",
    "house",
    "plot",
    "tenancy",
    "landlord",
    "lease",
    "mortgage",
  ],
  [
    "family",
    "divorce",
    "custody",
    "marriage",
    "child",
    "children",
    "adoption",
    "succession",
    "inheritance",
    "will",
    "probate",
    "estate",
  ],
  [
    "employment",
    "labour",
    "labor",
    "work",
    "worker",
    "workers",
    "employer",
    "employee",
    "job",
    "dismissal",
    "hr",
  ],
  ["tax", "taxes", "taxation", "revenue", "ura", "vat"],
  [
    "bank",
    "banking",
    "finance",
    "financial",
    "loan",
    "loans",
    "lending",
    "credit",
    "money",
    "investment",
    "capital",
  ],
  [
    "business",
    "company",
    "companies",
    "corporate",
    "commercial",
    "firm",
    "startup",
    "enterprise",
    "contract",
    "contracts",
    "registration",
  ],
  [
    "litigation",
    "dispute",
    "disputes",
    "court",
    "courts",
    "case",
    "cases",
    "trial",
    "arbitration",
    "mediation",
    "lawsuit",
    "sue",
    "defend",
    "defence",
    "defense",
  ],
  [
    "ip",
    "intellectual",
    "trademark",
    "trademarks",
    "copyright",
    "patent",
    "patents",
    "brand",
  ],
  ["criminal", "crime", "police", "bail", "arrest"],
  ["immigration", "visa", "permit", "permits", "citizenship", "passport"],
  [
    "article",
    "articles",
    "insight",
    "insights",
    "news",
    "blog",
    "post",
    "posts",
    "update",
    "updates",
    "publication",
    "read",
    "reading",
  ],
  [
    "career",
    "careers",
    "job",
    "jobs",
    "vacancy",
    "vacancies",
    "hiring",
    "recruit",
    "join",
    "internship",
    "intern",
    "apply",
  ],
  [
    "review",
    "reviews",
    "testimonial",
    "testimonials",
    "client",
    "clients",
    "feedback",
    "quote",
    "rating",
    "stars",
  ],
  [
    "fee",
    "fees",
    "cost",
    "costs",
    "price",
    "pricing",
    "charge",
    "free",
    "pay",
    "payment",
    "rate",
    "rates",
  ],
  [
    "headline",
    "title",
    "heading",
    "header",
    "hero",
    "tagline",
    "slogan",
    "intro",
    "introduction",
    "banner",
  ],
  ["button", "cta", "link", "action", "label"],
  [
    "consultation",
    "consult",
    "appointment",
    "meeting",
    "book",
    "booking",
    "schedule",
    "enquiry",
    "inquiry",
    "form",
    "request",
  ],
  [
    "about",
    "story",
    "history",
    "who",
    "background",
    "mission",
    "vision",
    "values",
    "founded",
    "since",
    "year",
    "years",
  ],
  ["faq", "faqs", "question", "questions", "answer", "answers", "ask"],
  ["menu", "navigation", "nav", "header"],
  ["footer", "bottom", "copyright", "legal", "privacy", "terms", "disclaimer"],
  [
    "number",
    "numbers",
    "stats",
    "statistics",
    "figures",
    "track",
    "record",
    "results",
    "experience",
    "cases",
  ],
  [
    "practice",
    "practices",
    "area",
    "areas",
    "service",
    "services",
    "expertise",
    "speciality",
    "specialty",
    "help",
  ],
  ["social", "facebook", "twitter", "linkedin", "instagram"],
  [
    "trust",
    "trusted",
    "reliable",
    "integrity",
    "honest",
    "confidential",
    "confidentiality",
  ],
  ["why", "reason", "reasons", "benefit", "benefits", "choose", "hire"],
  ["kampala", "uganda", "ugandan", "east", "africa"],
];

// ─── Text handling ─────────────────────────────────────────────────────────

/** Lower case, no accents, plain quotes and dashes, punctuation as spaces. */
export function normalize(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[‘’‛′`´]/g, "'")
    .replace(/&/g, " and ")
    .replace(/'s\b/g, "s")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** A rough word root, so "lawyers", "lawyer’s" and "lawyer" compare equal. */
export function stem(word: string) {
  let w = word;
  if (w.length > 4 && w.endsWith("ies")) w = `${w.slice(0, -3)}y`;
  else if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  else if (w.length > 4 && /(ss|x|ch|sh)es$/.test(w)) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss"))
    w = w.slice(0, -1);
  return w;
}

const words = (text: string) => normalize(text).split(" ").filter(Boolean);

const familyOf = new Map<string, Set<string>>();
for (const family of RELATED) {
  const stems = family.flatMap((w) => words(w)).map(stem);
  for (const s of stems) {
    const set = familyOf.get(s) ?? new Set<string>();
    stems.forEach((x) => x !== s && set.add(x));
    familyOf.set(s, set);
  }
}

/** Edit distance, giving up once it exceeds `max`. */
function distance(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let before: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      // Swapped neighbours ("adress" / "adderss") count as one slip.
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, before[j - 2] + 1);
      }
      row.push(value);
      best = Math.min(best, value);
    }
    if (best > max) return max + 1;
    before = prev;
    prev = row;
  }
  return prev[b.length];
}

const typoAllowance = (length: number) =>
  length >= 8 ? 2 : length >= 4 ? 1 : 0;

// ─── Query ─────────────────────────────────────────────────────────────────

type Term = {
  stem: string;
  raw: string;
  related: Set<string>;
  memo: Map<string, number>;
};

export type CompiledQuery = {
  terms: Term[];
  phrase: string;
  /** How well one word of text matches one term: 0 (no) to 1 (exact). */
  matchWord: (word: string) => number;
};

function termScore(term: Term, wordStem: string, rawWord: string) {
  const key = `${rawWord}|${wordStem}`;
  let score = term.memo.get(key);
  if (score === undefined) {
    score = rawTermScore(term, wordStem, rawWord);
    term.memo.set(key, score);
  }
  return score;
}

function rawTermScore(term: Term, wordStem: string, rawWord: string) {
  if (wordStem === term.stem || rawWord === term.raw) return 1;
  // Partly typed: "consult" → "consultation".
  if (term.raw.length >= 3 && rawWord.startsWith(term.raw)) return 0.8;
  if (term.related.has(wordStem)) return 0.7;
  const allowance = typoAllowance(term.stem.length);
  if (allowance && distance(term.stem, wordStem, allowance) <= allowance)
    return 0.6;
  return 0;
}

export function compileQuery(query: string): CompiledQuery | null {
  const all = words(query);
  if (all.length === 0) return null;
  const meaningful = all.filter((w) => !STOPWORDS.has(w));
  const chosen = meaningful.length > 0 ? meaningful : all;
  const terms = [...new Set(chosen)].map((raw) => {
    const s = stem(raw);
    const related = new Set(familyOf.get(s) ?? []);
    // A slightly misspelt word still brings its family ("telephon").
    if (related.size === 0 && s.length >= 5) {
      for (const [known, family] of familyOf) {
        if (distance(s, known, 1) <= 1) {
          related.add(known);
          family.forEach((x) => related.add(x));
        }
      }
    }
    return { raw, stem: s, related, memo: new Map<string, number>() };
  });
  return {
    terms,
    phrase: all.join(" "),
    matchWord(word) {
      const raw = normalize(word).replace(/ /g, "");
      if (!raw) return 0;
      const s = stem(raw);
      let best = 0;
      for (const term of terms) best = Math.max(best, termScore(term, s, raw));
      return best;
    },
  };
}

// ─── Scoring ───────────────────────────────────────────────────────────────

const tokenCache = new Map<string, { raw: string; stem: string }[]>();
function tokens(text: string) {
  let cached = tokenCache.get(text);
  if (!cached) {
    cached = [...new Set(words(text))].map((raw) => ({ raw, stem: stem(raw) }));
    if (tokenCache.size > 5000) tokenCache.clear();
    tokenCache.set(text, cached);
  }
  return cached;
}

/**
 * Score a piece of text spread over weighted zones. 0 means "not a match".
 * Every meaningful word of the search must be found somewhere (directly, as
 * a related word or with a small typo); for searches of three words or more,
 * two thirds is enough.
 */
export function scoreZones(query: CompiledQuery, zones: SearchZone[]) {
  let total = 0;
  let found = 0;
  for (const term of query.terms) {
    let best = 0;
    for (const zone of zones) {
      if (!zone.text) continue;
      for (const t of tokens(zone.text)) {
        const s = termScore(term, t.stem, t.raw) * zone.weight;
        if (s > best) best = s;
      }
    }
    if (best > 0) found++;
    total += best;
  }
  const needed =
    query.terms.length >= 3
      ? Math.ceil((query.terms.length * 2) / 3)
      : query.terms.length;
  if (found < needed) return 0;
  // The exact phrase, as typed, counts extra.
  if (query.phrase.includes(" ")) {
    for (const zone of zones) {
      if (normalize(zone.text).includes(query.phrase)) {
        total += 2 * zone.weight;
        break;
      }
    }
  }
  return (total * found) / query.terms.length;
}

// ─── Highlighting ──────────────────────────────────────────────────────────

/** Split text into pieces, marking the words that match the search. */
export function highlightParts(text: string, query: CompiledQuery | null) {
  if (!query) return [{ text, hit: false }];
  const parts: { text: string; hit: boolean }[] = [];
  // Words (letters, digits, inner apostrophes) and everything between them.
  for (const piece of text.split(/([\p{L}\p{N}]+(?:['’][\p{L}]+)*)/u)) {
    if (!piece) continue;
    const hit = /[\p{L}\p{N}]/u.test(piece) && query.matchWord(piece) > 0;
    const last = parts[parts.length - 1];
    if (last && last.hit === hit) last.text += piece;
    else parts.push({ text: piece, hit });
  }
  return parts;
}
