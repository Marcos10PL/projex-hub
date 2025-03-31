import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { ProjectType } from "../../../../utils/zodSchemas";
import { statusColor } from "../../../../utils/data";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "../../../../state/store";

type TopPanelProps = {
  id: ProjectType["_id"];
  status: ProjectType["status"];
  owner: ProjectType["owner"];
};

export default function TopPanel({ id, status, owner }: TopPanelProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const projectOwner = user?._id === owner._id;

  return (
    <div
      className={clsx(
        "flex items-center text-lg bg-slate-900 px-4 py-2 rounded-lg shadow-[0_0_6px_1px_#314158]",
        projectOwner ? "justify-between" : "justify-center"
      )}
    >
      <div className="flex items-center gap-2">
        <div className={`${statusColor[status]} w-4 h-4 rounded-full`} />
        <span className="uppercase">{status}</span>
      </div>

      {projectOwner && (
        <div className="flex gap-5">
          <NavLink
            to={`/projects/${id}/update`}
            className="flex items-center gap-2 text-primary cursor-pointer hover:text-violet-300 transition-colors active:text-violet-300"
          >
            <span>Edit</span>
            <FontAwesomeIcon icon={faEdit} />
          </NavLink>
          <NavLink
            to={`/projects/${id}/delete`}
            className="flex items-center gap-2 text-red-400 cursor-pointer hover:text-red-300 transition-colors active:text-red-300"
          >
            <span>Delete</span>
            <FontAwesomeIcon icon={faTrash} />
          </NavLink>
        </div>
      )}
    </div>
  );
}
