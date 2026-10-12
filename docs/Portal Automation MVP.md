# Portal Automation MVP
## Product Scope, Core Workflow & Delivery Epics

**Trạng thái:** Đề xuất baseline cho MVP  
**Phiên bản:** 1.0  
**Định hướng kỹ thuật:** Next.js + Prisma + PostgreSQL + Docker  
**Workflow ưu tiên:** Nhập dữ liệu khách hàng/leads vào CRM từ Excel/CSV  
**Tần suất sử dụng mục tiêu:** Hàng tháng hoặc ít hơn  
**Phạm vi tích hợp:** Một workflow, một hệ thống CRM đích được lựa chọn trong quá trình triển khai

---

# 1. Executive Summary

Portal Automation là ứng dụng hỗ trợ tự động hóa các tác vụ vận hành trên portal hoặc hệ thống nghiệp vụ thông qua dữ liệu đầu vào có cấu trúc.

Mục tiêu của MVP không phải là xây dựng một nền tảng RPA tổng quát, mà là kiểm chứng một bài toán cụ thể: **giảm công sức xử lý thủ công khi đưa danh sách khách hàng/leads từ Excel hoặc CSV vào CRM, đồng thời tăng khả năng kiểm soát dữ liệu và theo dõi kết quả thực thi.**

MVP cung cấp một quy trình thống nhất:

1. Người dùng tải lên file Excel/CSV chứa dữ liệu khách hàng.
2. Hệ thống đọc, kiểm tra và chuẩn hóa dữ liệu.
3. Người dùng xem trước các bản ghi hợp lệ, lỗi và có khả năng trùng lặp.
4. Người dùng xác nhận dữ liệu cần xử lý.
5. Hệ thống thực hiện workflow đưa dữ liệu vào CRM đích.
6. Người dùng theo dõi tiến độ, kết quả thành công, thất bại và chi tiết lỗi.
7. Người dùng có thể xem lại lịch sử các lần chạy để đối soát.

MVP chỉ thành công khi chứng minh được rằng một người dùng có thể hoàn thành quy trình nhập leads với ít thao tác thủ công hơn, biết chính xác dữ liệu nào đã được xử lý và có thể xử lý các trường hợp thất bại mà không phải làm lại toàn bộ công việc.

# 2. Product Vision và mục tiêu MVP

## 2.1. Tầm nhìn sản phẩm

Xây dựng một ứng dụng giúp người dùng vận hành các workflow nghiệp vụ lặp lại trên những hệ thống web hiện có, với dữ liệu đầu vào được kiểm soát, quá trình thực thi có thể quan sát và kết quả có thể kiểm chứng.

Sản phẩm hướng đến việc chuyển những quy trình đang phụ thuộc vào thao tác thủ công thành các workflow có cấu trúc, có thể tái sử dụng và cải tiến theo thời gian.

## 2.2. Chiến lược MVP

Thay vì hỗ trợ nhiều portal, nhiều loại dữ liệu và nhiều kiểu automation cùng lúc, MVP tập trung vào một trường hợp sử dụng có đầu vào rõ ràng và kết quả đo lường được:

**Excel/CSV → Validate & Normalize → Review → CRM → Execution Report.**

MVP cần kiểm chứng ba giả thuyết:

- **Giá trị nghiệp vụ:** Người dùng tiết kiệm thời gian và giảm thao tác thủ công khi nhập leads.
- **Khả năng vận hành:** Workflow có thể thực thi theo từng bản ghi, phát hiện lỗi và cho phép đối soát kết quả.
- **Khả năng mở rộng:** Có thể bổ sung workflow hoặc portal khác mà không phải viết lại toàn bộ ứng dụng.

## 2.3. Mục tiêu sản phẩm

- Giảm thời gian xử lý một lô dữ liệu so với quy trình thủ công hiện tại.
- Phát hiện lỗi dữ liệu trước khi gửi sang CRM.
- Giảm nguy cơ tạo bản ghi trùng lặp.
- Theo dõi được trạng thái và kết quả xử lý của từng bản ghi.
- Cho phép kiểm tra lại lịch sử chạy và nguyên nhân thất bại.
- Xác lập kiến trúc tối thiểu để có thể bổ sung các workflow sau MVP.

## 2.4. Những gì MVP không nhằm giải quyết

MVP không hướng tới:

- Xây dựng một nền tảng RPA thay thế các công cụ automation chuyên dụng.
- Tự động hóa mọi loại portal hoặc mọi quy trình nghiệp vụ.
- Xây dựng workflow designer dạng kéo thả.
- Sử dụng AI để tự khám phá giao diện, tự suy luận quy trình hoặc tự sửa lỗi.
- Hỗ trợ hàng loạt hệ thống CRM ngay từ phiên bản đầu.
- Xây dựng hệ thống scheduling, orchestration hoặc distributed workers phức tạp.
- Xây dựng hệ thống quản lý doanh nghiệp với phân quyền nhiều cấp.
- Tích hợp Harness Engineering hoặc GitNexus vào phạm vi MVP.

# 3. Người dùng mục tiêu và vấn đề cần giải quyết

## 3.1. Người dùng mục tiêu

Người dùng vận hành nghiệp vụ, sales operations hoặc nhân sự phụ trách nhập và cập nhật danh sách leads trên CRM.

Đặc điểm:

- Nhận dữ liệu từ Excel/CSV.
- Xử lý theo từng lô, không nhất thiết hàng ngày.
- Phải tuân thủ định dạng và trường dữ liệu của CRM.
- Cần kiểm tra dữ liệu trước khi nhập.
- Cần biết bản ghi nào thành công, thất bại hoặc chưa được xử lý.

## 3.2. Quy trình hiện tại giả định

1. Nhận file từ bộ phận liên quan.
2. Mở file và kiểm tra thủ công.
3. Chỉnh sửa dữ liệu sai định dạng.
4. Đăng nhập CRM.
5. Nhập từng bản ghi hoặc sử dụng chức năng import của CRM.
6. Kiểm tra lại kết quả.
7. Ghi nhận các lỗi hoặc bản ghi chưa nhập được.

Các điểm đau cần kiểm chứng thực tế gồm thời gian thao tác, chất lượng dữ liệu đầu vào, lỗi nhập liệu, dữ liệu trùng và chi phí đối soát sau khi thực hiện.

# 4. Phạm vi chức năng

## 4.1. In scope

| Nhóm | Chức năng |
|---|---|
| Input | Tải lên file CSV và Excel với cấu trúc được hỗ trợ |
| Preview | Hiển thị dữ liệu, số dòng và thông tin file |
| Mapping | Ánh xạ cột nguồn sang các trường CRM |
| Validation | Kiểm tra trường bắt buộc, kiểu dữ liệu và định dạng |
| Normalization | Chuẩn hóa các trường theo quy tắc xác định |
| Duplicate detection | Phát hiện bản ghi có khả năng trùng theo quy tắc MVP |
| Review | Cho phép xem lỗi và chọn các bản ghi đủ điều kiện |
| Workflow execution | Thực thi việc tạo lead trên một CRM đích |
| Run monitoring | Hiển thị trạng thái, tiến độ và kết quả |
| Error handling | Ghi nhận lỗi theo từng bản ghi và hỗ trợ chạy lại bản ghi thất bại |
| History | Xem lại các lần chạy và báo cáo kết quả |
| Configuration | Cấu hình tối thiểu cho workflow và kết nối CRM |

## 4.2. Out of scope

- Tự động cập nhật, hợp nhất hoặc xóa lead hiện có.
- Đồng bộ hai chiều giữa CRM và các nguồn dữ liệu.
- Xử lý file có nhiều sheet hoặc cấu trúc phức tạp nếu chưa được xác nhận hỗ trợ.
- Tự động suy luận mapping bằng AI.
- Chạy nhiều workflow song song với cơ chế điều phối phức tạp.
- Lập lịch chạy tự động theo thời gian.
- Multi-tenant SaaS hoàn chỉnh.
- Hệ thống phê duyệt nhiều cấp.
- Tích hợp nhiều CRM trong cùng một release.
- Browser automation engine tổng quát có khả năng tự thích ứng với mọi giao diện.

**Lưu ý về lựa chọn CRM:** CRM đích chưa được xác định. Vì vậy, phần tích hợp CRM phải được thiết kế sau khi đánh giá API, cơ chế xác thực và quyền truy cập của hệ thống được chọn. Không nên mặc định sử dụng browser automation nếu CRM đã cung cấp API phù hợp.

# 5. Workflow cốt lõi của MVP

## 5.1. Mô tả nghiệp vụ

Tên workflow: **Import Leads to CRM**

Đầu vào là một file Excel/CSV chứa danh sách leads. Đầu ra là tập hợp bản ghi CRM được tạo thành công, các bản ghi bị từ chối do dữ liệu không hợp lệ và các bản ghi thất bại trong quá trình thực thi.

### Luồng xử lý

**Bước 1 — Upload**

Người dùng chọn file và tải lên hệ thống.

Hệ thống kiểm tra định dạng, kích thước file theo giới hạn cấu hình và khả năng đọc dữ liệu. File không hợp lệ bị từ chối với thông báo rõ ràng.

**Bước 2 — Preview & Mapping**

Hệ thống hiển thị các cột nguồn, một số dòng mẫu và cho phép người dùng ánh xạ trường nguồn sang trường đích.

Ví dụ mapping:

| Cột nguồn | Trường CRM | Quy tắc |
|---|---|---|
| Full Name | Name | Bắt buộc |
| Email Address | Email | Kiểm tra định dạng |
| Phone Number | Phone | Chuẩn hóa khoảng trắng, ký tự theo quy tắc |
| Company | Company | Không bắt buộc |
| Lead Source | Source | Mapping giá trị nếu cần |

Tên trường và yêu cầu thực tế cần được xác nhận theo CRM được lựa chọn.

**Bước 3 — Validate & Normalize**

Hệ thống xử lý từng dòng độc lập:

- Kiểm tra trường bắt buộc.
- Kiểm tra kiểu dữ liệu và định dạng.
- Chuẩn hóa giá trị theo các quy tắc được xác định.
- Đánh dấu các dòng có dữ liệu không hợp lệ.
- Phát hiện khả năng trùng lặp trong file và, nếu được CRM hỗ trợ, với dữ liệu hiện có.

Kết quả là mỗi dòng có trạng thái và danh sách lỗi riêng.

**Bước 4 — Review & Confirm**

Người dùng xem số lượng dòng hợp lệ, không hợp lệ và có khả năng trùng.

Người dùng xác nhận các bản ghi đủ điều kiện sẽ được gửi sang CRM. Các bản ghi không hợp lệ không được đưa vào execution.

Nếu hệ thống chưa thể xác định chắc chắn một bản ghi có trùng hay không, cần hiển thị đây là cảnh báo thay vì tự động khẳng định.

**Bước 5 — Execute**

Hệ thống thực thi theo từng bản ghi, ghi nhận trạng thái và kết quả của mỗi lần gửi dữ liệu.

Mỗi lần chạy có một định danh duy nhất. Các bản ghi trong cùng một lần chạy cần được theo dõi độc lập để khi xảy ra lỗi có thể xác định chính xác phạm vi ảnh hưởng.

**Bước 6 — Monitor & Recover**

Người dùng theo dõi tiến độ và trạng thái chạy. Với các bản ghi thất bại, hệ thống lưu thông tin lỗi đủ để xác định nguyên nhân.

Chức năng chạy lại chỉ áp dụng cho các bản ghi thất bại hoặc chưa được xác nhận là đã tạo thành công. Trước khi retry các trường hợp có kết quả không rõ ràng, hệ thống phải đối soát với CRM để tránh tạo trùng.

**Bước 7 — Report**

Sau khi hoàn thành, hệ thống hiển thị:

- Tổng số dòng đầu vào.
- Số dòng hợp lệ và không hợp lệ.
- Số bản ghi đã tạo thành công.
- Số bản ghi thất bại.
- Số bản ghi bị bỏ qua do trùng hoặc không được chọn.
- Thời gian thực thi.
- Chi tiết lỗi và kết quả theo từng bản ghi.

# 6. Quy tắc nghiệp vụ quan trọng

## 6.1. Trạng thái bản ghi

Mỗi dòng dữ liệu cần có trạng thái nghiệp vụ rõ ràng. Bộ trạng thái đề xuất:

- `PENDING`: Chưa thực thi.
- `INVALID`: Không vượt qua validation.
- `DUPLICATE`: Bị nhận diện là trùng theo quy tắc đã xác định.
- `SKIPPED`: Người dùng không chọn hoặc bản ghi được bỏ qua.
- `PROCESSING`: Đang thực thi.
- `SUCCEEDED`: CRM xác nhận tạo thành công.
- `FAILED`: Thực thi thất bại và đã xác định được kết quả.
- `UNKNOWN`: Chưa xác định được kết quả cuối cùng, chẳng hạn timeout sau khi gửi yêu cầu.

Không nên gộp `FAILED` và `UNKNOWN`. Trường hợp `UNKNOWN` đặc biệt quan trọng vì retry mù có thể tạo bản ghi trùng.

## 6.2. Nguyên tắc retry và chống trùng

- Retry không được tự động gửi lại toàn bộ lô dữ liệu.
- Mỗi bản ghi cần có định danh ổn định trong phạm vi run.
- Nếu CRM hỗ trợ idempotency key, sử dụng cơ chế đó khi phù hợp.
- Nếu không hỗ trợ, cần kiểm tra trạng thái bản ghi trên CRM trước khi gửi lại các yêu cầu có kết quả không rõ ràng.
- Không coi việc gửi request thành công là bằng chứng đủ để kết luận bản ghi đã được tạo; cần xác nhận từ phản hồi đáng tin cậy hoặc cơ chế đối soát.
- Chỉ retry tự động những lỗi được xác định là tạm thời và an toàn để retry.

## 6.3. Dữ liệu và bảo mật

- Không lưu mật khẩu CRM dạng plaintext.
- Không ghi token, mật khẩu hoặc dữ liệu nhạy cảm vào log.
- Chỉ lưu dữ liệu nguồn cần thiết cho việc thực thi và đối soát.
- Có chính sách lưu giữ và xóa file đầu vào.
- Giới hạn kích thước file, số dòng và loại file được hỗ trợ.
- Phân biệt lỗi nghiệp vụ, lỗi dữ liệu và lỗi hệ thống.
- Nếu triển khai cho nhiều người dùng, cần xác định quyền truy cập và phạm vi dữ liệu trước khi đưa vào sử dụng thực tế.

# 7. Đề xuất UI/UX

MVP nên có ít màn hình, mỗi màn hình phục vụ một nhiệm vụ rõ ràng.

## 7.1. Dashboard

Hiển thị các thông tin cơ bản:

- Các workflow khả dụng.
- Các lần chạy gần đây.
- Trạng thái lần chạy cuối.
- Tóm tắt kết quả xử lý.

Không cần xây dựng dashboard phân tích phức tạp.

## 7.2. Import Wizard

Một quy trình nhiều bước:

1. Upload file.
2. Preview và mapping.
3. Validate và review.
4. Confirm và execute.

Người dùng phải có khả năng quay lại bước mapping để chỉnh sửa trước khi xác nhận chạy.

## 7.3. Run Detail

Hiển thị thông tin một lần chạy:

- Run ID.
- Workflow.
- File nguồn.
- Thời điểm bắt đầu và kết thúc.
- Trạng thái tổng thể.
- Số bản ghi theo từng trạng thái.
- Bảng kết quả từng bản ghi.
- Chi tiết lỗi.
- Thao tác retry cho các bản ghi đủ điều kiện.

## 7.4. Workflow Configuration

Cho phép cấu hình tối thiểu:

- CRM đích.
- Các trường mapping mặc định.
- Quy tắc validation và duplicate detection có thể cấu hình trong phạm vi cho phép.
- Cấu hình kết nối được bảo vệ an toàn.

Trong MVP, cấu hình có thể được quản lý bằng giao diện đơn giản hoặc cấu hình triển khai có kiểm soát, tùy mức độ cần thiết. Không cần xây dựng một workflow builder tổng quát.

# 8. Kiến trúc kỹ thuật đề xuất

## 8.1. Technology stack

- **Frontend và backend:** Next.js, TypeScript.
- **ORM:** Prisma.
- **Database:** PostgreSQL.
- **Local development:** Docker Compose.
- **File processing:** Thư viện đọc Excel/CSV phù hợp với giới hạn dữ liệu.
- **CRM integration:** Ưu tiên API chính thức nếu có và đáp ứng yêu cầu nghiệp vụ.
- **Automation fallback:** Chỉ sử dụng browser automation nếu API không khả dụng hoặc không đáp ứng yêu cầu, sau khi đánh giá tính ổn định và điều khoản sử dụng của portal.

## 8.2. Các thành phần chính

1. **Web UI:** Upload file, mapping, review, theo dõi và xem lịch sử.
2. **Import Service:** Đọc file và chuyển đổi thành dữ liệu nội bộ.
3. **Validation Service:** Kiểm tra dữ liệu và phát hiện vấn đề.
4. **Workflow Runner:** Điều phối việc thực thi từng bản ghi.
5. **CRM Adapter:** Đóng gói các thao tác đặc thù của CRM đích.
6. **Run Tracking:** Lưu trạng thái, kết quả và lỗi.
7. **PostgreSQL:** Lưu workflow, cấu hình, lần chạy và trạng thái bản ghi.

Nên tách logic nghiệp vụ khỏi phần tích hợp CRM để có thể thay đổi cơ chế kết nối mà không phải viết lại validation, import và run tracking.

## 8.3. Nguyên tắc triển khai

- Ưu tiên xử lý theo lô nhỏ và tuần tự trong phiên bản đầu nếu tần suất sử dụng thấp.
- Mọi thao tác có tác động lên CRM phải có log kết quả.
- Trạng thái của run và trạng thái của từng bản ghi phải được quản lý riêng.
- Có thể tiếp tục theo dõi kết quả sau khi người dùng tải lại trang.
- Không phụ thuộc vào trạng thái chỉ lưu trong bộ nhớ của trình duyệt.
- Xử lý timeout, lỗi kết nối và gián đoạn tiến trình một cách tường minh.
- Không xây dựng hệ thống queue hoặc worker phân tán trước khi có nhu cầu được chứng minh.

Nếu thời gian xử lý dài hoặc cần thực thi nền, có thể bổ sung worker riêng trong cùng môi trường Docker. Việc này nên dựa trên thiết kế thực thi đã được kiểm chứng, không mặc định xây dựng kiến trúc phân tán ngay từ đầu.

# 9. Dữ liệu và schema tối thiểu

Các entity đề xuất:

| Entity | Mục đích |
|---|---|
| `Workflow` | Định nghĩa workflow khả dụng |
| `WorkflowConfig` | Cấu hình workflow và CRM đích |
| `ImportFile` | Metadata của file đầu vào |
| `WorkflowRun` | Một lần thực thi workflow |
| `RunRecord` | Một dòng dữ liệu trong một lần chạy |
| `IntegrationConnection` | Thông tin tham chiếu đến kết nối CRM |
| `RunEvent` | Các sự kiện quan trọng phục vụ theo dõi và audit |

## 9.1. Quan hệ chính

- Một `Workflow` có thể có nhiều `WorkflowRun`.
- Một `WorkflowRun` có một `ImportFile` và nhiều `RunRecord`.
- Một `RunRecord` lưu dữ liệu đã chuẩn hóa, trạng thái và lỗi liên quan.
- Một `WorkflowRun` có nhiều `RunEvent`.
- `WorkflowConfig` tham chiếu đến cấu hình tích hợp phù hợp.

## 9.2. Các trường quan trọng

**WorkflowRun**

- `id`
- `workflowId`
- `importFileId`
- `status`
- `totalRecords`
- `successCount`
- `failedCount`
- `invalidCount`
- `skippedCount`
- `startedAt`
- `finishedAt`
- `createdAt`

**RunRecord**

- `id`
- `runId`
- `sourceRowNumber`
- `sourceData`
- `normalizedData`
- `status`
- `targetRecordId`
- `errorCode`
- `errorMessage`
- `attemptCount`
- `processedAt`

Các trường JSON có thể sử dụng kiểu `Json` của Prisma để giữ dữ liệu linh hoạt trong MVP. Các trường thường xuyên truy vấn, lọc hoặc dùng cho ràng buộc nên được mô hình hóa rõ ràng thay vì đưa tất cả vào JSON.

Schema cuối cùng cần được điều chỉnh theo CRM đích, yêu cầu bảo mật và chiến lược lưu trữ file. Không nên lưu toàn bộ nội dung file vào PostgreSQL nếu metadata và lưu trữ file riêng đáp ứng tốt hơn yêu cầu.

# 10. Các Epic trong MVP

Các Epic dưới đây được sắp xếp theo dependency và thứ tự tạo ra giá trị. Chúng là đề xuất ban đầu, chưa phải cam kết về effort hoặc ngày phát hành.

## Epic 1 — Project Foundation & Runtime

**Mục tiêu:** Có nền tảng kỹ thuật tối thiểu để phát triển, chạy và kiểm thử ứng dụng ổn định.

Phạm vi:

- Khởi tạo Next.js và TypeScript.
- Thiết lập Prisma và PostgreSQL.
- Cấu hình Docker Compose.
- Quản lý environment variables.
- Thiết lập migration và seed dữ liệu phát triển.
- Chuẩn hóa cấu trúc module và xử lý lỗi.
- Thiết lập logging cơ bản.
- Thiết lập kiểm thử tự động tối thiểu.

**Acceptance criteria:**

- Developer có thể khởi chạy ứng dụng theo tài liệu.
- Database được khởi tạo từ migration.
- Ứng dụng kết nối PostgreSQL thành công.
- Lỗi cấu hình được phát hiện và thông báo rõ ràng.

## Epic 2 — Workflow Definition & Configuration

**Mục tiêu:** Quản lý workflow nhập leads và cấu hình cần thiết để thực thi.

Phạm vi:

- Tạo workflow Import Leads to CRM.
- Lưu metadata và cấu hình workflow.
- Quản lý cấu hình mapping.
- Định nghĩa trạng thái workflow/run/record.
- Thiết lập tham chiếu đến CRM connection.

**Acceptance criteria:**

- Có thể khởi tạo và truy xuất workflow từ database.
- Cấu hình mapping được lưu và sử dụng lại.
- Trạng thái workflow được định nghĩa nhất quán trong backend.

## Epic 3 — File Upload & Data Ingestion

**Mục tiêu:** Đưa dữ liệu Excel/CSV vào hệ thống theo cách an toàn và có thể kiểm soát.

Phạm vi:

- Upload file.
- Kiểm tra định dạng, kích thước và giới hạn dòng.
- Đọc header và dữ liệu mẫu.
- Xử lý dòng rỗng và lỗi parse.
- Lưu metadata của file.
- Hiển thị lỗi đầu vào dễ hiểu.

**Acceptance criteria:**

- File hợp lệ được đọc và hiển thị preview.
- File sai định dạng bị từ chối.
- Lỗi parse được xác định rõ.
- Không tạo run thực thi CRM khi file chưa được xử lý hợp lệ.

## Epic 4 — Field Mapping, Validation & Duplicate Detection

**Mục tiêu:** Bảo đảm dữ liệu được ánh xạ và kiểm tra trước khi thực thi.

Phạm vi:

- Mapping cột nguồn sang trường CRM.
- Validation theo quy tắc.
- Chuẩn hóa dữ liệu.
- Phát hiện trùng trong file.
- Phát hiện trùng trên CRM nếu có cơ chế truy vấn phù hợp.
- Hiển thị lỗi và cảnh báo theo từng dòng.
- Cho phép người dùng xác nhận tập bản ghi đủ điều kiện.

**Acceptance criteria:**

- Mỗi dòng có trạng thái validation rõ ràng.
- Dữ liệu không hợp lệ không được gửi sang CRM.
- Người dùng nhìn thấy lỗi cụ thể và có thể sửa mapping trước khi chạy.
- Cảnh báo trùng được phân biệt với lỗi validation.

## Epic 5 — CRM Integration Adapter

**Mục tiêu:** Thiết lập kết nối đáng tin cậy với một CRM đích.

Phạm vi:

- Chọn CRM và xác nhận phương thức tích hợp.
- Cấu hình xác thực.
- Kiểm tra kết nối.
- Chuyển dữ liệu nội bộ sang schema CRM.
- Tạo lead qua API hoặc cơ chế automation được lựa chọn.
- Chuẩn hóa phản hồi thành công và lỗi.
- Bảo vệ thông tin xác thực.

**Acceptance criteria:**

- Có thể kiểm tra kết nối trước khi chạy.
- Có thể tạo một lead thử nghiệm theo quy trình được kiểm soát.
- Phản hồi CRM được chuyển thành kết quả nội bộ nhất quán.
- Thông tin xác thực không bị lộ trong log hoặc giao diện.

## Epic 6 — Workflow Execution & Run Tracking

**Mục tiêu:** Thực thi workflow theo từng bản ghi và lưu lại kết quả.

Phạm vi:

- Tạo run sau khi người dùng xác nhận.
- Thực thi tập bản ghi được chọn.
- Theo dõi trạng thái từng bản ghi.
- Cập nhật trạng thái run.
- Xử lý timeout và lỗi kết nối.
- Lưu target record ID khi có.
- Tính toán kết quả tổng hợp.

**Acceptance criteria:**

- Mỗi lần chạy có một `WorkflowRun` riêng.
- Kết quả từng bản ghi được lưu bền vững.
- Trạng thái tổng thể phản ánh chính xác kết quả từng bản ghi.
- Khi người dùng tải lại trang, trạng thái run vẫn được truy xuất.
- Run không được đánh dấu thành công hoàn toàn nếu vẫn còn bản ghi thất bại hoặc chưa xác định kết quả.

## Epic 7 — Execution Monitoring, Error Handling & Retry

**Mục tiêu:** Cho phép người dùng hiểu lỗi và khôi phục các bản ghi có thể xử lý lại.

Phạm vi:

- Trang chi tiết run.
- Hiển thị tiến độ và kết quả.
- Phân loại lỗi.
- Lưu attempt count.
- Retry bản ghi thất bại đủ điều kiện.
- Đối soát các bản ghi có kết quả chưa xác định.
- Ngăn retry trùng lặp trong phạm vi được hỗ trợ.

**Acceptance criteria:**

- Người dùng xác định được bản ghi nào thất bại và lý do.
- Retry chỉ tác động đến tập bản ghi được chọn và đủ điều kiện.
- Không retry mù các bản ghi có trạng thái `UNKNOWN`.
- Lịch sử attempt được ghi nhận.

## Epic 8 — Import Wizard & Operational UI

**Mục tiêu:** Kết nối các chức năng backend thành một quy trình có thể sử dụng thực tế.

Phạm vi:

- Dashboard tối giản.
- Import wizard.
- Preview và mapping UI.
- Validation result UI.
- Confirmation UI.
- Execution progress UI.
- Run detail UI.
- Trạng thái loading, empty và error.

**Acceptance criteria:**

- Người dùng hoàn thành workflow mà không cần thao tác trực tiếp với database.
- Các bước và trạng thái được thể hiện nhất quán.
- Không cho phép bắt đầu thực thi khi dữ liệu chưa được xác nhận.
- Lỗi có hướng xử lý rõ ràng.

Epic này có thể phát triển song song với backend khi API contract đã được thống nhất.

## Epic 9 — Run History, Reporting & Audit

**Mục tiêu:** Cung cấp khả năng đối soát và đánh giá hiệu quả workflow.

Phạm vi:

- Danh sách lịch sử run.
- Lọc theo trạng thái và thời gian.
- Xem kết quả từng run.
- Thống kê kết quả theo trạng thái.
- Ghi lại các sự kiện quan trọng.
- Xuất báo cáo kết quả nếu cần thiết cho quy trình vận hành.

**Acceptance criteria:**

- Người dùng có thể tìm và mở lại một run đã hoàn tất.
- Số liệu báo cáo khớp với kết quả từng bản ghi.
- Lịch sử đủ thông tin để xác định run nào đã xử lý dữ liệu và kết quả ra sao.

## Epic 10 — Security, Reliability & MVP Acceptance

**Mục tiêu:** Đảm bảo MVP đủ an toàn và đáng tin cậy để chạy thử với dữ liệu nghiệp vụ thực tế có kiểm soát.

Phạm vi:

- Quản lý secret và credentials.
- Giới hạn file và dữ liệu đầu vào.
- Kiểm tra quyền truy cập theo mô hình người dùng được chọn.
- Xử lý lỗi bất thường.
- Kiểm thử luồng end-to-end.
- Kiểm thử các tình huống retry và kết quả không xác định.
- Hướng dẫn cài đặt và vận hành.
- Thử nghiệm với dữ liệu mẫu và một lô dữ liệu thực tế được phê duyệt.

**Acceptance criteria:**

- Không lộ credentials trong log.
- Không tạo dữ liệu CRM ngoài phạm vi người dùng xác nhận.
- Có khả năng truy vết từ run đến từng bản ghi.
- Các trường hợp lỗi chính được kiểm thử.
- Có checklist go/no-go trước khi đưa vào pilot.

# 11. Thứ tự triển khai đề xuất

Để giảm rủi ro tích hợp, nên triển khai theo các milestone sau.

| Milestone | Epic chính | Kết quả |
|---|---|---|
| M1 — Foundation | 1, 2 | Ứng dụng và mô hình dữ liệu cơ bản hoạt động |
| M2 — Data Pipeline | 3, 4 | Upload, mapping, validation và review chạy được với dữ liệu mẫu |
| M3 — CRM Proof of Integration | 5 | Tạo được lead thử nghiệm trên CRM đích |
| M4 — Execution Core | 6, 7 | Chạy theo bản ghi, theo dõi kết quả và retry có kiểm soát |
| M5 — Usable MVP | 8, 9 | Người dùng thực hiện toàn bộ quy trình và xem lịch sử |
| M6 — Pilot Readiness | 10 | Hoàn tất kiểm thử và chạy pilot có kiểm soát |

Một nguyên tắc quan trọng là **không chờ hoàn thành toàn bộ UI mới kiểm tra khả năng tích hợp CRM**. Việc chứng minh sớm rằng hệ thống có thể tạo lead trên CRM thực tế là một cổng quyết định quan trọng của dự án.

# 12. Tiêu chí đánh giá thành công

MVP cần được đánh giá bằng kết quả nghiệp vụ và độ tin cậy, không chỉ bằng số lượng chức năng hoàn thành.

## 12.1. Chỉ số nghiệp vụ

- Thời gian xử lý một lô dữ liệu so với cách làm hiện tại.
- Thời gian người dùng phải trực tiếp thao tác.
- Tỷ lệ bản ghi hợp lệ được tạo thành công.
- Tỷ lệ lỗi dữ liệu được phát hiện trước khi gửi sang CRM.
- Số trường hợp phải xử lý lại thủ công.
- Tỷ lệ bản ghi trùng phát sinh sau khi chạy.

## 12.2. Chỉ số kỹ thuật

- Tỷ lệ run kết thúc với trạng thái xác định.
- Tỷ lệ bản ghi có kết quả được ghi nhận đầy đủ.
- Tỷ lệ retry thành công đối với các lỗi tạm thời phù hợp.
- Số trường hợp tạo trùng do retry.
- Khả năng phục hồi trạng thái sau khi ứng dụng bị gián đoạn.

## 12.3. Định nghĩa thành công ban đầu

Trước pilot, cần đo baseline của quy trình thủ công. Sau đó xác định mục tiêu định lượng cho thời gian xử lý, tỷ lệ thành công và mức độ chấp nhận của người dùng.

Các mục tiêu cụ thể không nên được đặt tùy ý trước khi biết kích thước file, API CRM, chất lượng dữ liệu và quy trình hiện tại.

# 13. Rủi ro và quyết định cần chốt

| Rủi ro / câu hỏi | Hướng xử lý |
|---|---|
| Chưa biết CRM đích | Chọn CRM thực tế trước khi thiết kế adapter chi tiết |
| API có thể bị giới hạn | Kiểm tra quyền, rate limit, cơ chế xác thực và khả năng truy vấn dữ liệu |
| Dữ liệu đầu vào không đồng nhất | Chốt schema chuẩn và bộ quy tắc validation |
| Bản ghi trùng | Xác định khóa nghiệp vụ và chiến lược duplicate detection |
| Timeout khi tạo lead | Hỗ trợ trạng thái `UNKNOWN` và đối soát trước retry |
| Portal thay đổi giao diện | Ưu tiên API; nếu dùng browser automation, cần kiểm thử độ ổn định |
| Dữ liệu khách hàng nhạy cảm | Hạn chế log, kiểm soát quyền truy cập và thời hạn lưu trữ |
| Tần suất chạy thấp | Tránh kiến trúc phân tán hoặc scheduling phức tạp khi chưa cần |

Các quyết định cần được chốt trước khi hoàn thiện backlog kỹ thuật:

1. CRM đích cụ thể và môi trường thử nghiệm.
2. API chính thức hay browser automation.
3. Bộ trường dữ liệu lead chuẩn.
4. Quy tắc nhận diện trùng.
5. Quy mô file mục tiêu và giới hạn dữ liệu.
6. Mô hình người dùng và xác thực trong MVP.
7. Chính sách lưu file, dữ liệu nguồn và log.

# 14. Definition of Done cho MVP

MVP được xem là hoàn thành khi đáp ứng đồng thời các điều kiện:

- Có thể triển khai bằng stack đã chọn và chạy trong môi trường Docker.
- Người dùng tải lên được file Excel/CSV thuộc phạm vi hỗ trợ.
- Người dùng xem trước, mapping và kiểm tra dữ liệu.
- Dữ liệu lỗi được phát hiện trước khi thực thi.
- Người dùng xác nhận rõ ràng trước khi tạo lead trên CRM.
- Workflow tạo lead trên CRM đích đã chọn.
- Kết quả từng bản ghi được lưu và truy xuất.
- Người dùng xem được tiến độ, lịch sử và báo cáo.
- Retry có kiểm soát, không gửi lại mù các bản ghi chưa xác định kết quả.
- Có kiểm thử end-to-end cho luồng thành công và các trường hợp lỗi quan trọng.
- Có tài liệu cấu hình, vận hành và hướng dẫn xử lý lỗi.
- Pilot cho thấy lợi ích nghiệp vụ có thể đo lường so với baseline.

# 15. Kết luận

Portal Automation MVP nên được xây dựng như một **ứng dụng thực thi workflow nghiệp vụ có kiểm soát**, bắt đầu từ một bài toán duy nhất: đưa leads từ Excel/CSV vào CRM.

Giá trị cốt lõi không nằm ở việc tự động hóa được nhiều thao tác nhất, mà ở việc tạo ra một quy trình có thể kiểm soát từ đầu đến cuối:

**Import → Validate → Review → Execute → Monitor → Reconcile.**

Nếu workflow đầu tiên chứng minh được hiệu quả, khả năng phục hồi và độ tin cậy, các phiên bản tiếp theo mới nên mở rộng sang workflow khác, portal khác, scheduling hoặc cơ chế automation tổng quát hơn.

MVP nên tối ưu cho một quy trình hoàn chỉnh và đáng tin cậy, không tối ưu cho số lượng tính năng.
