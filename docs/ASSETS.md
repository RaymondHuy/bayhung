# Tài nguyên hình ảnh và chữ

Ảnh được tạo bằng công cụ imagegen tích hợp, dùng làm **ảnh minh họa**. Không dùng ảnh để chứng minh tồn kho, nguồn gốc thực tế, nhà vườn hay cơ sở của Bảy Hưng. Chú thích minh họa đã được hiển thị trên website. Khi có ảnh hàng thật, chủ website nên thay ảnh cùng thông tin lô đã xác nhận.

## Ảnh chính

- `assets/images/bay-hung-trai-cay.webp`: ảnh chính 1440px.
- `assets/images/bay-hung-trai-cay-800.webp`: bản 800px cho màn hình nhỏ.
- `assets/images/bay-hung-social.jpg`: ảnh chia sẻ mạng xã hội 1200 × 630.

Prompt đã dùng với imagegen tích hợp:

> Photorealistic editorial studio still life for Bảy Hưng, a Vietnamese imported fruit wholesale brand. Landscape 3:2. A low wooden produce crate with red apples, green and purple grapes, cherries, oranges with leaves, golden Asian pears and a kiwi half. Matte light sage wall and tabletop, morning sunlight from upper left and natural leaf shadows. Fruit centered, crate near the bottom, realistic skin and small imperfections. No people, hands, packaging labels, stickers, typography, logos or watermarks. Illustrative brand photograph, not a documentary claim.

Chuyển sang WebP/JPEG và giảm kích thước bằng Sharp. Các prompt ảnh sản phẩm riêng nằm trong [product-image-prompts.md](product-image-prompts.md).

## Font và icon

- **Be Vietnam Pro** từ gói `@fontsource/be-vietnam-pro`, lưu trữ trực tiếp trên website. License được đưa vào `dist/assets/fonts/LICENSE` khi build.
- **Phosphor Icons**, MIT, từ `@phosphor-icons/core`. Icon quả cam được dùng trong dấu hiệu nhận diện hình tròn và favicon. License được đưa vào `dist/assets/licenses/phosphor.txt` khi build.

Không tải font, icon hoặc ảnh qua CDN khi người dùng truy cập website.
