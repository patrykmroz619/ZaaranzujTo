import { Injectable } from "@nestjs/common";

type TBuildVisualizationPromptParams = {
  stylePreset?: string;
  palette?: string;
  roomType?: string;
  prompt?: string;
  hasInputPhoto: boolean;
  hasReferencePhotos: boolean;
  hasPreviousOutput: boolean;
  isSubsequentIteration: boolean;
};

type TPaletteColors = {
  primary: string[];
  accents: string[];
};

type TPromptJson = {
  task: string;
  instructions: string;
  images_context?: Record<string, string>;
  scene: {
    room_type?: string;
    design_style?: string;
    color_palette?: { name: string; primary: string[]; accents: string[] };
  };
  technical: {
    camera: { lens: string; aperture: string };
    lighting: { type: string; direction: string };
  };
  composition: { framing: string; angle: string; focus: string };
  quality: string;
  additional_notes?: string;
  negative_prompt: string[];
};

@Injectable()
export class IterationPromptBuilderService {
  buildVisualizationPrompt = (params: TBuildVisualizationPromptParams): string => {
    const {
      stylePreset,
      palette,
      roomType,
      prompt,
      hasInputPhoto,
      hasReferencePhotos,
      hasPreviousOutput,
      isSubsequentIteration,
    } = params;

    const instructions = this.buildInstructions({
      hasInputPhoto,
      hasReferencePhotos,
      hasPreviousOutput,
      isSubsequentIteration,
    });

    const imagesContext = this.buildImagesContext({
      hasInputPhoto,
      hasPreviousOutput,
      hasReferencePhotos,
    });

    const promptJson: TPromptJson = {
      task: "interior design visualization",
      instructions,
      scene: {},
      technical: {
        camera: { lens: "24mm", aperture: "f/8.0" },
        lighting: { type: "natural_sunlight", direction: "front_lit" },
      },
      composition: { framing: "wide_shot", angle: "eye_level", focus: "whole_scene" },
      quality: "ultra_photorealistic",
      negative_prompt: [
        "blur",
        "low quality",
        "distortion",
        "unrealistic proportions",
        "watermark",
        "text overlay",
        "cartoon",
        "sketch",
      ],
    };

    if (Object.keys(imagesContext).length > 0) {
      promptJson.images_context = imagesContext;
    }

    if (roomType && roomType.trim().length > 0) {
      promptJson.scene.room_type = roomType.trim();
    }

    if (stylePreset && stylePreset.trim().length > 0) {
      promptJson.scene.design_style = stylePreset.trim();
    }

    if (palette && palette.trim().length > 0) {
      const colors = this.mapPaletteToColors({ palette: palette.trim() });
      promptJson.scene.color_palette = {
        name: palette.trim(),
        ...colors,
      };
    }

    if (prompt && prompt.trim().length > 0) {
      promptJson.additional_notes = prompt.trim();
    }

    return JSON.stringify(promptJson);
  };

  private buildInstructions = (params: {
    hasInputPhoto: boolean;
    hasReferencePhotos: boolean;
    hasPreviousOutput: boolean;
    isSubsequentIteration: boolean;
  }): string => {
    const { hasInputPhoto, hasReferencePhotos, hasPreviousOutput, isSubsequentIteration } = params;

    const parts: string[] = [];

    parts.push(
      "Generate a photorealistic interior design visualization of the described room space.",
    );

    if (hasInputPhoto && !isSubsequentIteration) {
      parts.push(
        "Use the provided room photo as the base — preserve the room layout, dimensions, windows, and architectural features while applying the requested design changes.",
      );
    }

    if (hasPreviousOutput) {
      parts.push(
        "A previous design iteration is provided — refine and improve upon it based on the updated parameters. Maintain elements that work well and adjust according to the new style, palette, or notes.",
      );
    }

    if (hasReferencePhotos) {
      parts.push(
        "Furniture and decor reference photos are provided — incorporate these specific pieces naturally into the room design, matching their style, scale, and proportions.",
      );
    }

    parts.push(
      "Ensure realistic lighting, shadows, material textures, and spatial proportions. The result should look like a professional interior design photograph.",
    );

    return parts.join(" ");
  };

  private buildImagesContext = (params: {
    hasInputPhoto: boolean;
    hasPreviousOutput: boolean;
    hasReferencePhotos: boolean;
  }): Record<string, string> => {
    const { hasInputPhoto, hasPreviousOutput, hasReferencePhotos } = params;

    const context: Record<string, string> = {};
    let imageIndex = 1;

    if (hasInputPhoto) {
      context[`image_${imageIndex}`] =
        "Room photo — the actual space to redesign. Preserve layout and architectural features.";
      imageIndex++;
    }

    if (hasPreviousOutput) {
      context[`image_${imageIndex}`] =
        "Previous design iteration — the starting point to refine and improve upon.";
    }

    if (hasReferencePhotos) {
      context[`remaining_images`] =
        "Furniture and decor reference photos — incorporate these specific pieces into the design.";
    }

    return context;
  };

  private mapPaletteToColors = (params: { palette: string }): TPaletteColors => {
    const { palette } = params;

    const paletteMap: Record<string, TPaletteColors> = {
      light: {
        primary: ["white", "light grey", "cream"],
        accents: ["soft blue", "pale wood", "silver"],
      },
      dark: {
        primary: ["charcoal", "deep navy", "espresso brown"],
        accents: ["brushed gold", "emerald green", "burgundy"],
      },
      warm: {
        primary: ["warm beige", "soft terracotta", "honey"],
        accents: ["matte black", "natural wood", "burnt sienna"],
      },
      cool: {
        primary: ["ice blue", "slate grey", "lavender"],
        accents: ["chrome", "frosted glass", "mint green"],
      },
      pastel: {
        primary: ["blush pink", "powder blue", "mint green"],
        accents: ["soft lilac", "pale yellow", "warm white"],
      },
    };

    return (
      paletteMap[palette] ?? {
        primary: [palette],
        accents: [],
      }
    );
  };
}
