import apiClient from "./client";
import { Project } from "@/types/project";

interface ListResult<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export async function getProjects(params?: { page?: number; limit?: number; search?: string }): Promise<ListResult<Project>> {
  const { data } = await apiClient.get("/projects", { params });
  return data;
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const { data } = await apiClient.get(`/projects/${slug}`);
  return data.data;
}

export async function createProject(payload: Omit<Project, "id">): Promise<Project> {
  const { data } = await apiClient.post("/projects", payload);
  return data.data;
}

export async function updateProject(id: string, payload: Partial<Project>): Promise<Project> {
  const { data } = await apiClient.patch(`/projects/${id}`, payload);
  return data.data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}
