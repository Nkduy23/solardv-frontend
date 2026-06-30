export type ConsultationStatus = "NEW" | "CONTACTED" | "DONE" | "CANCELLED";

export interface Consultation {
  id: string;
  fullName: string;
  phone: string;
  message: string;
  status: ConsultationStatus;
  createdAt: string; // ISO date string
}
