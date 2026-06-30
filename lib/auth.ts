// Helper phía client liên quan tới auth. Token thật nằm trong cookie httpOnly
// (set bởi route /api/mock/auth/login) nên JS phía client không đọc trực tiếp
// được — mọi kiểm tra trạng thái đăng nhập đi qua getCurrentUser() (lib/api/auth.api.ts).
export const ADMIN_HOME_PATH = "/admin/dashboard";
export const ADMIN_LOGIN_PATH = "/admin/login";
