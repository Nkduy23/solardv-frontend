import apiClient from "./client";
import { AuthUser } from "@/types/user";

// Lưu token vào localStorage để apiClient interceptor tự gắn vào header
function saveToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("solardv_access_token", token);
}
function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem("solardv_access_token");
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const { data } = await apiClient.post("/auth/login", { email, password });
  saveToken(data.data.accessToken);
  // Lưu refresh token nếu cần dùng sau
  if (typeof window !== "undefined") {
    localStorage.setItem("solardv_refresh_token", data.data.refreshToken);
  }
  return data.data.user;
}

export async function logout(): Promise<void> {
  clearToken();
  if (typeof window !== "undefined") localStorage.removeItem("solardv_refresh_token");
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await apiClient.get("/auth/me");
    return data.data;
  } catch {
    return null;
  }
}
