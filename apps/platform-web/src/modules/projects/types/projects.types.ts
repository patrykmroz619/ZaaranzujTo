export type TProject = {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  visualizationCount: number;
};

export type TVisualization = {
  id: string;
  name: string;
  iterationCount: number;
  latestDate: string;
  thumbnailUrl: string | null;
};

export type TIteration = {
  id: string;
  label: string;
  isOriginal: boolean;
};
