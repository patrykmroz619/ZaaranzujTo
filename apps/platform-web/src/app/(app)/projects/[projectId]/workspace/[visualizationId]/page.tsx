import { WorkspaceView } from "@/views/workspace";

type TWorkspacePageProps = {
  params: Promise<{ projectId: string; visualizationId: string }>;
};

const WorkspacePage = async (props: TWorkspacePageProps) => {
  const { projectId, visualizationId } = await props.params;

  return <WorkspaceView projectId={projectId} visualizationId={visualizationId} />;
};

export default WorkspacePage;
