import { ProjectType } from "../../../utils/zodSchemas";
import Hr from "../../Hr";
import Project from "./Project";

type ProjectProps = {
  projects: ProjectType[];
  totalProjects: number;
};

export default function ProjectsList({
  projects,
  totalProjects,
}: ProjectProps) {
  return (
    <section className="relative">
      <Hr />
      <div className="top-[-.8rem] md:top-[-1rem] left-1/2 -translate-x-1/2 absolute bg-[var(--background)] px-3">
        {totalProjects} project{totalProjects > 1 && "s"} found
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {projects.map(project => (
          <Project key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
