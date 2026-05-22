"use client";

import { useTranslations } from "next-intl";
import { Layers, Coins } from "lucide-react";
import { PageHeader } from "@repo/ui/components/PageHeader";
import { StatsCard } from "@/modules/dashboard/components/StatsCard";
import { QuickActions } from "@/modules/dashboard/components/QuickActions";
import { RecentProjects } from "@/modules/dashboard/components/RecentProjects";
import { useProjects } from "@/modules/projects/hooks/use-projects";
import { useProfile } from "@/core/packages/profile/use-profile";
import { CtaBanner } from "./CtaBanner";

export const DashboardView = () => {
  const t = useTranslations("dashboard");

  const { projects, isLoading } = useProjects({
    query: { page: 1, sort: "updatedAt:desc", pageSize: 5 },
  });
  const { profile, isLoading: isLoadingProfile } = useProfile();

  const projectItems = projects?.items ?? [];
  const projectCount = projects?.pagination.totalItems ?? 0;
  const creditBalance = profile?.creditBalance ?? 0;

  return (
    <div className="space-y-5">
      <PageHeader title={t("welcome")} subtitle={t("welcomeSubtitle")} />

      {/* CTA + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <CtaBanner />
        <QuickActions lastVisualization={null} />
      </div>

      {/* Recent projects / empty state */}
      <RecentProjects projects={projectItems.slice(0, 3)} isLoading={isLoading} />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard label={t("statsProjects")} value={projectCount} icon={Layers} isLoading={isLoading} />
        <StatsCard label={t("statsCredits")} value={creditBalance} icon={Coins} isLoading={isLoadingProfile} />
      </div>
    </div>
  );
};
