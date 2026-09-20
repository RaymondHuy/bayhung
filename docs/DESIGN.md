# Định hướng thiết kế Bảy Hưng

Website giới thiệu trái cây nhập khẩu bán sỉ cho cửa hàng, đại lý và đối tác tại TP.HCM. Mục tiêu của giao diện là giúp khách nhận ra thương hiệu, tìm nhóm trái cây phù hợp và chuẩn bị thông tin hỏi giá.

## Tinh thần và thông số

Áp dụng định hướng của skill `design-taste-frontend` với **DESIGN_VARIANCE = 7**, **MOTION_INTENSITY = 4**, **VISUAL_DENSITY = 3**. Bố cục có nhịp điệu riêng, khoảng thở rộng và chuyển động tiết chế; hình ảnh trái cây giữ vai trò chính.

Màu xanh rừng tạo nền nhận diện, kết hợp nền trắng ngà và các điểm nhấn lấy từ màu trái cây. Tiêu đề lớn, cách chia cột và khoảng trắng tạo phân cấp thị giác. Các khối được bo góc có chủ đích: thẻ khoảng 18 px, khối hero khoảng 32 px; nút dạng viên thuốc giúp nhận diện hành động.

Giao diện dùng **CSS thuần với biến thiết kế riêng**. Website giới thiệu tĩnh có phạm vi thành phần nhỏ, nên hệ thống màu, chữ, khoảng cách, nút và thẻ được định nghĩa trực tiếp để giữ chất thương hiệu, giảm mã tải xuống và thuận tiện bảo trì.

## Chữ, ảnh và chuyển động

- **Be Vietnam Pro** được tự lưu trữ cùng website, hỗ trợ dấu tiếng Việt và không cần gọi dịch vụ font bên ngoài khi người dùng mở trang.
- Ảnh trái cây minh họa được tạo cho website và xuất WebP. Chúng giúp nhận diện nhóm hàng, không chứng minh xuất xứ hoặc tình trạng của lô thực tế. Khi có ảnh do Bảy Hưng chụp, ưu tiên thay ảnh minh họa và sửa mô tả ảnh tương ứng.
- Hiệu ứng tập trung vào phản hồi của nút, thẻ và sự xuất hiện nhẹ của nội dung. Chế độ `prefers-reduced-motion` giảm chuyển động để tôn trọng lựa chọn của người dùng.
- Giao diện sáng/tối theo `prefers-color-scheme`, có nút đổi giao diện để khách tự chọn.

## Bố cục và hành động

Trang chủ giới thiệu thương hiệu, danh mục, cách hỏi giá và nội dung hướng dẫn. Danh mục dẫn tới trang riêng cho từng nhóm trái cây; cẩm nang bổ sung kiến thức liên quan đến nhập sỉ. Liên kết rõ ràng giúp cả khách hàng và công cụ tìm kiếm khám phá nội dung.

Trên màn hình nhỏ, các cột được xếp lại, điều hướng thu gọn và vùng bấm có khoảng cách đủ dùng. Trạng thái focus của bàn phím được hiển thị; ảnh có văn bản thay thế phù hợp với vai trò của chúng.

Hành động chính là **liên hệ hỏi giá**. Giá hiển thị **Liên hệ** trên toàn bộ danh mục. Kênh điện thoại và Zalo được lấy từ cấu hình; khi chưa có thông tin, giao diện giải thích trạng thái thay vì tạo dữ liệu giả. Biểu mẫu giúp khách soạn và sao chép nhu cầu, không mô phỏng việc đã gửi đơn.

## Nguyên tắc nội dung và SEO

Nội dung chính có sẵn trong HTML tạo lúc build. Mỗi trang có chủ đề, tiêu đề, mô tả và URL chuẩn riêng; sitemap, liên kết nội bộ và dữ liệu có cấu trúc sử dụng cùng URL xuất bản.

Nội dung viết tự nhiên quanh thương hiệu **Bảy Hưng**, **trái cây nhập khẩu bán sỉ** và khu vực **TP.HCM**. Không gắn thêm địa phương chưa phục vụ, nhồi từ khóa, tạo đánh giá khách hàng hoặc chứng nhận chưa xác minh. Xuất xứ, giống, quy cách và tình trạng hàng phải được xác nhận theo lô; ảnh minh họa không thay thế thông tin này.

Không dùng giá bằng 0 để biểu diễn “Liên hệ”, không tạo thông tin tồn kho hoặc đánh giá giả trong dữ liệu có cấu trúc. Nội dung hiển thị và thông tin khai báo cho công cụ tìm kiếm phải thống nhất.
