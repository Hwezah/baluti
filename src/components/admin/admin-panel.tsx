"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  CircleCheck,
  ClipboardCopy,
  Clock,
  Download,
  EyeOff,
  Eye,
  History,
  Plus,
  Info,
  LockKeyhole,
  RotateCcw,
  Undo2,
  Search,
  TriangleAlert,
} from "lucide-react";

import {
  copyDefaults,
  adminGroups,
  adminSections,
  isEssentialField,
  copySections,
  type CopyField,
  type CopySection,
} from "@/content/copy";
import { itemId, listDefs, listItems, type ListDef } from "@/content/lists";
import { cn } from "@/lib/utils";
import { publishedValue } from "@/context/copy-context";
import { pendingEdits } from "@/lib/copy-storage";
import {
  compileQuery,
  highlightParts,
  scoreZones,
  type CompiledQuery,
} from "@/lib/smart-search";
import {
  publishedText,
  type SiteTextFile,
  type TextEntry,
} from "@/lib/site-text";
import { Button } from "@/components/ui/button";

type Mode = "github" | "local" | "off";

const PASSCODE_KEY = "baluti-admin-passcode";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

const sectionAnchor = (id: string) => `section-${id}`;

/** Matching words in `text` are marked. */
function Highlight({
  text,
  query,
}: {
  text: string;
  query: CompiledQuery | null;
}) {
  if (!query) return text;
  return highlightParts(text, query).map((part, i) =>
    part.hit ? (
      <mark key={i} className="rounded-[2px] bg-[#fde68a] px-0.5 text-ink">
        {part.text}
      </mark>
    ) : (
      part.text
    ),
  );
}

/** Text the latest saved version gives an id. */
const savedValue = (file: SiteTextFile, id: string) =>
  file.texts[id] ?? copyDefaults[id] ?? "";

/** A field of an item the client added (it has no demo text). */
type AdminField = CopyField & { added?: boolean };

const capitalise = (text: string) => text[0].toUpperCase() + text.slice(1);

/** "Review 5", "Review 5 — quote", "Question 6 — answer". */
function itemLabel(def: ListDef, n: number, partLabel: string) {
  const name = `${capitalise(def.noun)} ${n}`;
  return partLabel.toLowerCase() === def.noun || !partLabel
    ? name
    : `${name} — ${partLabel.toLowerCase()}`;
}

/** Which list item (if any) a field belongs to. */
function itemOf(field: CopyField, defs: ListDef[]) {
  for (const def of defs) {
    const head = `${def.prefix}.`;
    if (field.id.startsWith(head)) {
      return { def, key: field.id.slice(head.length).split(".")[0] };
    }
  }
  return null;
}

/** Admin sections, with the fields of items the client added. */
function withAddedItems(file: SiteTextFile): CopySection[] {
  return adminSections.map((section) => {
    const defs = listDefs.filter((d) => d.section === section.id && d.canAdd);
    if (defs.length === 0) return section;
    const fields: CopyField[] = [...section.fields];
    for (const def of defs) {
      const items = listItems(def.id, file);
      const added = items.flatMap((item, i) =>
        item.added
          ? def.parts.map(
              (p): AdminField => ({
                id: itemId(def, item.key, p.part),
                label: itemLabel(def, i + 1, p.label),
                text: "",
                added: true,
              }),
            )
          : [],
      );
      if (added.length === 0) continue;
      // After the list's built-in items.
      let at = fields.length;
      for (let i = fields.length - 1; i >= 0; i--) {
        if (fields[i].id.startsWith(`${def.prefix}.`)) {
          at = i + 1;
          break;
        }
      }
      fields.splice(at, 0, ...added);
    }
    return { ...section, fields };
  });
}

function buildSummary(file: SiteTextFile) {
  const lines = [
    "Baluti & Co. Advocates website — text changes",
    `Exported ${formatDate(new Date().toISOString())}`,
    "",
  ];
  for (const section of copySections) {
    for (const field of section.fields) {
      const now = file.texts[field.id];
      if (now === undefined || !(field.id in copyDefaults)) continue;
      lines.push(
        `[${section.group} › ${section.title}] ${field.label}`,
        `Was: ${field.text}`,
        `Now: ${now}`,
        "",
      );
    }
  }
  for (const def of listDefs) {
    listItems(def.id, file).forEach((item, i) => {
      if (item.hidden) {
        lines.push(
          `Hidden from the site: ${capitalise(def.noun)} ${i + 1}`,
          "",
        );
      }
      if (item.added) {
        lines.push(`Added: ${capitalise(def.noun)} ${i + 1}`, "");
      }
    });
  }
  if (lines.length === 3) lines.push("No changes yet.");
  return lines.join("\n");
}

function readStoredPasscode() {
  try {
    return window.sessionStorage.getItem(PASSCODE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function AdminPanel({
  mode,
  passcodeRequired,
  missing,
}: {
  mode: Mode;
  passcodeRequired: boolean;
  missing: string[];
}) {
  const [passcode, setPasscode] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(!passcodeRequired && mode !== "off");
  const [file, setFile] = useState<SiteTextFile>(publishedText);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [tier, setTier] = useState<Tier>("essential");
  const [notice, setNotice] = useState<string | null>(null);

  const canSave = mode !== "off" && unlocked;

  const load = useCallback(async (code: string) => {
    const res = await fetch("/api/site-text", {
      headers: { "x-admin-passcode": code },
      cache: "no-store",
    });
    if (res.status === 401) return "wrong";
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setLoadError(body?.error ?? "The saved text couldn’t be loaded.");
      return "error";
    }
    setFile((await res.json()) as SiteTextFile);
    setLoadError(null);
    return "ok";
  }, []);

  // Reuse a passcode entered earlier in this browser tab.
  useEffect(() => {
    if (mode === "off") return;
    const code = passcodeRequired ? readStoredPasscode() : "";
    if (passcodeRequired && !code) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/site-text", {
        headers: { "x-admin-passcode": code },
        cache: "no-store",
      });
      if (cancelled) return;
      if (res.status === 401) {
        try {
          window.sessionStorage.removeItem(PASSCODE_KEY);
        } catch {}
        return;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setLoadError(body?.error ?? "The saved text couldn’t be loaded.");
        return;
      }
      const latest = (await res.json()) as SiteTextFile;
      if (cancelled) return;
      setFile(latest);
      setPasscode(code);
      setUnlocked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, passcodeRequired]);

  // Forget instant previews the published site has caught up with.
  useEffect(() => {
    pendingEdits.prune(
      (id, text) => publishedValue(id) === (text ?? copyDefaults[id]),
    );
  }, []);

  const sections = useMemo(() => withAddedItems(file), [file]);

  const changed = useMemo(
    () =>
      new Set(
        sections.flatMap((s) =>
          s.fields.filter((f) => f.id in file.texts).map((f) => f.id),
        ),
      ),
    [sections, file.texts],
  );

  const compiled = useMemo(() => compileQuery(query), [query]);

  const tierCounts = useMemo(() => {
    const all = sections.flatMap((s) => s.fields);
    const essential = all.filter((f) => isEssentialField(f.id)).length;
    return { essential, detail: all.length - essential };
  }, [sections]);

  const visibleSections = useMemo(() => {
    // A search looks through both lists; otherwise show the chosen one.
    const allowed = (id: string) =>
      (!onlyChanged || changed.has(id)) &&
      (compiled !== null || isEssentialField(id) === (tier === "essential"));

    if (!compiled) {
      return sections
        .map((section) => ({
          ...section,
          fields: section.fields.filter((f) => allowed(f.id)),
        }))
        .filter((s) => s.fields.length > 0);
    }

    // Smart search: score every text, keep the good ones, best first.
    const scored = sections.map((section) => {
      const context = `${section.group} ${section.title}`;
      const about = `${section.purpose} ${section.covers}`;
      const fields = section.fields
        .filter((f) => allowed(f.id))
        .map((field) => ({
          field,
          score: scoreZones(compiled, [
            { text: field.label, weight: 3 },
            { text: savedValue(file, field.id), weight: 2.5 },
            { text: field.text, weight: 1.5 },
            { text: context, weight: 1.5 },
            { text: about, weight: 0.6 },
          ]),
        }));
      return { section, fields };
    });
    const top = Math.max(
      0,
      ...scored.flatMap((s) => s.fields.map((f) => f.score)),
    );
    // Drop weak matches when there are strong ones.
    const cutoff = top * 0.4;
    return scored
      .map(({ section, fields }) => {
        const kept = fields
          .filter((f) => f.score > 0 && f.score >= cutoff)
          .sort((a, b) => b.score - a.score);
        return {
          section: { ...section, fields: kept.map((f) => f.field) },
          best: kept[0]?.score ?? 0,
        };
      })
      .filter(({ section }) => section.fields.length > 0)
      .sort((a, b) => b.best - a.best)
      .map(({ section }) => section);
  }, [compiled, onlyChanged, changed, file, sections, tier]);

  const matchCount = visibleSections.reduce((n, s) => n + s.fields.length, 0);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice((m) => (m === message ? null : m)), 4000);
  };

  /** Save (or with null, revert) one text. Returns an error message or null. */
  const save = async (id: string, text: string | null) => {
    const res = await fetch("/api/site-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passcode": passcode ?? "",
      },
      body: JSON.stringify({ id, text }),
    });
    const body = (await res.json().catch(() => null)) as
      | (SiteTextFile & { error?: string })
      | null;
    if (!res.ok || !body) {
      if (res.status === 401) setUnlocked(false);
      return body?.error ?? "Saving failed. Please try again.";
    }
    setFile({ texts: body.texts, history: body.history, lists: body.lists });
    // Show it in this browser now; everyone else sees it after the redeploy.
    pendingEdits.set(id, body.texts[id] ?? null);
    return null;
  };

  /** Hide, show or add a list item. Returns an error message or null. */
  const changeList = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/site-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passcode": passcode ?? "",
      },
      body: JSON.stringify(body),
    });
    const result = (await res.json().catch(() => null)) as
      | (SiteTextFile & { error?: string })
      | null;
    if (!res.ok || !result) {
      if (res.status === 401) setUnlocked(false);
      return result?.error ?? "Saving failed. Please try again.";
    }
    setFile({
      texts: result.texts,
      history: result.history,
      lists: result.lists,
    });
    return null;
  };

  /** Delete every edit and go back to the demo text. Returns an error or null. */
  const resetAll = async (confirmCode: string) => {
    const res = await fetch("/api/site-text", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passcode": passcode ?? "",
      },
      body: JSON.stringify({ passcode: confirmCode }),
    });
    const body = (await res.json().catch(() => null)) as
      | (SiteTextFile & { error?: string })
      | null;
    if (res.status === 401) return "That passcode isn’t right.";
    if (!res.ok || !body)
      return body?.error ?? "Resetting failed. Please try again.";
    const ids = Object.keys(file.texts);
    setFile({ texts: body.texts, history: body.history, lists: body.lists });
    ids.forEach((id) => pendingEdits.set(id, null));
    return null;
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(file));
      flash("A list of all changes was copied.");
    } catch {
      flash(
        "Copying isn’t allowed in this browser. Use “Download a copy” instead.",
      );
    }
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(file, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `baluti-site-text-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-sand px-2 pt-4 pb-12 sm:px-4 sm:pt-10 lg:px-10 lg:pt-16 lg:pb-[110px]">
      <div className="site-container">
        <header className="mb-4 max-w-[70ch] max-sm:px-1 sm:mb-8">
          <div className="eyebrow mb-3">Admin panel</div>
          <h1 className="m-0 mb-4 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-bold">
            Edit the text on your website
          </h1>
          <p className="m-0 text-base text-ink-soft">
            Below is the text only you can get right: your firm’s details,
            people and credentials, practice areas, articles and client reviews,
            grouped by page. Under each one, type the text you would like
            instead and press <strong>Save to site</strong>. You can always undo
            a change or go back to the original demo text. Menus, buttons and
            small headings are looked after by your developer.
          </p>
        </header>

        <HowItWorks mode={mode} missing={missing} />

        {canSave && (
          <ResetAll
            mode={mode}
            changedCount={changed.size}
            passcodeRequired={passcodeRequired}
            onReset={resetAll}
          />
        )}

        {mode !== "off" && !unlocked && (
          <PasscodeForm
            onSubmit={async (code) => {
              const result = await load(code);
              if (result === "wrong") return "That passcode isn’t right.";
              if (result === "error") return null;
              try {
                window.sessionStorage.setItem(PASSCODE_KEY, code);
              } catch {}
              setPasscode(code);
              setUnlocked(true);
              return null;
            }}
          />
        )}

        {loadError && (
          <p
            role="alert"
            className="m-0 mb-6 border border-[#e3a3a3] bg-[#fdeeee] p-4 text-[15px] text-ink"
          >
            {loadError}
          </p>
        )}

        <TierTabs
          tier={tier}
          counts={tierCounts}
          searching={compiled !== null}
          onChange={(next) => {
            setTier(next);
            window.scrollTo({ top: 0 });
          }}
        />

        {/* Toolbar */}
        <div className="z-20 mb-4 flex flex-wrap items-center gap-2 border border-black/10 bg-white p-2 max-sm:flex-col max-sm:items-stretch sm:mb-8 sm:gap-3 sm:p-3 shadow-[0_12px_30px_-24px_rgba(0,0,0,.5)] lg:sticky lg:top-[calc(var(--header-h)+8px)]">
          <label className="relative min-w-[220px] flex-1 max-sm:min-w-0">
            <span className="sr-only">Search the text</span>
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a word or phrase…"
              className="w-full rounded-[2px] border border-black/12 bg-field py-2.5 pr-3 pl-9 text-[15px] focus:border-ink focus:outline-none"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium max-sm:justify-center max-sm:py-1">
            <input
              type="checkbox"
              checked={onlyChanged}
              onChange={(e) => setOnlyChanged(e.target.checked)}
              className="size-4 accent-ink"
            />
            Only show changed text ({changed.size})
          </label>
          <div className="flex flex-wrap gap-2 max-sm:flex-col max-sm:items-center">
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer max-sm:w-[80vw]"
              onClick={copySummary}
            >
              <ClipboardCopy size={15} /> Copy list of changes
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer max-sm:w-[80vw]"
              onClick={download}
            >
              <Download size={15} /> Download a copy
            </Button>
          </div>
          {compiled && (
            <p role="status" className="m-0 w-full text-sm text-ink-soft">
              <strong className="text-ink">{matchCount}</strong>{" "}
              {matchCount === 1 ? "match" : "matches"}, best first. Related
              words and small typos are included.
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="m-0 w-full text-sm font-medium text-ink"
            >
              {notice}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 items-start gap-4 sm:gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <SectionNav sections={visibleSections} changed={changed} />
          <div className="flex min-w-0 flex-col gap-4 sm:gap-8">
            {compiled === null && <TierBanner tier={tier} />}
            {visibleSections.length === 0 && (
              <p className="m-0 border border-black/10 bg-white p-8 text-center text-muted-foreground">
                Nothing matches. Try another word, or untick “Only show changed
                text”.
              </p>
            )}
            {visibleSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                file={file}
                changed={changed}
                canSave={canSave}
                mode={mode}
                onSave={save}
                onListChange={changeList}
                query={compiled}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type Tier = "essential" | "detail";

const tiers: {
  id: Tier;
  step: string;
  title: string;
  text: string;
  banner: string;
}[] = [
  {
    id: "essential",
    step: "1",
    title: "Must check first",
    text: "Facts about your firm: practice areas and services, attorney names and credentials, contact details, numbers, client reviews, history and the promises you make to clients.",
    banner:
      "This section covers the most crucial information on the site, from practice areas to attorney names. The demo text here is made up, so please confirm or correct every item before the site is shared.",
  },
  {
    id: "detail",
    step: "2",
    title: "Fine-tuning",
    text: "Descriptions and wording: introductions, practice area descriptions, values, careers and articles.",
    banner:
      "This section covers the finer details: descriptions and wording that already read well. Nothing here is urgent, so refine it whenever you have time, once everything in “Must check first” is right.",
  },
];

function TierBanner({ tier }: { tier: Tier }) {
  const t = tiers.find((x) => x.id === tier)!;
  return (
    <div
      role="note"
      className="flex gap-3 bg-crimson p-3 text-[15px] leading-[1.5] text-white sm:p-5"
    >
      <TriangleAlert size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="m-0">
        <strong className="font-semibold">
          {t.step}. {t.title}:
        </strong>{" "}
        {t.banner}
      </p>
    </div>
  );
}

function TierTabs({
  tier,
  counts,
  searching,
  onChange,
}: {
  tier: Tier;
  counts: Record<Tier, number>;
  searching: boolean;
  onChange: (tier: Tier) => void;
}) {
  return (
    <div className="mb-4 sm:mb-8">
      <div
        role="tablist"
        aria-label="Which text to show"
        className="grid gap-2 sm:grid-cols-2 sm:gap-3"
      >
        {tiers.map((t) => {
          const active = !searching && tier === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={cn(
                "flex cursor-pointer gap-3 border p-3 text-left transition-colors sm:p-5",
                active
                  ? "border-ink bg-ink text-white"
                  : "border-black/12 bg-white text-ink hover:border-ink",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full font-serif text-[1.05rem] font-bold",
                  active ? "bg-white text-ink" : "bg-ink text-white",
                )}
              >
                {t.step}
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-[1.15rem] font-semibold">
                  {t.title}{" "}
                  <span
                    className={cn(
                      "font-sans text-sm font-medium",
                      active ? "text-white/70" : "text-ink-faint",
                    )}
                  >
                    ({counts[t.id]} texts)
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-1 block text-[14px] leading-[1.5]",
                    active ? "text-white/80" : "text-ink-soft",
                  )}
                >
                  {t.text}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {searching && (
        <p className="m-0 mt-2 text-sm text-ink-soft">
          Searching both lists. Clear the search to go back to one list.
        </p>
      )}
    </div>
  );
}

function HowItWorks({ mode, missing }: { mode: Mode; missing: string[] }) {
  if (mode === "off") {
    return (
      <aside
        role="note"
        className="mb-4 flex gap-3 border border-[#d9b44a] bg-[#fff8e1] p-3 text-[15px] text-ink sm:mb-8 sm:gap-4 sm:p-5"
      >
        <TriangleAlert
          size={22}
          className="mt-0.5 shrink-0 text-[#9a6b00]"
          aria-hidden="true"
        />
        <div>
          <p className="m-0 mb-2 font-semibold">
            Saving is not switched on yet
          </p>
          <p className="m-0 text-ink-soft">
            You can read through all the text below, but changes can’t be saved
            until the website is connected to its code storage. For the
            developer: add {missing.join(", ")} in the hosting settings and
            redeploy.
          </p>
        </div>
      </aside>
    );
  }
  return (
    <aside
      role="note"
      className="mb-4 flex gap-3 border border-black/12 bg-white p-3 text-[15px] text-ink sm:mb-8 sm:gap-4 sm:p-5"
    >
      <Info
        size={22}
        className="mt-0.5 shrink-0 text-ink-soft"
        aria-hidden="true"
      />
      <div>
        <p className="m-0 mb-2 font-semibold">How saving works</p>
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-ink-soft">
          <li>
            When you press <strong>Save to site</strong>, your text is written
            into the website itself. It is permanent and everyone will see it.
          </li>
          {mode === "github" ? (
            <li>
              The website then rebuilds itself, which takes{" "}
              <strong>about 1–2 minutes</strong>. You will see your change
              straight away on this device; other visitors see it once the
              rebuild finishes.
            </li>
          ) : (
            <li>
              This is a development copy of the site: changes are saved to the
              files on this computer and show immediately.
            </li>
          )}
          <li>
            Every change is recorded. Use <strong>Undo last save</strong>,{" "}
            <strong>Revert to demo text</strong> or{" "}
            <strong>Earlier versions</strong> on any item to undo it.
          </li>
        </ul>
      </div>
    </aside>
  );
}

function ResetAll({
  mode,
  changedCount,
  passcodeRequired,
  onReset,
}: {
  mode: Mode;
  changedCount: number;
  passcodeRequired: boolean;
  onReset: (code: string) => Promise<string | null>;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  // Without a passcode (local development), typing RESET confirms instead.
  const ready = passcodeRequired ? code.length > 0 : code.trim() === "RESET";

  return (
    <aside className="mb-4 border border-black/12 bg-white p-3 text-[15px] text-ink sm:mb-8 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="m-0 mb-1 font-semibold">
            Start over: reset the whole site to the demo text
          </p>
          <p className="m-0 text-ink-soft">
            Only use this if you want to throw away all your changes at once. To
            undo a single change, use <strong>Undo last save</strong> or{" "}
            <strong>Revert to demo text</strong> on that item instead.
          </p>
        </div>
        {!open && (
          <Button
            size="sm"
            variant="ghost"
            className="cursor-pointer max-sm:w-[80vw]"
            disabled={changedCount === 0}
            onClick={() => {
              setOpen(true);
              setMessage(null);
            }}
          >
            <RotateCcw size={14} /> Reset everything…
          </Button>
        )}
      </div>

      {open && (
        <form
          className="mt-3 border border-[#d9b44a] bg-[#fff8e1] p-3 sm:mt-4 sm:p-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!ready) return;
            setBusy(true);
            const error = await onReset(code);
            setBusy(false);
            if (error) {
              setMessage({ ok: false, text: error });
            } else {
              setOpen(false);
              setCode("");
              setMessage({
                ok: true,
                text:
                  mode === "github"
                    ? "Everything was reset. The demo text will be live for everyone in about 1–2 minutes."
                    : "Everything was reset to the demo text.",
              });
            }
          }}
        >
          <p className="m-0 mb-3 flex gap-2 font-semibold">
            <TriangleAlert
              size={20}
              className="mt-0.5 shrink-0 text-[#9a6b00]"
              aria-hidden="true"
            />
            <span>
              Please note: this will delete everything you’ve been editing (
              {changedCount} {changedCount === 1 ? "change" : "changes"} and all
              earlier versions) and revert the site text to its original demo
              text. This can’t be undone from the admin panel.
            </span>
          </p>
          <label className="mb-3 flex max-w-[360px] flex-col gap-1.5 font-semibold">
            {passcodeRequired
              ? "Enter the admin passcode to confirm"
              : "Type RESET to confirm"}
            <input
              type={passcodeRequired ? "password" : "text"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
              className="rounded-[2px] border border-black/15 bg-white p-3 text-[15px] font-normal focus:border-ink focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2 max-sm:flex-col max-sm:items-center">
            <Button
              type="submit"
              size="sm"
              className="cursor-pointer max-sm:w-[80vw]"
              disabled={!ready || busy}
            >
              {busy ? "Resetting…" : "Yes, delete my changes and reset"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="cursor-pointer max-sm:w-[80vw]"
              onClick={() => {
                setOpen(false);
                setCode("");
                setMessage(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {message && (
        <p
          role={message.ok ? "status" : "alert"}
          className={cn(
            "m-0 mt-3 text-sm font-medium",
            message.ok ? "text-ink" : "text-[#9a1b1b]",
          )}
        >
          {message.text}
        </p>
      )}
    </aside>
  );
}

function PasscodeForm({
  onSubmit,
}: {
  onSubmit: (code: string) => Promise<string | null>;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(await onSubmit(code));
        setBusy(false);
      }}
      className="mb-4 flex flex-wrap items-end gap-3 border border-black/12 bg-white p-3 max-sm:flex-col max-sm:items-center sm:mb-8 sm:p-5"
    >
      <LockKeyhole
        size={22}
        className="mb-2.5 shrink-0 text-ink-soft"
        aria-hidden="true"
      />
      <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-[15px] font-semibold max-sm:w-full">
        Enter the admin passcode to make changes
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="current-password"
          className="rounded-[2px] border border-black/15 bg-field p-3 text-[15px] font-normal focus:border-ink focus:outline-none"
        />
      </label>
      <Button
        type="submit"
        size="sm"
        className="cursor-pointer max-sm:w-[80vw]"
        disabled={!code || busy}
      >
        {busy ? "Checking…" : "Unlock"}
      </Button>
      {error && (
        <p
          role="alert"
          className="m-0 w-full text-sm font-medium text-[#9a1b1b]"
        >
          {error}
        </p>
      )}
    </form>
  );
}

function SectionNav({
  sections,
  changed,
}: {
  sections: CopySection[];
  changed: Set<string>;
}) {
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Highlight the section currently at the top of the screen.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const header =
        document.getElementById("site-header-bars")?.getBoundingClientRect()
          .height ?? 0;
      const line = header + 140;
      let current: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(sectionAnchor(s.id));
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = s.id;
        else break;
      }
      setActive(current ?? sections[0]?.id ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  // Keep the highlighted item visible inside the panel.
  useEffect(() => {
    if (!active) return;
    navRef.current
      ?.querySelector(`[data-section="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <nav
      ref={navRef}
      aria-label="Sections"
      className="hidden max-h-[calc(100vh-var(--header-h)-120px)] overflow-y-auto border border-black/10 bg-white p-4 lg:sticky lg:top-[calc(var(--header-h)+100px)] lg:block"
    >
      {adminGroups.map((group) => {
        const inGroup = sections.filter((s) => s.group === group);
        if (inGroup.length === 0) return null;
        return (
          <div key={group} className="mb-4 last:mb-0">
            <div className="mb-1.5 text-xs font-semibold tracking-[.14em] text-ink-faint uppercase">
              {group}
            </div>
            <ul className="m-0 list-none p-0">
              {inGroup.map((s) => {
                const count = s.fields.filter((f) => changed.has(f.id)).length;
                const isActive = s.id === active;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${sectionAnchor(s.id)}`}
                      data-section={s.id}
                      aria-current={isActive ? "location" : undefined}
                      onClick={() => setActive(s.id)}
                      className={cn(
                        "-mx-2 flex items-center justify-between gap-2 rounded-[2px] px-2 py-1 text-[13.5px] transition-colors",
                        isActive
                          ? "bg-crimson font-semibold text-white hover:text-white"
                          : "text-ink-body hover:text-crimson",
                      )}
                    >
                      <span className="truncate">{s.title}</span>
                      {count > 0 && (
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-1.5 text-[11px] font-semibold",
                            isActive
                              ? "bg-white text-crimson"
                              : "bg-ink text-white",
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function SectionCard({
  section,
  file,
  changed,
  canSave,
  mode,
  onSave,
  onListChange,
  query,
}: {
  section: CopySection;
  file: SiteTextFile;
  changed: Set<string>;
  canSave: boolean;
  mode: Mode;
  onSave: (id: string, text: string | null) => Promise<string | null>;
  onListChange: (body: Record<string, unknown>) => Promise<string | null>;
  query: CompiledQuery | null;
}) {
  const defs = listDefs.filter((d) => d.section === section.id);
  // A whole section that is one item (an article).
  const sectionItem = listDefs
    .filter((d) => d.itemSection)
    .map((def) => {
      const item = listItems(def.id, file).find(
        (it) => def.itemSection!(it.key) === section.id,
      );
      return item && { def, item };
    })
    .find(Boolean);

  // Group the fields of each list item, and put "Add another" after a list.
  type Block =
    | { kind: "field"; field: CopyField }
    | { kind: "item"; def: ListDef; key: string; fields: CopyField[] }
    | { kind: "add"; def: ListDef };
  const blocks: Block[] = [];
  for (const field of section.fields) {
    const owner = itemOf(field, defs);
    const last = blocks[blocks.length - 1];
    if (!owner) {
      blocks.push({ kind: "field", field });
    } else if (
      last?.kind === "item" &&
      last.def === owner.def &&
      last.key === owner.key
    ) {
      last.fields.push(field);
    } else {
      blocks.push({
        kind: "item",
        def: owner.def,
        key: owner.key,
        fields: [field],
      });
    }
  }
  for (const def of defs.filter((d) => d.canAdd)) {
    let at = -1;
    blocks.forEach((b, i) => {
      if (b.kind === "item" && b.def === def) at = i;
    });
    if (at >= 0) blocks.splice(at + 1, 0, { kind: "add", def });
  }

  const editor = (field: CopyField) => (
    <FieldEditor
      key={field.id}
      field={field}
      current={savedValue(file, field.id)}
      entries={file.history[field.id] ?? []}
      isChanged={changed.has(field.id)}
      canSave={canSave}
      mode={mode}
      onSave={onSave}
      query={query}
    />
  );

  return (
    <section
      id={sectionAnchor(section.id)}
      className="scroll-mt-[calc(var(--header-h)+100px)] border border-black/10 bg-white"
    >
      <div className="border-b border-black/10 p-3 sm:p-5 lg:p-8">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-[.14em] text-ink-faint uppercase">
            {section.group}
          </span>
          <Link
            href={section.href}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            See it on the site <ArrowUpRight size={15} />
          </Link>
        </div>
        <h2 className="m-0 mb-4 font-serif text-[clamp(1.4rem,2.4vw,1.8rem)] leading-[1.2] font-bold">
          <Highlight text={section.title} query={query} />
        </h2>
        <dl className="m-0 grid gap-2 text-[15px] sm:gap-3 md:grid-cols-2">
          <div className="bg-paper p-3 sm:p-4">
            <dt className="mb-1 text-xs font-semibold tracking-[.12em] text-ink-faint uppercase">
              What this section is for
            </dt>
            <dd className="m-0 text-ink-soft">{section.purpose}</dd>
          </div>
          <div className="bg-paper p-3 sm:p-4">
            <dt className="mb-1 text-xs font-semibold tracking-[.12em] text-ink-faint uppercase">
              What it should cover
            </dt>
            <dd className="m-0 text-ink-soft">{section.covers}</dd>
          </div>
        </dl>
        {sectionItem && (
          <HideToggle
            def={sectionItem.def}
            itemKey={sectionItem.item.key}
            hidden={sectionItem.item.hidden}
            canSave={canSave}
            mode={mode}
            onListChange={onListChange}
            className="mt-4"
          />
        )}
      </div>
      {sectionItem?.item.hidden ? (
        <p className="m-0 p-3 sm:p-5 lg:p-8 text-[15px] text-ink-soft">
          This {sectionItem.def.noun} is hidden from the site. Its text is kept,
          so you can show it again at any time.
        </p>
      ) : (
        <div className="divide-y divide-black/8">
          {blocks.map((block) => {
            if (block.kind === "field") return editor(block.field);
            if (block.kind === "add") {
              return (
                <AddItem
                  key={`add-${block.def.id}`}
                  def={block.def}
                  canSave={canSave}
                  mode={mode}
                  onListChange={onListChange}
                />
              );
            }
            const items = listItems(block.def.id, file);
            const index = items.findIndex((it) => it.key === block.key);
            const item = items[index];
            return (
              <ItemCard
                key={`${block.def.id}-${block.key}`}
                def={block.def}
                itemKey={block.key}
                title={
                  block.def.id === "people"
                    ? (block.fields[0]?.label.split(" — ")[0] ??
                      `Person ${index + 1}`)
                    : `${capitalise(block.def.noun)} ${index + 1}`
                }
                hidden={item?.hidden ?? false}
                canSave={canSave}
                mode={mode}
                onListChange={onListChange}
              >
                {block.fields.map(editor)}
              </ItemCard>
            );
          })}
        </div>
      )}
    </section>
  );
}

const structureNote = (mode: Mode) =>
  mode === "github"
    ? "The site will update in about 1–2 minutes."
    : "The site has been updated.";

function HideToggle({
  def,
  itemKey,
  hidden,
  canSave,
  mode,
  onListChange,
  className,
}: {
  def: ListDef;
  itemKey: string;
  hidden: boolean;
  canSave: boolean;
  mode: Mode;
  onListChange: (body: Record<string, unknown>) => Promise<string | null>;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 max-sm:flex-col max-sm:items-center",
        className,
      )}
    >
      <Button
        size="sm"
        variant="ghost"
        className="cursor-pointer max-sm:w-[80vw]"
        disabled={!canSave || busy}
        onClick={async () => {
          setBusy(true);
          setMessage(null);
          const error = await onListChange({
            op: hidden ? "show" : "hide",
            list: def.id,
            key: itemKey,
          });
          setBusy(false);
          setMessage(
            error
              ? { ok: false, text: error }
              : {
                  ok: true,
                  text: `${hidden ? "Shown again" : "Hidden"}. ${structureNote(mode)}`,
                },
          );
        }}
      >
        {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
        {busy
          ? "Saving…"
          : hidden
            ? "Show on site again"
            : `Hide this ${def.noun} from the site`}
      </Button>
      {message && (
        <span
          role={message.ok ? "status" : "alert"}
          className={cn(
            "text-sm font-medium",
            message.ok ? "text-ink" : "text-[#9a1b1b]",
          )}
        >
          {message.text}
        </span>
      )}
    </div>
  );
}

function ItemCard({
  def,
  itemKey,
  title,
  hidden,
  canSave,
  mode,
  onListChange,
  children,
}: {
  def: ListDef;
  itemKey: string;
  title: string;
  hidden: boolean;
  canSave: boolean;
  mode: Mode;
  onListChange: (body: Record<string, unknown>) => Promise<string | null>;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-l-4",
        hidden ? "border-black/10 bg-paper" : "border-ink/70",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 max-sm:flex-col max-sm:items-center pt-3 sm:px-5 sm:pt-5 lg:px-8">
        <div className="flex items-center gap-2 max-sm:self-start">
          <span className="font-serif text-[1.15rem] font-semibold">
            {title}
          </span>
          {hidden && (
            <span className="inline-flex items-center gap-1 rounded-full border border-black/15 px-2 py-0.5 text-[11px] font-semibold tracking-[.06em] text-ink-soft uppercase">
              <EyeOff size={12} /> Hidden
            </span>
          )}
        </div>
        <HideToggle
          def={def}
          itemKey={itemKey}
          hidden={hidden}
          canSave={canSave}
          mode={mode}
          onListChange={onListChange}
        />
      </div>
      {hidden ? (
        <p className="m-0 px-3 pt-2 pb-3 sm:px-5 sm:pb-5 lg:px-8 text-[14.5px] text-ink-soft">
          Not shown on the site. Its text is kept, so you can show it again at
          any time.
        </p>
      ) : (
        <div className="divide-y divide-black/8">{children}</div>
      )}
    </div>
  );
}

function AddItem({
  def,
  canSave,
  mode,
  onListChange,
}: {
  def: ListDef;
  canSave: boolean;
  mode: Mode;
  onListChange: (body: Record<string, unknown>) => Promise<string | null>;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const ready = def.parts.every((p) => (values[p.part] ?? "").trim());

  return (
    <div className="bg-paper/60 p-3 sm:p-5 lg:p-8">
      {!open ? (
        <div className="flex flex-wrap items-center gap-3 max-sm:flex-col max-sm:items-center">
          <Button
            size="sm"
            className="cursor-pointer max-sm:w-[80vw]"
            disabled={!canSave}
            onClick={() => {
              setOpen(true);
              setMessage(null);
            }}
          >
            <Plus size={15} /> Add another {def.noun}
          </Button>
          {message && (
            <span role="status" className="text-sm font-medium text-ink">
              {message.text}
            </span>
          )}
        </div>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!ready) return;
            setBusy(true);
            const error = await onListChange({
              op: "add",
              list: def.id,
              values,
            });
            setBusy(false);
            if (error) {
              setMessage({ ok: false, text: error });
            } else {
              setOpen(false);
              setValues({});
              setMessage({
                ok: true,
                text: `Added. ${structureNote(mode)}`,
              });
            }
          }}
        >
          <p className="m-0 font-semibold">New {def.noun}</p>
          {def.parts.map((p) => (
            <label
              key={p.part || "text"}
              className="flex flex-col gap-1.5 text-[14.5px] font-semibold"
            >
              {p.label}
              <textarea
                rows={p.long ? 4 : 1}
                value={values[p.part] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [p.part]: e.target.value }))
                }
                className="resize-y rounded-[2px] border border-black/15 bg-white p-2 text-[15px] leading-[1.5] sm:p-3 font-normal focus:border-ink focus:outline-none"
              />
            </label>
          ))}
          <div className="flex flex-wrap items-center gap-2 max-sm:flex-col max-sm:items-center">
            <Button
              type="submit"
              size="sm"
              className="cursor-pointer max-sm:w-[80vw]"
              disabled={!ready || busy}
            >
              {busy ? "Adding…" : "Add to site"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="cursor-pointer max-sm:w-[80vw]"
              onClick={() => {
                setOpen(false);
                setMessage(null);
              }}
            >
              Cancel
            </Button>
            {message && !message.ok && (
              <span role="alert" className="text-sm font-medium text-[#9a1b1b]">
                {message.text}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

function FieldEditor({
  field,
  current,
  entries,
  isChanged,
  canSave,
  mode,
  onSave,
  query,
}: {
  field: CopyField;
  current: string;
  entries: TextEntry[];
  isChanged: boolean;
  canSave: boolean;
  mode: Mode;
  onSave: (id: string, text: string | null) => Promise<string | null>;
  query: CompiledQuery | null;
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const added = (field as AdminField).added ?? false;
  const lastChange = entries[entries.length - 1];
  // What this text was before the last save (null: the demo text). Added
  // items have no demo text, so their first save can't be undone.
  const previous = added
    ? (entries[entries.length - 2]?.text ?? undefined)
    : entries.length > 0
      ? (entries[entries.length - 2]?.text ?? null)
      : undefined;
  const canUndo =
    previous !== undefined && (previous ?? field.text) !== current;
  // Saved, but this build of the site doesn't have it yet.
  const goingLive = mode === "github" && publishedValue(field.id) !== current;

  // Earlier saved wordings, newest first, without duplicates or the current one.
  const earlier = useMemo(() => {
    const seen = new Set<string>([current]);
    const list: TextEntry[] = [];
    for (const entry of [...entries].reverse()) {
      if (entry.text === null || seen.has(entry.text)) continue;
      seen.add(entry.text);
      list.push(entry);
    }
    return list;
  }, [entries, current]);

  const run = async (text: string | null, success: string) => {
    setBusy(true);
    setMessage(null);
    const error = await onSave(field.id, text);
    setBusy(false);
    if (error) {
      setMessage({ ok: false, text: error });
    } else {
      if (text !== null && text === draft.trim()) setDraft("");
      setMessage({ ok: true, text: success });
      window.setTimeout(
        () => setMessage((m) => (m?.text === success ? null : m)),
        5000,
      );
    }
  };

  const saved =
    mode === "github"
      ? "Saved — live for everyone in about 1–2 minutes."
      : "Saved — now showing on the site.";

  const rows = Math.min(8, Math.max(2, Math.ceil(field.text.length / 70)));
  const inputId = `field-${field.id}`;

  return (
    <div className="p-3 sm:p-5 lg:p-8">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <label htmlFor={inputId} className="text-[15px] font-semibold">
          <Highlight text={field.label} query={query} />
        </label>
        {isChanged && (
          <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold tracking-[.06em] text-white uppercase">
            {added ? "Added" : "Changed"}{" "}
            {lastChange && `· ${formatDate(lastChange.at)}`}
          </span>
        )}
        {goingLive ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-black/15 px-2 py-0.5 text-[11px] font-semibold tracking-[.06em] text-ink-soft uppercase">
            <Clock size={12} /> Going live
          </span>
        ) : (
          isChanged && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[.06em] text-ink-soft uppercase">
              <CircleCheck size={12} /> Live
            </span>
          )
        )}
      </div>

      <div className="mb-3 border-l-[3px] border-ink/20 bg-paper px-4 py-3">
        <div className="mb-1 text-[11.5px] font-semibold tracking-[.12em] text-ink-faint uppercase">
          Current text
        </div>
        <p className="m-0 text-[15px] whitespace-pre-line text-ink">
          <Highlight text={current} query={query} />
        </p>
        {isChanged && !added && (
          <p className="m-0 mt-2 text-[13.5px] text-muted-foreground">
            <span className="font-semibold">Original demo text:</span>{" "}
            <Highlight text={field.text} query={query} />
          </p>
        )}
      </div>

      <textarea
        id={inputId}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={rows}
        disabled={!canSave}
        placeholder={
          canSave
            ? "Type the text you would like here instead…"
            : "Unlock the admin panel to make changes."
        }
        className="mb-3 block w-full resize-y rounded-[2px] border border-black/15 bg-white p-2 text-[15px] leading-[1.5] sm:p-3 focus:border-ink focus:outline-none disabled:bg-paper"
      />

      <div className="flex flex-wrap items-center gap-2 max-sm:flex-col max-sm:items-center">
        <Button
          size="sm"
          className="cursor-pointer disabled:opacity-100 max-sm:w-[80vw]"
          disabled={
            !canSave || busy || !draft.trim() || draft.trim() === current
          }
          onClick={() => run(draft.trim(), saved)}
        >
          {busy ? "Saving…" : "Save to site"}
        </Button>
        {canUndo && (
          <Button
            size="sm"
            variant="ghost"
            className="cursor-pointer max-sm:w-[80vw]"
            disabled={!canSave || busy}
            title={`Go back to: ${previous ?? field.text}`}
            onClick={() => run(previous ?? null, "Last save undone.")}
          >
            <Undo2 size={14} /> Undo last save
          </Button>
        )}
        {isChanged && !added && (
          <Button
            size="sm"
            variant="ghost"
            className="cursor-pointer max-sm:w-[80vw]"
            disabled={!canSave || busy}
            onClick={() => run(null, "Back to the original demo text.")}
          >
            <RotateCcw size={14} /> Revert to demo text
          </Button>
        )}
        {draft === "" && canSave && (
          <Button
            size="sm"
            variant="ghost"
            className="cursor-pointer max-sm:w-[80vw]"
            onClick={() => setDraft(current)}
          >
            Start from current text
          </Button>
        )}
        {message && (
          <span
            role={message.ok ? "status" : "alert"}
            className={
              message.ok
                ? "inline-flex items-center gap-1.5 text-sm font-medium text-ink max-sm:w-[80vw] max-sm:justify-center max-sm:text-center"
                : "inline-flex items-center gap-1.5 text-sm font-medium text-[#9a1b1b] max-sm:w-[80vw] max-sm:justify-center max-sm:text-center"
            }
          >
            {message.ok ? <Check size={15} /> : <TriangleAlert size={15} />}{" "}
            {message.text}
          </span>
        )}
      </div>

      {earlier.length > 0 && (
        <details className="mt-4 text-[14.5px]">
          <summary className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-ink-soft select-none">
            <History size={15} /> Earlier versions ({earlier.length})
          </summary>
          <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
            {earlier.map((entry) => (
              <li
                key={entry.at}
                className="flex flex-wrap items-start justify-between gap-3 border border-black/10 p-3 max-sm:flex-col max-sm:items-center max-sm:p-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-xs text-ink-faint">
                    {formatDate(entry.at)}
                  </div>
                  <p className="m-0 whitespace-pre-line text-ink">
                    {entry.text}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="cursor-pointer max-sm:w-[80vw]"
                  disabled={!canSave || busy}
                  onClick={() => run(entry.text, "Earlier version restored.")}
                >
                  Use this version
                </Button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
