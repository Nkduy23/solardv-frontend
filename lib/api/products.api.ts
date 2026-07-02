import apiClient from "./client";
import { Product } from "@/types/product";

interface ListResult<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export async function getProducts(params?: { page?: number; limit?: number; search?: string; category?: string }): Promise<ListResult<Product>> {
  const { data } = await apiClient.get("/products", { params });
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data } = await apiClient.get(`/products/${slug}`);
  return data.data;
}

export async function createProduct(payload: Omit<Product, "id" | "image">): Promise<Product> {
  const { data } = await apiClient.post("/products", payload);
  return data.data;
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await apiClient.patch(`/products/${id}`, payload);
  return data.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
