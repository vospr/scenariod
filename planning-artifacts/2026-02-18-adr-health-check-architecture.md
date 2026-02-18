# ADR: Health Check Endpoint - Technology and Architecture Decisions
**Date:** 2026-02-18
**Status:** ACCEPTED

## Context
This is a greenfield Node.js API project. The first feature is a minimal health check endpoint (GET /health) returning `{"status":"ok","timestamp":"..."}`. We need to select the HTTP framework, project structure, test framework, and decomposition strategy. The user classified this as COMPLEX tier, which is appropriate given that it establishes the foundational project scaffold that all future work will build upon.

## Options Considered

### Option A: Express.js (HTTP Framework)
- Pros: Industry standard, massive ecosystem, minimal boilerplate, excellent documentation, trivial learning curve, stable and battle-tested (10+ years)
- Cons: Minimalist by design (no built-in validation, no structure opinions), callback-oriented API (mitigated by modern async/await patterns), slower than alternatives like Fastify
- Fit: Excellent for a greenfield API where simplicity and familiarity are priorities. Performance difference is irrelevant for a health check feature.

### Option B: Fastify
- Pros: Faster than Express, built-in schema validation, structured plugin system
- Cons: Smaller ecosystem, steeper learning curve, less community momentum for simple projects
- Fit: Over-engineered for the current scope. Could be reconsidered if performance becomes a constraint.

### Option C: Native Node.js http module
- Pros: Zero dependencies, maximum control
- Cons: No routing, no middleware, significant boilerplate for anything beyond trivial use, poor developer experience for future feature growth
- Fit: Too low-level. Would slow down all future feature development.

### Option D: Jest (Test Framework)
- Pros: Zero-config for Node.js, built-in assertions, mocking, and coverage, widely adopted, snapshot testing available
- Cons: Slower than Vitest for large suites, heavier dependency footprint
- Fit: Strong fit. Industry standard for Node.js testing. Overhead is irrelevant at this project scale.

### Option E: Vitest
- Pros: Faster execution, ESM-native, compatible with Jest API
- Cons: Newer, smaller community, requires Vite config for non-Vite projects
- Fit: Good alternative but adds unnecessary config complexity for a project not using Vite.

### Option F: supertest (HTTP Testing)
- Pros: Purpose-built for Express testing, clean API for HTTP assertions, no need to start a real server
- Cons: Additional dependency
- Fit: Perfect complement to Jest for testing Express routes without network overhead.

## Decision

**HTTP Framework:** Express.js (Option A). It is the simplest, most widely understood choice. The project is greenfield and the first priority is establishing a clean, extensible scaffold. Express provides exactly the right level of abstraction.

**Test Framework:** Jest + supertest (Options D + F). Jest for unit and integration testing, supertest for HTTP endpoint testing without starting a live server. This combination is the Node.js ecosystem standard.

**Project Structure:** Layered separation with app/server split:
```
src/
  app.js          # Express app configuration (exportable for testing)
  server.js       # Server startup (listens on port)
  routes/
    health.js     # Health route handler
tests/
  health.test.js  # Endpoint tests
package.json
```

**Why the app/server split:** Separating the Express app from the server listener allows supertest to import the app directly without binding to a port. This is a well-established pattern that prevents port conflicts in tests and enables parallel test execution.

**Node.js version target:** 18+ (LTS). No ESM-only features required; CommonJS is fine for simplicity.

## Decomposition Validation

The proposed 4-task decomposition is approved with one refinement:

| Task | Description | Dependencies | Notes |
|------|-------------|--------------|-------|
| T-001 | Initialize Node.js project | None | package.json, Express + Jest + supertest deps, project directory structure, .gitignore updates |
| T-002 | Implement GET /health endpoint | T-001 | app.js, server.js, routes/health.js with `{"status":"ok","timestamp":"<ISO8601>"}` response |
| T-003 | Write tests for health endpoint | T-002 | Jest + supertest tests: status code 200, content-type JSON, response body shape, timestamp validity |
| T-004 | Verify and validate complete feature | T-003 | Run full test suite, verify npm start works, confirm endpoint responds correctly |

This is within the 7-task limit and has clean linear dependencies. No refinement needed -- the decomposition is sound.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Node.js not installed on dev machine | Low | High (blocks everything) | T-001 should verify `node --version` and `npm --version` before proceeding |
| Port conflict on default port (3000) | Medium | Low | Use PORT env variable with fallback; document in T-002 |
| Test flakiness from timestamp comparison | Medium | Low | Tests should validate timestamp format (ISO 8601) rather than exact value |
| Scope creep (adding DB checks, dependency checks to health endpoint) | Low | Medium | Defer to future ADR. This health check is a "liveness" probe only, not a "readiness" probe |

## Guidance for the Planner

1. **T-001 acceptance criteria:** `npm install` succeeds, directory structure matches the layout above, `.gitignore` includes `node_modules/`.
2. **T-002 acceptance criteria:** `node src/server.js` starts without error; `curl localhost:3000/health` returns 200 with correct JSON shape.
3. **T-003 acceptance criteria:** `npm test` runs and passes; tests cover: HTTP 200 status, JSON content-type, `status` field equals `"ok"`, `timestamp` field is valid ISO 8601.
4. **T-004 acceptance criteria:** All tests pass, manual smoke test documented, no lint errors if linter is configured.
5. **Worker-reviewer pattern:** Use for T-002 and T-003. T-001 and T-004 can be one-shot dispatch.
6. **Branch:** All work on `feature/health-check` branched from `scenario-d-run`.

## Consequences
- Express.js is now the HTTP framework for this project. All future endpoints build on this foundation.
- Jest + supertest is the test stack. Future test tasks should follow the patterns established in T-003.
- The app/server split pattern is mandatory for all future route modules to maintain testability.
- If the project later needs high-throughput performance, this decision should be revisited in favor of Fastify (would require a new ADR superseding this one).

## ARCHITECTURE_IMPACT
YES -- this establishes the foundational project structure, HTTP framework, and test stack for all future development.
