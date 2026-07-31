import { cn } from "@/lib/utils";
import type { LeaveStatus } from "@/types";

const STATUS_STYLES: Record<LeaveStatus, string> = {
  pending: "bg-pending-light text-pending-text",
  approved: "bg-success-light text-success-text",
  rejected: "bg-danger-light text-danger-text",
};

const STATUS_LABELS: Record<LeaveStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export function StatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
