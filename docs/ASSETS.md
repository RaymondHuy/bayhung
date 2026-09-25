# Tài nguyên hình ảnh và chữ

Ảnh chính và sáu ảnh trái cây nhập khẩu ban đầu được tạo bằng công cụ imagegen tích hợp. Bốn ảnh danh mục bổ sung sử dụng ảnh có giấy phép mở từ Wikimedia Commons, ghi nguồn bên dưới. Tất cả dùng làm **ảnh minh họa**, không chứng minh tồn kho, nguồn gốc thực tế, nhà vườn hay cơ sở của Bảy Hưng. Chú thích minh họa được hiển thị trên website. Khi có ảnh hàng thật, chủ website nên thay ảnh cùng thông tin lô đã xác nhận.

## Ảnh chính

- `assets/images/bay-hung-trai-cay.webp`: ảnh chính 1440px.
- `assets/images/bay-hung-trai-cay-800.webp`: bản 800px cho màn hình nhỏ.
- `assets/images/bay-hung-social.jpg`: ảnh chia sẻ mạng xã hội 1200 × 630.

Prompt đã dùng với imagegen tích hợp:

> Photorealistic editorial studio still life for Bảy Hưng, a Vietnamese imported fruit wholesale brand. Landscape 3:2. A low wooden produce crate with red apples, green and purple grapes, cherries, oranges with leaves, golden Asian pears and a kiwi half. Matte light sage wall and tabletop, morning sunlight from upper left and natural leaf shadows. Fruit centered, crate near the bottom, realistic skin and small imperfections. No people, hands, packaging labels, stickers, typography, logos or watermarks. Illustrative brand photograph, not a documentary claim.

Chuyển sang WebP/JPEG và giảm kích thước bằng Sharp. Các prompt ảnh sản phẩm riêng nằm trong [product-image-prompts.md](product-image-prompts.md).

## Ảnh bổ sung ngày 25/09/2026

Nguồn và giấy phép đã được kiểm tra qua metadata của Wikimedia Commons. Các ảnh được lưu trực tiếp trong website dưới dạng WebP 800 × 800, chất lượng 82; chỉ xoay theo hướng ảnh gốc, giảm kích thước, căn khung vuông và nén, không chỉnh sửa nội dung trái cây.

| Tệp trong website | Ảnh nguồn và tác giả | Giấy phép | Thay đổi |
| --- | --- | --- | --- |
| `assets/images/nhan-xuong.webp` | [Longan fruits.jpg](https://commons.wikimedia.org/wiki/File:Longan_fruits.jpg), Dinkum | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Thu nhỏ, cắt nhẹ vào khung vuông, chuyển WebP. Ảnh nhãn minh họa, nguồn không xác nhận giống nhãn xuồng. |
| `assets/images/xoai-cat-hoa-loc.webp` | [Bữa ăn chiều tối ng31th5n2020 (dĩa xoài cát Hòa Lộc) (1).jpg](https://commons.wikimedia.org/w/index.php?curid=137697216), Phương Huy | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Thu nhỏ, thêm khoảng trắng để giữ trọn ảnh, chuyển WebP. Bản ảnh này tiếp tục được cung cấp theo CC BY-SA 4.0. |
| `assets/images/hong.webp` | [Persimmon 2017 B3.jpg](https://commons.wikimedia.org/wiki/File:Persimmon_2017_B3.jpg), Fructibus | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Thu nhỏ, cắt nền vào khung vuông, chuyển WebP. Không dùng ảnh để khẳng định giống hoặc xuất xứ của hàng bán. |
| `assets/images/thanh-long.webp` | [A dragon fruit.jpg](https://commons.wikimedia.org/wiki/File:A_dragon_fruit.jpg), Helga Kattinger | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Thu nhỏ, thêm khoảng trắng để giữ trọn trái, chuyển WebP. Ảnh nguyên trái không xác nhận màu ruột của lô hàng. |

Ảnh xoài cần giữ ghi công Phương Huy, liên kết ảnh nguồn và giấy phép CC BY-SA 4.0 khi tiếp tục sử dụng hoặc phân phối. Việc ghi công ảnh không ngụ ý tác giả xác nhận hay bảo trợ cho Bảy Hưng. Các ảnh CC0 không bắt buộc ghi công; thông tin nguồn được lưu tại đây để dễ truy xuất.

Bản ghi công để công bố cùng website nằm tại `assets/licenses/fruit-photos.txt`, được liên kết qua mục “Nguồn ảnh”.

## Font và icon

- **Be Vietnam Pro** từ gói `@fontsource/be-vietnam-pro`, lưu trữ trực tiếp trên website. License được đưa vào `dist/assets/fonts/LICENSE` khi build.
- **Phosphor Icons**, MIT, từ `@phosphor-icons/core`. Icon quả cam được dùng trong dấu hiệu nhận diện hình tròn và favicon. License được đưa vào `dist/assets/licenses/phosphor.txt` khi build.

Không tải font, icon hoặc ảnh qua CDN khi người dùng truy cập website.
