# Health Check API

A minimal Node.js health check API built using the [Claude Code Context Engineering Template](https://github.com/vospr/context-engineering-template) — a multi-agent, spec-driven development workflow.

## Overview

This project provides a single `GET /health` endpoint that returns the service status and a timestamp. It was implemented using the SDD (Spec-Driven Development) protocol with COMPLEX-tier routing: architect pre-check, planner spec suite, implementer execution, reviewer validation, and tester verification.

## Quick Start

### Prerequisites

- Node.js >= 18
- npm

### Install & Run

```bash
npm install
npm start
```

The server starts on port 3000 by default. Override with the `PORT` environment variable:

```bash
PORT=8080 npm start
```

### Run Tests

```bash
npm test
```

## API

### GET /health

Returns the service health status.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-18T12:35:53.131Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always `"ok"` when the service is running |
| `timestamp` | string | ISO 8601 timestamp of the response |

**Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | Service is healthy |

## Project Structure

```
├── src/
│   ├── app.js              # Express app configuration (exported for testing)
│   ├── server.js            # Server startup (listens on PORT, defaults to 3000)
│   └── routes/
│       └── health.js        # GET /health route handler
├── tests/
│   └── health.test.js       # Jest + supertest tests (6 test cases)
├── package.json
├── .gitignore
│
├── .claude/                  # Multi-agent orchestration config
│   ├── agents/               # Specialized agent definitions
│   │   ├── architect.md
│   │   ├── planner.md
│   │   ├── implementer.md
│   │   ├── reviewer.md
│   │   ├── tester.md
│   │   └── researcher.md
│   └── skills/               # Reusable knowledge loaded on demand
│       ├── spec-protocol.md  # SDD core protocol
│       ├── coding-standards.md
│       ├── review-checklist.md
│       ├── testing-strategy.md
│       └── architecture-principles.md
│
├── planning-artifacts/       # Specs, plans, decisions, feature tracker
│   ├── feature-tracker.json
│   ├── decisions.md
│   ├── spec-F-001-health-check-overview.md
│   ├── 2026-02-18-adr-health-check-architecture.md
│   └── 2026-02-18-plan-health-check.md
│
├── implementation-artifacts/ # Implementation notes, reviews, test reports
│   ├── 2026-02-18-impl-T-001.md
│   ├── 2026-02-18-impl-T-002.md
│   ├── 2026-02-18-impl-T-003.md
│   ├── 2026-02-18-review-T-002.md
│   ├── 2026-02-18-review-T-003.md
│   └── 2026-02-18-test-T-004.md
│
└── CLAUDE.md                 # Main Agent dispatch loop kernel
```

## Architecture Decisions

- **HTTP Framework:** Express.js — minimal boilerplate, stable ecosystem
- **Test Stack:** Jest + supertest — zero-config testing with HTTP assertion support
- **App/Server Split:** `src/app.js` exports the Express app without calling `listen()`, enabling supertest to import it directly without binding a port. `src/server.js` handles startup.
- **Liveness Only:** This is a liveness probe. Readiness probes (database/dependency checks) are out of scope and would require a separate feature and ADR.

See `planning-artifacts/2026-02-18-adr-health-check-architecture.md` for the full ADR.

## SDD Workflow Summary

This feature was delivered using the COMPLEX-tier SDD workflow:

| Step | Agent | Output |
|------|-------|--------|
| 1. Pre-check | Architect | ADR + decisions log |
| 2. Spec suite | Planner | 4 task specs (26 assertions), overview, feature tracker |
| 3. Scaffold | Implementer | package.json, directory structure, npm install |
| 4. Endpoint | Implementer + Reviewer | src/app.js, src/routes/health.js, src/server.js |
| 5. Tests | Implementer + Reviewer | tests/health.test.js (6 test cases) |
| 6. Validation | Tester | End-to-end smoke test + full assertion verification |

All 26 assertions passed. Feature F-001 is VERIFIED.

## Test Coverage

| Test | What it verifies |
|------|-----------------|
| A1 | HTTP 200 status code |
| A2 | Content-Type application/json |
| A3 | `body.status === "ok"` |
| A4 | Valid ISO 8601 timestamp (round-trip: `new Date(ts).toISOString() === ts`) |
| A5 | Response body contains exactly `status` and `timestamp` fields |
| A6 | Successive requests produce non-decreasing timestamps |

## License

MIT
