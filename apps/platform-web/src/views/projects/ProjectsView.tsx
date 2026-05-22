"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { PageHeader } from "@repo/ui/components/PageHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/core/select";
import type { TProjectSort } from "@repo/contracts";
import { ProjectCard } from "@/modules/projects/components/ProjectCard";
import { ProjectCardSkeleton } from "@/modules/projects/components/ProjectCardSkeleton";
import { CreateProjectDialog } from "@/modules/projects/components/CreateProjectDialog";
import { DeleteProjectDialog } from "@/modules/projects/components/DeleteProjectDialog";
import { EditProjectNameDialog } from "@/modules/projects/components/EditProjectNameDialog";
import { useProjects } from "@/modules/projects/hooks/use-projects";
import { useCreateProject } from "@/modules/projects/hooks/use-create-project";
import { useDeleteProject } from "@/modules/projects/hooks/use-delete-project";
import { useUpdateProject } from "@/modules/projects/hooks/use-update-project";

const SORT_OPTIONS: TProjectSort[] = [
  "updatedAt:desc",
  "updatedAt:asc",
  "name:asc",
  "name:desc",
];

export const ProjectsView = () => {
  const t = useTranslations();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [sort, setSort] = useState<TProjectSort>("updatedAt:desc");

  const { projects, isLoading, error } = useProjects({ query: { sort, page: 1, pageSize: 20 } });
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

  const handleCreateProject = (name: string) => {
    createProject({ body: { name } }, { onSuccess: () => setCreateDialogOpen(false) });
  };

  const handleDeleteProject = () => {
    if (!deleteProjectId) return;
    deleteProject({ projectId: deleteProjectId }, { onSuccess: () => setDeleteProjectId(null) });
  };

  const handleEditProjectName = (name: string) => {
    if (!editProjectId) return;

    updateProject(
      {
        projectId: editProjectId,
        body: { name },
      },
      {
        onSuccess: () => setEditProjectId(null),
      },
    );
  };

  const projectItems = projects?.items ?? [];
  const editProject = projectItems.find((project) => project.id === editProjectId) ?? null;
  const projectToDelete = projectItems.find((project) => project.id === deleteProjectId) ?? null;

  return (
    <div className="space-y-5">
      <PageHeader title={t("dashboard.title")} subtitle={t("dashboard.manageSubtitle")}>
        <div className="w-full sm:ml-auto sm:w-auto">
          <CreateProjectDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onCreate={handleCreateProject}
            isPending={isCreating}
          />
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="text-muted-foreground">{t("errors.500")}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t("errors.retry")}
          </Button>
        </div>
      ) : projectItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="mb-2 font-display text-2xl text-foreground">{t("dashboard.emptyTitle")}</h2>
          <p className="mb-6 max-w-md text-muted-foreground">{t("dashboard.emptyDescription")}</p>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="gradient-warm text-primary-foreground border-0 gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("dashboard.emptyCta")}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <Select value={sort} onValueChange={(value) => setSort(value as TProjectSort)}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`projects.sort.${option}` as Parameters<typeof t>[0])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectItems.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={setEditProjectId}
                onDelete={setDeleteProjectId}
              />
            ))}
          </div>
        </>
      )}

      <DeleteProjectDialog
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
        onConfirm={handleDeleteProject}
        projectName={projectToDelete?.name}
        visualizationCount={projectToDelete?.visualizationCount}
      />

      <EditProjectNameDialog
        open={!!editProject}
        onOpenChange={() => setEditProjectId(null)}
        currentName={editProject?.name ?? ""}
        onSave={handleEditProjectName}
        isPending={isUpdating}
      />
    </div>
  );
};
