import "server-only";

import Anthropic from "@anthropic-ai/sdk";

import { copySections, isCopyId } from "@/content/copy";
import { publishedText } from "@/lib/site-text";

// "Ask in your own words" in the admin panel: Claude reads a list of every
// text on the site and picks the ones related to the client's question.
// Only switched on when ANTHROPIC_API_KEY is set.

const MODEL = "claude-opus-5-5";
const MAX_RESULTS = 30;

export const aiSearchEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY);

export class AiSearchError extends Error {}

export type AiMatch = { id: string; reason: string };

const INSTRUCTIONS = `You help the owner of a law firm's website find text they want to change in its admin panel.

Below is every piece of text on the site, one per line, as:
id | page › section | label | current wording

The owner describes what they are looking for in their own words, possibly vaguely, with typos, or by what the text does rather than what it says (for example "where we say how long we've been around" or "the bit that tells people we answer quickly"). Return the ids of the texts they most likely mean, best match first, at most ${MAX_RESULTS}. Include texts that are closely related even if not exact. Give each a short reason (under 15 words) in plain, non-technical English. If nothing fits, return an empty list. Only use ids from the list.`;

/** The site's text, as Claude sees it. Fixed for each deployment, so cached. */
const index = copySections
  .flatMap((section) =>
    section.fields.map((field) => {
      const text = (publishedText.texts[field.id] ?? field.text)
        .replace(/\s+/g, " ")
        .slice(0, 200);
      return `${field.id} | ${section.group} › ${section.title} | ${field.label} | ${text}`;
    }),
  )
  .join("\n");

const schema = {
  type: "object",
  properties: {
    matches: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          reason: { type: "string" },
        },
        required: ["id", "reason"],
        additionalProperties: false,
      },
    },
  },
  required: ["matches"],
  additionalProperties: false,
};

let client: Anthropic | null = null;

export async function aiSearch(question: string): Promise<AiMatch[]> {
  client ??= new Anthropic();
  let response;
  try {
    response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 8000,
      // If the model declines, the API retries on a fallback model for us.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema },
      },
      system: [
        { type: "text", text: INSTRUCTIONS },
        { type: "text", text: index, cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: question }],
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new AiSearchError(
        "The AI search key isn’t valid. Check ANTHROPIC_API_KEY.",
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new AiSearchError("The AI search is busy. Try again in a minute.");
    }
    if (error instanceof Anthropic.APIError) {
      console.error("[ai-search]", error.status, error.message);
      throw new AiSearchError("The AI search isn’t available right now.");
    }
    throw error;
  }

  if (response.stop_reason === "refusal") {
    throw new AiSearchError(
      "The AI search couldn’t help with that. Try the normal search.",
    );
  }
  const text = response.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new AiSearchError("The AI search gave an unexpected answer.");
  }
  const matches = (parsed as { matches?: unknown })?.matches;
  if (!Array.isArray(matches)) return [];
  const seen = new Set<string>();
  return matches
    .filter(
      (m): m is AiMatch =>
        typeof m?.id === "string" &&
        typeof m?.reason === "string" &&
        isCopyId(m.id),
    )
    .filter((m) => !seen.has(m.id) && seen.add(m.id))
    .slice(0, MAX_RESULTS);
}
