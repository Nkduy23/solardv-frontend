import apiClient from "./client";
import { AuthUser } from "@/types/user";

export async function login(email: string, password: string): Promise<AuthUser> {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data.data.user; // token đã nằm trong cookie httpOnly, không cần xử lý ở FE
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await apiClient.get("/auth/me");
    return data.data;
  } catch {
    return null;
  }
}
