import { VisualizationCreateView } from "@/views/visualization-create";

type TNewVisualizationPageProps = {
  params: Promise<{ projectId: string }>;
};

const NewVisualizationPage = async (props: TNewVisualizationPageProps) => {
  const { projectId } = await props.params;

  return <VisualizationCreateView projectId={projectId} />;
};

export default NewVisualizationPage;
