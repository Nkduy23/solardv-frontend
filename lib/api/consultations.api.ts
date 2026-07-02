import apiClient from "./client";
import { Consultation, ConsultationStatus } from "@/types/consultation";

interface ListResult<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export interface CreateConsultationPayload {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  message?: string;
}

export async function createConsultation(payload: CreateConsultationPayload): Promise<Consultation> {
  const { data } = await apiClient.post("/consultations", payload);
  return data.data;
}

export async function getConsultations(params?: { page?: number; limit?: number; search?: string; status?: ConsultationStatus }): Promise<ListResult<Consultation>> {
  const { data } = await apiClient.get("/consultations", { params });
  return data;
}

export async function getConsultationSummary(): Promise<{ total: number; new: number; contacted: number; done: number }> {
  const { data } = await apiClient.get("/consultations/summary");
  return data.data;
}

export async function updateConsultationStatus(id: string, status: ConsultationStatus): Promise<Consultation> {
  const { data } = await apiClient.patch(`/consultations/${id}/status`, { status });
  return data.data;
}

export async function deleteConsultation(id: string): Promise<void> {
  await apiClient.delete(`/consultations/${id}`);
}
