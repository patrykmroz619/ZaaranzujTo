import type { TProject, TVisualization } from "../types/projects.types";

export const MOCK_PROJECTS: TProject[] = [
  {
    id: "1",
    name: "Mieszkanie na Mokotowie",
    createdAt: "2026-03-01",
    modifiedAt: "2026-03-06",
    visualizationCount: 3,
  },
  {
    id: "2",
    name: "Dom w Konstancinie",
    createdAt: "2026-02-15",
    modifiedAt: "2026-03-04",
    visualizationCount: 5,
  },
  {
    id: "3",
    name: "Kawalerka Praga",
    createdAt: "2026-03-05",
    modifiedAt: "2026-03-05",
    visualizationCount: 0,
  },
];

export const MOCK_VISUALIZATIONS: Record<
  string,
  { projectName: string; visualizations: TVisualization[] }
> = {
  "1": {
    projectName: "Mieszkanie na Mokotowie",
    visualizations: [
      {
        id: "v1",
        name: "Salon",
        iterationCount: 4,
        latestDate: "2026-03-06",
        thumbnailUrl: null,
      },
      {
        id: "v2",
        name: "Kuchnia",
        iterationCount: 2,
        latestDate: "2026-03-05",
        thumbnailUrl: null,
      },
      {
        id: "v3",
        name: "Sypialnia",
        iterationCount: 1,
        latestDate: "2026-03-03",
        thumbnailUrl: null,
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
        thumbnailUrl: null,
      },
      {
        id: "v5",
        name: "Gabinet",
        iterationCount: 3,
        latestDate: "2026-03-02",
        thumbnailUrl: null,
      },
    ],
  },
  "3": {
    projectName: "Kawalerka Praga",
    visualizations: [],
  },
};
