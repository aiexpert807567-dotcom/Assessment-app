"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Textarea } from "@/components/ui/form-fields";
import { decideLeaveRequest } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { formatDateRange, formatRelativeTime } from "@/lib/utils";
import type { LeaveRequestWithEmployee } from "@/types";

export function ManagerRequestCard({ request }: { request: LeaveRequestWithEmployee }) {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [confirmingReject, setConfirmingReject] = useState(false);
  const [loadingAction, setLoadingAction] = useState<"approve" | "reject" | null>(null);

  async function handleDecision(decision: "approved" | "rejected") {
    setLoadingAction(decision === "approved" ? "approve" : "reject");

    const result = await decideLeaveRequest(request.id, decision, comment);

    setLoadingAction(null);
    setConfirmingReject(false);

    if (result.error) {
      toast(result.error, "error");
      return;
    }

    toast(decision === "approved" ? "Request approved" : "Request rejected", "success");
  }

  const isPending = request.status === "pending";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-900">{request.employee.name}</p>
          <p className="text-xs text-gray-500">{request.employee.email}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <p className="mt-3 text-sm font-medium text-gray-800">
        {formatDateRange(request.start_date, request.end_date)}
      </p>
      <p className="mt-1 text-sm text-gray-600">{request.reason}</p>
      <p className="mt-2 text-xs text-gray-400">
        Submitted {formatRelativeTime(request.created_at)}
      </p>

      {request.manager_comment && !isPending && (
        <div className="mt-3 rounded-md bg-surface px-3 py-2 text-xs text-gray-600">
          <span className="font-medium text-gray-700">Your note: </span>
          {request.manager_comment}
        </div>
      )}

      {isPending && (
        <div className="mt-4 space-y-3">
          <Textarea
            placeholder="Optional comment"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-xs"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="danger"
              onClick={() => setConfirmingReject(true)}
              loading={loadingAction === "reject"}
            >
              Reject
            </Button>
            <Button
              onClick={() => handleDecision("approved")}
              loading={loadingAction === "approve"}
            >
              Approve
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmingReject}
        title="Reject this request?"
        description={`This will reject ${request.employee.name}'s leave request. They'll be able to see your comment.`}
        confirmLabel="Reject request"
        loading={loadingAction === "reject"}
        onConfirm={() => handleDecision("rejected")}
        onCancel={() => setConfirmingReject(false)}
      />
    </Card>
  );
}
