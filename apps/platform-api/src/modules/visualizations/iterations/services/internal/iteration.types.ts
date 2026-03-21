export type TUploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type TInputIterationAsset = {
  assetId: string;
  role: "input-primary" | "input-reference";
  mimeType: string;
  sizeBytes: number;
};

export type TOutputIterationAsset = {
  assetId: string;
  role: "output-generated";
  mimeType: string;
  sizeBytes: number;
};

export type TRegisteredIterationAssetsBundle = {
  inputAssetId: string;
  referenceAssetIds: string[];
  outputAssetId: string;
  inputAssets: TInputIterationAsset[];
  outputAsset: TOutputIterationAsset;
};
