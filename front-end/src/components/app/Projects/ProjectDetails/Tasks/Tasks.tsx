import { ProjectType } from "../../../../../utils/zodSchemas";
import Task from "./Task";

type TasksProps = {
  tasks: ProjectType["tasks"];
};

export default function Tasks({ tasks }: TasksProps) {
  return (
    <div className="text-violet-300 bg-slate-900 p-4 rounded-lg border-2 border-slate-700">
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <>
          <h1 className="pb-1">
            Tasks:
            <span className="text-gray-400">
              {" "}
              ({tasks.filter(task => task.status === "done").length}/
              {tasks.length})
            </span>
          </h1>

          <div className="flex items-center flex-wrap gap-2">
            {tasks.map(task => (
              <Task key={task._id} task={task} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
