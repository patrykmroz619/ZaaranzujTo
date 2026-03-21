import { Injectable } from "@nestjs/common";

type TBuildIterationVisualizationPromptParams = {
  stylePreset?: string;
  promptContext?: Record<string, unknown>;
};

@Injectable()
export class IterationPromptBuilderService {
  buildVisualizationPrompt = (params: TBuildIterationVisualizationPromptParams): string => {
    const { stylePreset, promptContext } = params;

    const contextParts: string[] = [];

    if (stylePreset && stylePreset.trim().length > 0) {
      contextParts.push(`Style preset: ${stylePreset.trim()}`);
    }

    if (promptContext && Object.keys(promptContext).length > 0) {
      contextParts.push(`Context: ${JSON.stringify(promptContext)}`);
    }

    const contextText = contextParts.length > 0 ? ` ${contextParts.join(". ")}.` : "";

    return `Generate an interior design visualization image based on the provided room photo.${contextText}`;
  };
}
