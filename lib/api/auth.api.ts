import { AuthUser } from "@/types/user";

const BASE = "/api/mock/auth"; // TODO: đổi sang `${process.env.NEXT_PUBLIC_API_URL}/auth` khi nối backend thật

interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json: ApiResult<AuthUser> = await res.json();
  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message ?? "Đăng nhập thất bại");
  }
  return json.data;
}

export async function logout(): Promise<void> {
  await fetch(`${BASE}/logout`, { method: "POST" });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch(`${BASE}/me`);
  if (!res.ok) return null;
  const json: ApiResult<AuthUser> = await res.json();
  return json.data ?? null;
}
