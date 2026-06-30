export type Role = "ADMIN" | "STAFF";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}
