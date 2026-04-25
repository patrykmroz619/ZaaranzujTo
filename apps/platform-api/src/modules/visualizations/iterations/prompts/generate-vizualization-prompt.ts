type TFirstIterationPromptParams = {
  stylePreset?: string;
  palette?: string;
  roomType?: string;
  prompt?: string;
  hasInputPhoto: boolean;
  hasReferencePhotos: boolean;
};

type TSubsequentIterationPromptParams = {
  stylePreset?: string;
  palette?: string;
  roomType?: string;
  prompt?: string;
  hasReferencePhotos: boolean;
};

export const generateFirstIterationPrompt = (params: TFirstIterationPromptParams): string => {
  const { stylePreset, palette, roomType, prompt, hasInputPhoto, hasReferencePhotos } = params;

  // ── images ────────────────────────────────────────────────────────────────
  const images: Record<string, string> = {};

  if (hasInputPhoto) {
    images.image_1 =
      "Photo of the actual room. It defines the geometry, perspective, lighting direction, and every architectural detail of the output.";
  }

  if (hasReferencePhotos) {
    const key = hasInputPhoto ? "remaining_images" : "reference_images";
    images[key] =
      "Furniture and decor references. Each piece appears in the output with its exact type, silhouette, proportions, materials, and color — one reference, one object.";
  }

  // ── hard constraints ──────────────────────────────────────────────────────
  const hardConstraints: string[] = [];

  if (hasInputPhoto) {
    hardConstraints.push(
      "Room architecture is locked to the input photo. Walls, openings, ceiling, and built-in features stay exactly as shown — nothing added, removed, moved, resized, or reshaped.",
      "Camera position, lens, perspective, and framing match the input photo precisely.",
      "All furniture and decor must fit inside the visible room boundaries.",
    );
  }

  if (hasReferencePhotos) {
    hardConstraints.push(
      "Each reference furniture piece keeps its identity: same type, silhouette, proportions, materials, and color. Do not merge, split, or reinterpret references.",
    );
  }

  // ── style ─────────────────────────────────────────────────────────────────
  const style: Record<string, unknown> = {};
  if (roomType?.trim()) style.room_type = roomType.trim();
  if (stylePreset?.trim()) style.design_style = stylePreset.trim();
  if (palette?.trim()) style.color_palette = palette.trim();

  // ── prompt JSON ───────────────────────────────────────────────────────────
  return JSON.stringify({
    task: "photorealistic interior design visualization",
    goal: hasInputPhoto
      ? "Redesign the room from the input photo at a surface level — materials, finishes, furniture, decor, and lighting mood — while leaving its architecture untouched."
      : "Generate a photorealistic interior matching the described scene and style.",
    ...(hardConstraints.length > 0 && { hard_constraints: hardConstraints }),
    ...(Object.keys(images).length > 0 && { images }),
    ...(Object.keys(style).length > 0 && { style }),
    ...(prompt?.trim() && { user_request: prompt.trim() }),
    ...(!hasInputPhoto && {
      shot: {
        lens: "24mm",
        aperture: "f/8.0",
        lighting: "natural soft front sunlight",
        framing: "wide eye-level shot of the whole scene",
      },
    }),
    quality: [
      "ultra photorealistic",
      "sharp focus",
      "realistic proportions and shadows",
      "accurate material textures",
      "professional interior photography",
    ],
  });
};

export const generateSubsequentIterationPrompt = (
  params: TSubsequentIterationPromptParams,
): string => {
  const { stylePreset, palette, roomType, prompt, hasReferencePhotos } = params;

  // ── images ────────────────────────────────────────────────────────────────
  const images: Record<string, string> = {
    image_1:
      "Previous design iteration. This is the base — preserve every pixel-level detail unless the user_request explicitly changes it.",
  };

  if (hasReferencePhotos) {
    images.remaining_images =
      "Furniture and decor references the user wants incorporated into the refined design. Each piece must appear in the output with its exact type, silhouette, proportions, materials, and color — one reference, one object.";
  }

  // ── hard constraints ──────────────────────────────────────────────────────
  const hardConstraints: string[] = [];

  if (hasReferencePhotos) {
    hardConstraints.push(
      "Allowed changes: (1) anything user_request explicitly names, (2) integrating every reference piece into the scene — replacing or supplementing existing furniture as needed. Everything else — unrelated furniture, materials, colors, lighting, layout, and architecture — stays identical to the previous iteration.",
      "Camera position, perspective, and framing are identical to the previous iteration.",
      "Each reference piece keeps its exact type, silhouette, proportions, materials, and color. Do not merge, split, or reinterpret references.",
    );
  } else {
    hardConstraints.push(
      "Only what user_request explicitly names may change. Everything else — furniture, materials, colors, lighting, layout, and architecture — stays identical to the previous iteration.",
      "Camera position, perspective, and framing are identical to the previous iteration.",
    );
  }

  // ── style ─────────────────────────────────────────────────────────────────
  const style: Record<string, unknown> = {};
  if (roomType?.trim()) style.room_type = roomType.trim();
  if (stylePreset?.trim()) style.design_style = stylePreset.trim();
  if (palette?.trim()) style.color_palette = palette.trim();

  // ── prompt JSON ───────────────────────────────────────────────────────────
  return JSON.stringify({
    task: "interior design visualization — targeted refinement",
    goal: "Apply only the change described in user_request. Everything else is locked.",
    hard_constraints: hardConstraints,
    images,
    ...(Object.keys(style).length > 0 && { style }),
    ...(prompt?.trim() && { user_request: prompt.trim() }),
    quality: [
      "ultra photorealistic",
      "sharp focus",
      "realistic proportions and shadows",
      "accurate material textures",
    ],
  });
};
