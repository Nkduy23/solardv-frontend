import apiClient from "./client";

export interface SiteSettings {
  id: string;
  phone: string;
  email: string;
  address: string;
  updatedAt: string;
}

export interface UpdateSettingsPayload {
  phone?: string;
  email?: string;
  address?: string;
}

export async function getSettings(): Promise<SiteSettings> {
  const { data } = await apiClient.get("/settings");
  return data.data;
}

export async function updateSettings(payload: UpdateSettingsPayload): Promise<SiteSettings> {
  const { data } = await apiClient.patch("/settings", payload);
  return data.data;
}
