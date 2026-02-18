# Plan: Health Check Endpoint
**Date:** 2026-02-18
**Feature:** F-001
**Goal:** Implement GET /health returning `{"status":"ok","timestamp":"<ISO8601>"}` on a greenfield
Node.js API using Express.js, with a Jest + supertest test suite. Establishes the foundational
project scaffold for all future features.
**Spec Tier:** COMPLEX (multi-component, greenfield scaffold, high coupling — establishes
framework, test stack, and architectural patterns for the entire project)
**Branch:** `feature/health-check` (from `scenario-d-run`)

---

## Task DAG

```
T-1: Initialize Node.js project scaffold   [no blockers]
  |
  v
T-2: Implement GET /health endpoint        [blocked by T-1]
  |
  v
T-3: Write Jest + supertest tests          [blocked by T-2]
  |
  v
T-4: Verify and validate complete feature  [blocked by T-3]
```

Linear dependency chain — no parallel execution opportunities within this feature. Each task
produces outputs that the next task requires.

---

## Tasks Created

| Task ID | Subject                                         | Agent       | Dispatch Pattern    | Blocked By |
|---------|-------------------------------------------------|-------------|---------------------|------------|
| T-1     | Initialize Node.js project scaffold             | implementer | one-shot            | —          |
| T-2     | Implement GET /health endpoint                  | implementer | worker-reviewer     | T-1        |
| T-3     | Write Jest + supertest tests for GET /health    | implementer | worker-reviewer     | T-2        |
| T-4     | Verify and validate complete health check feature | tester    | one-shot            | T-3        |

---

## Parallel Execution Groups

- **Group 1** (can run immediately): T-1
- **Group 2** (after T-1 completes): T-2
- **Group 3** (after T-2 completes): T-3
- **Group 4** (after T-3 completes): T-4

No intra-group parallelism is possible — the chain is strictly linear because each task
consumes outputs from the prior task.

---

## Spec Artifacts

| Artifact | Path |
|----------|------|
| Spec overview | `planning-artifacts/spec-F-001-health-check-overview.md` |
| Feature tracker | `planning-artifacts/feature-tracker.json` |
| Architecture ADR | `planning-artifacts/2026-02-18-adr-health-check-architecture.md` |

All task spec packets are embedded in each task's description field in the TaskList
(between `# --- SPEC ---` / `# --- END SPEC ---` delimiters per spec-protocol Section 8).

---

## Assertion Summary

| Task | Assertions | Key Observables |
|------|-----------|-----------------|
| T-1  | A1-A7     | package.json fields, directory structure, npm install exit code |
| T-2  | A1-A7     | HTTP 200, JSON body shape, ISO 8601 timestamp, app/server split, PORT env var |
| T-3  | A1-A6     | Test cases for status/timestamp/content-type, supertest pattern, npm test exit code |
| T-4  | A1-A6     | npm test exit code, server startup, smoke test HTTP 200, validation report file |

Total assertions: 26 across 4 tasks. All pass the 7x7 constraint (max 7 per task).

---

## Dispatch Instructions

**T-1 dispatch (one-shot):**
```
Implement task T-1: Initialize Node.js project scaffold

Spec packet is embedded in the task description. Read it via TaskGet.
Follow all assertions. Report evidence per assertion ID.
Constraints in the spec are non-negotiable.
Freedom not listed in constraints is yours to decide.
```

**T-2 dispatch (worker-reviewer):**
```
Implement task T-2: Implement GET /health endpoint

Spec packet is embedded in the task description. Read it via TaskGet.
Follow all assertions. Report evidence per assertion ID.
Constraints in the spec are non-negotiable.
Freedom not listed in constraints is yours to decide.
```
Then dispatch reviewer with T-2 output. Max 3 worker-reviewer cycles (circuit breaker).

**T-3 dispatch (worker-reviewer):**
```
Implement task T-3: Write Jest + supertest tests for GET /health

Spec packet is embedded in the task description. Read it via TaskGet.
Follow all assertions. Report evidence per assertion ID.
Constraints in the spec are non-negotiable.
Freedom not listed in constraints is yours to decide.
```
Then dispatch reviewer with T-3 output. Max 3 worker-reviewer cycles (circuit breaker).

**T-4 dispatch (one-shot):**
```
Implement task T-4: Verify and validate complete health check feature

Spec packet is embedded in the task description. Read it via TaskGet.
Follow all assertions. Report evidence per assertion ID.
Constraints in the spec are non-negotiable.
Freedom not listed in constraints is yours to decide.
```

---

## Risk Notes

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Node.js not installed on execution environment | Low | T-1 spec A7 requires `npm install` to succeed — blocks immediately if missing |
| Port 3000 conflict during smoke test (T-4) | Medium | T-2 spec A6 mandates PORT env var; T-4 can set PORT=3001 for smoke test |
| Timestamp flakiness in tests | Low | T-3 spec A4 mandates ISO 8601 round-trip check, not exact value — eliminates race conditions |
| Scope creep (adding DB/readiness checks) | Low | ADR explicitly defers readiness probes to a future feature; T-2 spec file_scope limits changes to src/ only |
| Worker-reviewer cycle burn (T-2 or T-3) | Low | Circuit breaker at 3 cycles; if triggered, escalate to user with issue summary |

---

## Governance Compliance

- 7x7 rule: 4 tasks (limit: 7) — PASS
- Max assertions per task: 7 (T-1 and T-2) — PASS
- Spec delimiters: all tasks use `# --- SPEC ---` / `# --- END SPEC ---` — PASS
- Controlled vocabulary: all assertions use MUST / MUST NOT — PASS
- Double-entry: all assertions have positive + negative — PASS
- Specific observables: all assertions name file paths, HTTP status codes, field names, or exit codes — PASS
- No banned vague terms ("works correctly", "proper", etc.) — PASS
- constitution.md: not present — Phase -1 gates skipped (no degradation)
- failure-patterns.md: README only, no active patterns — no domain risks flagged
