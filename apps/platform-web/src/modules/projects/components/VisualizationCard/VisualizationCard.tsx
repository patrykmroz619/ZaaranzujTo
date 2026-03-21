"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@repo/ui/core/card";
import type { TVisualization } from "../../types/projects.types";

type TVisualizationCardProps = {
  visualization: TVisualization;
  projectId: string;
};

export const VisualizationCard = (props: TVisualizationCardProps) => {
  const { visualization, projectId } = props;
  const router = useRouter();
  const t = useTranslations("project");

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-elevated"
      onClick={() => router.push(`/projects/${projectId}/workspace/${visualization.id}`)}
    >
      <div className="aspect-video bg-muted flex items-center justify-center">
        {visualization.thumbnailUrl ? (
          <img
            src={visualization.thumbnailUrl}
            alt={visualization.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-card-foreground">{visualization.name}</h3>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>
            {visualization.iterationCount} {t("iterations")}
          </span>
          <span>{visualization.latestDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};
