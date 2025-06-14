import { useParams } from "react-router-dom";
import Spinner from "../../../../components/Spinner";
import TopPanel from "../../../../components/app/Projects/ProjectDetails/TopPanel";
import MainPanel from "../../../../components/app/Projects/ProjectDetails/MainPanel";
import Members from "../../../../components/app/Projects/ProjectDetails/Members/Members";
import Tasks from "../../../../components/app/Projects/ProjectDetails/Tasks/Tasks";
import { useGetProjectQuery } from "../../../../state/projects/projectsApi";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetProjectQuery(id ?? "");
  const project = data?.project || null;

  if (isLoading) return <Spinner size={2} />;

  if (isError) return <p className="text-center">Error loading project</p>;

  if (!project) return <p className="text-center">Project not found</p>;

  return (
    <>
      <TopPanel
        id={project._id}
        status={project.status}
        owner={project.owner}
      />

      <MainPanel
        name={project.name}
        description={project.description}
        createdAt={project.createdAt}
        updatedAt={project.updatedAt}
        dueDate={project.dueDate}
      />

      <Members
        id={project._id}
        owner={project.owner}
        members={project.members}
      />

      <Tasks id={project._id} tasks={project.tasks} owner={project.owner} />
    </>
  );
}
