const designPrinciples = [
  "Restraint over abundance: include only what serves the room's function and leave breathable negative space — a real, tidy, lived-in home, not a staged showroom.",
  "Functional coherence: render the room complete and usable for its type, each piece placed logically, with doorways, walkways, and windows kept clear.",
  "Render the selected style in its current, professional real-world form — not a dated, kitschy, or stereotyped interpretation.",
];

const globalAvoid = [
  "distorted or melted furniture, warped perspective, impossible geometry",
  "text, watermarks, logos, signage",
];

const firstIterationQuality = [
  "ultra photorealistic",
  "sharp focus",
  "realistic proportions and shadows",
  "accurate material textures",
  "natural, well-composed real-home interior photography",
];

const refinementQuality = [
  "ultra photorealistic",
  "sharp focus",
  "realistic proportions and shadows",
  "accurate material textures",
];

type TFirstIterationPromptParams = {
  stylePreset?: string;
  palette?: string;
  roomType?: string;
  prompt?: string;
  hasInputPhoto: boolean;
  hasInspirationPhoto: boolean;
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
  const {
    stylePreset,
    palette,
    roomType,
    prompt,
    hasInputPhoto,
    hasInspirationPhoto,
    hasReferencePhotos,
  } = params;

  const images: Record<string, string> = {};

  if (hasInputPhoto) {
    images.image_1 =
      "Photo of the actual room — the single source of truth for all architecture: room shape, wall layout, openings, ceiling, and perspective. Reproduce its geometry exactly.";
  }

  if (hasInspirationPhoto) {
    const key = hasInputPhoto ? "image_2" : "image_1";
    images[key] = hasInputPhoto
      ? "Design inspiration — aesthetics only (style, colour palette, materials, mood). Not a source of geometry: ignore its walls, room shape, layout, and openings. All architecture comes from the input photo."
      : "Design inspiration. Follow its style, colour palette, materials, and mood — do not copy specific furniture pieces, their placement, or the room layout.";
  }

  if (hasReferencePhotos) {
    const hasAnyPhoto = hasInputPhoto || hasInspirationPhoto;
    const key = hasAnyPhoto ? "remaining_images" : "reference_images";
    images[key] =
      "Furniture and decor references. Each piece appears in the output with its exact type, silhouette, proportions, materials, and color — one reference, one object.";
  }

  const hardConstraints: string[] = [];

  if (hasInputPhoto) {
    hardConstraints.push(
      "The room's architecture and shell are copied verbatim from the input photo: the exact position, shape, length, angle, and number of every wall, plus all openings (doors, windows), ceiling, floor plan, and built-in features. Do not add, remove, move, resize, reshape, or merge any of them — and never invent new structural elements such as niches, recesses, alcoves, partitions, columns, soffits, or dropped ceilings.",
      "Camera position, lens, perspective, and framing match the input photo precisely.",
      "All furniture and decor must fit inside the visible room boundaries.",
    );
  }

  if (hasInspirationPhoto) {
    hardConstraints.push(
      hasInputPhoto
        ? "Inspiration image is a style-only reference: take only its aesthetic cues — colours, materials, finishes, furniture style, and mood. Ignore its architecture entirely — its walls, room shape, proportions, openings, and spatial layout must have zero influence on the output. All geometry comes exclusively from the input photo."
        : "Inspiration image is a style-only reference. Do not replicate its layout, furniture arrangement, or any specific objects — extract only aesthetic cues.",
    );
  }

  if (hasReferencePhotos) {
    hardConstraints.push(
      "Each reference furniture piece keeps its identity: same type, silhouette, proportions, materials, and color. Do not merge, split, or reinterpret references.",
    );
  }

  const style: Record<string, unknown> = {};
  if (roomType?.trim()) style.room_type = roomType.trim();
  if (stylePreset?.trim()) style.design_style = stylePreset.trim();
  if (palette?.trim()) style.color_palette = palette.trim();

  return JSON.stringify({
    task: "photorealistic interior design visualization",
    goal: hasInputPhoto
      ? "Redesign the room from the input photo at a surface level — materials, finishes, furniture, decor, and lighting mood — while leaving its architecture untouched."
      : "Generate a photorealistic interior matching the described scene and style.",
    design_principles: designPrinciples,
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
    avoid: globalAvoid,
    quality: firstIterationQuality,
  });
};

export const generateSubsequentIterationPrompt = (
  params: TSubsequentIterationPromptParams,
): string => {
  const { stylePreset, palette, roomType, prompt, hasReferencePhotos } = params;

  const images: Record<string, string> = {
    image_1:
      "Previous design iteration. This is the base — preserve every pixel-level detail unless the user_request explicitly changes it.",
  };

  if (hasReferencePhotos) {
    images.remaining_images =
      "Furniture and decor references the user wants incorporated into the refined design. Each piece must appear in the output with its exact type, silhouette, proportions, materials, and color — one reference, one object.";
  }

  const scopeConstraint = hasReferencePhotos
    ? "Allowed changes: (1) anything user_request explicitly names, (2) integrating every reference piece into the scene — replacing or supplementing existing furniture as needed. Everything else — unrelated furniture, materials, colors, lighting, and layout — stays identical to the previous iteration."
    : "Only what user_request explicitly names may change. Everything else — furniture, materials, colors, lighting, and layout — stays identical to the previous iteration.";

  const hardConstraints: string[] = [
    scopeConstraint,
    "Architecture is fully locked to the previous iteration: every wall, door, window, opening, ceiling, and built-in feature keeps its exact position, shape, and size. Never add, remove, move, reshape, or hide any of them — not even when the requested change sits right next to them.",
    "When a change removes, replaces, or moves an object, reconstruct whatever was behind or around it (wall, floor, door, window, or built-in) to match the previous iteration. Editing one object must never delete or alter any architectural element.",
    "Camera position, perspective, and framing are identical to the previous iteration.",
    "Any furniture that is added or repositioned must keep doorways, walkways, and windows clear and unobstructed.",
  ];

  if (hasReferencePhotos) {
    hardConstraints.push(
      "Each reference piece keeps its exact type, silhouette, proportions, materials, and color. Do not merge, split, or reinterpret references.",
    );
  }

  const style: Record<string, unknown> = {};
  if (roomType?.trim()) style.room_type = roomType.trim();
  if (stylePreset?.trim()) style.design_style = stylePreset.trim();
  if (palette?.trim()) style.color_palette = palette.trim();

  return JSON.stringify({
    task: "interior design visualization — targeted refinement",
    goal: "Apply only the change described in user_request. Everything else is locked.",
    hard_constraints: hardConstraints,
    images,
    ...(Object.keys(style).length > 0 && { style }),
    ...(prompt?.trim() && { user_request: prompt.trim() }),
    avoid: globalAvoid,
    quality: refinementQuality,
  });
};
