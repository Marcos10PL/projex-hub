import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import ProjectForm from "../../../components/app/Projects/ProjectForm";

export default function UpdateProject() {
  const { id } = useParams<{ id: string }>();

  const { loadingProject, project, error } = useSelector(
    (state: RootState) => state.projects
  );

  if (!project) return <p className="text-center">Project not found</p>;

  return (
    <ProjectForm
      id={id}
      project={project}
      loading={loadingProject}
      error={error}
      type="update"
    />
  );
}
