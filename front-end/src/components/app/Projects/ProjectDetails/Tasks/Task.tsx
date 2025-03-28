import clsx from "clsx";
import { ProjectType } from "../../../../../utils/zodSchemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faRotateRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

type TaskProps = {
  task: ProjectType["tasks"][number];
};

export default function Task({ task }: TaskProps) {
  return (
    <div
      className={clsx(
        "relative flex items-center gap-4 px-3 py-2 rounded-lg bg-gray-800 w-full md:w-fit justify-between my-2 shadow-[0_0_5px_3px_#111222] group",
        task.status === "done" && "opacity-70",
        task.status === "in-progress" && "bg-gray-600"
      )}
    >
      <span className={clsx(task.status === "done" && "line-through")}>
        {task.name}
      </span>

      {task.completedAt && (
        <div className="text-sm text-gray-400 absolute -top-4.5 right-0 mr-1 group-hover:opacity-100 md:opacity-0 transition-opacity duration-200 ">
          {`Completed at ${new Date(task.completedAt).toLocaleDateString()}`}
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex gap-2 *:px-3 *:py-1 ml-5 *:bg-gray-900 *:rounded-lg *:hover:bg-gray-700 *:transition-colors *:cursor-pointer *:active:bg-gray-700">
        <button className="text-green-300">
          {task.status === "done" ? (
            <FontAwesomeIcon icon={faRotateRight} className="text-xl" />
          ) : (
            <FontAwesomeIcon icon={faCheck} className="text-xl" />
          )}
        </button>
        <button className="text-red-300 ">
          <FontAwesomeIcon icon={faTrash} className="text-xl" />
        </button>
      </div>
    </div>
  );
}
