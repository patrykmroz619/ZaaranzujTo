export type TWorkspaceStyle =
  | "scandinavian"
  | "industrial"
  | "minimalist"
  | "classic"
  | "boho"
  | "modern";

export type TColorPalette = "light" | "dark" | "warm" | "cool" | "pastel";

export type TRoomType = "livingRoom" | "bedroom" | "kitchen" | "bathroom" | "office";

export type TWorkspaceFormValues = {
  name: string;
  style: string;
  palette: string;
  roomType: string;
  prompt: string;
  roomPhotoFile: File | null;
  furniturePhotoFiles: File[];
};
