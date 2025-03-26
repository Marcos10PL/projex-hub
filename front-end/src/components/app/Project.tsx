import { useSelector } from "react-redux";
import { ProjectType } from "../../utils/zodSchemas";
import { RootState } from "../../state/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const statusColor = {
  active: "bg-green-500",
  planned: "bg-yellow-500",
  completed: "bg-blue-500",
  delayed: "bg-red-500",
} as const;

type ProjectProps = {
  project: ProjectType;
};

export default function Project({ project }: ProjectProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);

  return (
    <div className="relative bg-slate-900 rounded-lg p-5 border-2 border-slate-700 hover:border-secondary hover:shadow-[0_0_10px_1px_#00d49f] transition-all duration-300 hover:cursor-pointer hover:bg-slate-800 space-y-2 overflow-hidden">
      <h1 className="font-bold text-xl text-white pb-2 flex items-center gap-3">
        <div
          className={`${statusColor[project.status]} w-3 h-3 rounded-full`}
        />
        <span>{project.name}</span>
      </h1>

      <p className="line-clamp-1 text-gray-300">
        {project.description}
      </p>

      <p className="font-bold">
        {project?.dueDate
          ? `Due date: ${new Date(project.dueDate).toLocaleDateString()}`
          : "No due date"}
      </p>

      <div className="absolute top-0 right-0 flex items-center gap-2 p-2 bg-slate-800 rounded-bl-lg border-l-2 border-b-2 border-slate-700">
        <p>{project.members.length + 1}</p>
        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
      </div>

      <div className="text-sm text-gray-400 flex flex-col gap-2 pt-3">
        <div className="flex items-center gap-2">
          Created by {project.owner.username === user?.username && "you"}
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
          <p>{new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
        <p>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
