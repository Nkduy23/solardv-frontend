export const SITE_NAME = "SolarDV";

export const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Dịch vụ", href: "/services" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Dự án", href: "/projects" },
  { label: "Liên hệ", href: "/contact" },
] as const;

export const COMPANY_INFO = {
  fullName: "Công ty TNHH Đức Vinh Việt Nam",
  address: "160 đường số 2, Khu đô thị Vạn Phúc, Phường Hiệp Bình, TP. Hồ Chí Minh",
  phone: "0985 821 820",
  email: "contact@solardv.vn",
};

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Đăng ký tư vấn", href: "/admin/consultations", icon: "Inbox" },
  { label: "Dịch vụ", href: "/admin/services", icon: "Wrench" },
  { label: "Sản phẩm", href: "/admin/products", icon: "Package" },
  { label: "Dự án", href: "/admin/projects", icon: "Building2" },
  { label: "Bài viết", href: "/admin/posts", icon: "Newspaper" },
  { label: "Thư viện ảnh", href: "/admin/gallery", icon: "Images" },
  { label: "Cài đặt", href: "/admin/settings", icon: "Settings" },
] as const;
