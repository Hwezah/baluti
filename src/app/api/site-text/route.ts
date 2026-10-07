import { NextResponse, type NextRequest } from "next/server";

import { copyDefaults, copySections, isCopyId } from "@/content/copy";
import { applyEdit, emptySiteText } from "@/lib/site-text";
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
    id?: unknown;
    text?: unknown;
  } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  const raw = body?.text;
  if (!isCopyId(id) || !(raw === null || typeof raw === "string")) {
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
      (current) => applyEdit(current, id, value),
      `Site text: ${value === null ? "revert" : "update"} ${labels.get(id) ?? id}`,
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
