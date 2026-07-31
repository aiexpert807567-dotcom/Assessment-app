import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: number;
  tone?: "default" | "pending" | "success" | "danger";
}

const TONE_STYLES: Record<NonNullable<StatItem["tone"]>, string> = {
  default: "text-gray-900",
  pending: "text-pending-text",
  success: "text-success-text",
  danger: "text-danger-text",
};

const COLS_BY_COUNT: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", COLS_BY_COUNT[items.length] ?? "sm:grid-cols-3")}>
      {items.map((item) => (
        <Card key={item.label} className="p-4">
          <p className="text-xs font-medium text-gray-500">{item.label}</p>
          <p className={cn("mt-1.5 text-2xl font-semibold", TONE_STYLES[item.tone ?? "default"])}>
            {item.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
