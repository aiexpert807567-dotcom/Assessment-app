import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data";

export default async function RootPage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  redirect(profile.role === "manager" ? "/manager" : "/employee");
}
