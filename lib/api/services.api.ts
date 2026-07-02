import apiClient from "./client";
import { Service } from "@/types/service";

interface ListResult<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export async function getServices(params?: { page?: number; limit?: number; search?: string }): Promise<ListResult<Service>> {
  const { data } = await apiClient.get("/services", { params });
  return data;
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const { data } = await apiClient.get(`/services/${slug}`);
  return data.data;
}

export async function createService(payload: Omit<Service, "id">): Promise<Service> {
  const { data } = await apiClient.post("/services", payload);
  return data.data;
}

export async function updateService(id: string, payload: Partial<Service>): Promise<Service> {
  const { data } = await apiClient.patch(`/services/${id}`, payload);
  return data.data;
}

export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(`/services/${id}`);
}
