"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FolderOpen, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { Card, CardContent } from "@repo/ui/core/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/core/dropdown-menu";
import type { TProjectObject } from "@repo/contracts";

type TProjectCardProps = {
  project: TProjectObject;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const ProjectCard = (props: TProjectCardProps) => {
  const { project, onEdit, onDelete } = props;
  const router = useRouter();
  const t = useTranslations("dashboard");

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-elevated"
      onClick={() => router.push(`/projects/${project.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <FolderOpen className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-card-foreground">{project.name}</h3>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(project.id);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("editName")}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(project.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("deleteProject")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>
            {t("created")}: {project.createdAt.split("T")[0]}
          </span>
          <span>
            {t("modified")}: {project.updatedAt.split("T")[0]}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
