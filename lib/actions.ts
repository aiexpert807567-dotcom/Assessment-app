"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
}

const REASON_MAX = 300;
const COMMENT_MAX = 300;

export async function signIn(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect(profile?.role === "manager" ? "/manager" : "/employee");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createLeaveRequest(formData: FormData): Promise<ActionResult> {
  const startDate = String(formData.get("start_date") ?? "");
  const endDate = String(formData.get("end_date") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!startDate || !endDate || !reason) {
    return { error: "All fields are required." };
  }

  if (reason.length > REASON_MAX) {
    return { error: `Reason must be ${REASON_MAX} characters or fewer.` };
  }

  if (new Date(endDate) < new Date(startDate)) {
    return { error: "End date cannot be before start date." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase.from("leave_requests").insert({
    employee_id: user.id,
    start_date: startDate,
    end_date: endDate,
    reason,
    status: "pending",
  });

  if (error) {
    return { error: "Could not submit your request. Try again." };
  }

  revalidatePath("/employee");
  return {};
}

export async function decideLeaveRequest(
  requestId: string,
  decision: "approved" | "rejected",
  comment: string
): Promise<ActionResult> {
  if (comment.length > COMMENT_MAX) {
    return { error: `Comment must be ${COMMENT_MAX} characters or fewer.` };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("leave_requests")
    .update({
      status: decision,
      manager_comment: comment.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    return { error: "Could not update the request. Try again." };
  }

  revalidatePath("/manager");
  return {};
}
