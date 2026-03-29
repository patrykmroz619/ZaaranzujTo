"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, Layers, Image as ImageIcon, Coins } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent } from "@repo/ui/core/card";
import { PageHeader } from "@repo/ui/components/page-header";
import { StatsCard } from "@/modules/dashboard/components/StatsCard";
import { QuickActions } from "@/modules/dashboard/components/QuickActions";
import { RecentProjects } from "@/modules/dashboard/components/RecentProjects";
import { useProjects } from "@/modules/projects/hooks/use-projects";
import { useProfile } from "@/core/packages/profile/use-profile";

export const DashboardView = () => {
  const router = useRouter();
  const t = useTranslations("dashboard");

  const { projects, isLoading } = useProjects({ query: { page: 1, sort: "updatedAt:desc", pageSize: 5 } });
  const { profile } = useProfile();

  const projectItems = projects?.items ?? [];
  const projectCount = projects?.pagination.totalItems ?? 0;
  const visualizationCount = projectItems.reduce((sum, p) => sum + p.visualizationsCount, 0);
  const creditBalance = profile?.creditBalance ?? 0;

  const recentProjects = projectItems.map((p) => ({
    id: p.id,
    name: p.name,
    visualizations: p.visualizationsCount,
    thumbnail: null,
  }));

  return (
    <div className="space-y-5">
      <PageHeader title={t("welcome")} subtitle={t("welcomeSubtitle")} />

      {/* CTA + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* CTA card */}
        <Card className="overflow-hidden border-0 gradient-warm">
          <CardContent className="p-0">
            <div className="flex min-h-[140px]">
              <div className="flex flex-col justify-center p-5 md:p-6 flex-1">
                <h2 className="font-display text-lg md:text-xl leading-snug text-primary-foreground mb-3">
                  {t("ctaHeading")}
                </h2>
                <div>
                  <Button
                    size="sm"
                    onClick={() => router.push("/projects")}
                    className="bg-background text-foreground hover:bg-background/90 border-0 gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("newProject")}
                  </Button>
                </div>
              </div>
              <div className="relative hidden md:block w-48 shrink-0">
                <div className="absolute inset-0 bg-muted" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <QuickActions lastVisualization={null} />
      </div>

      {/* Recent projects / empty state */}
      <RecentProjects projects={isLoading ? [] : recentProjects} />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard label={t("statsProjects")} value={projectCount} icon={Layers} />
        <StatsCard label={t("statsVisualizations")} value={visualizationCount} icon={ImageIcon} />
        <StatsCard label={t("statsCredits")} value={creditBalance} icon={Coins} />
      </div>
    </div>
  );
};
