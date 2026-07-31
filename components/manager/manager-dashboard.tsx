"use client";

import { useMemo, useState } from "react";
import { StatsGrid } from "@/components/ui/stats-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { ManagerRequestCard } from "@/components/manager/manager-request-card";
import { SearchFilterBar, type FilterValue } from "@/components/manager/search-filter-bar";
import type { LeaveRequestWithEmployee, ManagerStats } from "@/types";

export function ManagerDashboard({
  requests,
  stats,
}: {
  requests: LeaveRequestWithEmployee[];
  stats: ManagerStats;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch = r.employee.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || r.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [requests, search, filter]);

  const pending = filtered.filter((r) => r.status === "pending");
  const approved = filtered.filter((r) => r.status === "approved");
  const rejected = filtered.filter((r) => r.status === "rejected");

  return (
    <div className="space-y-6">
      <StatsGrid
        items={[
          { label: "Total requests", value: stats.total },
          { label: "Pending", value: stats.pending, tone: "pending" },
          { label: "Approved today", value: stats.approvedToday, tone: "success" },
        ]}
      />

      <h1 className="text-base font-semibold text-gray-900">Requests</h1>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching requests"
          description="Try a different search term or filter."
        />
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <Section title="Pending" requests={pending} />
          )}
          {approved.length > 0 && (
            <Section title="Approved" requests={approved} />
          )}
          {rejected.length > 0 && (
            <Section title="Rejected" requests={rejected} />
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  requests,
}: {
  title: string;
  requests: LeaveRequestWithEmployee[];
}) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title} · {requests.length}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {requests.map((request) => (
          <ManagerRequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
