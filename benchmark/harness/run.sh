#!/usr/bin/env bash
# Usage: ./run.sh <run-number>   (app must be running at localhost:8080 with VITE_BUGS=all)
# Runs the agent in an isolated folder that contains ONLY SPEC.md, so it cannot see bugs.json or the source.
set -euo pipefail
N=${1:?run number}
HERE="$(cd "$(dirname "$0")" && pwd)"
RUN="$HERE/runs/run-$N"
rm -rf "$RUN"; mkdir -p "$RUN"
cp "$HERE/../SPEC.md" "$RUN/SPEC.md"
cd "$RUN"
claude -p "$(cat "$HERE/AGENT_PROMPT.md")" \
  --mcp-config "$HERE/mcp.json" --strict-mcp-config \
  --allowedTools "mcp__playwright__*" "Read" "Write" \
  --output-format json > result.json
python3 - <<PY
import json
r=json.load(open("result.json"))
print("cost_usd:", r.get("total_cost_usd"), "turns:", r.get("num_turns"), "duration_ms:", r.get("duration_ms"))
PY
