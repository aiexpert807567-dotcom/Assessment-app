import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { ManagerDashboard } from "@/components/manager/manager-dashboard";
import { RequestCardSkeleton } from "@/components/ui/skeleton";
import { getAllRequests, getCurrentProfile, getManagerStats } from "@/lib/data";

export default async function ManagerPage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "manager") redirect("/employee");

  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader name={profile.name} roleLabel="Manager" />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <ManagerContent />
        </Suspense>
      </main>
    </div>
  );
}

async function ManagerContent() {
  const requests = await getAllRequests();
  const stats = getManagerStats(requests);

  return <ManagerDashboard requests={requests} stats={stats} />;
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <RequestCardSkeleton />
      <RequestCardSkeleton />
      <RequestCardSkeleton />
      <RequestCardSkeleton />
    </div>
  );
}
