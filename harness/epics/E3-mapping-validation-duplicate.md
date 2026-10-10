# E3 — Mapping, Validation & Duplicate Detection

**Layer:** product (vertical slice: `validation`)
**Gộp từ:** Epic 4 (Field Mapping, Validation & Duplicate Detection)
**Mục tiêu:** Ánh xạ và kiểm tra dữ liệu trước thực thi; đánh dấu trạng thái + lỗi theo từng dòng.
**Quyết định chặn:** #3 đã CHỐT — khóa trùng = **email chuẩn hóa (lowercase + trim)**. Duplicate **trong-file** làm được ngay; duplicate **phía CRM** còn chờ #1 (CRM đích).

---

## Story E3-S1 — Mapping cột → trường CRM
### E3-T1 — Mapping engine + lưu cấu hình
- **Goal:** Ánh xạ cột nguồn sang trường đích; lưu/tái dùng mapping trong `WorkflowConfig`.
- **Scope:** mapping do người dùng chọn; quay lại sửa trước confirm. / out: tự suy luận mapping bằng AI (out-of-scope).
- **Dependencies:** E1-T3, E2-T3.
- **Acceptance:** lưu & nạp lại mapping; đổi mapping cập nhật kết quả validate.
- **Verification:** unit mapping engine; e2e chỉnh mapping ở wizard.
- **Schema impact:** `WorkflowConfig`.

## Story E3-S2 — Validate & normalize (deterministic)
### E3-T2 — Rule validation + normalization bằng Zod
- **Goal:** Mỗi dòng có trạng thái + danh sách lỗi; chuẩn hóa theo quy tắc xác định.
- **Scope:** required/type/format (email, phone...) qua `zod`; normalize (trim, chuẩn hóa phone); đánh dấu `INVALID`. / out: AI-based validation.
- **Dependencies:** E3-T1.
- **Acceptance:** dòng lỗi → `INVALID` + lỗi cụ thể; dòng hợp lệ → `normalizedData`; dữ liệu `INVALID` không bao giờ vào execution.
- **Verification:** unit bảng dữ liệu hợp lệ/không hợp lệ; property test normalize.
- **Schema impact:** ghi `status`,`normalizedData`,`errorCode/Message` lên `RunRecord` (khi tạo run ở E5).

## Story E3-S3 — Duplicate detection
### E3-T3 — Trùng trong-file (làm ngay)
- **Goal:** Phát hiện trùng theo khóa nghiệp vụ trong cùng file.
- **Scope:** khóa = **email chuẩn hóa (lowercase + trim)** (đã chốt #3); đánh dấu `DUPLICATE` là **cảnh báo**, không phải lỗi validation. / out: trùng phía CRM.
- **Dependencies:** E3-T2.
- **Acceptance:** dòng trùng được tách khỏi `INVALID`; người dùng phân biệt được.
- **Verification:** unit với file có trùng.
- **Schema impact:** dùng `status=DUPLICATE`.

### E3-T4 — Trùng phía CRM (BLOCKED: #1, #2)
- **Goal:** Truy vấn CRM để cảnh báo trùng với dữ liệu hiện có, nếu CRM hỗ trợ.
- **Scope:** chỉ cảnh báo khi không chắc, không tự khẳng định (tài liệu §4 bước 4). 
- **Dependencies:** E4 (CRM port), quyết định #1+#2+#3.
- **Acceptance:** khi CRM hỗ trợ truy vấn → cảnh báo trùng; khi không chắc → cảnh báo, không auto-khẳng định.
- **Trạng thái:** CHỜ chốt CRM. Giữ sau CRM port, không nhúng vào domain.

## Story E3-S4 — Review & confirm
### E3-T5 — Màn review + xác nhận tập đủ điều kiện
- **Goal:** Hiển thị số hợp lệ/không hợp lệ/trùng; người dùng chọn & xác nhận.
- **Scope:** UI review; chỉ bản ghi hợp lệ được chọn mới đi tiếp. / out: execute (E5).
- **Dependencies:** E3-T2, E3-T3.
- **Acceptance:** không cho confirm khi chưa chọn hợp lệ; cảnh báo trùng tách khỏi lỗi.
- **Verification:** e2e: upload → mapping → review → confirm (chưa execute).
- **Schema impact:** none.

---

## Definition of Done (E3)
- Mỗi dòng có trạng thái validation rõ ràng; `INVALID` không vào execution.
- Người dùng thấy lỗi cụ thể, sửa mapping được trước khi chạy.
- Cảnh báo trùng phân biệt với lỗi validation.
- Logic validation/duplicate là deterministic và có unit test; không phụ thuộc DOM/CRM cụ thể.
