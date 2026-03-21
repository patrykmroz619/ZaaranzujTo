"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/core/button";
import { PageHeader } from "@repo/ui/components/page-header";
import { ProjectCard } from "@/modules/projects/components/ProjectCard";
import { CreateProjectDialog } from "@/modules/projects/components/CreateProjectDialog";
import { DeleteProjectDialog } from "@/modules/projects/components/DeleteProjectDialog";
import { MOCK_PROJECTS } from "@/modules/projects/data/mock-projects";
import type { TProject } from "@/modules/projects/types/projects.types";

export const ProjectsView = () => {
  const t = useTranslations();
  const [projects, setProjects] = useState<TProject[]>(MOCK_PROJECTS);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const handleCreateProject = (name: string) => {
    const newProject: TProject = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString().split("T")[0] ?? "",
      modifiedAt: new Date().toISOString().split("T")[0] ?? "",
      visualizationCount: 0,
    };
    setProjects([newProject, ...projects]);
    setCreateDialogOpen(false);
  };

  const handleDeleteProject = () => {
    if (!deleteProjectId) return;
    setProjects(projects.filter((p) => p.id !== deleteProjectId));
    setDeleteProjectId(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t("dashboard.title")} subtitle={t("dashboard.manageSubtitle")}>
        <CreateProjectDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreate={handleCreateProject}
        />
      </PageHeader>

      {projects.length === 0 ? (
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
          {projects.map((project) => (
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
