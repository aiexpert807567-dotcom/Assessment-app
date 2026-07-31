import { createClient } from "@/lib/supabase/server";
import type {
  EmployeeStats,
  LeaveRequest,
  LeaveRequestWithEmployee,
  ManagerStats,
  Profile,
} from "@/types";

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .eq("id", user.id)
    .single();

  return data;
}

export async function getEmployeeRequests(employeeId: string): Promise<LeaveRequest[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("employee_id", employeeId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export function getEmployeeStats(requests: LeaveRequest[]): EmployeeStats {
  return {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };
}

export async function getAllRequests(): Promise<LeaveRequestWithEmployee[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("leave_requests")
    .select("*, employee:profiles!leave_requests_employee_id_fkey(id, name, email)")
    .order("created_at", { ascending: false });

  return (data as unknown as LeaveRequestWithEmployee[]) ?? [];
}

export function getManagerStats(requests: LeaveRequestWithEmployee[]): ManagerStats {
  const today = new Date().toDateString();

  return {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approvedToday: requests.filter(
      (r) => r.status === "approved" && new Date(r.updated_at).toDateString() === today
    ).length,
  };
}
