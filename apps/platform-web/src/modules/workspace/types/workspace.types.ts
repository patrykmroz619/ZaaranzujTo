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

export const workspaceFormSchema = z.object({
  name: z.string().min(1),
  style: z.string().min(1),
  palette: z.string(),
  roomType: z.string().min(1),
  prompt: z.string(),
  roomPhotoFile: z.instanceof(File).nullable(),
  furniturePhotoFiles: z.array(z.instanceof(File)),
});

export type TWorkspaceFormValues = z.infer<typeof workspaceFormSchema>;
