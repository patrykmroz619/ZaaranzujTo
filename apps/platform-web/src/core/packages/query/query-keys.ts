export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    detail: (projectId: string) => ["projects", projectId] as const,
    visualizations: (projectId: string) => ["projects", projectId, "visualizations"] as const,
  },
  visualizations: {
    detail: (visualizationId: string) => ["visualizations", visualizationId] as const,
    iterations: (visualizationId: string) =>
      ["visualizations", visualizationId, "iterations"] as const,
  },
  credits: {
    packages: ["credits", "packages"] as const,
    balance: ["credits", "balance"] as const,
  },
  profile: ["profile"] as const,
  storage: {
    asset: (assetId: string) => ["storage", "asset", assetId] as const,
  },
};
