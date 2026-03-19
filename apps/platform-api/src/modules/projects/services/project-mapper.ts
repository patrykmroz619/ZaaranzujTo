import { projectObjectSchema } from "@repo/contracts/projects";

import type { TProjectDocument } from "../schemas/project.schema";

export const mapProjectDocumentToProjectObject = ({
  projectDocument,
}: {
  projectDocument: TProjectDocument;
}) => {
  return projectObjectSchema.parse({
    id: projectDocument._id.toString(),
    name: projectDocument.name,
    visualizationsCount: 0,
    createdAt: projectDocument.createdAt.toISOString(),
    updatedAt: projectDocument.updatedAt.toISOString(),
  });
};
