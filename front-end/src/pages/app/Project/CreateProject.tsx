import { useSelector } from "react-redux";
import ProjectForm from "../../../components/app/Projects/ProjectForm";
import { RootState } from "../../../state/store";

export default function CreateProject() {
  const { loadingProject, error } = useSelector(
    (state: RootState) => state.projects
  );

  return <ProjectForm loading={loadingProject} type="create" error={error} />;
}
