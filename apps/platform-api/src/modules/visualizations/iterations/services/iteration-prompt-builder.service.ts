import { Injectable } from "@nestjs/common";

type TBuildIterationVisualizationPromptParams = {
  stylePreset?: string;
  palette?: string;
  roomType?: string;
  prompt?: string;
};

@Injectable()
export class IterationPromptBuilderService {
  buildVisualizationPrompt = (params: TBuildIterationVisualizationPromptParams): string => {
    const { stylePreset, palette, roomType, prompt } = params;

    const contextParts: string[] = [];

    if (stylePreset && stylePreset.trim().length > 0) {
      contextParts.push(`Style: ${stylePreset.trim()}`);
    }

    if (palette && palette.trim().length > 0) {
      contextParts.push(`Palette: ${palette.trim()}`);
    }

    if (roomType && roomType.trim().length > 0) {
      contextParts.push(`Room type: ${roomType.trim()}`);
    }

    if (prompt && prompt.trim().length > 0) {
      contextParts.push(`Additional notes: ${prompt.trim()}`);
    }

    const contextText = contextParts.length > 0 ? ` ${contextParts.join(". ")}.` : "";

    return `Generate an interior design visualization image based on the provided room photo.${contextText}`;
  };
}
