/**
 * Seeded-bug switchboard for the Naqsh benchmark.
 *
 * Bugs are enabled with the VITE_BUGS environment variable:
 *   VITE_BUGS=all            -> every bug on
 *   VITE_BUGS=none (or empty) -> clean app, no seeded bugs
 *   VITE_BUGS=B01,B04,B17    -> only the listed bugs
 *
 * The full description of every bug (ground truth) lives in /benchmark/bugs.json.
 */
export const BUG_IDS = [
  "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10",
  "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18", "B19", "B20",
] as const;

export type BugId = (typeof BUG_IDS)[number];

const raw = String(import.meta.env.VITE_BUGS ?? "").trim().toLowerCase();

const active: Set<string> =
  raw === "all"
    ? new Set<string>(BUG_IDS)
    : new Set<string>(
        raw
          .split(",")
          .map((s) => s.trim().toUpperCase())
          .filter((s) => s && s !== "NONE"),
      );

export const isBug = (id: BugId): boolean => active.has(id);
