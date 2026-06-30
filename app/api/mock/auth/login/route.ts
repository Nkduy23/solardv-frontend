import { NextRequest, NextResponse } from "next/server";
import { MOCK_ADMIN_CREDENTIALS, MOCK_ADMIN_USER } from "@/mocks/auth.mock";

const AUTH_COOKIE_NAME = "solardv_access_token";

/**
 * Route mock cho POST /api/mock/auth/login — đứng vai trò backend tạm thời.
 * Khi nối NestJS thật, thay lời gọi ở lib/api/auth.api.ts sang
 * `${NEXT_PUBLIC_API_URL}/auth/login` và xoá route này.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;

  if (!email || !password || email !== MOCK_ADMIN_CREDENTIALS.email || password !== MOCK_ADMIN_CREDENTIALS.password) {
    return NextResponse.json({ success: false, message: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, data: MOCK_ADMIN_USER });

  response.cookies.set(AUTH_COOKIE_NAME, "mock-token-" + Date.now(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 giờ
  });

  return response;
}
