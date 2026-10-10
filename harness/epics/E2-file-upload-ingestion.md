# E2 — File Upload & Data Ingestion

**Layer:** product (vertical slice: `input`)
**Gộp từ:** Epic 3 (File Upload & Data Ingestion)
**Mục tiêu:** Đưa dữ liệu Excel/CSV vào hệ thống an toàn, có kiểm soát, với lỗi đầu vào rõ ràng.
**Quyết định chặn:** không. Giới hạn file (quyết định #5 tài liệu) nên chốt sớm nhưng có thể dùng default cấu hình được.

---

## Story E2-S1 — Upload & parse file
Là người dùng, tôi tải lên file leads và hệ thống đọc được.

### E2-T1 — Parser CSV/Excel (deterministic core)
- **Goal:** Hàm thuần đọc CSV/Excel → `{ headers, rows, rowCount }` dùng `xlsx`.
- **Scope:** parse buffer, xử lý dòng rỗng, lỗi parse → error value (không throw mù). / out: multi-sheet, cấu trúc phức tạp (tài liệu out-of-scope).
- **Dependencies:** none (xlsx đã có).
- **Acceptance:** file hợp lệ trả headers + rows đúng; file hỏng trả lỗi phân loại được; dòng rỗng bị bỏ.
- **Verification:** `pnpm test` với fixture CSV/XLSX hợp lệ + hỏng.
- **Schema impact:** none.

### E2-T2 — Upload endpoint + giới hạn + lưu metadata
- **Goal:** API nhận file, kiểm định dạng/kích thước/số dòng, lưu `ImportFile` metadata.
- **Scope:** validate MIME/size/row-limit từ env config; lưu metadata; chính sách lưu/xóa file nguồn. / out: lưu nội dung file vào Postgres.
- **Dependencies:** E1-T3, E2-T1.
- **Acceptance:** file quá giới hạn/sai định dạng bị từ chối kèm thông báo; `ImportFile` được tạo; không tạo `WorkflowRun` ở bước này.
- **Verification:** integration test endpoint (hợp lệ + vượt giới hạn + sai type).
- **Schema impact:** dùng `ImportFile`.

## Story E2-S2 — Preview đầu vào
### E2-T3 — Preview headers + dòng mẫu (UI + API)
- **Goal:** Hiển thị cột nguồn, số dòng, vài dòng mẫu sau upload.
- **Scope:** API trả preview; UI bước 1 của wizard; empty/error state. / out: mapping (thuộc E3).
- **Dependencies:** E2-T1, E2-T2.
- **Acceptance:** upload hợp lệ → thấy preview; file lỗi → thông báo rõ, không sang bước sau.
- **Verification:** e2e Playwright: upload fixture → thấy preview.
- **Schema impact:** none.

---

## Definition of Done (E2)
- File hợp lệ đọc & preview; file sai bị từ chối với lỗi phân loại (dữ liệu/định dạng).
- Không tạo run thực thi khi file chưa hợp lệ.
- Metadata lưu bền vững; nội dung file không nhồi vào DB.
- Unit (parser) + integration (upload) + e2e (preview) xanh.
