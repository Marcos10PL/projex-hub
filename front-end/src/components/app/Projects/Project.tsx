import { useSelector } from "react-redux";
import { ProjectType } from "../../../utils/zodSchemas";
import { RootState } from "../../../state/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { statusColor } from "../../../utils/data";
import { daysUpdated } from "../../../utils/utils";

type ProjectProps = {
  project: ProjectType;
};

export default function Project({ project }: ProjectProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);

  return (
    <NavLink
      className="relative bg-slate-900 rounded-lg p-5 border-2 border-slate-700 hover:border-secondary hover:shadow-[0_0_10px_1px_#00d49f] transition-all duration-300 hover:cursor-pointer hover:bg-slate-800 space-y-2 overflow-hidden active:shadow-[0_0_10px_1px_#00d49f] active:bg-slate-800 active:border-secondary"
      to={`/projects/${project._id}`}
    >
      {/* HEADER */}
      <h1 className="font-bold text-xl text-white pb-2 flex items-center gap-3">
        <div
          className={`${statusColor[project.status]} min-w-2.5 min-h-2.5 rounded-full`}
        />
        <span className="line-clamp-2">{project.name}</span>
      </h1>

      {/* DESCRIPTION */}
      <p className="line-clamp-2 text-gray-300">{project.description}</p>

      <p className="font-bold">
        {project?.dueDate
          ? `Due date: ${new Date(project.dueDate).toLocaleDateString()}`
          : "No due date"}
      </p>

      {/* TIMESTAMPS, OWNER */}
      <div className="text-sm text-gray-400 grid grid-cols-1 grid-rows-2 gap-2 pt-3 my-0">
        {project.createdAt !== project.updatedAt && (
          <p className="row-start-1">{daysUpdated(project.updatedAt)}</p>
        )}
        <div className="flex items-center gap-2 row-start-2">
          Created by {project.owner.username === user?.username && "you"}
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
          <p>{new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* ABSOLUTE - USERS, TASKS */}
      <div className="absolute bottom-10 right-0 flex items-center gap-2 px-2 py-1 bg-slate-800 rounded-s-lg border-2 border-r-0 border-slate-700 text-emerald-200">
        <p>{project.members.length + 1}</p>
        <FontAwesomeIcon icon={faUser} />
      </div>

      <div className="absolute bottom-0 right-0 flex items-center gap-2 text-violet-300 bg-slate-800 rounded-tl-lg border-l-2 border-t-2 border-slate-700 px-2 py-1">
        <p>
          {project.tasks.filter(task => task.status === "done").length}/
          {project.tasks.length}
        </p>
        <FontAwesomeIcon icon={faListCheck} />
      </div>
    </NavLink>
  );
}
