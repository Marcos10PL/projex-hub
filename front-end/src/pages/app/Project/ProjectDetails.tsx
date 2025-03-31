import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import TopPanel from "../../../components/app/Projects/ProjectDetails/TopPanel";
import MainPanel from "../../../components/app/Projects/ProjectDetails/MainPanel";
import Members from "../../../components/app/Projects/ProjectDetails/Members/Members";
import Tasks from "../../../components/app/Projects/ProjectDetails/Tasks/Tasks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../state/store";
import { useEffect } from "react";
import { fetchProject } from "../../../state/project/projectThunk";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { project, loading } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) dispatch(fetchProject(id));
  }, [id, dispatch]);

  if (loading) return <Spinner size={2} />;

  if (!project) return <p>Project not found</p>;

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

      <Members owner={project.owner} members={project.members} />

      <Tasks tasks={project.tasks} owner={project.owner} />
    </>
  );
}
