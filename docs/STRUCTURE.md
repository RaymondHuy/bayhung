# Cấu trúc website Bảy Hưng

15 trang có thể lập chỉ mục, cộng một trang 404 có `noindex`. Mỗi trang được tạo thành HTML đầy đủ, có tiêu đề và mô tả riêng, canonical tuyệt đối, ảnh chia sẻ và dữ liệu JSON-LD.

```text
/
├── san-pham/
│   ├── tao-nhap-khau/
│   ├── nho-nhap-khau/
│   ├── cherry-nhap-khau/
│   ├── kiwi-nhap-khau/
│   ├── cam-nhap-khau/
│   └── le-nhap-khau/
├── gioi-thieu/
├── cam-nang/
│   ├── kinh-nghiem-nhap-trai-cay-si/
│   ├── bao-quan-trai-cay-nhap-khau/
│   └── chon-trai-cay-cho-cua-hang/
├── lien-he/
└── chinh-sach-bao-mat/
```

Trên GitHub Pages của repository hiện tại, các đường dẫn trên có tiền tố `/bayhung.github.io/`. `data/site.json` là nguồn cấu hình URL chính thức. Sitemap chỉ chứa URL canonical của 15 trang, không chứa URL bộ lọc, trang lỗi hoặc `lastmod` được suy đoán.

## Chủ đề nội dung

- Trang chủ và giới thiệu: trái cây nhập khẩu bán sỉ, Bảy Hưng, TP.HCM.
- Danh mục và từng nhóm trái: loại trái + nhập khẩu/bán sỉ, đặc điểm chung và thông tin cần xác nhận khi nhập hàng.
- Cẩm nang: nhập trái cây sỉ, bảo quản và chọn danh mục cho cửa hàng.
- Liên hệ: chuẩn bị nhu cầu và liên hệ nhận báo giá.

Trang nhóm trái cây mô tả nhóm sản phẩm, không phải một SKU có giá cố định. Vì vậy dùng `CollectionPage`, không tạo `Offer`, đánh giá khách hàng hay tồn kho giả để lấy rich result. Có `Organization`, `WebSite`, `BreadcrumbList`, `Article`, `AboutPage` và `ContactPage` theo loại nội dung. Không dựng `LocalBusiness` với địa chỉ chưa được xác nhận.

## Sau khi xuất bản

Kiểm tra URL thực tế và submit sitemap qua Google Search Console theo [SEO-CHECKLIST.md](SEO-CHECKLIST.md). Bổ sung số liên hệ và ảnh hàng thật khi có. Việc Google lập chỉ mục và thứ hạng phụ thuộc vào nhiều yếu tố ngoài mã nguồn; không có bảo đảm lên top.
