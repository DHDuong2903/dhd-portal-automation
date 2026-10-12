# E4 — CRM Integration

**Layer:** product (vertical slice: `execution` — lớp ra ngoài)
**Gộp từ:** Epic 5 (CRM Integration Adapter)
**Mục tiêu:** Kết nối đáng tin cậy với một CRM đích; tạo lead qua API (ưu tiên) hoặc automation (fallback).
**Quyết định chặn:** **#1 CRM đích** còn DEFERRED (build qua Mock). **#2 đã CHỐT: API-first** — browser automation chỉ khi CRM đã chọn không có API phù hợp. **CRM port** + **MockCrmAdapter** làm ngay để gỡ chặn các epic khác.

> Nguyên tắc North Star/§8.1: ưu tiên API chính thức; chỉ dùng browser automation khi API không khả dụng/không đáp ứng, sau khi đánh giá độ ổn định + điều khoản. Không mặc định Playwright nếu đã có API.

---

## Story E4-S1 — CRM port + Mock (làm ngay, gỡ chặn)
### E4-T1 — Định nghĩa CRM port
- **Goal:** Interface `CrmAdapter` ổn định: `testConnection()`, `createLead(normalized) -> {status, targetRecordId?, errorCode?}`, `findExisting(key)?`.
- **Scope:** interface + kiểu kết quả chuẩn hóa (success/failed/unknown). / out: mọi chi tiết CRM cụ thể.
- **Dependencies:** E1-T3.
- **Acceptance:** domain/execution chỉ phụ thuộc interface này, không biết CRM nào.
- **Verification:** `pnpm typecheck`; grep không có import CRM-specific trong domain/execution.
- **Schema impact:** none (tham chiếu `IntegrationConnection`).

### E4-T2 — MockCrmAdapter deterministic
- **Goal:** Adapter giả lập success/failed/timeout(→`UNKNOWN`)/duplicate để test toàn slice.
- **Scope:** điều khiển kết quả theo input để test E5/E6. / out: gọi mạng thật.
- **Dependencies:** E4-T1.
- **Acceptance:** tạo được đủ các nhánh kết quả một cách xác định.
- **Verification:** unit; dùng trong e2e của E5/E6.
- **Schema impact:** none.

## Story E4-S2 — Adapter CRM thật (BLOCKED: #1, #2)
### E4-T3 — Đánh giá CRM & xác nhận có API phù hợp
- **Goal:** Khi chốt CRM, xác nhận API/auth/rate-limit/quyền/điều khoản đáp ứng (mặc định API-first); chỉ cân nhắc automation nếu API không đủ.
- **Dependencies:** quyết định #1.
- **Acceptance:** có tài liệu xác nhận API đáp ứng (hoặc lý do phải fallback automation) + rủi ro.
- **Trạng thái:** CHỜ #1.

### E4-T4 — Triển khai adapter API thật sau port
- **Goal:** `testConnection` + `createLead` qua API CRM; map dữ liệu nội bộ → schema CRM; chuẩn hóa phản hồi; bảo vệ credentials.
- **Scope:** API chính thức của CRM đã chọn. / out: đồng bộ 2 chiều, update/merge/delete (out-of-scope).
- **Dependencies:** E4-T3, E1-T3.
- **Acceptance:** tạo được 1 lead thử nghiệm có kiểm soát (M3); credentials không lộ trong log/UI; phản hồi → kết quả nội bộ nhất quán.
- **Verification:** integration test với sandbox CRM; test redaction credentials.
- **Schema impact:** có thể tinh chỉnh `IntegrationConnection`.
- **Trạng thái:** CHỜ #1.

---

## Definition of Done (E4)
- Port + Mock xong, các epic khác chạy e2e không cần CRM thật.
- (Sau khi gỡ chặn) kiểm tra kết nối trước khi chạy; tạo 1 lead thử nghiệm; phản hồi chuẩn hóa; credentials an toàn.
- Domain/execution không import gì CRM-specific (chỉ qua port).
