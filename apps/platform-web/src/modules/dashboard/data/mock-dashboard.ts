import type { TDashboardStats, TRecentProject } from "../types/dashboard.types";

export const MOCK_STATS: TDashboardStats = {
  projectCount: 2,
  visualizationCount: 2,
  creditBalance: 4,
};

export const MOCK_RECENT_PROJECTS: TRecentProject[] = [
  {
    id: "1",
    name: "Metamorfoza salonu",
    visualizations: 3,
    thumbnail: null,
  },
  {
    id: "2",
    name: "Sypialnia główna",
    visualizations: 1,
    thumbnail: null,
  },
];

export const MOCK_LAST_VISUALIZATION = {
  id: "2",
  projectId: "2",
  name: "Wyciszona sypialnia",
  projectName: "Sypialnia główna",
};
