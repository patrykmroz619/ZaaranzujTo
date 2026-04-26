"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FolderOpen, Sparkles, Coins, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@repo/ui/core/card";

type TLastVisualization = {
  id: string;
  projectId: string;
  name: string;
} | null;

type TQuickActionsProps = {
  lastVisualization: TLastVisualization;
};

export const QuickActions = (props: TQuickActionsProps) => {
  const { lastVisualization } = props;
  const router = useRouter();
  const t = useTranslations("dashboard");

  return (
    <Card className="shadow-card">
      <CardContent className="p-5 flex flex-col justify-center h-full gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {t("quickActions")}
        </p>

        <button
          onClick={() => router.push("/projects")}
          className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 group cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
            <FolderOpen className="h-4 w-4 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{t("myProjects")}</p>
            <p className="text-xs text-muted-foreground">{t("manageProjects")}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {lastVisualization ? (
          <button
            onClick={() =>
              router.push(
                `/projects/${lastVisualization.projectId}/workspace/${lastVisualization.id}`,
              )
            }
            className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 group cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{t("lastVisualization")}</p>
              <p className="text-xs text-muted-foreground truncate">{lastVisualization.name}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ) : (
          <button
            onClick={() => router.push("/credits")}
            className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 group cursor-pointer "
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
              <Coins className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{t("topUpCredits")}</p>
              <p className="text-xs text-muted-foreground">{t("topUpCreditsDesc")}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </CardContent>
    </Card>
  );
};
