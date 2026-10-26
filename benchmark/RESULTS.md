# Results

5 runs of the agent (Claude Code + Playwright MCP, defined in `harness/AGENT_PROMPT.md`), each a fresh session
seeing only `SPEC.md`, against the app with `VITE_BUGS=all` (19 scored seeded bugs; B16 is excluded, it needs
Stripe). Findings were matched to ground truth with an LLM judge (`harness/score.py`).

## Per-run results

| Run | Recall | Precision | Findings reported | Matched to a bug | Unmatched | Cost (USD) | Duration | Turns |
|-----|-------:|----------:|-------------------:|------------------:|----------:|-----------:|---------:|------:|
| 1   | 0.684  | 0.929     | 14                 | 13                 | 1         | $5.04      | 9.6 min  | 147   |
| 2   | 0.632  | 0.800     | 15                 | 12                 | 3         | $6.43      | 8.4 min  | 182   |
| 3   | 0.579  | 0.917     | 12                 | 11                 | 1         | $4.66      | 9.1 min  | 147   |
| 4   | 0.684  | 0.929     | 14                 | 13                 | 1         | $6.58      | 10.0 min | 187   |
| 5   | 0.579  | 0.846     | 13                 | 11                 | 2         | $4.43      | 8.1 min  | 151   |

**Aggregate (n=5):** recall 0.632 mean (range 0.579–0.684) · precision 0.884 mean (range 0.800–0.929) ·
cost $5.43 mean (range $4.43–$6.58, $27.14 total) · duration 9.0 min mean (range 8.1–10.0) · 162.8 turns mean.

## Per-bug consistency (how often each bug was found, across 5 runs)

| Bug | Title | Severity | Difficulty | Found | Runs |
|-----|-------|----------|------------|------:|------|
| B01 | Cart subtotal undercounts quantities of 3+ | high | medium | 5/5 | 1,2,3,4,5 |
| B02 | Bridal package price uses the wrong multiplier | medium | hard | 5/5 | 1,2,3,4,5 |
| B03 | Platform commission is 15% instead of 10% | high | sneaky | 5/5 | 1,2,3,4,5 |
| B04 | Price sort is descending | medium | easy | 5/5 | 1,2,3,4,5 |
| B05 | Style filter matches on the last word only | medium | medium | 5/5 | 1,2,3,4,5 |
| B07 | Booking accepts a date in the past | medium | medium | 5/5 | 1,2,3,4,5 |
| B12 | Rating on artist cards is rounded up | low | medium | 5/5 | 1,2,3,4,5 |
| B15 | Cart is lost on page refresh | medium | medium | 5/5 | 1,2,3,4,5 |
| B08 | Weak passwords accepted at signup | high | medium | 4/5 | 1,2,3,4 |
| B11 | Review button stays after submitting (duplicate reviews) | medium | sneaky | 4/5 | 1,2,3,4 |
| B10 | Review stars shown one fewer than the rating | medium | easy | 3/5 | 1,2,5 |
| B17 | Book Now button hidden on mobile widths | high | medium | 3/5 | 1,4,5 |
| B18 | Shop product cards overflow on mobile | medium | easy | 3/5 | 1,3,4 |
| B06 | 'Available today' filter is inverted | medium | easy | 1/5 | 5 |
| B09 | Signup does not block mismatched password confirmation | high | medium | 1/5 | 2 |
| B13 | Un-favoriting an artist does nothing | medium | medium | 1/5 | 4 |
| B14 | Adding a second favorite fails silently | medium | sneaky | 0/5 | — |
| B19 | Portfolio images have no alt attribute | medium | medium | 0/5 | — |
| B20 | Signup email label is not linked to its input | low | sneaky | 0/5 | — |

Easy/medium-difficulty bugs with a clear, isolated symptom (B01, B04, B05, B07, B12, B15) were found in every
run. The three "sneaky" bugs are the weakest spot: B03 (differently-labeled currency hides the wrong %) was
still always caught, but B11, B14, and B20 were missed most or all of the time. B14 (silent failure on a second
favorite — nothing renders, only a console error) and B19/B20 (accessibility-only defects with no visible
symptom) were never found in any of the 5 runs.

## Unmatched findings (unseeded, real defects the judge couldn't tie to a seeded bug)

| Run(s) | Finding | Notes |
|--------|---------|-------|
| 1, 2, 3, 4, 5 | Booking form inputs (Package / Preferred Date / Occasion) have no associated label | Found in **every** run; matches `docs/KNOWN_ISSUES.md` U8 (currently marked "found by run 1; verify" — confirmed across all 5 runs now) |
| 2 | Sort dropdown on artists listing has no associated label | Same defect class as U8, different control |
| 2 | Favorite (heart) state does not visually persist after a page refresh | Possible R9 violation distinct from B13/B14 |
| 5 | Homepage stats counters show "0+" / "0" instead of real numbers | Not tied to any spec rule; likely an animation/data-loading bug |

## Baseline comparison (`baseline/SeleniumTests`, by inspection)

The scripted Selenium suite was not re-run for this benchmark; its test files were read to check whether any
assertion could have caught a seeded bug. Its assertions are smoke-test style — "a count is greater than 0",
"the URL still contains /shop after filtering", "the page didn't crash" — and none check a specific business-rule
value (a price multiplier, a commission percentage, a sort order, a star count, a password-strength rule). By
inspection, **0 of the 19 scored bugs** would be caught by the existing scripted suite, versus a mean 63% recall
(12/19 bugs on average) for the exploratory agent, at a mean cost of $5.43 and 9 minutes per run.
