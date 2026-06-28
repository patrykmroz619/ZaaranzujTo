export type TUploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type TUploadedIterationAssetsBundle = {
  inputAssetId: string | null;
  referenceAssetIds: string[];
  inspirationAssetId: string | null;
  outputAssetId: string;
};
