# 05 — Kế hoạch triển khai (Frontend)

## Giai đoạn 1 — Khung & dữ liệu giả lập
- [ ] Dựng layout client + admin, routing đầy đủ
- [ ] Hoàn thiện component UI dùng chung
- [ ] Tạo mock data cho services/products/projects/posts/consultations
- [ ] Kết nối page với mock qua lớp `lib/api`

## Giai đoạn 2 — Giao diện & hiệu ứng
- [ ] Hoàn thiện Hero + hiệu ứng scroll/parallax cho Home
- [ ] ScrollReveal cho các section còn lại
- [ ] Page transition giữa các route
- [ ] Responsive đầy đủ trên mobile/tablet

## Giai đoạn 3 — Khu vực Admin
- [ ] Auth (login/logout, middleware bảo vệ route)
- [ ] CRUD UI cho posts/services/products/projects
- [ ] Bảng quản lý khách hàng đăng ký tư vấn
- [ ] Dashboard: StatCard + biểu đồ lượt truy cập/đăng ký

## Giai đoạn 4 — Tích hợp Backend thật
- [ ] Thay `NEXT_PUBLIC_USE_MOCK=false`, nối API thật theo từng domain
- [ ] Xử lý lỗi, loading state, empty state cho toàn bộ trang
- [ ] Kiểm thử luồng đăng ký tư vấn end-to-end

## Giai đoạn 5 — Tối ưu & hoàn thiện
- [ ] SEO cơ bản (metadata, sitemap, robots)
- [ ] Tối ưu hiệu năng (lazy load ảnh, code splitting)
- [ ] Rà soát UI/UX, thay ảnh thật

> Ghi chú: roadmap này sẽ được cập nhật lại theo tiến độ thực tế và phản hồi trong quá trình phát triển.
