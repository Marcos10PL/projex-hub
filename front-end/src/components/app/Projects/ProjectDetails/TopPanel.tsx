import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";
import { ProjectType } from "../../../../utils/zodSchemas";
import { statusColor } from "../../../../utils/data";
import { useSelector } from "react-redux";
import { RootState } from "../../../../state/store";
import DeleteAlert from "../../../DeleteAlert";
import { useState } from "react";
import {
  useDeleteProjectMutation,
  useRemoveMemberMutation,
} from "../../../../state/projects/projectsApi";

type TopPanelProps = {
  id: ProjectType["_id"];
  status: ProjectType["status"];
  owner: ProjectType["owner"];
};

export default function TopPanel({ id, status, owner }: TopPanelProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const navigate = useNavigate();

  const [deleteProject, { isLoading: isLoadingDeleteProject }] =
    useDeleteProjectMutation();
  const [deleteMember, { isLoading: isLoadingDeleteMember }] =
    useRemoveMemberMutation();

  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (projectOwner) {
      try {
        await deleteProject({ id }).unwrap();
        navigate("/projects", { replace: true });
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    } else {
      try {
        if (!user) return;
        await deleteMember({
          id,
          memberId: user?._id,
          currentUser: true,
        }).unwrap();
        navigate("/projects", { replace: true });
      } catch (err) {
        console.error("Failed to leave project:", err);
      }
    }
  };

  const projectOwner = user?._id === owner._id;

  return (
    <div className="flex items-center text-lg bg-slate-900 px-4 py-2 rounded-lg shadow-[0_0_6px_1px_#314158] justify-between">
      {/* STATUS */}
      <div className="flex items-center gap-2">
        <div className={`${statusColor[status]} w-4 h-4 rounded-full`} />
        <span className="uppercase">{status}</span>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-5">
        {projectOwner && (
          <NavLink
            to={`/projects/${id}/update`}
            className="flex items-center gap-2 text-primary cursor-pointer hover:text-violet-300 transition-colors active:text-violet-300"
          >
            <span>Edit</span>
            <FontAwesomeIcon icon={faEdit} />
          </NavLink>
        )}
        <button
          className="flex items-center gap-2 text-red-400 cursor-pointer hover:text-red-300 transition-colors active:text-red-300"
          onClick={() => setIsOpen(true)}
        >
          <span>{projectOwner ? "Delete" : "Leave"}</span>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      <DeleteAlert
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleDelete={handleDelete}
        message={`Are you sure you want to ${projectOwner ? "delete" : "leave"} this project?`}
        loading={isLoadingDeleteProject || isLoadingDeleteMember}
        // error={error}
      />
    </div>
  );
}
