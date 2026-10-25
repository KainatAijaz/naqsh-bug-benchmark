#!/usr/bin/env python3
"""Score one run: python3 score.py runs/run-1
Matches agent findings to ground truth with an LLM judge (claude -p), then reports
recall, precision, and per-bug hits. Output: runs/run-N/score.json
"""
import json, subprocess, sys, pathlib
run = pathlib.Path(sys.argv[1])
truth = json.load(open(pathlib.Path(__file__).parent.parent / "bugs.json"))["bugs"]
findings = json.load(open(run / "findings.json"))
bugs = [{k: b[k] for k in ("id", "title", "expected", "actual", "page")} for b in truth]
prompt = f"""You grade a QA agent's findings against a ground-truth bug list.
For each finding (by index) say which bug id it describes, or null if it matches none
(a false positive, or a real but unlisted defect). A finding matches only if it describes the
same defect, not merely the same page. Reply with ONLY a JSON array of
{{"finding": <index>, "bug": "Bxx" or null}}.

BUGS: {json.dumps(bugs)}
FINDINGS: {json.dumps(list(enumerate(findings)))}"""
out = subprocess.run(["claude", "-p", prompt], capture_output=True, text=True, check=True).stdout
m = json.loads(out[out.index("["): out.rindex("]") + 1])
hit = {x["bug"] for x in m if x["bug"]}
unmatched = [x["finding"] for x in m if not x["bug"]]
res = {
    "found": sorted(hit),
    "missed": sorted(b["id"] for b in truth if b["id"] not in hit),
    "recall": round(len(hit) / len(truth), 3),
    "precision": round(len({x["finding"] for x in m if x["bug"]}) / max(len(findings), 1), 3),
    "unmatched_findings_to_review_by_hand": unmatched,
}
json.dump(res, open(run / "score.json", "w"), indent=2)
print(json.dumps(res, indent=2))
