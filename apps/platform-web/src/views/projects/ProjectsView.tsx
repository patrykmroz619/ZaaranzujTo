"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { PageHeader } from "@repo/ui/components/page-header";
import { ProjectCard } from "@/modules/projects/components/ProjectCard";
import { CreateProjectDialog } from "@/modules/projects/components/CreateProjectDialog";
import { DeleteProjectDialog } from "@/modules/projects/components/DeleteProjectDialog";
import { useProjects } from "@/modules/projects/hooks/use-projects";
import { useCreateProject } from "@/modules/projects/hooks/use-create-project";
import { useDeleteProject } from "@/modules/projects/hooks/use-delete-project";

export const ProjectsView = () => {
  const t = useTranslations();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const { projects, isLoading, error } = useProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const handleCreateProject = (name: string) => {
    createProject(
      { body: { name } },
      { onSuccess: () => setCreateDialogOpen(false) },
    );
  };

  const handleDeleteProject = () => {
    if (!deleteProjectId) return;
    deleteProject(
      { projectId: deleteProjectId },
      { onSuccess: () => setDeleteProjectId(null) },
    );
  };

  const projectItems = projects?.items ?? [];

  return (
    <div className="space-y-5">
      <PageHeader title={t("dashboard.title")} subtitle={t("dashboard.manageSubtitle")}>
        <CreateProjectDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreate={handleCreateProject}
          isPending={isCreating}
        />
      </PageHeader>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground">{t("common.loading")}</p>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projectItems.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={setDeleteProjectId} />
          ))}
        </div>
      )}

      <DeleteProjectDialog
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
        onConfirm={handleDeleteProject}
      />
    </div>
  );
};
