"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowUpRight,
  Check,
  ClipboardCopy,
  Download,
  History,
  RotateCcw,
  Search,
  TriangleAlert,
  Upload,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  copyGroups,
  copySections,
  type CopyField,
  type CopySection,
} from "@/content/copy";
import { useCopy } from "@/context/copy-context";
import {
  copyStorage,
  currentText,
  type CopyEntry,
  type CopyHistory,
} from "@/lib/copy-storage";
import { Button } from "@/components/ui/button";

const noopSubscribe = () => () => {};

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

/** Every text id whose current text differs from the demo text. */
function changedIds(history: CopyHistory) {
  return copySections.flatMap((s) =>
    s.fields
      .filter((f) => currentText(history, f.id) !== undefined)
      .map((f) => f.id),
  );
}

function buildSummary(history: CopyHistory) {
  const lines = [
    "Baluti & Co. Advocates website — text changes",
    `Exported ${formatDate(new Date().toISOString())}`,
    "",
  ];
  for (const section of copySections) {
    for (const field of section.fields) {
      const now = currentText(history, field.id);
      if (now === undefined) continue;
      lines.push(
        `[${section.group} › ${section.title}] ${field.label}`,
        `Was: ${field.text}`,
        `Now: ${now}`,
        "",
      );
    }
  }
  if (lines.length === 3) lines.push("No changes yet.");
  return lines.join("\n");
}

export function AdminPanel() {
  const { history } = useCopy();
  const storageOk = useSyncExternalStore(
    noopSubscribe,
    () => copyStorage.isAvailable(),
    () => true,
  );
  const [query, setQuery] = useState("");
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const changed = useMemo(() => new Set(changedIds(history)), [history]);

  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return copySections
      .map((section) => {
        const sectionHit =
          q && `${section.group} ${section.title}`.toLowerCase().includes(q);
        const fields = section.fields.filter((field) => {
          if (onlyChanged && !changed.has(field.id)) return false;
          if (!q || sectionHit) return true;
          const now = currentText(history, field.id) ?? field.text;
          return `${field.label} ${field.text} ${now}`
            .toLowerCase()
            .includes(q);
        });
        return { ...section, fields };
      })
      .filter((s) => s.fields.length > 0);
  }, [query, onlyChanged, changed, history]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice((m) => (m === message ? null : m)), 4000);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(history));
      flash(
        "A list of your changes was copied. Paste it into an email or message.",
      );
    } catch {
      flash(
        "Copying isn’t allowed in this browser. Use “Download changes” instead.",
      );
    }
  };

  const download = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { version: 1, exportedAt: new Date().toISOString(), history },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `baluti-site-text-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as { history?: CopyHistory };
      if (!data.history || typeof data.history !== "object") throw new Error();
      if (
        changed.size > 0 &&
        !window.confirm(
          "Replace the changes saved in this browser with the ones in this file?",
        )
      ) {
        return;
      }
      copyStorage.replaceAll(data.history);
      flash("Changes restored from the file.");
    } catch {
      flash(
        "That file couldn’t be read. Choose a file made with “Download changes”.",
      );
    }
  };

  const resetAll = () => {
    if (
      window.confirm(
        "Put every piece of text back to the original demo text? Download your changes first if you might want them again.",
      )
    ) {
      copyStorage.replaceAll({});
      flash("All text is back to the original demo text.");
    }
  };

  return (
    <div className="gutter bg-sand pt-[clamp(40px,5vw,64px)] pb-[clamp(64px,8vw,110px)]">
      <div className="site-container">
        <header className="mb-8 max-w-[70ch]">
          <div className="eyebrow mb-3">Admin panel</div>
          <h1 className="m-0 mb-4 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-bold">
            Edit the text on your website
          </h1>
          <p className="m-0 text-base text-ink-soft">
            Every piece of text on the demo site is listed below, grouped by
            page and section. Under each one, type the text you would like
            instead and press <strong>Save to site</strong> — the website
            updates straight away. You can always go back to the original demo
            text or to any earlier version you saved.
          </p>
        </header>

        <Disclaimer storageOk={storageOk} />

        {/* Toolbar */}
        <div className="z-20 lg:sticky lg:top-[calc(var(--header-h)+8px)] mb-8 flex flex-wrap items-center gap-3 border border-black/10 bg-white p-3 shadow-[0_12px_30px_-24px_rgba(0,0,0,.5)]">
          <label className="relative min-w-[220px] flex-1">
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
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={onlyChanged}
              onChange={(e) => setOnlyChanged(e.target.checked)}
              className="size-4 accent-ink"
            />
            Only show changed text ({changed.size})
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={copySummary}
            >
              <ClipboardCopy size={15} /> Copy changes
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={download}
            >
              <Download size={15} /> Download changes
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={() => fileInput.current?.click()}
            >
              <Upload size={15} /> Restore from file
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importFile(file);
                e.target.value = "";
              }}
            />
            {changed.size > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="cursor-pointer"
                onClick={resetAll}
              >
                <RotateCcw size={15} /> Reset everything
              </Button>
            )}
          </div>
          {notice && (
            <p
              role="status"
              className="m-0 w-full text-sm font-medium text-ink"
            >
              {notice}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <SectionNav sections={visibleSections} changed={changed} />
          <div className="flex min-w-0 flex-col gap-8">
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
                history={history}
                changed={changed}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Disclaimer({ storageOk }: { storageOk: boolean }) {
  return (
    <aside
      role="note"
      className="mb-8 flex gap-4 border border-[#d9b44a] bg-[#fff8e1] p-5 text-[15px] text-ink"
    >
      <TriangleAlert
        size={22}
        className="mt-0.5 shrink-0 text-[#9a6b00]"
        aria-hidden="true"
      />
      <div>
        <p className="m-0 mb-2 font-semibold">
          Please read: your changes are saved in this browser only
        </p>
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-ink-soft">
          <li>
            Text you save here is stored on{" "}
            <strong>this device, in this browser</strong>. You will see it on
            the website here, but other people, devices and browsers still see
            the original demo text.
          </li>
          <li>
            Your changes are <strong>lost</strong> if this browser’s history or
            site data is cleared, and they are not kept in private or incognito
            windows.
          </li>
          <li>
            Use <strong>Download changes</strong> (or{" "}
            <strong>Copy changes</strong>) regularly and send the result to your
            web developer, so your wording can be added to the live site
            permanently. A downloaded file can be loaded back with{" "}
            <strong>Restore from file</strong>.
          </li>
        </ul>
        {!storageOk && (
          <p className="m-0 mt-3 font-semibold text-[#9a1b1b]">
            This browser is blocking storage (for example a private window), so
            your changes will disappear when you close this tab. Download them
            before you leave.
          </p>
        )}
      </div>
    </aside>
  );
}

function SectionNav({
  sections,
  changed,
}: {
  sections: CopySection[];
  changed: Set<string>;
}) {
  return (
    <nav
      aria-label="Sections"
      className="hidden max-h-[calc(100vh-var(--header-h)-120px)] overflow-y-auto border border-black/10 bg-white p-4 lg:sticky lg:top-[calc(var(--header-h)+100px)] lg:block"
    >
      {copyGroups.map((group) => {
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
                return (
                  <li key={s.id}>
                    <a
                      href={`#${sectionAnchor(s.id)}`}
                      className="flex items-center justify-between gap-2 py-1 text-[13.5px] text-ink-body hover:text-crimson"
                    >
                      <span className="truncate">{s.title}</span>
                      {count > 0 && (
                        <span className="shrink-0 rounded-full bg-ink px-1.5 text-[11px] font-semibold text-white">
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
  history,
  changed,
}: {
  section: CopySection;
  history: CopyHistory;
  changed: Set<string>;
}) {
  return (
    <section
      id={sectionAnchor(section.id)}
      className="scroll-mt-[calc(var(--header-h)+100px)] border border-black/10 bg-white"
    >
      <div className="border-b border-black/10 p-[clamp(20px,3vw,32px)]">
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
          {section.title}
        </h2>
        <dl className="m-0 grid gap-3 text-[15px] md:grid-cols-2">
          <div className="bg-paper p-4">
            <dt className="mb-1 text-xs font-semibold tracking-[.12em] text-ink-faint uppercase">
              What this section is for
            </dt>
            <dd className="m-0 text-ink-soft">{section.purpose}</dd>
          </div>
          <div className="bg-paper p-4">
            <dt className="mb-1 text-xs font-semibold tracking-[.12em] text-ink-faint uppercase">
              What it should cover
            </dt>
            <dd className="m-0 text-ink-soft">{section.covers}</dd>
          </div>
        </dl>
      </div>
      <div className="divide-y divide-black/8">
        {section.fields.map((field) => (
          <FieldEditor
            key={field.id}
            field={field}
            entries={history[field.id] ?? []}
            isChanged={changed.has(field.id)}
          />
        ))}
      </div>
    </section>
  );
}

function FieldEditor({
  field,
  entries,
  isChanged,
}: {
  field: CopyField;
  entries: CopyEntry[];
  isChanged: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const current = isChanged
    ? (entries[entries.length - 1].text ?? field.text)
    : field.text;
  const lastChange = entries[entries.length - 1];

  // Earlier saved wordings, newest first, without duplicates or the current one.
  const earlier = useMemo(() => {
    const seen = new Set<string>([current]);
    const list: CopyEntry[] = [];
    for (const entry of [...entries].reverse()) {
      if (entry.text === null || seen.has(entry.text)) continue;
      seen.add(entry.text);
      list.push(entry);
    }
    return list;
  }, [entries, current]);

  const confirm = (message: string) => {
    setSaved(message);
    window.setTimeout(() => setSaved((m) => (m === message ? null : m)), 3000);
  };

  const save = () => {
    const text = draft.trim();
    if (!text || text === current) return;
    copyStorage.push(field.id, text);
    setDraft("");
    confirm("Saved — now showing on the site.");
  };

  const rows = Math.min(8, Math.max(2, Math.ceil(field.text.length / 70)));
  const inputId = `field-${field.id}`;

  return (
    <div className="p-[clamp(20px,3vw,32px)]">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <label htmlFor={inputId} className="text-[15px] font-semibold">
          {field.label}
        </label>
        {isChanged && (
          <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold tracking-[.06em] text-white uppercase">
            Changed {lastChange && `· ${formatDate(lastChange.at)}`}
          </span>
        )}
      </div>

      <div className="mb-3 border-l-[3px] border-ink/20 bg-paper px-4 py-3">
        <div className="mb-1 text-[11.5px] font-semibold tracking-[.12em] text-ink-faint uppercase">
          On the site now
        </div>
        <p className="m-0 text-[15px] whitespace-pre-line text-ink">
          {current}
        </p>
        {isChanged && (
          <p className="m-0 mt-2 text-[13.5px] text-muted-foreground">
            <span className="font-semibold">Original demo text:</span>{" "}
            {field.text}
          </p>
        )}
      </div>

      <textarea
        id={inputId}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={rows}
        placeholder="Type the text you would like here instead…"
        className="mb-3 block w-full resize-y rounded-[2px] border border-black/15 bg-white p-3 text-[15px] leading-[1.5] focus:border-ink focus:outline-none"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          className="cursor-pointer"
          disabled={!draft.trim() || draft.trim() === current}
          onClick={save}
        >
          Save to site
        </Button>
        {isChanged && (
          <Button
            size="sm"
            variant="ghost"
            className="cursor-pointer"
            onClick={() => {
              copyStorage.push(field.id, null);
              confirm("Back to the original demo text.");
            }}
          >
            <RotateCcw size={14} /> Revert to demo text
          </Button>
        )}
        {draft === "" && (
          <Button
            size="sm"
            variant="ghost"
            className="cursor-pointer"
            onClick={() => setDraft(current)}
          >
            Start from current text
          </Button>
        )}
        {saved && (
          <span
            role="status"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink"
          >
            <Check size={15} /> {saved}
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
                className={cn(
                  "flex flex-wrap items-start justify-between gap-3 border border-black/10 p-3",
                )}
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
                  className="cursor-pointer"
                  onClick={() => {
                    copyStorage.push(field.id, entry.text);
                    confirm("Earlier version restored.");
                  }}
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
