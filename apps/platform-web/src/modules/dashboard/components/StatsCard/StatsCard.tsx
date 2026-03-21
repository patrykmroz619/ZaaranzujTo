import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@repo/ui/core/card";

type TStatsCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
};

export const StatsCard = (props: TStatsCardProps) => {
  const { label, value, icon: Icon } = props;

  return (
    <Card className="shadow-card">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
          <Icon className="h-4 w-4 text-accent-foreground" />
        </div>
        <div>
          <span className="font-display text-xl text-foreground">{value}</span>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
