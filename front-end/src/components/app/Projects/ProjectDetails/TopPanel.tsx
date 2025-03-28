import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { ProjectType } from "../../../../utils/zodSchemas";
import { statusColor } from "../../../../utils/data";

type TopPanelProps = {
  id: ProjectType["_id"];
  status: ProjectType["status"];
};

export default function TopPanel({ id, status }: TopPanelProps) {
  return (
    <div className="flex items-center justify-between text-lg bg-slate-900 px-4 py-2 rounded-lg shadow-[0_0_6px_1px_#314158]">
      <div className="flex items-center gap-2">
        <div
          className={`${statusColor[status]} w-4 h-4 rounded-full`}
        />
        <span className="uppercase">{status}</span>
      </div>

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
    </div>
  );
}
