# Kết quả kiểm tra bản dựng

- `npm run build`: tạo 15 trang có thể lập chỉ mục và trang 404.
- `npm run check`: đạt 489 kiểm tra, kiểm tra 532 tham chiếu tài nguyên nội bộ; canonical, sitemap, ảnh, schema và fragment không lỗi.
- `npm run test:browser`: đạt các kịch bản desktop 1440px và mobile 390px, menu, bộ lọc/tìm kiếm, biểu mẫu nháp, sao chép, theme, reduced motion và đọc trang khi tắt JavaScript. Không có lỗi JavaScript; các route chính không có lỗi axe mức nghiêm trọng.
- Bản dựng thử biệt lập với tên miền gốc và thông tin liên hệ đã điền: số có khoảng trắng được chuẩn hóa, liên kết điện thoại/Zalo/email đúng, mã xác minh Search Console xuất hiện. Dữ liệu liên hệ thật của dự án vẫn để trống.
- `git diff --check` và kiểm tra cú pháp JavaScript: đạt.

## Lighthouse

| Hạng mục | Điểm |
|---|---:|
| Hiệu năng | 96 |
| Khả năng truy cập | 100 |
| Best Practices | 100 |
| SEO kỹ thuật | 100 |

Đo bằng Lighthouse trên Chromium, mô phỏng mobile, ở bản xem thử cục bộ có nén gzip. FCP 1,7 giây; LCP 2,7 giây; CLS 0; TBT 0 ms. Kết quả cụ thể và phiên bản công cụ nằm trong [verification.json](verification.json).

Đây là số đo phòng thử nghiệm; LCP vẫn cao hơn mục tiêu 2,5 giây trong lần đo này. Tốc độ thực tế phụ thuộc vào hosting, thiết bị và mạng. TBT không phải số đo INP thực tế. Điểm SEO 100 kiểm tra nền tảng kỹ thuật, không bảo đảm thứ hạng, việc lập chỉ mục hay rich result.

## Còn cần chủ website bổ sung

- Điện thoại, URL Zalo và địa chỉ thật nếu muốn công khai.
- Kiểm tra lại danh mục trước khi xuất bản; ảnh hiện là minh họa.
- Chọn nơi xuất bản phù hợp, xác minh Search Console và gửi sitemap sau khi có URL live.

Chưa push mã nguồn hoặc triển khai website công khai. Workflow GitHub Pages đã có, xem [checklist xuất bản](../SEO-CHECKLIST.md) về giới hạn hosting kinh doanh và cách cấu hình.
