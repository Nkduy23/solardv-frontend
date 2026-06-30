import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    success: true,
    message: "Đăng ký tư vấn thành công (Mock API)",
    data: {
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
    },
  });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [],
  });
}
