// middleware.ts — sửa lại, không còn check cookie nữa
// Vì token lưu localStorage (client-side only), middleware không đọc được
// → bỏ redirect tại middleware, để useAuth() trong layout xử lý
import { NextResponse } from "next/server";
export function middleware() {
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
