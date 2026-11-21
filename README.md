# TomTalk Phòng Tập Nói

Website luyện kỹ năng thuyết trình và hùng biện của **TomTalk**, chia theo 4 cấp: Tiểu học, THCS, THPT và Đi làm.

> Your voice speaks volumes.

## Tính năng

- **Lộ trình kỹ năng**: 30 bài học chia 4 chặng (Vững tâm lý, Giọng nói & hình thể, Xây nội dung, Giao tiếp & ứng biến). Mỗi bài có các bước thực hành và một bài "Thử ngay".
- **Phòng thu**: vòng quay chủ đề, giờ chuẩn bị ngắn, giờ nói giới hạn, đèn ON AIR, tự chấm theo 5 tiêu chí và lịch sử luyện tập.
- **Thẻ ứng xử**: 48 câu hỏi tình huống, giao tiếp và phỏng vấn dạng thẻ lật có gợi ý trả lời.
- **Nghề gì cần gì**: 14 nghề, trắc nghiệm kiểu giao tiếp và trò chơi đoán nghề.
- **Động lực luyện tập**: XP, cấp bậc, chuỗi ngày luyện và 7 huy hiệu.

Website là trang tĩnh, không cần máy chủ hay cơ sở dữ liệu. Tiến độ của người học được lưu bằng `localStorage` trên trình duyệt của chính họ.

## Cấu trúc thư mục

```
tomtalk-phong-tap-noi/
├── index.html            # Khung trang
├── assets/
│   ├── css/style.css     # Giao diện (màu, chữ, bố cục, chế độ sáng/tối)
│   └── js/
│       ├── data.js       # NỘI DUNG: bài học, chủ đề, câu hỏi, nghề nghiệp
│       └── app.js        # Logic: điều hướng, đồng hồ, vòng quay, XP, huy hiệu
├── .nojekyll
├── LICENSE
└── README.md
```

## Chạy thử trên máy

Mở trực tiếp file `index.html` bằng trình duyệt, hoặc chạy một máy chủ tĩnh:

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## Đưa lên GitHub và GitHub Pages

```bash
cd tomtalk-phong-tap-noi
git init
git add .
git commit -m "TomTalk Phòng Tập Nói: phiên bản đầu tiên"
git branch -M main
git remote add origin https://github.com/<tên-tài-khoản>/tomtalk-phong-tap-noi.git
git push -u origin main
```

Sau đó trên GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, chọn nhánh `main`, thư mục `/ (root)`, bấm **Save**. Sau 1–2 phút, website sẽ có tại:

```
https://<tên-tài-khoản>.github.io/tomtalk-phong-tap-noi/
```

Muốn dùng tên miền riêng (ví dụ `luyennoi.tomtalk.vn`): thêm file `CNAME` chứa tên miền đó, rồi trỏ bản ghi DNS `CNAME` về `<tên-tài-khoản>.github.io`.

## Sửa nội dung

Mọi nội dung nằm trong `assets/js/data.js`:

| Muốn sửa | Biến |
|---|---|
| Bài học kỹ năng | `TIPS` (trường `lv` quyết định bài hiện ở cấp nào) |
| Chủ đề vòng quay | `TOPICS.th`, `TOPICS.thcs`, `TOPICS.thpt`, `TOPICS.dl` |
| Chế độ luyện, thời gian | `MODES` (`prep`, `speak` tính bằng giây) |
| Góc nhìn khi bốc góc | `ANGLES` |
| Câu hỏi ứng xử | `QS` (`[cấp, loại, câu hỏi, [gợi ý]]`) |
| Nghề nghiệp | `CAREERS` (`r` là mức độ 1–5: giao tiếp 1-1, nhóm, công chúng) |

Lời chào trên hero, 4 chặng lộ trình, cấp bậc và huy hiệu nằm ở đầu `assets/js/app.js` (`HERO`, `MODULES`, `RANKS`, `BADGES`).

## Nguồn nội dung

Nội dung được soạn từ tài liệu giảng dạy của TomTalk: GREENFIELD TALKS (*Từ trái tim đến sân khấu TED*), workshop ELOQUENTIA (*Brainstorm like a champ*), workshop *Communicate to Influence*, chuyên đề *Ứng xử có văn minh, văn hoá*, HIC’26 (*Giải mã thế giới nghề nghiệp*) và đề án trại hè *Gen Z On Air*.

## Liên hệ

TomTalk – Trung tâm Rèn luyện Kỹ năng và Phát triển Bản thân
Tầng 5, Số 03 TT1A, 622 Minh Khai, Hai Bà Trưng, Hà Nội · 096 943 7868 · trungtamtomtalk@gmail.com
