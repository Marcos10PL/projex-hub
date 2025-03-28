import { useParams } from "react-router-dom";
import Spinner from "../../../Spinner";
import useProject from "../../../../utils/myHooks/useProject";
import TopPanel from "../../../app/Projects/ProjectDetails/TopPanel";
import MainPanel from "../../../app/Projects/ProjectDetails/MainPanel";
import Tasks from "../../../app/Projects/ProjectDetails/Tasks/Tasks";
import Members from "../../../app/Projects/ProjectDetails/Members/Members";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  const { loading, project } = useProject({ id });

  if (loading) return <Spinner size={2} />;

  if (!project) return <p>Project not found</p>;

  return (
    <>
      <TopPanel id={project._id} status={project.status} />

      <MainPanel
        name={project.name}
        description={project.description}
        createdAt={project.createdAt}
        updatedAt={project.updatedAt}
        dueDate={project.dueDate}
      />

      <Members owner={project.owner} members={project.members} />

      <Tasks tasks={project.tasks} />
    </>
  );
}
