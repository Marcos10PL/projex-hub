import { useParams } from "react-router-dom";
import ProjectForm from "../../../../components/app/Projects/ProjectForm";
import { useGetProjectQuery } from "../../../../state/projects/projectsApi";
import Spinner from "../../../../components/Spinner";

export default function UpdateProject() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useGetProjectQuery(id ?? "");

  if (isLoading) return <Spinner size={2} />;

  if (isError) return <p className="text-center">Error loading project</p>;

  if (!data?.project) return <p className="text-center">Project not found</p>;

  return <ProjectForm id={id} project={data.project} type="update" />;
}
