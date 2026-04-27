import { z } from "zod";
import {
  STYLE_PRESETS,
  COLOR_PALETTE_PRESETS,
  ROOM_TYPE_PRESETS,
  OTHER_PRESET,
} from "@repo/contracts";

export const workspaceCreateSchema = z
  .object({
    name: z.string().min(1),
    stylePreset: z.enum([...STYLE_PRESETS, OTHER_PRESET]),
    stylePresetCustom: z.string().trim().max(120).optional(),
    palette: z.enum([...COLOR_PALETTE_PRESETS, OTHER_PRESET]),
    paletteCustom: z.string().trim().max(120).optional(),
    roomType: z.enum([...ROOM_TYPE_PRESETS, OTHER_PRESET]),
    roomTypeCustom: z.string().trim().max(120).optional(),
    prompt: z.string(),
    roomPhotoFile: z.instanceof(File).optional(),
    furniturePhotoFiles: z.array(z.instanceof(File)),
  })
  .superRefine((data, ctx) => {
    if (data.stylePreset === OTHER_PRESET && !data.stylePresetCustom?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stylePresetCustom"],
        message: "To pole jest wymagane.",
      });
    }
    if (data.palette === OTHER_PRESET && !data.paletteCustom?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paletteCustom"],
        message: "To pole jest wymagane.",
      });
    }
    if (data.roomType === OTHER_PRESET && !data.roomTypeCustom?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["roomTypeCustom"],
        message: "To pole jest wymagane.",
      });
    }
    if (!data.roomPhotoFile && !data.prompt.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["prompt"],
        message: "Dodaj zdjęcie pokoju lub opisz wnętrze.",
      });
    }
  });

export type TWorkspaceCreateValues = z.infer<typeof workspaceCreateSchema>;

export const workspaceIterationSchema = z.object({
  prompt: z.string().min(1),
  furniturePhotoFiles: z.array(z.instanceof(File)),
});

export type TWorkspaceIterationValues = z.infer<typeof workspaceIterationSchema>;
