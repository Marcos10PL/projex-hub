import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addTaskSchema, ProjectType } from "../../../../../utils/zodSchemas";
import Task from "./Task";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../state/store";
import AddForm from "../AddForm";
import { addTask } from "../../../../../state/projects/tasksThunk";
import { useState } from "react";
import { MAX_TASKS } from "../../../../../utils/data";

type TasksProps = {
  id: ProjectType["_id"];
  tasks: ProjectType["tasks"];
  owner: ProjectType["owner"];
};

export default function Tasks({ id, tasks, owner }: TasksProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const { loadingTasks, error } = useSelector(
    (state: RootState) => state.projects
  );
  const [isOpen, setIsOpen] = useState(false);

  const projectOwner = user?._id === owner._id;

  return (
    <div className="text-violet-300 p-4 rounded-4xl border-2 border-transparent border-l-violet-400">
      <h1 className="pb-1 flex items-center gap-2">
        <FontAwesomeIcon icon={faTasks} />
        <span>Tasks</span>
        <span className="text-gray-400">
          {" "}
          ({tasks.filter(task => task.status === "done").length}/{tasks.length})
          (max 50)
        </span>
      </h1>

      <div className="flex items-center flex-wrap gap-2">
        {projectOwner && tasks.length < MAX_TASKS && (
          <AddForm
            id={id}
            schema={addTaskSchema}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            placeholder="Task name..."
            fieldName="name"
            loading={loadingTasks}
            error={error}
            asyncThunk={addTask}
          />
        )}
        {tasks
          .filter(task => task.status === "in-progress")
          .map(task => (
            <Task key={task._id} id={id} task={task} owner={owner} />
          ))}
        {tasks
          .filter(task => task.status === "done")
          .map(task => (
            <Task key={task._id} id={id} task={task} owner={owner} />
          ))}
      </div>
    </div>
  );
}
