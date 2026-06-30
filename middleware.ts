import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "solardv_access_token";
const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";

/**
 * Bảo vệ toàn bộ route trong /admin, trừ trang /admin/login.
 * Hiện chỉ kiểm tra SỰ TỒN TẠI của cookie token (xác thực thật sẽ làm ở
 * backend qua JwtAuthGuard) — mục đích ở đây là chặn truy cập UI admin
 * khi chưa đăng nhập, tránh để lộ giao diện quản trị.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX) || pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
