# SlideMind AI

> **Đọc slide, nắm bài nhanh** — Công cụ tóm tắt bài giảng thông minh bằng AI

## Vấn đề

Sinh viên thường mất nhiều thời gian đọc lại toàn bộ slide sau buổi học. SlideMind AI giải quyết vấn đề này bằng cách tự động phân tích slide PDF/PPTX và tạo ra bản tóm tắt có cấu trúc, từ khóa quan trọng và câu hỏi ôn tập — trong vài giây.

## Tính năng

- **Tải lên slide**: Hỗ trợ PDF và PPTX (tối đa 20MB)
- **Tóm tắt toàn bài**: Tổng quan nội dung bài giảng 3-4 đoạn
- **Tóm tắt từng slide**: Chi tiết từng trang trình bày với các điểm chính
- **Từ khóa quan trọng**: Thuật ngữ và định nghĩa với trích dẫn slide nguồn
- **Câu hỏi ôn tập**: 5 câu hỏi để kiểm tra kiến thức
- **Xuất Markdown**: Sao chép hoặc tải xuống kết quả
- **Chế độ demo**: Hoạt động 100% không cần API key
- **Hỗ trợ Claude AI**: Khi có ANTHROPIC_API_KEY, dùng Claude claude-sonnet-4-6 cho kết quả thực

## Công nghệ

| Lớp | Công nghệ |
|-----|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| PDF | pdf-parse |
| PPTX | JSZip + XML parsing |
| AI | Anthropic Claude claude-sonnet-4-6 |

## Cài đặt

### Yêu cầu
- Node.js 18+
- npm 9+

### 1. Clone dự án

```bash
git clone <repo-url>
cd SlideMind
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ template:
```bash
cp .env.example .env
```

Chỉnh sửa `.env` (tuỳ chọn - để trống ANTHROPIC_API_KEY để dùng chế độ demo):
```env
PORT=3001
ANTHROPIC_API_KEY=
FRONTEND_URL=http://localhost:5173
```

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

## Chạy ứng dụng

### Chạy Backend

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3001`

### Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## Chế độ Demo

SlideMind AI hoạt động **hoàn toàn không cần API key** nhờ chế độ demo:

1. Mở `http://localhost:5173`
2. Nhấn **"Dùng bài giảng mẫu"** (không cần tải file)
3. Chọn tùy chỉnh và nhấn **"Bắt đầu tóm tắt"**
4. Xem kết quả demo về bài giảng "Nhập môn Trí tuệ Nhân tạo" (9 slides)

Hoặc tải file PDF/PPTX thực tế — nếu không có API key, hệ thống sẽ tự động dùng dữ liệu tóm tắt mẫu.

## Cài đặt Claude AI (tùy chọn)

Để nhận tóm tắt thực từ AI thay vì dữ liệu mẫu:

1. Đăng ký tại [console.anthropic.com](https://console.anthropic.com/)
2. Tạo API key
3. Thêm vào `backend/.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```
4. Khởi động lại backend

Kiểm tra trạng thái API: `GET http://localhost:3001/api/health`

## Script Demo CP2 (1 phút)

1. **[0:00]** Mở `http://localhost:5173` — giới thiệu "SlideMind AI - Đọc slide, nắm bài nhanh"
2. **[0:10]** Nhấn "Dùng bài giảng mẫu" — giải thích không cần API key
3. **[0:20]** Chọn "Chi tiết" + bật tất cả checkbox → "Bắt đầu tóm tắt"
4. **[0:30]** Xem 4 bước xử lý animation
5. **[0:40]** Kết quả: Tóm tắt toàn bài → Chủ đề → Từng slide → Từ khóa → Câu hỏi
6. **[0:50]** Nhấn "Tải Markdown" để tải file `.md`
7. **[1:00]** Nhấn "Tóm tắt lại" để demo thay đổi cài đặt

## CP2 vs CP3 So sánh

| Tính năng | CP2 (hiện tại) | CP3 (kế hoạch) |
|-----------|----------------|-----------------|
| Demo mode | Có | Có |
| Claude AI | Có (với key) | Có (nâng cao) |
| PDF extraction | Có | Cải tiến |
| PPTX extraction | Có | Cải tiến |
| Export | Markdown | PDF + DOCX |
| Lịch sử | Không | Có (localStorage) |
| Chia sẻ | Không | Link chia sẻ |
| Đa ngôn ngữ | VI + EN | Thêm ngôn ngữ |

## Giới hạn hiện tại

- File PPTX phức tạp với hình ảnh embedded có thể mất một số text
- PDF scan (ảnh) không đọc được text (cần OCR)
- Demo mode không phản ánh nội dung thực của file tải lên
- Không lưu lịch sử tóm tắt
- Tối đa 20MB file

## Cấu trúc dự án

```
SlideMind/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express app
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # PDF, PPTX, AI logic
│   │   ├── data/             # Demo data
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main app + state
│   │   ├── screens/          # 4 màn hình chính
│   │   ├── components/       # Reusable components
│   │   ├── utils/            # API, export, formatters
│   │   ├── data/             # Frontend demo data
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── .env.example
```

---

*Được xây dựng cho Batch03-K4 AI Product Hackathon*
