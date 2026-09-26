# Bảy Hưng — trái cây nhập khẩu bán sỉ

Website tĩnh giới thiệu Bảy Hưng, phục vụ cửa hàng, đại lý và đối tác kinh doanh chủ yếu tại **TP.HCM**. Giá sản phẩm luôn hiển thị **Liên hệ**. Nội dung HTML được tạo sẵn khi build; người xem không cần JavaScript để đọc các trang chính.

## Chạy trên máy

Dùng Node.js 24 (tối thiểu Node.js 22), rồi chạy:

```sh
npm ci
npm run build
npm run preview
```

Mở <http://127.0.0.1:4173/bayhung/>. Lệnh preview phục vụ thư mục `dist`; sau khi sửa dữ liệu hoặc mã nguồn, chạy lại `npm run build` và tải lại trình duyệt. Nếu đổi `siteUrl`, dừng và chạy lại `npm run preview` để máy chủ nhận đường dẫn mới.

```sh
npm run check
npx playwright install chromium
npm run test:browser
```

`check` kiểm tra đầu ra tĩnh. Kiểm thử trình duyệt cần Chromium của Playwright; lệnh cài trình duyệt chỉ cần chạy lần đầu hoặc sau khi cập nhật Playwright.

## Thay thông tin liên hệ

Chỉnh [data/site.json](data/site.json). Số điện thoại liên hệ hiện là **0938879795**. Zalo được để trống và ẩn khỏi giao diện; email và địa chỉ có thể bổ sung sau.

| Trường | Cách sử dụng |
| --- | --- |
| `name`, `description` | Tên thương hiệu và mô tả chung. |
| `siteUrl` | URL chính thức, gồm đường dẫn project nếu có. |
| `serviceArea` | Khu vực hoạt động; hiện là `TP.HCM`. |
| `phone` | Số điện thoại để khách bấm gọi. |
| `zalo` | Không sử dụng: để trống để ẩn toàn bộ mục liên hệ Zalo. |
| `email`, `address` | Thông tin kinh doanh được phép công khai; có thể để trống. |
| `googleSiteVerification` | Giá trị `content` của thẻ xác minh Google Search Console. |
| `socialLinks` | Danh sách URL trang mạng xã hội chính thức; mặc định `[]`. |
| `copyrightYear` | Năm hiển thị ở chân trang. |

Cấu hình liên hệ hiện tại:

```json
{
  "phone": "0938879795",
  "zalo": ""
}
```

Khi thay thông tin trong file hiện có, giữ nguyên các trường khác và chạy `npm run build`. Số điện thoại xuất hiện tại trang Liên hệ, chân trang và dữ liệu có cấu trúc; khách có thể bấm để gọi.

Biểu mẫu hỏi giá tạo **nội dung nháp trên trình duyệt**, cho phép sao chép để dùng khi trao đổi. Website không có máy chủ nhận đơn hay lưu khách hàng. Khách có thể gọi số điện thoại trên trang Liên hệ để hỏi giá.

## Cập nhật sản phẩm và cẩm nang

- [data/catalog.json](data/catalog.json): 10 nhóm trái cây, nội dung sản phẩm, ảnh, mô tả SEO và nhãn giá. Giữ `priceLabel` là `Liên hệ`; xác nhận giống, xuất xứ, quy cách và tình trạng hàng theo từng lô.
- [data/guides.json](data/guides.json): ba bài cẩm nang; mỗi bài gồm tiêu đề, mô tả và các phần nội dung. Bổ sung nguồn khi có thông tin cần dẫn chứng.
- `assets/images/`: ảnh dùng cho website. Ảnh hiện tại là ảnh minh họa; nên thay bằng ảnh thực tế của Bảy Hưng khi có.

Giữ `slug` ổn định để tránh làm hỏng liên kết đã được chia sẻ hoặc lập chỉ mục. Sau mỗi lần chỉnh, build và kiểm tra lại. Không sửa trực tiếp `dist` vì thư mục này được tạo lại khi build.

## Xuất bản

Với repository **`RaymondHuy/bayhung`**, URL GitHub Pages mặc định là **<https://raymondhuy.github.io/bayhung/>**. Đây là project site, nên đường dẫn `/bayhung/` là một phần của URL. `siteUrl` trong `data/site.json` phải khớp địa chỉ này để CSS, ảnh, liên kết và các URL SEO được tạo đúng.

Đã có workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Khi chọn GitHub Pages làm nơi xuất bản, đặt **Settings → Pages → Source → GitHub Actions**. Push lên nhánh `main` sẽ kích hoạt build và deploy; cũng có thể chạy workflow thủ công trong thẻ Actions. Mã nguồn được chuẩn bị sẵn, việc có workflow không đồng nghĩa website đã được xuất bản.

Xem [checklist SEO và xuất bản](docs/SEO-CHECKLIST.md) trước khi đưa website lên mạng: tài liệu bao gồm giới hạn sử dụng Pages cho website kinh doanh, cấu hình URL, Search Console, sitemap và các bước kiểm tra sau triển khai.

Để dùng tên miền riêng hoặc hosting tĩnh khác, đổi `siteUrl`, chạy lại `npm run build` và đưa **nội dung thư mục `dist`** lên host. Với tên miền riêng, cấu hình DNS và tên miền theo nhà cung cấp. Không cần backend hay cơ sở dữ liệu.

## Thiết kế và SEO

Định hướng giao diện nằm ở [docs/DESIGN.md](docs/DESIGN.md). Website sử dụng chữ tiếng Việt tự lưu trữ, ảnh WebP, giao diện sáng/tối, bố cục đáp ứng, liên kết nội bộ và nội dung HTML có thể thu thập dữ liệu. Tiêu đề, mô tả, canonical, dữ liệu có cấu trúc và sitemap được sinh khi build từ URL cấu hình.

Nội dung tập trung vào nhu cầu mua sỉ trái cây nhập khẩu tại TP.HCM; không bịa giá, đánh giá khách hàng, chứng nhận, xuất xứ hay tồn kho. Cấu trúc SEO hỗ trợ Google hiểu website, không bảo đảm vị trí tìm kiếm.
