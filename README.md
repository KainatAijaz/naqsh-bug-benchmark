# Naqsh bug benchmark

A benchmark for **AI exploratory testing**. It is a henna-artist marketplace (React, Supabase, Stripe test mode) with **20 deliberately seeded bugs** (19 scored) that can be switched on and off, so an AI agent's findings can be scored against known ground truth.

## Results (5 runs, Claude Code + Playwright MCP)

| | Mean | Range |
|---|---:|---:|
| Recall (19 scored bugs) | **63%** | 58% to 68% |
| Precision | **88%** | 80% to 93% |
| Cost per run (API-equivalent) | $5.43 | $4.43 to $6.58 |
| Time per run | 9.0 min | 8.1 to 10.0 |

- **Found in all 5 runs (8 bugs):** cart subtotal, bridal price multiplier, wrong commission %, price sort, style filter, past-date booking, rounded ratings, cart lost on refresh.
- **Found in some runs:** weak password (4/5), duplicate review (4/5), review stars (3/5), Book Now hidden on mobile (3/5), shop overflow on mobile (3/5).
- **Rarely or never found:** inverted "available today" filter, mismatched password confirmation, un-favorite (1/5 each); silent favorite failure, missing image alt text, unlinked signup label (0/5).
- **Unseeded findings:** the agent also reported real defects I had not seeded, for example unlabeled booking-form fields (in every run). See `docs/KNOWN_ISSUES.md`.
- **Scripted baseline:** by reading the existing Selenium suite (not running it), none of its assertions check a business-rule value, so it would catch 0 of the 19 bugs.

The pattern: the agent is reliable on visible, rule-based defects with a clear symptom, and weak on silent failures and accessibility-only defects. Details per run and per bug: [`benchmark/RESULTS.md`](benchmark/RESULTS.md).

## Why this exists
Most AI testing demos show a tool finding a few bugs. This one measures it: how many of the 19 scored seeded bugs (a 20th needs Stripe and is excluded) it finds (recall), how many of its reports are real (precision), how consistent it is across runs, and what it costs.

## How it works
- `VITE_BUGS` switches the seeded bugs: `none`, `all`, or a list such as `B01,B04,B17`.
- `benchmark/bugs.json` is the ground truth (id, category, severity, difficulty, steps, expected vs actual).
- `benchmark/SPEC.md` is the only document the agent receives, along with the app URL.
- `docs/KNOWN_ISSUES.md` lists real defects that were *not* seeded; if the agent finds one, it is scored separately as an unseeded finding.

## Run it
```bash
cp .env.example .env.local   # fill in YOUR OWN new Supabase project
npm install
npm run dev                  # http://localhost:8080
```
Database: run `supabase/schema.sql`, then `supabase/seed.sql` in the Supabase SQL editor. Use a separate Supabase project, never a live one.

## Scoring
`benchmark/harness/run.sh N` runs the agent in an isolated folder; `benchmark/harness/score.py` matches its findings to `bugs.json` with an LLM judge and prints recall, precision and the reason for each match (review these by hand). Scripted-suite comparison: `baseline/`.

## Fair-test rules
The agent runs in a separate folder that contains only `SPEC.md`. It must not see the source code, `bugs.json` or `.env.local`.
