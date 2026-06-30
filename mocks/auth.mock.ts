import { AuthUser } from "@/types/user";

// Tài khoản giả lập dùng để test UI trước khi nối backend thật.
// ⚠️ Xoá file này khi nối API NestJS thật ở module auth.
export const MOCK_ADMIN_CREDENTIALS = {
  email: "admin@solardv.vn",
  password: "admin123",
};

export const MOCK_ADMIN_USER: AuthUser = {
  id: "usr-1",
  email: "admin@solardv.vn",
  fullName: "Quản trị viên SolarDV",
  role: "ADMIN",
};
