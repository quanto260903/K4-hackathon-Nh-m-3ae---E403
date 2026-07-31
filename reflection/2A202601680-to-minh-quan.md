# Reflection cá nhân — Tô Minh Quân (2A202601680)

## Vai trò

Phụ trách backend và tích hợp AI cho SlideMind AI: trích xuất PDF/PPTX, API tóm tắt và hỏi đáp, tích hợp Gemini (kèm fallback Anthropic/OpenAI), route `/api/health`, và xử lý lỗi ở tầng provider.

## Phần mình làm

- `backend/src/services/pdfExtractor.ts` và `pptxExtractor.ts` — trích xuất text thật từ file người dùng tải lên, không dùng dữ liệu giả trừ khi extraction thất bại.
- `backend/src/services/summarizer.ts` và `chatAssistant.ts` — ghép prompt, gọi AI thật (Gemini là provider mặc định qua `AI_PROVIDER=auto`), parse kết quả về đúng shape frontend cần.
- `backend/src/routes/health.ts` — cho biết provider nào đang active và có API key hay không, để frontend khoá tính năng Chat đúng lúc thay vì để user bấm rồi mới lỗi 503 (nguyên tắc G1 trong spec.md §4b).
- Gần nhất: `backend/src/services/textQuality.ts` — thêm bước phát hiện văn bản trích xuất bị lỗi phông chữ (mojibake), gắn cảnh báo vào response `/api/extract` và hiển thị banner ở `ResultsScreen.tsx` thay vì âm thầm tóm tắt sai.

## AI hỗ trợ thế nào

Dùng Claude Code trong suốt quá trình build, nhưng theo kiểu **augment có kiểm soát**, không phải giao hết:

- Với phần lặp lại (route Express, parse XML của PPTX, mapping type), để AI viết nháp đầu rồi mình đọc lại từng dòng trước khi giữ — vì đây là phần dễ AI viết đúng cú pháp nhưng sai giả định domain (ví dụ AI ban đầu định OCR ảnh trong PDF scan, ngoài phạm vi đã chốt ở spec.md).
- Với phần quyết định (ví dụ ngưỡng nào coi là "lỗi phông chữ", có nên tự động fallback demo hay chỉ cảnh báo), mình giữ quyết định — AI đề xuất cách tiếp cận (đếm tỉ lệ ký tự thuộc vùng Private Use Area / ký tự điều khiển trong text trích xuất), mình chọn cách chỉ cảnh báo (không tự fallback) vì fallback im lặng từng là đúng cái gây ra case fail bên dưới.
- Luôn chạy thử qua UI thật (demo mode + `curl /api/health`) trước khi tin code AI viết chạy đúng, không chỉ tin vào việc code build/type-check qua.

## Bài học từ case fail của nhóm

Case fail cụ thể: rủi ro #2 đã ghi trong `spec.md §5` — khi PPTX/PDF trích xuất lỗi hoặc rỗng, backend fallback êm về `demoData` và trả về field `warning`, nhưng **frontend chưa từng hiển thị field này ở đâu cả**. Nghĩa là nếu một học viên tải slide tiếng Việt dùng font legacy (VNI/TCVN3 — khá phổ biến với slide cũ) và bị lỗi trích xuất, họ sẽ nhận một bản tóm tắt trông rất tự tin nhưng thực ra là dữ liệu mẫu về AI đại cương, không liên quan gì đến bài giảng họ tải lên — mà không có cách nào biết được.

Bài học lớn nhất: **tự động fallback không kèm cảnh báo hiển thị là lỗi nguy hiểm hơn không có fallback**, vì nó tạo cảm giác tin cậy giả (false confidence) — đúng loại lỗi mà nhóm đã tự đặt làm nguyên tắc thiết kế (G10 — thu hẹp phạm vi khi nghi ngờ) nhưng lại bỏ sót ngay ở chính luồng upload, không phải ở luồng chat. Đã sửa bằng cách thêm `hasGarbledText()` để phát hiện chủ động (không chỉ dựa vào extraction throw lỗi) và nối `warning` xuyên suốt `ProcessingScreen → App → ResultsScreen` thành banner người dùng thực sự thấy được. Việc còn thiếu, tự nhận trước khi nộp: chưa test tay với một file PDF tiếng Việt font lỗi thật (chỉ mới verify bằng type-check + review logic), nên chưa chắc ngưỡng 2% đã đúng — cần một file thật trong `eval/` để xác nhận trước CP5.
