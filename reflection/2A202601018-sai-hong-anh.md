# Reflection cá nhân

## Thông tin

- **Mã học viên:** 2A202601018
- **Họ và tên:** Sái Hồng Anh
- **Dự án:** SlideMind AI

## Phần công việc của tôi

Trong dự án SlideMind AI, tôi phụ trách chính phần frontend và tích hợp hệ thống. Các công việc gồm xây dựng giao diện tải file PDF/PPTX, màn hình cấu hình, khu vực hiển thị kết quả tóm tắt và chức năng hỏi đáp theo nội dung bài giảng. Tôi cũng tham gia kết nối frontend với backend, chạy thử luồng hoàn chỉnh và kiểm tra các lỗi phát sinh khi khởi động dự án.

## Khó khăn gặp phải

Khó khăn lớn nhất là bảo đảm frontend và backend hoạt động ổn định cùng lúc. Trong quá trình thực hiện, nhóm gặp lỗi cài dependency, tiến trình cũ chiếm port và kết nối tới Gemini API đôi lúc trả về lỗi mạng `fetch failed`. Ngoài ra, việc xử lý file PDF/PPTX có nhiều dạng nội dung như văn bản, bảng, biểu đồ hoặc ảnh scan cũng làm cho chất lượng tóm tắt chưa đồng đều.

## Cách tôi xử lý

Tôi kiểm tra log của frontend và backend, xác nhận các port đang được sử dụng, dừng đúng tiến trình cũ và chạy lại từng thành phần riêng biệt. Khi tích hợp AI, tôi kiểm tra trạng thái provider, cấu hình biến môi trường và cách hiển thị lỗi trên giao diện để người dùng hiểu vấn đề thay vì chỉ nhận thông báo chung chung. Tôi cũng phối hợp với các thành viên để kiểm tra lại luồng tải file, tạo tóm tắt và hỏi đáp.

## Điều tôi học được

Qua dự án, tôi hiểu rằng một sản phẩm AI không chỉ cần tạo ra câu trả lời mà còn phải giúp người dùng kiểm chứng và xử lý được khi AI sai. Giao diện cần hiển thị trạng thái rõ ràng, thông báo khi thiếu dữ liệu và không được làm người dùng tin vào một câu trả lời không có căn cứ. Tôi cũng học được cách tích hợp frontend–backend, đọc log, xử lý lỗi môi trường và bảo vệ API key bằng biến môi trường thay vì đưa thông tin bí mật vào mã nguồn hoặc giao diện.

## Nếu có thêm thời gian

Tôi muốn cải thiện giao diện tóm tắt để người dùng dễ đối chiếu với từng trang/slide, bổ sung OCR cho PDF scan và xử lý tốt hơn các bảng hoặc hình ảnh trong PPTX. Tôi cũng muốn hoàn thiện trạng thái loading, thông báo lỗi, lịch sử tóm tắt và kiểm thử với nhiều người dùng hơn để đánh giá mức độ hữu ích thực tế của sản phẩm.

## Tự đánh giá

Tôi đã hoàn thành phần công việc được phân công và chủ động tham gia kiểm tra luồng sản phẩm. Kết quả hiện tại đáp ứng được chức năng chính, nhưng độ ổn định của kết nối AI và chất lượng xử lý một số loại tài liệu vẫn cần được cải thiện. Trải nghiệm này giúp tôi hiểu rõ hơn cách phát triển một prototype AI có phạm vi vừa đủ, có thể demo và có cơ sở để tiếp tục hoàn thiện.
