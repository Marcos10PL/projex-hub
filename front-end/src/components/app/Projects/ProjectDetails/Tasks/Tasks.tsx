import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectType } from "../../../../../utils/zodSchemas";
import Task from "./Task";
import { faPlus, faTasks } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../state/store";

type TasksProps = {
  tasks: ProjectType["tasks"];
  owner: ProjectType["owner"];
};

export default function Tasks({ tasks, owner }: TasksProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const projectOwner = user?._id === owner._id;

  return (
    <div className="text-violet-300 p-4 rounded-4xl border-2 border-transparent border-l-violet-400">
      <>
        <h1 className="pb-1 flex items-center gap-2">
          <FontAwesomeIcon icon={faTasks} />
          <span>Tasks:</span>
          <span className="text-gray-400">
            {" "}
            ({tasks.filter(task => task.status === "done").length}/
            {tasks.length})
          </span>
        </h1>

        <div className="flex items-center flex-wrap gap-2">
          {projectOwner && (
            <button
              type="button"
              className="flex items-center justify-center px-10 h-13 w-full md:w-fit mb-2 md:mb-0 rounded-lg bg-gray-700 border-2 border-violet-400 hover:bg-gray-600 transition-colors cursor-pointer shadow-[0_0_5px_3px_#222] active:bg-gray-600"
              onClick={() => console.log("Add member")}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
          {tasks.map(task => (
            <>
              <Task key={task._id} task={task} owner={owner} />
            </>
          ))}
        </div>
      </>
    </div>
  );
}
