import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";

type TPageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
  className?: string;
};

const PageHeader = (props: TPageHeaderProps) => {
  const { title, subtitle, backHref, backLabel, children, className } = props;

  return (
    <div className={cn("space-y-2", className)}>
      {backHref && (
        <a
          href={backHref}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel || "Wstecz"}
        </a>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="font-display text-2xl text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {children && (
          <div className="flex w-full sm:ml-auto sm:w-auto sm:justify-end">{children}</div>
        )}
      </div>
    </div>
  );
};

export { PageHeader, type TPageHeaderProps };
