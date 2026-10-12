# E5 — Workflow Execution & Run Tracking

**Layer:** product (vertical slice: `execution` + `verification`)
**Gộp từ:** Epic 6 (Workflow Execution & Run Tracking)
**Mục tiêu:** Thực thi workflow theo từng bản ghi qua CRM port, lưu trạng thái bền vững, kết quả tổng hợp chính xác.
**Quyết định chặn:** chạy được ngay với `MockCrmAdapter` (E4-T2). Chi tiết retry/đối soát `UNKNOWN` phụ thuộc #3 (idempotency/khóa trùng).

---

## Story E5-S1 — Tạo & chạy run
### E5-T1 — Tạo WorkflowRun từ tập đã confirm
- **Goal:** Sau confirm (E3-T5), tạo `WorkflowRun` + `RunRecord` cho bản ghi được chọn, mỗi record có định danh ổn định trong run.
- **Scope:** khởi tạo run `PROCESSING`, record `PENDING`. / out: scheduling, chạy song song phức tạp (out-of-scope).
- **Dependencies:** E1-T3, E3-T5.
- **Acceptance:** mỗi lần chạy có `WorkflowRun` riêng; chỉ bản ghi hợp lệ/được chọn vào run.
- **Verification:** integration test tạo run từ tập mẫu.
- **Schema impact:** `WorkflowRun`, `RunRecord`.

### E5-T2 — Runner tuần tự theo bản ghi
- **Goal:** Duyệt record, gọi `CrmAdapter.createLead`, map phản hồi → `SUCCEEDED/FAILED/UNKNOWN`, lưu `targetRecordId`.
- **Scope:** lô nhỏ tuần tự (tài liệu §8.3); xử lý timeout/lỗi kết nối tường minh → `UNKNOWN`. / out: queue/worker phân tán (out-of-scope).
- **Dependencies:** E5-T1, E4-T1/T2.
- **Acceptance:** timeout sau khi gửi → `UNKNOWN` (không `FAILED`); mỗi record lưu kết quả độc lập.
- **Verification:** integration với MockCrmAdapter cho đủ nhánh success/failed/timeout.
- **Schema impact:** cập nhật `RunRecord`.

## Story E5-S2 — Tổng hợp & bền vững
### E5-T3 — Cập nhật trạng thái run + đếm tổng hợp
- **Goal:** Tính `successCount/failedCount/invalidCount/skippedCount`, cập nhật `status` run; ghi `RunEvent`.
- **Scope:** trạng thái run riêng với trạng thái record (§8.3). / out: analytics dashboard.
- **Dependencies:** E5-T2.
- **Acceptance:** run **không** được đánh dấu thành công hoàn toàn nếu còn `FAILED`/`UNKNOWN`; số tổng hợp khớp record.
- **Verification:** integration kiểm tra counts + trạng thái.
- **Schema impact:** `WorkflowRun`, `RunEvent`.

### E5-T4 — Khôi phục trạng thái sau reload
- **Goal:** Trạng thái run/record đọc từ DB, không phụ thuộc state trình duyệt.
- **Scope:** API truy xuất trạng thái run. / out: realtime websocket (polling là đủ cho MVP).
- **Dependencies:** E5-T3.
- **Acceptance:** reload trang vẫn thấy đúng trạng thái; gián đoạn tiến trình không mất dữ liệu đã ghi.
- **Verification:** e2e: chạy run (Mock) → reload → trạng thái đúng.
- **Schema impact:** none.

---

## Definition of Done (E5)
- Mỗi lần chạy có `WorkflowRun` riêng; kết quả từng bản ghi bền vững.
- Trạng thái tổng thể phản ánh đúng từng record; `UNKNOWN` tách `FAILED`.
- Khôi phục được sau reload; không dựa vào bộ nhớ trình duyệt.
- Mọi thao tác tác động CRM đều có log kết quả (secrets redacted).
- Chạy end-to-end qua MockCrmAdapter không cần CRM thật.
