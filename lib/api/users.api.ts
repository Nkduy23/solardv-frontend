import apiClient from "./client";
import { AuthUser } from "@/types/user";

export interface CreateUserPayload {
  email: string;
  password: string;
  fullName: string;
  role?: "ADMIN" | "STAFF";
}

export interface UpdateUserPayload {
  fullName?: string;
  password?: string;
}

export async function getUsers(): Promise<AuthUser[]> {
  const { data } = await apiClient.get("/users");
  return data.data;
}

export async function createUser(payload: CreateUserPayload): Promise<AuthUser> {
  const { data } = await apiClient.post("/users", payload);
  return data.data;
}

export async function updateMe(payload: UpdateUserPayload): Promise<AuthUser> {
  const { data } = await apiClient.patch("/users/me", payload);
  return data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
