import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, FolderOpen, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PageHeader } from '@/components/PageHeader';
import emptyStateImage from '@/assets/empty-state.png';

interface Project {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  visualizationCount: number;
}

const mockProjects: Project[] = [
  { id: '1', name: 'Mieszkanie na Mokotowie', createdAt: '2026-03-01', modifiedAt: '2026-03-06', visualizationCount: 3 },
  { id: '2', name: 'Dom w Konstancinie', createdAt: '2026-02-15', modifiedAt: '2026-03-04', visualizationCount: 5 },
  { id: '3', name: 'Kawalerka Praga', createdAt: '2026-03-05', modifiedAt: '2026-03-05', visualizationCount: 0 },
];

export default function ProjectsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [newProjectName, setNewProjectName] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      modifiedAt: new Date().toISOString().split('T')[0],
      visualizationCount: 0,
    };
    setProjects([newProject, ...projects]);
    setNewProjectName('');
    setCreateDialogOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setDeleteProjectId(null);
  };

  return (
    <DashboardLayout subtitle="Zarządzanie" title={t('dashboard.title')}>
      <div className="p-4 md:p-6 lg:p-8 space-y-5">
        <PageHeader
          title="Moje projekty"
          subtitle="Zarządzaj swoimi projektami i wizualizacjami."
        >
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-warm text-primary-foreground border-0 gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                {t('dashboard.newProject')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">{t('dashboard.newProject')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Input
                  placeholder={t('project.namePlaceholder')}
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  maxLength={100}
                  onKeyDown={e => e.key === 'Enter' && handleCreateProject()}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>{t('dashboard.cancel')}</Button>
                <Button onClick={handleCreateProject} disabled={!newProjectName.trim()} className="gradient-warm text-primary-foreground border-0">
                  {t('project.create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <img src={emptyStateImage} alt="" className="mb-6 h-48 w-48 opacity-80" />
            <h2 className="mb-2 font-display text-2xl text-foreground">{t('dashboard.emptyTitle')}</h2>
            <p className="mb-6 max-w-md text-muted-foreground">{t('dashboard.emptyDescription')}</p>
            <Button onClick={() => setCreateDialogOpen(true)} className="gradient-warm text-primary-foreground border-0 gap-2">
              <Plus className="h-4 w-4" />
              {t('dashboard.emptyCta')}
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="group cursor-pointer transition-shadow hover:shadow-elevated"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                          <FolderOpen className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium text-card-foreground">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {project.visualizationCount} {t('dashboard.visualizations')}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('dashboard.editName')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteProjectId(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('dashboard.deleteProject')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                      <span>{t('dashboard.created')}: {project.createdAt}</span>
                      <span>{t('dashboard.modified')}: {project.modifiedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">{t('dashboard.deleteConfirmTitle')}</AlertDialogTitle>
              <AlertDialogDescription>{t('dashboard.deleteConfirmMessage')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('dashboard.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteProjectId && handleDeleteProject(deleteProjectId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('dashboard.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
