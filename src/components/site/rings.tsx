type Ring = { px: number; vw: number; color: string };

const WHITE = (a: number) => `rgba(255,255,255,${a})`;
const CRIMSON = (a: number) => `rgba(200,16,46,${a})`;

const presets = {
  /** Page heroes on black. */
  dark: {
    at: ["88%", "6%"],
    rings: [
      { px: 760, vw: 121, color: WHITE(0.1) },
      { px: 520, vw: 83, color: CRIMSON(0.28) },
      { px: 280, vw: 44, color: WHITE(0.07) },
    ],
  },
  /** Page heroes on crimson. */
  crimson: {
    at: ["88%", "6%"],
    rings: [
      { px: 760, vw: 121, color: WHITE(0.22) },
      { px: 520, vw: 83, color: WHITE(0.16) },
      { px: 280, vw: 44, color: WHITE(0.1) },
    ],
  },
  /** Home hero. */
  home: {
    at: ["88%", "6%"],
    rings: [
      { px: 900, vw: 143, color: WHITE(0.11) },
      { px: 620, vw: 98, color: CRIMSON(0.3) },
      { px: 340, vw: 54, color: WHITE(0.07) },
    ],
  },
  /** Home "Need help?" crimson CTA. */
  cta: {
    at: ["86%", "4%"],
    rings: [
      { px: 820, vw: 130, color: WHITE(0.22) },
      { px: 560, vw: 89, color: WHITE(0.16) },
      { px: 300, vw: 48, color: WHITE(0.1) },
    ],
  },
} satisfies Record<string, { at: [string, string]; rings: Ring[] }>;

/**
 * Signature motif: three concentric 1px rings sharing one centre.
 * The parent must be `relative overflow-hidden`.
 */
export function Rings({ preset }: { preset: keyof typeof presets }) {
  const { at, rings } = presets[preset];
  return rings.map((ring) => (
    <div
      key={ring.px}
      aria-hidden="true"
      className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border"
      style={{
        left: at[0],
        top: at[1],
        width: `min(${ring.px}px, ${ring.vw}vw)`,
        borderColor: ring.color,
      }}
    />
  ));
}
