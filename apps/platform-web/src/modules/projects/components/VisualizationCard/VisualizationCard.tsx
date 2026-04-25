"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Image as ImageIcon, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent } from "@repo/ui/core/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/core/dropdown-menu";
import type { TVisualizationSummary } from "@repo/contracts";
import { useAssetUrl } from "@/modules/storage/hooks/use-asset-url";

type TVisualizationCardProps = {
  visualization: TVisualizationSummary;
  projectId: string;
  onDelete: (visualizationId: string) => void;
};

export const VisualizationCard = (props: TVisualizationCardProps) => {
  const { visualization, projectId, onDelete } = props;
  const router = useRouter();
  const t = useTranslations("project");
  const { url: thumbnailUrl } = useAssetUrl(visualization.latestIteration?.imageAssetId);

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-elevated"
      onClick={() => router.push(`/projects/${projectId}/workspace/${visualization.id}`)}
    >
      <div className="aspect-video bg-muted flex items-center justify-center">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={visualization.name} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-card-foreground">{visualization.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
              <DropdownMenuItem
                className="text-destructive"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(visualization.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("deleteVisualization")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>
            {visualization.iterationsCount} {t("iterations")}
          </span>
          <span>{visualization.updatedAt.split("T")[0]}</span>
        </div>
      </CardContent>
    </Card>
  );
};
