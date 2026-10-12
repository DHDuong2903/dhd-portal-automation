# `lib/` — module boundaries

Business logic is split along these boundaries. Epics fill each folder as they
land; the separation exists so execution can swap CRM mechanisms without
touching validation, import or run-tracking.

| Module (planned path) | Responsibility | Owned by |
|---|---|---|
| `lib/db.ts` | Prisma client (PostgreSQL via `@prisma/adapter-pg`) | E1 |
| `lib/env.ts` | Validated environment config (fail fast) | E1 |
| `lib/logger.ts` | Structured logging with secret redaction | E1 |
| `lib/file-processing/` | Parse CSV/Excel → internal rows | E2 |
| `lib/validation/` | Mapping, normalization, validation, duplicate detection | E3 |
| `lib/adapters/` | CRM port + adapters (Mock now, real after CRM is chosen) | E4 |
| `lib/execution/` | Workflow runner + run/record state transitions | E5 |

## Hard rules

- **Domain and execution never import CRM-specific code** — only the CRM port
  (`lib/adapters`). No DOM selectors or CRM SDK types leak into validation or
  run-tracking.
- **Validation and file-processing are deterministic and unit-tested** — no
  network, no AI.
- **No secrets in logs** — pass metadata through `logger`, which redacts them.
