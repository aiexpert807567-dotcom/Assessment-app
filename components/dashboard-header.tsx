import { signOut } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function DashboardHeader({
  name,
  roleLabel,
}: {
  name: string;
  roleLabel: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="text-sm font-semibold text-gray-900">Leave</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium leading-tight text-gray-900">{name}</p>
            <p className="text-xs leading-tight text-gray-500">{roleLabel}</p>
          </div>
          <form action={signOut}>
            <Button variant="ghost" type="submit" className="px-3">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
