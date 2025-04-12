import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";
import { ProjectType } from "../../../../utils/zodSchemas";
import { statusColor } from "../../../../utils/data";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { AppDispatch, RootState } from "../../../../state/store";
import DeleteAlert from "../../../DeleteAlert";
import { useState } from "react";
import { deleteProject } from "../../../../state/projects/projectThunk";

type TopPanelProps = {
  id: ProjectType["_id"];
  status: ProjectType["status"];
  owner: ProjectType["owner"];
};

export default function TopPanel({ id, status, owner }: TopPanelProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const { loadingProject } = useSelector((state: RootState) => state.projects);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    dispatch(deleteProject({ id }));
    navigate("/projects", { replace: true });
  };

  const projectOwner = user?._id === owner._id;

  return (
    <div
      className={clsx(
        "flex items-center text-lg bg-slate-900 px-4 py-2 rounded-lg shadow-[0_0_6px_1px_#314158]",
        projectOwner ? "justify-between" : "justify-center"
      )}
    >
      {/* STATUS */}
      <div className="flex items-center gap-2">
        <div className={`${statusColor[status]} w-4 h-4 rounded-full`} />
        <span className="uppercase">{status}</span>
      </div>

      {/* BUTTONS */}
      {projectOwner && (
        <div className="flex gap-5">
          <NavLink
            to={`/projects/${id}/update`}
            className="flex items-center gap-2 text-primary cursor-pointer hover:text-violet-300 transition-colors active:text-violet-300"
          >
            <span>Edit</span>
            <FontAwesomeIcon icon={faEdit} />
          </NavLink>
          <button
            className="flex items-center gap-2 text-red-400 cursor-pointer hover:text-red-300 transition-colors active:text-red-300"
            onClick={() => setIsOpen(true)}
          >
            <span>Delete</span>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}

      <DeleteAlert
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleDelete={handleDelete}
        message="this project"
        loading={loadingProject}
      />
    </div>
  );
}
