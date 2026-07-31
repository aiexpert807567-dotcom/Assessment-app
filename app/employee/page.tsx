import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { EmployeeDashboard } from "@/components/employee/employee-dashboard";
import { RequestCardSkeleton } from "@/components/ui/skeleton";
import { getCurrentProfile, getEmployeeRequests, getEmployeeStats } from "@/lib/data";

export default async function EmployeePage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "employee") redirect("/manager");

  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader name={profile.name} roleLabel="Employee" />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <EmployeeContent employeeId={profile.id} />
        </Suspense>
      </main>
    </div>
  );
}

async function EmployeeContent({ employeeId }: { employeeId: string }) {
  const requests = await getEmployeeRequests(employeeId);
  const stats = getEmployeeStats(requests);

  return <EmployeeDashboard requests={requests} stats={stats} />;
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RequestCardSkeleton />
      <RequestCardSkeleton />
    </div>
  );
}
