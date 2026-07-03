import apiClient from "./client";

export interface MediaFile {
  id: string;
  publicId: string;
  url: string;
  originalName: string;
  size: number;
  mimetype: string;
  category?: string;
  caption?: string;
  refId?: string;
  createdAt: string;
}

export async function uploadMedia(file: File, meta?: { category?: string; caption?: string; refId?: string }): Promise<MediaFile> {
  const form = new FormData();
  form.append("file", file);
  if (meta?.category) form.append("category", meta.category);
  if (meta?.caption) form.append("caption", meta.caption);
  if (meta?.refId) form.append("refId", meta.refId);

  const { data } = await apiClient.post("/media/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function getMediaFiles(category?: string): Promise<MediaFile[]> {
  const { data } = await apiClient.get("/media", { params: category ? { category } : {} });
  return data.data;
}

export async function deleteMedia(id: string): Promise<void> {
  await apiClient.delete(`/media/${id}`);
}
