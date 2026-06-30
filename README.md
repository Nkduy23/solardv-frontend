# SolarDV — Frontend

Website giới thiệu & đăng ký dịch vụ điện năng lượng mặt trời cho **Công ty TNHH Đức Vinh Việt Nam**, kèm hệ thống quản trị (Admin Dashboard).

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** cho styling
- **Framer Motion** cho hiệu ứng chuyển động (scroll reveal, parallax background, page transition)
- **React Hook Form + Zod** cho form & validate
- **Recharts** cho biểu đồ ở Admin Dashboard
- **Axios** cho gọi API, có sẵn lớp mock data/mock API để phát triển độc lập với backend

## Cấu trúc thư mục

```
app/
  (client)/        Nhóm route phía khách hàng: home, about, services, products, projects, contact
  (admin)/         Nhóm route quản trị: login, dashboard, posts, services, products, projects, consultations, gallery, settings
  api/mock/        Route handler mock tạm thời trong lúc chưa nối backend
components/
  ui/               Component UI cơ bản, dùng chung toàn site
  layout/           Header, Footer, Sidebar admin, ...
  sections/         Các khối nội dung lớn theo từng trang
  admin/            Component riêng cho khu vực quản trị
  motion/           Component bọc hiệu ứng Framer Motion tái sử dụng
hooks/              Custom hooks
lib/                Helper, constants, validators, lớp gọi API
mocks/              Mock data cho từng domain
types/              Định nghĩa TypeScript dùng chung
docs/               Tài liệu thiết kế & kế hoạch của FE
```

## Bắt đầu

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Quy ước

- Mỗi page trong `app/` chỉ lo bố cục + ghép section, logic hiển thị nằm trong `components/sections`.
- Khi chưa có API thật, dùng dữ liệu trong `mocks/` thông qua cờ `NEXT_PUBLIC_USE_MOCK`.
- Component hiệu ứng đặt trong `components/motion`, các section khác import lại thay vì viết animation rải rác.

## Tài liệu liên quan

Xem thêm tại [`docs/`](./docs).
