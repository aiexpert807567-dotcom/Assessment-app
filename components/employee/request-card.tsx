import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate, formatDateRange } from "@/lib/utils";
import type { LeaveRequest } from "@/types";

export function RequestCard({ request }: { request: LeaveRequest }) {
  return (
    <Card className="p-4 transition-default hover:shadow-pop">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-900">
          {formatDateRange(request.start_date, request.end_date)}
        </p>
        <StatusBadge status={request.status} />
      </div>
      <p className="mt-2 text-sm text-gray-600">{request.reason}</p>
      <p className="mt-3 text-xs text-gray-400">
        Submitted {formatDate(request.created_at)}
      </p>
      {request.manager_comment && (
        <div className="mt-3 rounded-md bg-surface px-3 py-2 text-xs text-gray-600">
          <span className="font-medium text-gray-700">Manager note: </span>
          {request.manager_comment}
        </div>
      )}
    </Card>
  );
}
