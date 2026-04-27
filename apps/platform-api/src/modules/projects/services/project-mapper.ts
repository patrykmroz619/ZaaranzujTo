import { projectObjectSchema } from "@repo/contracts/projects";

import type { TProjectDocument } from "../schemas/project.schema";

export const mapProjectDocumentToProjectObject = ({
  projectDocument,
  visualizationCount,
}: {
  projectDocument: TProjectDocument;
  visualizationCount?: number;
}) => {
  return projectObjectSchema.parse({
    id: projectDocument._id.toString(),
    name: projectDocument.name,
    visualizationCount,
    createdAt: projectDocument.createdAt.toISOString(),
    updatedAt: projectDocument.updatedAt.toISOString(),
  });
};
