import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  children?: React.ReactNode; // CTA slot
}

export function PageHeader({ title, subtitle, backTo, backLabel, children }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      {backTo && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(backTo)}
          className="gap-1 text-muted-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel || "Wstecz"}
        </Button>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {children && <div className="flex w-full sm:w-auto">{children}</div>}
      </div>
    </div>
  );
}
