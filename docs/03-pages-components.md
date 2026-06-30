# 03 — Bảng ánh xạ Trang ↔ Component

| Trang | File route | Section chính sử dụng |
|---|---|---|
| Home | `app/(client)/page.tsx` | HeroSection, AboutSection (rút gọn), ServicesSection (rút gọn), ProductGrid (nổi bật), TestimonialSection, CtaSection, ConsultationFormQuick |
| About | `app/(client)/about/page.tsx` | AboutSection (đầy đủ), TestimonialSection |
| Services | `app/(client)/services/page.tsx` | ServicesSection (đầy đủ), CtaSection |
| Products | `app/(client)/products/page.tsx` | ProductGrid, ProductCard |
| Projects/Gallery | `app/(client)/projects/page.tsx` | ProjectGallery |
| Contact | `app/(client)/contact/page.tsx` | ContactForm |
| Admin Login | `app/(admin)/login/page.tsx` | (form riêng, không dùng section client) |
| Admin Dashboard | `app/(admin)/dashboard/page.tsx` | StatCard, VisitsChart |
| Admin Posts | `app/(admin)/posts/page.tsx`, `posts/[id]/page.tsx` | DataTable, RichTextEditor |
| Admin Services | `app/(admin)/services/page.tsx` | DataTable |
| Admin Products | `app/(admin)/products/page.tsx` | DataTable, ImageUploader |
| Admin Projects | `app/(admin)/projects/page.tsx` | DataTable, ImageUploader |
| Admin Consultations | `app/(admin)/consultations/page.tsx` | ConsultationsTable |
| Admin Gallery | `app/(admin)/gallery/page.tsx` | ImageUploader |
| Admin Settings | `app/(admin)/settings/page.tsx` | (form riêng) |

## Component dùng chung (UI)

`Button`, `Card`, `Input`, `Textarea`, `Select`, `Modal`, `Badge`, `Tabs`, `Pagination`, `Skeleton`, `Toast` — đặt trong `components/ui`, không phụ thuộc domain cụ thể, tái sử dụng ở cả client lẫn admin.

## Component Layout

`Header`, `Footer`, `Navbar`, `MobileMenu` dùng cho khu vực client. `AdminSidebar`, `AdminTopbar` dùng cho khu vực admin. `Container` dùng chung để giới hạn max-width nội dung.
