"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/form-fields";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(formData: FormData) {
    setError(undefined);
    setLoading(true);
    const result = await signIn(formData);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary text-base font-semibold text-white">
            L
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Sign in to Leave</h1>
          <p className="mt-1 text-sm text-gray-500">Request and approve time off.</p>
        </div>

        <Card className="p-6">
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@company.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <FieldError>{error}</FieldError>
            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-gray-400">
          employee@test.com / manager@test.com · Password123!
        </p>
      </div>
    </div>
  );
}
