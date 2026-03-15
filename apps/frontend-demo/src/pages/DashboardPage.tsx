import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Layers,
  Image as ImageIcon,
  Coins,
  ArrowRight,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import heroImage from "@/assets/hero-interior.jpg";
import emptyState from "@/assets/empty-state.png";

const mockStats = { projects: 2, visualizations: 2, credits: 4 };

const mockLastVisualization = {
  id: "2",
  projectId: "2",
  name: "Wyciszona sypialnia",
  projectName: "Sypialnia główna",
};

const mockRecentProjects = [
  {
    id: "1",
    name: "Metamorfoza salonu",
    visualizations: 3,
    thumbnail: heroImage,
  },
  {
    id: "2",
    name: "Sypialnia główna",
    visualizations: 1,
    thumbnail: heroImage,
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  const hasProjects = mockRecentProjects.length > 0;

  return (
    <DashboardLayout subtitle="Panel klienta">
      <div className="p-4 md:p-6 lg:p-8 space-y-5">
        <PageHeader
          title="Witaj z powrotem 👋"
          subtitle="Twój panel projektowy — tu znajdziesz podsumowanie i skróty."
        />

        {/* CTA + Quick actions — above the fold */}
        <motion.div
          className="grid gap-4 lg:grid-cols-[1fr_320px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* CTA card */}
          <Card className="overflow-hidden border-0 gradient-warm">
            <CardContent className="p-0">
              <div className="flex min-h-[140px]">
                <div className="flex flex-col justify-center p-5 md:p-6 flex-1">
                  <h2 className="font-display text-lg md:text-xl leading-snug text-primary-foreground mb-3">
                    Zbieraj inspiracje, generuj warianty
                    <br className="hidden md:block" /> i wracaj do nich bez
                    chaosu.
                  </h2>
                  <div>
                    <Button
                      size="sm"
                      onClick={() => navigate("/projects")}
                      className="bg-background text-foreground hover:bg-background/90 border-0 gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Nowy projekt
                    </Button>
                  </div>
                </div>
                <div className="relative hidden md:block w-48 shrink-0">
                  <img
                    src={heroImage}
                    alt="Wnętrze"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="shadow-card">
            <CardContent className="p-5 flex flex-col justify-center h-full gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Szybkie akcje
              </p>
              <button
                onClick={() => navigate("/projects")}
                className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
                  <FolderOpen className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Moje projekty
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Zarządzaj swoimi projektami
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              {mockLastVisualization ? (
                <button
                  onClick={() =>
                    navigate(
                      `/workspace/${mockLastVisualization.projectId}/${mockLastVisualization.id}`,
                    )
                  }
                  className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
                    <Sparkles className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Ostatnia wizualizacja
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {mockLastVisualization.name}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/credits")}
                  className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
                    <Coins className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Doładuj kredyty
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Kup pakiet i generuj więcej
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent projects / empty state */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {hasProjects ? (
            <Card className="shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Ostatnie projekty
                    </p>
                    <h3 className="font-display text-lg text-foreground mt-0.5">
                      Kontynuuj pracę
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/projects")}
                    className="gap-1 text-muted-foreground"
                  >
                    Moje projekty
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {mockRecentProjects.slice(0, 3).map((project) => (
                    <button
                      key={project.id}
                      onClick={() => navigate(`/project/${project.id}`)}
                      className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 group"
                    >
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="h-14 w-16 shrink-0 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {project.visualizations} wizualizacji
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <img
                  src={emptyState}
                  alt=""
                  className="h-28 w-28 mb-4 opacity-80"
                />
                <h3 className="font-display text-lg text-foreground">
                  Nie masz jeszcze projektów
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">
                  Stwórz swój pierwszy projekt i zacznij projektować wymarzone
                  wnętrza.
                </p>
                <Button
                  onClick={() => navigate("/projects")}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Stwórz pierwszy projekt
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Stats row — below the fold */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: "Projekty", value: mockStats.projects, icon: Layers },
            {
              label: "Wizualizacje",
              value: mockStats.visualizations,
              icon: ImageIcon,
            },
            { label: "Kredyty", value: mockStats.credits, icon: Coins },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <stat.icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <span className="font-display text-xl text-foreground">
                    {stat.value}
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
