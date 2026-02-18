# Feature F-001: Health Check Endpoint

## Goal
Implement a minimal HTTP health check endpoint (GET /health) for a greenfield Node.js API using
Express.js. The endpoint returns `{"status":"ok","timestamp":"<ISO8601>"}` with HTTP 200 so that
infrastructure orchestrators (load balancers, Kubernetes liveness probes) can verify the service
is alive. This feature also establishes the foundational project scaffold — package.json, directory
structure, app/server split pattern, and Jest + supertest test stack — that all future features
will build upon.

## Task List

| Task ID | Subject                                        | Spec Tier | Assertions |
|---------|------------------------------------------------|-----------|------------|
| T-1     | Initialize Node.js project scaffold            | COMPLEX   | A1-A7      |
| T-2     | Implement GET /health endpoint                 | COMPLEX   | A1-A7      |
| T-3     | Write Jest + supertest tests for GET /health   | COMPLEX   | A1-A6      |
| T-4     | Verify and validate complete health check feature | COMPLEX | A1-A6      |

## Acceptance Criteria Summary

1. A `package.json` with Express as a runtime dependency and Jest + supertest as devDependencies
   exists; `npm install` exits with code 0.
2. Directory structure `src/`, `src/routes/`, and `tests/` exists; `.gitignore` excludes
   `node_modules/`.
3. `GET /health` returns HTTP 200 with `Content-Type: application/json` and a body containing
   `"status": "ok"` and a valid ISO 8601 `"timestamp"` string.
4. The Express app is exported from `src/app.js` without calling `app.listen()`; server startup
   is isolated in `src/server.js` using the `PORT` environment variable with a fallback to 3000.
5. Health route logic is encapsulated in `src/routes/health.js` and mounted in `src/app.js`.
6. `npm test` exits with code 0; test suite covers HTTP 200 status, JSON content-type,
   `status === "ok"`, and ISO 8601 timestamp format validation (no exact-value comparison).
7. End-to-end smoke test confirms the server starts, responds correctly on port 3000, and the
   validation report is written to `implementation-artifacts/`.

## Dependency Graph

```
T-1 (project scaffold)
  └── T-2 (implement endpoint)  [blocked by T-1]
        └── T-3 (write tests)   [blocked by T-2]
              └── T-4 (validate) [blocked by T-3]
```

## Notes

- **Architecture decision:** Express.js selected as HTTP framework (see
  `planning-artifacts/2026-02-18-adr-health-check-architecture.md`). This is binding for all
  future route modules.
- **App/server split is mandatory** for all future route modules; supertest imports `src/app.js`
  directly, never binds to a port.
- **Timestamp validation strategy:** Tests MUST validate ISO 8601 format via
  `new Date(ts).toISOString() === ts` — never compare exact timestamp strings.
- **Worker-reviewer pattern** applies to T-2 and T-3 per architect guidance. T-1 and T-4 are
  one-shot dispatch.
- **Branch:** All implementation on `feature/health-check` branched from `scenario-d-run`.
- **Liveness vs readiness:** This is a liveness probe only. Future readiness probes (DB checks,
  dependency checks) require a separate feature and ADR.
- **7x7 compliance:** 4 tasks (≤7), max 7 assertions per task. Feature is within governance
  limits.
