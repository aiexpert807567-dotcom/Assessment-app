"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/form-fields";
import { createLeaveRequest } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function NewRequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(formData: FormData) {
    setError(undefined);
    setLoading(true);

    const result = await createLeaveRequest(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast("Request submitted", "success");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New leave request"
      description="Submit your dates and a short reason for approval."
    >
      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="start_date">Start date</Label>
            <Input id="start_date" name="start_date" type="date" required />
          </div>
          <div>
            <Label htmlFor="end_date">End date</Label>
            <Input id="end_date" name="end_date" type="date" required />
          </div>
        </div>
        <div>
          <Label htmlFor="reason">Reason</Label>
          <Textarea id="reason" name="reason" rows={3} placeholder="e.g. Family trip" required />
        </div>
        <FieldError>{error}</FieldError>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Submit request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
