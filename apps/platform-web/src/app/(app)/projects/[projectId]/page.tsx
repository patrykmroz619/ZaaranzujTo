import { ProjectDetailView } from "@/views/projects";

type TProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

const ProjectDetailPage = async (props: TProjectDetailPageProps) => {
  const { projectId } = await props.params;

  return <ProjectDetailView projectId={projectId} />;
};

export default ProjectDetailPage;
