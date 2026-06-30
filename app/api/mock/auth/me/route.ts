import { NextRequest, NextResponse } from "next/server";
import { MOCK_ADMIN_USER } from "@/mocks/auth.mock";

const AUTH_COOKIE_NAME = "solardv_access_token";

/** Trả thông tin user hiện tại dựa trên cookie — dùng cho useAuth() phía client. */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  return NextResponse.json({ success: true, data: MOCK_ADMIN_USER });
}
