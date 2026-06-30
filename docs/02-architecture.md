# 02 — Kiến trúc Frontend

## Route groups

Sử dụng **Route Groups** của App Router để tách layout giữa khu vực khách hàng và khu vực quản trị mà không ảnh hưởng URL:

- `app/(client)/...` → layout có Header/Footer công khai
- `app/(admin)/...` → layout có Sidebar/Topbar, được bảo vệ bởi `middleware.ts`

## Luồng dữ liệu

```
UI Page/Section
      │
      ▼
lib/api/*.api.ts  ──(NEXT_PUBLIC_USE_MOCK=true)──► mocks/*.mock.ts
      │
      └──(NEXT_PUBLIC_USE_MOCK=false)──► Backend NestJS (REST API)
```

Mỗi domain (services, products, projects, posts, consultations, auth, analytics) có một file API riêng trong `lib/api/`, expose các hàm dạng `getServices()`, `getServiceById(id)`, `createConsultation(payload)`,... Component không gọi `axios` trực tiếp mà luôn đi qua lớp này, để sau dễ thay nguồn dữ liệu (mock ↔ thật).

## Hiệu ứng chuyển động

- `components/motion/ScrollReveal.tsx`: bọc một section, fade/slide in khi scroll tới.
- `components/motion/ParallaxBackground.tsx`: nền chuyển tiếp mượt theo scroll, dùng cho Home.
- `components/motion/PageTransition.tsx`: animation chuyển trang.
- Nguyên tắc: animation luôn nằm trong `components/motion`, các section khác **compose lại** thay vì viết `motion.div` rải rác để dễ kiểm soát hiệu năng và phong cách nhất quán.

## Auth & phân quyền Admin

- `middleware.ts` kiểm tra token (cookie) cho mọi route trong `app/(admin)`, redirect về `/login` nếu chưa đăng nhập.
- `lib/auth.ts` chứa helper đọc/ghi token phía client.
- `hooks/useAuth.ts` cung cấp thông tin user hiện tại cho component.

## Theo dõi lượt truy cập (phối hợp với Backend)

FE gửi sự kiện pageview tới Backend (`lib/api/analytics.api.ts`) — ví dụ qua `hooks/useVisitTracker.ts` được gọi trong layout client. Backend chịu trách nhiệm lưu trữ & tổng hợp số liệu (xem tài liệu Backend, mục Analytics). Dashboard Admin chỉ gọi API thống kê để hiển thị biểu đồ bằng Recharts.
