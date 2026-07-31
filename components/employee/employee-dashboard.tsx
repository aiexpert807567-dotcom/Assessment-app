"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatsGrid } from "@/components/ui/stats-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { RequestCard } from "@/components/employee/request-card";
import { NewRequestModal } from "@/components/employee/new-request-modal";
import type { EmployeeStats, LeaveRequest } from "@/types";

export function EmployeeDashboard({
  requests,
  stats,
}: {
  requests: LeaveRequest[];
  stats: EmployeeStats;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <StatsGrid
        items={[
          { label: "Pending", value: stats.pending, tone: "pending" },
          { label: "Approved", value: stats.approved, tone: "success" },
          { label: "Rejected", value: stats.rejected, tone: "danger" },
        ]}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-900">My requests</h1>
        <Button onClick={() => setModalOpen(true)}>New request</Button>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description="Submit your first leave request and it will show up here."
          action={<Button onClick={() => setModalOpen(true)}>New request</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}

      <NewRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
