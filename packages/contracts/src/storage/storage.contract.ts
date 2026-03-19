import { z } from "zod";

export const SignedUrlResponseSchema = z.object({
  downloadUrl: z
    .string()
    .url()
    .describe("The pre-signed, temporary URL to securely download the asset"),
  expiresAt: z
    .string()
    .datetime()
    .describe("The exact ISO timestamp when this URL stops functioning"),
});

export const FileAssetResponseSchema = z.object({
  id: z.string().describe("The primary ObjectId of the stored file metadata"),
  mimeType: z.string().describe("The format, e.g. image/png"),
  sizeBytes: z.number().int().nonnegative().describe("File size constraint in bytes"),
  createdAt: z.string().datetime(),
});

export type TSignedUrlResponse = z.infer<typeof SignedUrlResponseSchema>;
export type TFileAssetResponse = z.infer<typeof FileAssetResponseSchema>;
