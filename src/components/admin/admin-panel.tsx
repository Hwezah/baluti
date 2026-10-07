"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  CircleCheck,
  ClipboardCopy,
  Clock,
  Download,
  History,
  Info,
  LockKeyhole,
  RotateCcw,
  Search,
  TriangleAlert,
} from "lucide-react";

import {
  copyDefaults,
  copyGroups,
  copySections,
  type CopyField,
  type CopySection,
} from "@/content/copy";
import { publishedValue } from "@/context/copy-context";
import { pendingEdits } from "@/lib/copy-storage";
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

/** Text the latest saved version gives an id. */
const savedValue = (file: SiteTextFile, id: string) =>
  file.texts[id] ?? copyDefaults[id];

function buildSummary(file: SiteTextFile) {
  const lines = [
    "Baluti & Co. Advocates website — text changes",
    `Exported ${formatDate(new Date().toISOString())}`,
    "",
  ];
  for (const section of copySections) {
    for (const field of section.fields) {
      const now = file.texts[field.id];
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

  const changed = useMemo(
    () =>
      new Set(
        copySections.flatMap((s) =>
          s.fields.filter((f) => f.id in file.texts).map((f) => f.id),
        ),
      ),
    [file],
  );

  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return copySections
      .map((section) => {
        const sectionHit =
          q && `${section.group} ${section.title}`.toLowerCase().includes(q);
        const fields = section.fields.filter((field) => {
          if (onlyChanged && !changed.has(field.id)) return false;
          if (!q || sectionHit) return true;
          const now = savedValue(file, field.id);
          return `${field.label} ${field.text} ${now}`
            .toLowerCase()
            .includes(q);
        });
        return { ...section, fields };
      })
      .filter((s) => s.fields.length > 0);
  }, [query, onlyChanged, changed, file]);

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
    setFile({ texts: body.texts, history: body.history });
    // Show it in this browser now; everyone else sees it after the redeploy.
    pendingEdits.set(id, body.texts[id] ?? null);
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
    <div className="gutter bg-sand pt-[clamp(40px,5vw,64px)] pb-[clamp(64px,8vw,110px)]">
      <div className="site-container">
        <header className="mb-8 max-w-[70ch]">
          <div className="eyebrow mb-3">Admin panel</div>
          <h1 className="m-0 mb-4 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-bold">
            Edit the text on your website
          </h1>
          <p className="m-0 text-base text-ink-soft">
            Every piece of text on the site is listed below, grouped by page and
            section. Under each one, type the text you would like instead and
            press <strong>Save to site</strong>. You can always go back to the
            original demo text or to any earlier version.
          </p>
        </header>

        <HowItWorks mode={mode} missing={missing} />

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

        {/* Toolbar */}
        <div className="z-20 mb-8 flex flex-wrap items-center gap-3 border border-black/10 bg-white p-3 shadow-[0_12px_30px_-24px_rgba(0,0,0,.5)] lg:sticky lg:top-[calc(var(--header-h)+8px)]">
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
              <ClipboardCopy size={15} /> Copy list of changes
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={download}
            >
              <Download size={15} /> Download a copy
            </Button>
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
                file={file}
                changed={changed}
                canSave={canSave}
                mode={mode}
                onSave={save}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorks({ mode, missing }: { mode: Mode; missing: string[] }) {
  if (mode === "off") {
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
      className="mb-8 flex gap-4 border border-black/12 bg-white p-5 text-[15px] text-ink"
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
            Every change is recorded. Use <strong>Revert to demo text</strong>{" "}
            or <strong>Earlier versions</strong> on any item to undo it.
          </li>
        </ul>
      </div>
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
      className="mb-8 flex flex-wrap items-end gap-3 border border-black/12 bg-white p-5"
    >
      <LockKeyhole
        size={22}
        className="mb-2.5 shrink-0 text-ink-soft"
        aria-hidden="true"
      />
      <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-[15px] font-semibold">
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
        className="cursor-pointer"
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
  file,
  changed,
  canSave,
  mode,
  onSave,
}: {
  section: CopySection;
  file: SiteTextFile;
  changed: Set<string>;
  canSave: boolean;
  mode: Mode;
  onSave: (id: string, text: string | null) => Promise<string | null>;
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
            current={savedValue(file, field.id)}
            entries={file.history[field.id] ?? []}
            isChanged={changed.has(field.id)}
            canSave={canSave}
            mode={mode}
            onSave={onSave}
          />
        ))}
      </div>
    </section>
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
}: {
  field: CopyField;
  current: string;
  entries: TextEntry[];
  isChanged: boolean;
  canSave: boolean;
  mode: Mode;
  onSave: (id: string, text: string | null) => Promise<string | null>;
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const lastChange = entries[entries.length - 1];
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
        disabled={!canSave}
        placeholder={
          canSave
            ? "Type the text you would like here instead…"
            : "Unlock the admin panel to make changes."
        }
        className="mb-3 block w-full resize-y rounded-[2px] border border-black/15 bg-white p-3 text-[15px] leading-[1.5] focus:border-ink focus:outline-none disabled:bg-paper"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          className="cursor-pointer"
          disabled={
            !canSave || busy || !draft.trim() || draft.trim() === current
          }
          onClick={() => run(draft.trim(), saved)}
        >
          {busy ? "Saving…" : "Save to site"}
        </Button>
        {isChanged && (
          <Button
            size="sm"
            variant="ghost"
            className="cursor-pointer"
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
            className="cursor-pointer"
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
                ? "inline-flex items-center gap-1.5 text-sm font-medium text-ink"
                : "inline-flex items-center gap-1.5 text-sm font-medium text-[#9a1b1b]"
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
                className="flex flex-wrap items-start justify-between gap-3 border border-black/10 p-3"
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
