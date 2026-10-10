# E1 — Project Foundation

**Layer:** engineering foundation
**Gộp từ:** Epic 1 (Project Foundation & Runtime), Epic 2 (Workflow Definition & Configuration), quality-gate/CI
**Mục tiêu:** Có nền tảng kỹ thuật tối thiểu, quality gate chạy sớm, và schema nghiệp vụ phản ánh workflow thật — đủ để các nhóm sau xây vertical slice.
**Quyết định chặn:** không (độc lập với CRM).

> Đã có sẵn trong repo: Next.js 16, Prisma 7 + adapter-pg, docker-compose Postgres, migration `init` (chỉ `User`), `xlsx`+`zod`, `lib/db.ts`. Các task dưới chỉ lấp khoảng trống, không scaffold lại.

---

## Story E1-S1 — Quality gates & CI chạy sớm
Là developer, tôi cần lint/typecheck/test/build chuẩn hóa và CI bảo vệ mọi thay đổi.

### E1-T1 — Thêm test tooling + scripts
- **Goal:** Có Vitest (unit/integration) + Playwright (e2e) và script chạy được.
- **Scope:** cài `vitest`, `@playwright/test`; thêm scripts `typecheck`, `test`, `test:e2e`. / out: viết test nghiệp vụ (thuộc epic tương ứng).
- **Dependencies:** none.
- **Acceptance:** `pnpm typecheck`, `pnpm test`, `pnpm test:e2e` chạy được (dù 0 test); 1 smoke test mẫu xanh.
- **Verification:** `pnpm typecheck && pnpm test && pnpm test:e2e`.
- **Schema impact:** none.
- **Risks:** Playwright browser download trong CI — cache lại.

### E1-T2 — GitHub Actions CI
- **Goal:** CI chạy lint + typecheck + test + build trên PR.
- **Scope:** `.github/workflows/ci.yml` với service Postgres cho integration. / out: CD/deploy.
- **Dependencies:** E1-T1.
- **Acceptance:** PR mới kích hoạt workflow; fail khi lint/type/test/build fail.
- **Verification:** mở PR nháp, xem checks xanh; `act` hoặc chạy lại job.
- **Schema impact:** none.

## Story E1-S2 — Schema nghiệp vụ tối thiểu
Là hệ thống, tôi cần entity phản ánh workflow thật để lưu run và trạng thái bản ghi.

### E1-T3 — Prisma models + migration
- **Goal:** Thêm `Workflow`, `WorkflowConfig`, `ImportFile`, `WorkflowRun`, `RunRecord`, `IntegrationConnection`, `RunEvent` (tài liệu §9).
- **Scope:** model + quan hệ + enum trạng thái (`PENDING/INVALID/DUPLICATE/SKIPPED/PROCESSING/SUCCEEDED/FAILED/UNKNOWN`); field truy vấn nhiều để cột rõ ràng, phần linh hoạt dùng `Json`. / out: field chỉ để "dự phòng" chưa dùng.
- **Dependencies:** none.
- **Acceptance:** `prisma migrate dev` tạo migration; `UNKNOWN` tách khỏi `FAILED`; không lưu toàn bộ nội dung file vào DB (chỉ metadata).
- **Verification:** `pnpm prisma migrate dev`, integration test ghi/đọc 1 `WorkflowRun` + `RunRecord`.
- **Schema impact:** migration mới (7 entity + enum).
- **Risks:** schema còn phụ thuộc CRM đích — giữ `IntegrationConnection` tối giản, tinh chỉnh ở E4.

### E1-T4 — Seed + cấu trúc module + logging
- **Goal:** Seed workflow "Import Leads to CRM" + tách module (`domain / file-processing / validation / execution / adapters`) + logger không log secrets.
- **Scope:** `prisma/seed.ts`; thư mục module rỗng có ranh giới rõ; logger redact token/password. / out: logging/observability nâng cao.
- **Dependencies:** E1-T3.
- **Acceptance:** seed tạo 1 workflow; import cross-module theo đúng ranh giới; test khẳng định logger che secret.
- **Verification:** `pnpm prisma db seed`; `pnpm test` cho logger-redaction test.
- **Schema impact:** dùng schema E1-T3.

---

## Definition of Done (E1)
- `pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` xanh; CI xanh trên PR.
- Migration tồn tại và áp được từ DB trống; seed chạy.
- Enum trạng thái có đủ `UNKNOWN` tách biệt.
- Không secret trong log (có test chứng minh).
- Không tạo entity/field dự phòng ngoài nhu cầu workflow hiện tại.
