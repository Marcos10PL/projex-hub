import clsx from "clsx";
import { ProjectType } from "../../../../../utils/zodSchemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faRotateRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../state/store";
import DeleteAlert from "../../../../DeleteAlert";
import { useState } from "react";
import Spinner from "../../../../Spinner";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../../../../../state/projects/projectsApi";

type TaskProps = {
  id: ProjectType["_id"];
  task: ProjectType["tasks"][number];
  owner: ProjectType["owner"];
};

export default function Task({ id, task, owner }: TaskProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);

  const [deleteTask, { isLoading: isLoadingDelete }] = useDeleteTaskMutation();
  const [updateTask, { isLoading: isLoadingUpdate }] = useUpdateTaskMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(task.status);

  const projectOwner = user?._id === owner._id;

  const handleDelete = async () => {
    try {
      await deleteTask({ id, taskId: task._id }).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleUpdateTask = async () => {
    const newStatus = task.status === "done" ? "in-progress" : "done";
    try {
      await updateTask({
        id,
        taskId: task._id,
        task: { status: newStatus },
      }).unwrap();
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <>
      <div
        className={clsx(
          "relative flex items-center gap-8 px-3 rounded-lg bg-gray-800 w-full md:w-fit justify-between my-2 shadow-[0_0_5px_3px_#111222] group h-13",
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
        {projectOwner && (
          <div className="flex gap-2 *:px-3 *:py-1.5 *:bg-gray-900 *:rounded-lg *:hover:bg-gray-700 *:transition-colors *:cursor-pointer *:active:bg-gray-700 *:w-11">
            <button
              disabled={isLoadingUpdate}
              className="text-green-300"
              onClick={handleUpdateTask}
            >
              {isLoadingUpdate ? (
                <Spinner size={1} />
              ) : status === "done" ? (
                <FontAwesomeIcon icon={faRotateRight} className="text-xl" />
              ) : (
                <FontAwesomeIcon icon={faCheck} className="text-xl" />
              )}
            </button>
            <button className="text-red-300" onClick={() => setIsOpen(true)}>
              <FontAwesomeIcon icon={faTrash} className="text-xl" />
            </button>
          </div>
        )}
      </div>

      <DeleteAlert
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleDelete={handleDelete}
        message="Are you sure you want to delete this task?"
        loading={isLoadingDelete}
      />
    </>
  );
}
