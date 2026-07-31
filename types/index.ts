export type Role = "employee" | "manager";

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  manager_comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequestWithEmployee extends LeaveRequest {
  employee: Pick<Profile, "id" | "name" | "email">;
}

export interface EmployeeStats {
  pending: number;
  approved: number;
  rejected: number;
}

export interface ManagerStats {
  total: number;
  pending: number;
  approvedToday: number;
}
