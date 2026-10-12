# Harness — Delivery Backlog

> "Harness" ở đây là **khung giao việc + kiểm chứng (delivery/test harness)** của dự án, KHÔNG phải sản phẩm Harness.io (thứ nằm ngoài phạm vi MVP theo `docs/Portal Automation MVP.md` §2.4).

Folder này chuyển 10 Epic định hướng trong `docs/Portal Automation MVP.md` thành backlog phát triển có thể thực thi. Tài liệu MVP vẫn là baseline; backlog này gom lại thành **6 nhóm công việc cốt lõi** để ưu tiên triển khai.

Mọi epic/task tuân theo `.cursor/rules/task-decomposition.mdc` (template task, cổng lọc phạm vi, vertical slice, tách adapter khỏi domain, deterministic trước AI).

## 6 nhóm cốt lõi ↔ 10 Epic tài liệu

| # | Nhóm backlog (file) | Gộp từ Epic tài liệu |
|---|---|---|
| E1 | [Project Foundation](epics/E1-project-foundation.md) | Epic 1, Epic 2, phần CI/quality-gate |
| E2 | [File Upload & Data Ingestion](epics/E2-file-upload-ingestion.md) | Epic 3 |
| E3 | [Mapping, Validation & Duplicate Detection](epics/E3-mapping-validation-duplicate.md) | Epic 4 |
| E4 | [CRM Integration](epics/E4-crm-integration.md) | Epic 5 |
| E5 | [Workflow Execution & Run Tracking](epics/E5-workflow-execution-run-tracking.md) | Epic 6 |
| E6 | [Monitoring, Retry & Operational UI](epics/E6-monitoring-retry-operational-ui.md) | Epic 7, Epic 8, Epic 9 |

Epic 10 tài liệu (Security, Reliability & MVP Acceptance) là **cross-cutting**: được gắn vào Definition of Done của từng nhóm + một cổng Pilot Readiness ở cuối (xem §Milestones).

## Trạng thái repo hiện tại (đã kiểm tra)

Đã có: Next.js 16 + TS, Prisma 7 + `@prisma/adapter-pg` + `pg`, `docker-compose.yml` (Postgres 16), migration `init` (chỉ model `User`), deps `xlsx` + `zod`, `lib/db.ts`.
Còn thiếu: Vitest, Playwright, script `typecheck`/`test`, CI GitHub Actions, seed, schema nghiệp vụ (`Workflow`/`WorkflowRun`/`RunRecord`/...), logging chuẩn, cấu trúc module.

## 3 quyết định chặn

1. **CRM đích** — ⏳ **DEFERRED**: chưa chốt, build qua `MockCrmAdapter` trước. Vẫn **chặn E4 adapter thật** và duplicate-detection phía CRM (E3-T4).
2. **Cơ chế thực thi** — ✅ **CHỐT: API-first.** Chỉ dùng browser automation (Playwright) khi CRM đã chọn không có API phù hợp, sau khi đánh giá auth/rate-limit/điều khoản.
3. **Định danh trùng** — ✅ **CHỐT: email đã chuẩn hóa** là khóa nghiệp vụ MVP (lowercase + trim). Áp dụng cho duplicate-detection (E3) và đối soát trước retry `UNKNOWN` (E5/E6).

### Cách gỡ chặn mà vẫn tiến được (đề xuất kiến trúc)

Định nghĩa **CRM port** (interface) ngay trong E1/E5 và xây **`MockCrmAdapter`** deterministic. Nhờ đó E2→E3→E5→E6 chạy và test end-to-end **trước khi** chốt CRM thật. Khi quyết định #1/#2 có, chỉ cần viết adapter thật sau port, không phải sửa domain/validation/run-tracking. Điều này tôn trọng cả ba nguyên tắc: vertical slice sớm, API-first, và tách adapter khỏi domain.

## Đề xuất chốt phạm vi triển khai

**Cam kết ngay (không bị CRM chặn):** E1, E2, E3 (duplicate trong-file), E5 (khung thực thi + `MockCrmAdapter`), E6 (khung monitoring/retry UI).
**Chờ quyết định #1 + #2:** E4 (adapter thật), duplicate phía CRM (E3), chi tiết idempotency/đối soát (E5/E6).
**Cổng quyết định riêng (North Star):** chọn portal/CRM thật + thử nghiệm thương mại — tách khỏi phần kỹ thuật.

Nguyên tắc tài liệu §11: **không chờ xong toàn bộ UI mới kiểm tra tích hợp CRM.** Vì vậy M3 (CRM Proof of Integration) phải chạy ngay khi quyết định #1 có, song song M4.

## Milestones

| Milestone | Nhóm | Kết quả | Phụ thuộc quyết định |
|---|---|---|---|
| M1 — Foundation | E1 | App + schema nghiệp vụ + CI xanh | — |
| M2 — Data Pipeline | E2, E3 | Upload → mapping → validate → review với dữ liệu mẫu | — |
| M3 — CRM Proof of Integration | E4 | Tạo 1 lead thật trên CRM đích | #1, #2 |
| M4 — Execution Core | E5 | Chạy theo bản ghi + run tracking (qua Mock, rồi adapter thật) | #3 cho retry |
| M5 — Usable MVP | E6 | Toàn luồng + lịch sử/report qua UI | — |
| M6 — Pilot Readiness | Epic 10 (cross-cut) | E2E, retry/UNKNOWN đã test, go/no-go checklist | — |
