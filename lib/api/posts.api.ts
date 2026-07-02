import apiClient from "./client";
import { Post } from "@/types/post";

interface ListResult<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export async function getPosts(params?: { page?: number; limit?: number; search?: string; published?: boolean }): Promise<ListResult<Post>> {
  const { data } = await apiClient.get("/posts", { params: { ...params, published: params?.published ? "true" : undefined } });
  return data;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const { data } = await apiClient.get(`/posts/${slug}`);
  return data.data;
}

export async function createPost(payload: Omit<Post, "id" | "publishedAt">): Promise<Post> {
  const { data } = await apiClient.post("/posts", payload);
  return data.data;
}

export async function updatePost(id: string, payload: Partial<Post>): Promise<Post> {
  const { data } = await apiClient.patch(`/posts/${id}`, payload);
  return data.data;
}

export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`/posts/${id}`);
}
