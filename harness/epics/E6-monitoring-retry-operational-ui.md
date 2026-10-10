# E6 — Monitoring, Retry & Operational UI

**Layer:** product (vertical slice: `monitor` + `report`)
**Gộp từ:** Epic 7 (Monitoring/Retry), Epic 8 (Import Wizard & Operational UI), Epic 9 (History/Reporting/Audit)
**Mục tiêu:** Người dùng hoàn thành toàn luồng qua UI, hiểu lỗi, retry an toàn và đối soát lịch sử.
**Quyết định chặn:** retry/đối soát `UNKNOWN` phụ thuộc #3 (idempotency/khóa trùng) và E4 (findExisting). UI + history làm được ngay với Mock.

---

## Story E6-S1 — Operational UI nối toàn luồng
### E6-T1 — Import wizard + dashboard tối giản
- **Goal:** Wizard 4 bước (upload → preview/mapping → validate/review → confirm/execute) + dashboard workflow/run gần đây.
- **Scope:** nối UI các epic trước; loading/empty/error state. / out: workflow builder kéo thả (out-of-scope).
- **Dependencies:** E2-T3, E3-T5, E5-T4.
- **Acceptance:** người dùng hoàn thành workflow không cần chạm DB; không cho execute khi chưa confirm.
- **Verification:** e2e full happy-path qua MockCrmAdapter.
- **Schema impact:** none.

### E6-T2 — Run Detail UI
- **Goal:** Hiển thị run (ID, file, thời gian, trạng thái tổng, counts, bảng record, chi tiết lỗi).
- **Scope:** đọc từ E5 API; progress hiển thị qua polling. / out: biểu đồ phân tích phức tạp.
- **Dependencies:** E5-T4.
- **Acceptance:** người dùng xác định được record nào thất bại và lý do.
- **Verification:** e2e mở run detail sau khi chạy.
- **Schema impact:** none.

## Story E6-S2 — Retry an toàn
### E6-T3 — Phân loại lỗi + retry bản ghi đủ điều kiện
- **Goal:** Retry chỉ các record `FAILED`/chưa chắc đã tạo; lưu `attemptCount`; không gửi lại cả lô.
- **Scope:** lỗi tạm-thời/an-toàn mới auto-retry; retry chỉ tác động tập được chọn. / out: retry mù.
- **Dependencies:** E5-T3, quyết định #3.
- **Acceptance:** không retry mù `UNKNOWN`; lịch sử attempt được ghi; retry không chạm record `SUCCEEDED`.
- **Verification:** integration: FAILED tạm thời → retry thành công; `UNKNOWN` bị chặn retry mù.
- **Schema impact:** `attemptCount` trên `RunRecord`.

### E6-T4 — Đối soát UNKNOWN trước retry (phụ thuộc E4)
- **Goal:** Với `UNKNOWN`, đối soát CRM (`findExisting`/idempotency key) trước khi gửi lại.
- **Scope:** dùng CRM port; nếu CRM không hỗ trợ truy vấn → không auto-retry, yêu cầu xử lý thủ công. / out: tạo trùng.
- **Dependencies:** E4-T1 (port) + E4-T4 (adapter thật) hoặc Mock cho test; quyết định #3.
- **Acceptance:** `UNKNOWN` không tạo lead trùng khi retry; dùng idempotency key nếu CRM hỗ trợ.
- **Verification:** integration với Mock mô phỏng record đã tồn tại → retry không tạo trùng.
- **Schema impact:** none.

## Story E6-S3 — History & report
### E6-T5 — Lịch sử run + report + audit events
- **Goal:** Danh sách run (lọc trạng thái/thời gian), mở lại run, thống kê theo trạng thái; xuất report nếu cần.
- **Scope:** đọc `WorkflowRun`/`RunRecord`/`RunEvent`. / out: BI/analytics.
- **Dependencies:** E5-T3.
- **Acceptance:** tìm & mở lại run đã hoàn tất; số liệu report khớp record; truy vết run → từng record.
- **Verification:** integration + e2e mở lịch sử.
- **Schema impact:** none.

---

## Definition of Done (E6)
- Người dùng chạy toàn luồng qua UI, xem tiến độ/lịch sử/report.
- Retry có kiểm soát: không gửi lại mù các record `UNKNOWN`; không tạo trùng khi retry.
- `attemptCount` + sự kiện được ghi; truy vết đầy đủ run → record.
- E2E cho happy-path và các case lỗi quan trọng (FAILED tạm thời, UNKNOWN) xanh.
