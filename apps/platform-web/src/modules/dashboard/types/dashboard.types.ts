export type TDashboardStats = {
  projectCount: number;
  visualizationCount: number;
  creditBalance: number;
};

export type TRecentProject = {
  id: string;
  name: string;
  visualizations: number;
  thumbnail: string | null;
};
