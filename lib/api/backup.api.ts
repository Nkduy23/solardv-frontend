import apiClient from "./client";

export interface BackupLog {
  id: string;
  url: string;
  fileName: string;
  sizeBytes: number;
  createdAt: string;
}

export async function getBackups(): Promise<BackupLog[]> {
  const { data } = await apiClient.get("/backup");
  return data.data;
}

export async function runBackupNow(): Promise<BackupLog> {
  const { data } = await apiClient.post("/backup/run");
  return data.data;
}
