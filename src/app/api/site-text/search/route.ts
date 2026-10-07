import { NextResponse, type NextRequest } from "next/server";

import { AiSearchError, aiSearch, aiSearchEnabled } from "@/lib/ai-search";
import { checkPasscode } from "@/lib/site-text-store";

const MAX_LENGTH = 300;

/** "Ask in your own words": `{ question }` → `{ matches: [{ id, reason }] }`. */
export async function POST(request: NextRequest) {
  if (!checkPasscode(request.headers.get("x-admin-passcode"))) {
    return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
  }
  if (!aiSearchEnabled()) {
    return NextResponse.json(
      { error: "The AI search isn’t switched on." },
      { status: 404 },
    );
  }
  const body = (await request.json().catch(() => null)) as {
    question?: unknown;
  } | null;
  const question =
    typeof body?.question === "string" ? body.question.trim() : "";
  if (!question || question.length > MAX_LENGTH) {
    return NextResponse.json(
      { error: `Ask in 1 to ${MAX_LENGTH} characters.` },
      { status: 400 },
    );
  }
  try {
    return NextResponse.json({ matches: await aiSearch(question) });
  } catch (error) {
    if (!(error instanceof AiSearchError)) console.error("[ai-search]", error);
    return NextResponse.json(
      {
        error:
          error instanceof AiSearchError
            ? error.message
            : "The AI search isn’t available right now.",
      },
      { status: 502 },
    );
  }
}
