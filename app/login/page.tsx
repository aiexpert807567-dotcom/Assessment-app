"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/form-fields";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #D1D5DB 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="mb-6 flex flex-col items-center">
          <Logo size={40} />
          <h1 className="mt-4 text-lg font-semibold text-gray-900">
            Sign in to Leave
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Request and approve time off.
          </p>
        </div>

        <Card className="p-6">
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <FieldError>{error}</FieldError>
            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
