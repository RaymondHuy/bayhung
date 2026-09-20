# Checklist vận hành website Bảy Hưng

Website được thiết kế để giới thiệu nguồn trái cây nhập khẩu bán sỉ tại TP.HCM, trình bày danh mục và hướng khách đến tư vấn. Giá hiển thị là **Liên hệ**. SEO giúp Google hiểu nội dung và khách tìm đúng thông tin; không bảo đảm thứ hạng hay thời điểm được lập chỉ mục.

## 1. Hoàn thiện thông tin thật

Chỉnh các trường trong `data/site.json`, sau đó build lại bằng `npm run build`:

| Trường | Thông tin cần điền |
| --- | --- |
| `name` | Tên thương hiệu nhất quán: Bảy Hưng. |
| `siteUrl` | URL xuất bản chính thức, ví dụ `https://raymondhuy.github.io/bayhung.github.io`. |
| `serviceArea` | Khu vực phục vụ thực tế, hiện là `TP.HCM`. |
| `phone` | Số điện thoại kinh doanh có người tiếp nhận. |
| `zalo` | Đường dẫn Zalo chính thức, đã thử mở trên điện thoại. |
| `email` | Email liên hệ thực tế, nếu sử dụng. |
| `address` | Địa chỉ thực tế được phép công khai; để trống khi chưa có. |
| `googleSiteVerification` | Chỉ chuỗi `content` từ thẻ xác minh Google Search Console. |

- [ ] Thử nút điện thoại và Zalo trên máy thật sau khi điền thông tin.
- [ ] Rà lại xuất xứ, giống, quy cách đóng gói và điều kiện nhập sỉ theo hàng thực tế. Không coi ảnh minh họa là cam kết về lô hàng.
- [ ] Bổ sung ảnh do Bảy Hưng chụp: trái cây, thùng hàng, nhãn xuất xứ và quá trình chuẩn bị hàng. Che thông tin riêng của khách.
- [ ] Viết rõ cách xác nhận đơn, giao nhận và xử lý vấn đề khi các chính sách đã được chủ cơ sở chốt.
- [ ] Chỉ nêu chứng nhận, kinh nghiệm, số khách hàng, đánh giá hoặc đối tác khi có cơ sở kiểm chứng.

## 2. Chuẩn bị xuất bản

Với remote `RaymondHuy/bayhung.github.io`, URL Pages mặc định là **`https://raymondhuy.github.io/bayhung.github.io/`**. Đây là project site; tên repository `bayhung.github.io` không tự tạo ra tên miền `bayhung.github.io`. Nếu đổi tên repository hoặc dùng tên miền riêng, cập nhật `siteUrl` và build lại. [Cách GitHub đặt URL Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

GitHub có giới hạn sử dụng Pages đối với online business, thương mại điện tử và website chủ yếu phục vụ giao dịch thương mại. Website bán sỉ cần xem xét điều kiện này trước khi chọn nơi xuất bản chính thức; không có giỏ hàng vẫn chưa đủ để kết luận được phép. Bộ mã tĩnh có thể chuyển sang dịch vụ hosting phù hợp. [Giới hạn sử dụng GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

Khi đã chọn Pages phù hợp với mục đích sử dụng:

1. Trong repository, mở **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Đưa mã nguồn và `package-lock.json` lên nhánh `main`.
3. Workflow `.github/workflows/deploy.yml` sẽ dùng Node.js 24, chạy `npm ci`, `npm run build`, tải thư mục `dist` lên và triển khai.
4. Có thể chạy lại tại **Actions → Deploy Bảy Hưng to GitHub Pages → Run workflow**.
5. Kiểm tra URL hiển thị trong lần deploy thành công; bật HTTPS nếu giao diện Pages yêu cầu.

Workflow chỉ cấp quyền đọc mã cho job build, và quyền triển khai Pages cho job deploy. Không cần token cá nhân. [Tài liệu workflow Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 3. Đưa website vào Google Search Console

1. Mở [Google Search Console](https://search.google.com/search-console) bằng tài khoản Google của chủ website.
2. Thêm tài sản dạng **URL prefix** với URL đầy đủ, gồm cả `/bayhung.github.io/` nếu dùng địa chỉ Pages mặc định.
3. Chọn xác minh bằng **HTML tag**, chép giá trị `content` vào `googleSiteVerification` trong `data/site.json`.
4. Build và xuất bản lại, rồi chọn **Verify**. Giữ lại mã xác minh trong các lần cập nhật sau. [Hướng dẫn xác minh quyền sở hữu](https://support.google.com/webmasters/answer/9008080?hl=vi).
5. Trong **Sitemaps**, gửi `sitemap.xml` tại URL website; với cấu hình mặc định là `https://raymondhuy.github.io/bayhung.github.io/sitemap.xml`.
6. Dùng **URL Inspection → Test live URL** cho trang chủ, danh mục, một sản phẩm và một bài cẩm nang. Có thể yêu cầu lập chỉ mục cho các URL quan trọng.

Sitemap chỉ chứa URL chuẩn, có thể truy cập và muốn xuất hiện trên Google; không thêm trang 404 hoặc URL bộ lọc trùng nội dung. Gửi sitemap giúp Google phát hiện trang, không bảo đảm lập chỉ mục. [Hướng dẫn sitemap của Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

**Riêng `robots.txt`:** Google đọc tệp này tại gốc hostname, ví dụ `https://raymondhuy.github.io/robots.txt`. Tệp nằm tại `/bayhung.github.io/robots.txt` không điều khiển crawl cho project site. Khi không quản lý được gốc hostname, gửi sitemap trực tiếp qua Search Console; nếu có site gốc, kiểm tra nó không chặn đường dẫn project. Với tên miền riêng, đặt `robots.txt` ngay tại gốc tên miền. [Vị trí robots.txt](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt).

## 4. Kiểm tra sau khi xuất bản

- [ ] Trang chủ, danh mục, sản phẩm và cẩm nang mở trực tiếp được; tải lại trang con không lỗi 404.
- [ ] Ảnh, CSS, font và liên kết nội bộ hoạt động cả với đường dẫn project Pages.
- [ ] Mỗi trang có title mô tả đúng nội dung, tiêu đề chính rõ ràng và mô tả riêng; không lặp dày các biến thể từ khóa. Google có thể tự chọn lại tiêu đề kết quả tìm kiếm. [Hướng dẫn title](https://developers.google.com/search/docs/appearance/title-link).
- [ ] Canonical, Open Graph URL và sitemap đều dùng URL xuất bản thật. Canonical của trang sản phẩm trỏ về chính trang sản phẩm, không gom hết về trang chủ; không dùng `localhost`, URL xem trước hoặc dấu `#`. [Hướng dẫn canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [ ] Trang nội dung công khai không còn `noindex` ngoài ý muốn.
- [ ] Kiểm tra JSON-LD bằng [Rich Results Test](https://search.google.com/test/rich-results). Dữ liệu phải đúng với nội dung khách thấy.
- [ ] Giữ giá là **Liên hệ**. Không khai báo `Offer.price: 0` hoặc `price: "Liên hệ"`: số 0 biểu thị miễn phí, còn giá cho Google phải là số. Không bịa giá, đánh giá hay tình trạng hàng để đạt Product rich results. Website vẫn có thể xuất hiện trong kết quả tìm kiếm thông thường. [Yêu cầu Product và Offer](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).
- [ ] Kiểm tra điện thoại bằng [PageSpeed Insights](https://pagespeed.web.dev/), chú ý tốc độ hiển thị ảnh đầu trang, độ ổn định bố cục và phản hồi khi bấm nút. Website mới có thể chưa đủ dữ liệu người dùng thực tế.

## 5. Nội dung và SEO địa phương

Ưu tiên các nhóm nhu cầu thật: **trái cây nhập khẩu sỉ**, **bán sỉ trái cây nhập khẩu TP.HCM**, **nguồn hàng trái cây nhập khẩu**, và tên từng loại trái cây đang kinh doanh kèm nhu cầu mua sỉ. Đây là định hướng nội dung, chưa phải số liệu lượng tìm kiếm.

| Nhóm trang | Nội dung nên duy trì |
| --- | --- |
| Trang chủ | Bảy Hưng cung cấp gì, phục vụ ai, ở đâu và liên hệ thế nào. |
| Danh mục và sản phẩm | Loại trái cây, xuất xứ có thể cung cấp, quy cách, lưu ý chọn hàng và cách hỏi báo giá. |
| Cẩm nang | Những điều cần hỏi khi nhập sỉ, hiểu quy cách thùng, kiểm tra hàng và bảo quản theo hướng dẫn của từng lô. |
| Giới thiệu và liên hệ | Thông tin cơ sở có thật, khu vực phục vụ, hình ảnh thực tế và kênh liên hệ. |

Nếu có địa điểm thật tiếp khách hoặc mô hình phục vụ tại địa điểm khách đủ điều kiện, thiết lập Google Business Profile bằng thông tin thực tế. Không tạo địa chỉ giả, địa điểm ảo hay hồ sơ ở từng quận chỉ để lấy từ khóa; mô hình chỉ hoạt động trực tuyến không tự động đủ điều kiện. Đồng bộ tên, điện thoại, địa chỉ giữa hồ sơ và website. [Quy định Google Business Profile](https://support.google.com/business/answer/3038177?hl=vi).

Hằng tháng, xem truy vấn, lượt hiển thị, lượt nhấp và lỗi lập chỉ mục trong Search Console. Cập nhật bài viết dựa trên câu hỏi khách thực sự hỏi; thêm ảnh và thông tin mới khi có hàng thực tế. Không tạo hàng loạt trang địa phương chỉ thay tên quận, mua đánh giá, hay nhồi từ khóa vào phần mô tả ảnh.
