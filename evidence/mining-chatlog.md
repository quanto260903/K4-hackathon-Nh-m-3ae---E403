# Mining chatlog — bằng chứng cho spec.md §1-§2

Nguồn: `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv` (1.261 tin nhắn học viên, 585 hội thoại, 369 user, 22/07-29/07/2026). Đọc `DATA_DICTIONARY.md` trước khi chạy lại.

## Phương pháp

1. Lọc `role == student`.
2. Với mỗi `content`, tách phần **câu lệnh/câu hỏi học viên thực sự gõ** ra khỏi đoạn slide trích dẫn kèm theo — format chuẩn của VLearn là `(Trang N, đoạn được chọn: "...")\n<câu hỏi thật>`. Chỉ so khớp từ khoá trên phần sau dấu `")\n`, KHÔNG so trên đoạn slide trích dẫn (bản nháp đầu tiên đã đếm nhầm từ khoá xuất hiện trong đoạn slide chứ không phải trong câu hỏi — ví dụ tin `M2023` bị đếm nhầm vào nhóm "tóm tắt" vì đoạn slide trích dẫn có chữ "tóm tắt phần cũ" trong khi câu hỏi thật chỉ là "Giải thích đoạn bôi đen ở Trang 22" — đã sửa và chạy lại).
3. Regex theo nhóm, không phân biệt hoa/thường, so trên phần câu hỏi đã tách:
   - **Core (tóm tắt / khái niệm / thuật ngữ / ôn lại):** `tóm tắt|recap|ôn (lại|tập)|khái niệm|thuật ngữ|là gì|quên (các|những)? câu`
   - **Giải thích đoạn bôi đen (existing feature):** `giải thích (đoạn|phần)`
   - **Quiz / câu hỏi ôn tập:** `quiz|câu hỏi ôn`
   - **Ví dụ:** `ví dụ`
   - **Bài tập:** `bài tập|exercise`
   - **Dịch:** `dịch|translate`
4. Đếm số tin nhắn khớp, số hội thoại (`conversation_id`) và số user (`user_id`) duy nhất bị chạm.

Không phải NLP/phân loại ý định đầy đủ — đây là quét từ khoá, có thể còn sót một số case diễn đạt khác cách hoặc còn vài false positive hiếm. Đã spot-check thủ công các match nhóm "quên" (2 case) và các ví dụ đầu của mỗi nhóm để xác nhận đúng ý định trước khi đưa số liệu vào spec.md.

## Kết quả

| Nhóm | Số tin nhắn | % / 1.261 | Hội thoại chạm | User chạm |
|---|---:|---:|---:|---:|
| **Core — tóm tắt/khái niệm/thuật ngữ/ôn lại** | 244 | 19,3% | 194/585 | 151/369 |
| Giải thích đoạn bôi đen (đã có sẵn ở VLearn) | 363 | 28,8% | 207/585 | 160/369 |
| Ví dụ minh hoạ | 38 | 3,0% | 32/585 | 27/369 |
| Quiz / câu hỏi ôn tập | 4 | 0,3% | 3/585 | 3/369 |
| Bài tập | 4 | 0,3% | 3/585 | 3/369 |
| Dịch | 9 | 0,7% | 9/585 | 8/369 |

Trong nhóm Core: 54/151 user lặp lại hành vi này ≥2 lần trong 8 ngày dữ liệu (không phải hỏi một lần rồi thôi); user hỏi nhiều nhất có 8 tin nhắn thuộc nhóm này.

**Giới hạn quan trọng:** `conversation_mode` trong file này 100% là `in_class` (theo `DATA_DICTIONARY.md`) — toàn bộ số liệu trên là hành vi **trong lúc học**, chưa trực tiếp đo được hành vi **sau buổi học** (đúng thời điểm JTBD của SlideMind nhắm tới). Coi đây là bằng chứng nhu cầu tồn tại + tần suất, không phải bằng chứng đã đo đúng thời điểm — cần khảo sát đường A để xác nhận nếu có thời gian trước CP5.

## Ví dụ nguyên văn (nhóm Core)

| Mã tin nhắn / hội thoại | Câu hỏi thật (đã tách khỏi đoạn slide trích dẫn) |
|---|---|
| `M0332/C0018` | "tóm tắt toàn bộ slide sau đó đưa ra các ý chính" |
| `M2504/C0020` | "tóm tắt hết slice trong vài câu đi" |
| `M2134/C0031` | "tóm tắt các chủ đề chính của slide day05-lecture-slides-batch03.pdf này" |
| `M2104/C0469` | "hãy bắt đầu cuộc trò chuyện mới quên các câu hỏi cũ của tôi đi, hãy tóm tắt lại những ý quan trọng trong tài liệu" |
| `M1739/C0015` | "Designt Pattern ReAct là gì có lưu ý gì về nó?" |
| `M1612/C0033` | "agent la gi" |
| `M0196/C0043` | "Giải thích đoạn bôi đen ở Trang 8: [...]. Loop ở đây là gì" |

## Cách tái chạy

```
python evidence/mine_chatlog.py
```

Chạy từ thư mục gốc repo, chỉ dùng thư viện chuẩn Python (`csv`, `re`). Script tại `evidence/mine_chatlog.py` — output khớp đúng bảng số liệu ở trên (đã verify lại trước khi đưa vào `spec.md`).
