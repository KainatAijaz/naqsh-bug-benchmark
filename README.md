# Naqsh bug benchmark

A benchmark for **AI exploratory testing**. It is a henna-artist marketplace (React, Supabase, Stripe test mode) with **20 deliberately seeded bugs** that can be switched on and off, so an AI agent's findings can be scored against known ground truth.

> Status: work in progress. Results will be added once the agent runs are complete.

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

## Scoring (planned)
Recall, precision, duplicates and report quality, consistency across 5 runs, cost and time per run, and a head-to-head with a scripted suite (`baseline/`).

## Fair-test rules
The agent runs in a separate folder that contains only `SPEC.md`. It must not see the source code, `bugs.json` or `.env.local`.
