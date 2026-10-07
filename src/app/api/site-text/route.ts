import { NextResponse, type NextRequest } from "next/server";

import { copyDefaults, copySections, isCopyId } from "@/content/copy";
import {
  ITEM_KEY,
  addedItemOf,
  getList,
  itemId,
  newItemKey,
} from "@/content/lists";
import {
  addItem,
  applyEdit,
  listState,
  emptySiteText,
  setItemHidden,
} from "@/lib/site-text";
import {
  StoreError,
  checkPasscode,
  readSiteText,
  updateSiteText,
} from "@/lib/site-text-store";

const MAX_LENGTH = 5000;

const labels = new Map(
  copySections.flatMap((s) =>
    s.fields.map((f) => [f.id, `${s.title} › ${f.label}`] as const),
  ),
);

function unauthorized() {
  return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
}

function failure(error: unknown) {
  const message =
    error instanceof StoreError
      ? error.message
      : "Something went wrong while saving.";
  if (!(error instanceof StoreError)) console.error("[site-text]", error);
  return NextResponse.json({ error: message }, { status: 502 });
}

/** The latest saved text (including edits not yet live). */
export async function GET(request: NextRequest) {
  if (!checkPasscode(request.headers.get("x-admin-passcode")))
    return unauthorized();
  try {
    return NextResponse.json(await readSiteText());
  } catch (error) {
    return failure(error);
  }
}

/** Save one text: `{ id, text }`, where `text: null` reverts to the demo text. */
export async function POST(request: NextRequest) {
  if (!checkPasscode(request.headers.get("x-admin-passcode")))
    return unauthorized();

  const body = (await request.json().catch(() => null)) as {
    op?: unknown;
    id?: unknown;
    text?: unknown;
    list?: unknown;
    key?: unknown;
    values?: unknown;
  } | null;
  if (body?.op === "hide" || body?.op === "show" || body?.op === "add") {
    return listChange(body);
  }

  const id = typeof body?.id === "string" ? body.id : "";
  const raw = body?.text;
  const added = isCopyId(id) ? null : addedItemOf(id);
  if (
    !(isCopyId(id) || added !== null) ||
    !(raw === null || typeof raw === "string") ||
    (added !== null && raw === null)
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const text = raw === null ? null : raw.trim();
  if (text !== null && (text.length === 0 || text.length > MAX_LENGTH)) {
    return NextResponse.json(
      { error: `Text must be between 1 and ${MAX_LENGTH} characters.` },
      { status: 400 },
    );
  }
  // Saving the demo text itself is the same as reverting.
  const value = text === copyDefaults[id] ? null : text;

  try {
    const file = await updateSiteText(
      (current) => {
        if (
          added &&
          !listState(current, added.def.id).added.includes(added.key)
        ) {
          throw new StoreError("This item no longer exists.");
        }
        return applyEdit(current, id, value);
      },
      `Site text: ${value === null ? "revert" : "update"} ${labels.get(id) ?? id}`,
    );
    return NextResponse.json(file);
  } catch (error) {
    return failure(error);
  }
}

const invalid = () =>
  NextResponse.json({ error: "Invalid request." }, { status: 400 });

/**
 * Hide or show an item: `{ op: "hide" | "show", list, key }`.
 * Add an item: `{ op: "add", list, values: { [part]: text } }`.
 */
async function listChange(body: {
  op?: unknown;
  list?: unknown;
  key?: unknown;
  values?: unknown;
}) {
  const def = typeof body.list === "string" ? getList(body.list) : undefined;
  if (!def) return invalid();

  if (body.op === "add") {
    if (!def.canAdd || !body.values || typeof body.values !== "object") {
      return invalid();
    }
    const values = body.values as Record<string, unknown>;
    const parts: Record<string, string> = {};
    for (const { part, label } of def.parts) {
      const value = values[part];
      const text = typeof value === "string" ? value.trim() : "";
      if (text.length === 0 || text.length > MAX_LENGTH) {
        return NextResponse.json(
          {
            error: `${label}: please write between 1 and ${MAX_LENGTH} characters.`,
          },
          { status: 400 },
        );
      }
      parts[part] = text;
    }
    try {
      const file = await updateSiteText((current) => {
        // Practice areas get a page address made from their name.
        const key = newItemKey(def, parts, current);
        const texts: Record<string, string> = {};
        for (const [part, text] of Object.entries(parts)) {
          texts[itemId(def, key, part)] = text;
        }
        return addItem(current, def.id, key, texts);
      }, `Site text: add a ${def.noun}`);
      return NextResponse.json(file);
    } catch (error) {
      return failure(error);
    }
  }

  const key = typeof body.key === "string" ? body.key : "";
  const hide = body.op === "hide";
  if (!def.builtIn.includes(key) && !ITEM_KEY.test(key)) {
    return invalid();
  }
  try {
    const file = await updateSiteText(
      (current) => setItemHidden(current, def.id, key, hide),
      `Site text: ${hide ? "hide" : "show"} ${def.noun} ${key}`,
    );
    return NextResponse.json(file);
  } catch (error) {
    return failure(error);
  }
}

/**
 * Reset the whole site to the demo text, deleting every edit and its history
 * (the repository's commit history still has them). The passcode must be
 * typed again in the body: `{ passcode }`.
 */
export async function DELETE(request: NextRequest) {
  if (!checkPasscode(request.headers.get("x-admin-passcode")))
    return unauthorized();
  const body = (await request.json().catch(() => null)) as {
    passcode?: unknown;
  } | null;
  const confirm = typeof body?.passcode === "string" ? body.passcode : null;
  if (!checkPasscode(confirm)) return unauthorized();

  try {
    const file = await updateSiteText(
      () => emptySiteText(),
      "Site text: reset everything to the demo text",
    );
    return NextResponse.json(file);
  } catch (error) {
    return failure(error);
  }
}
