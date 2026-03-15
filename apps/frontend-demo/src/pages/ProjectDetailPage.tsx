import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import emptyStateImage from "@/assets/empty-state.png";

interface Visualization {
  id: string;
  name: string;
  iterationCount: number;
  latestDate: string;
  thumbnailUrl?: string;
}

const mockVisualizations: Record<
  string,
  { projectName: string; visualizations: Visualization[] }
> = {
  "1": {
    projectName: "Mieszkanie na Mokotowie",
    visualizations: [
      { id: "v1", name: "Salon", iterationCount: 4, latestDate: "2026-03-06" },
      {
        id: "v2",
        name: "Kuchnia",
        iterationCount: 2,
        latestDate: "2026-03-05",
      },
      {
        id: "v3",
        name: "Sypialnia",
        iterationCount: 1,
        latestDate: "2026-03-03",
      },
    ],
  },
  "2": {
    projectName: "Dom w Konstancinie",
    visualizations: [
      {
        id: "v4",
        name: "Salon z kominkiem",
        iterationCount: 6,
        latestDate: "2026-03-04",
      },
      {
        id: "v5",
        name: "Gabinet",
        iterationCount: 3,
        latestDate: "2026-03-02",
      },
    ],
  },
  "3": { projectName: "Kawalerka Praga", visualizations: [] },
};

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const data = mockVisualizations[projectId || ""] || {
    projectName: "Projekt",
    visualizations: [],
  };

  return (
    <DashboardLayout subtitle={data.projectName}>
      <div className="p-4 md:p-6 lg:p-8 space-y-5">
        <PageHeader
          title={data.projectName}
          backTo="/projects"
          backLabel={t("common.back")}
        >
          <Button
            onClick={() => navigate(`/workspace/${projectId}/new`)}
            className="gradient-warm text-primary-foreground border-0 gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {t("project.newVisualization")}
          </Button>
        </PageHeader>

        {data.visualizations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <img
              src={emptyStateImage}
              alt=""
              className="mb-6 h-40 w-40 opacity-80"
            />
            <h2 className="mb-2 font-display text-xl text-foreground">
              {t("project.emptyTitle")}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t("project.emptyDescription")}
            </p>
            <Button
              onClick={() => navigate(`/workspace/${projectId}/new`)}
              className="gradient-warm text-primary-foreground border-0 gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("project.emptyCta")}
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.visualizations.map((vis, i) => (
              <motion.div
                key={vis.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-elevated"
                  onClick={() => navigate(`/workspace/${projectId}/${vis.id}`)}
                >
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-card-foreground">
                      {vis.name}
                    </h3>
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>
                        {vis.iterationCount} {t("project.iterations")}
                      </span>
                      <span>{vis.latestDate}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
