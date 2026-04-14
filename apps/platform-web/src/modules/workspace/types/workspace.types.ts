import { z } from "zod";

export type TWorkspaceStyle =
  | "scandinavian"
  | "industrial"
  | "minimalist"
  | "classic"
  | "boho"
  | "modern";

export type TColorPalette = "light" | "dark" | "warm" | "cool" | "pastel";

export type TRoomType = "livingRoom" | "bedroom" | "kitchen" | "bathroom" | "office";

export const workspaceCreateSchema = z.object({
  name: z.string().min(1),
  stylePreset: z.string().min(1),
  palette: z.string().min(1),
  roomType: z.string().min(1),
  prompt: z.string(),
  roomPhotoFile: z.instanceof(File),
  furniturePhotoFiles: z.array(z.instanceof(File)),
});

export type TWorkspaceCreateValues = z.infer<typeof workspaceCreateSchema>;

export const workspaceIterationSchema = z.object({
  prompt: z.string().min(1),
  furniturePhotoFiles: z.array(z.instanceof(File)),
});

export type TWorkspaceIterationValues = z.infer<typeof workspaceIterationSchema>;
