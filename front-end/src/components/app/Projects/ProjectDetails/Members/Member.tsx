import { faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  apiResponseSchema,
  ProjectType,
} from "../../../../../utils/zodSchemas";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../state/store";
import useApi from "../../../../../utils/myHooks/useApi";
import { useState } from "react";
import Spinner from "../../../../Spinner";
import { useParams } from "react-router-dom";

type MemberProps = {
  member: ProjectType["members"][number];
  owner: ProjectType["owner"];
  isOwner?: true;
};

export default function Member({ member, isOwner, owner }: MemberProps) {
  const { id } = useParams<{ id: string }>();

  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const projectOwner = user?._id === owner._id;
  const you = user?._id === member._id;

  const [isOpen, setIsOpen] = useState(false);

  const { loading, fetchData } = useApi(
    `/projects/${id}/members/${member._id}`,
    apiResponseSchema,
    "delete"
  );

  const handleDelete = async () => {
    const res = await fetchData();
    if (res?.success) setIsOpen(false);
  };

  return (
    <div
      key={member._id}
      className="flex items-center justify-between my-2 px-3 h-13 rounded-lg bg-gray-800 w-full md:w-fit shadow-[0_0_2px_2px_#113233]"
    >
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faUser} />
        <span>
          {member.username} {isOwner && "(owner)"} {you && "(you)"}
        </span>
      </div>

      {projectOwner && !isOwner && (
        <button
          className="text-red-300 px-3 py-1.5 ml-5 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer active:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={faTrash} className="text-xl" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/20 backdrop-blur-sm">
          <div className="bg-gray-800 border-2 border-gray-700 p-5 rounded-lg shadow-lg flex flex-col items-center gap-3 text-text w-5/6 md:w-fit">
            <p>
              Are you sure you want to remove{" "}
              <span className="text-emerald-100">{member.username}</span> from
              your project?
            </p>
            <div className="flex gap-3 *:uppercase *:font-bold *:px-3 *:py-1.5 *:transition-colors *:cursor-pointer *:active:bg-gray-700 *:rounded-lg *:hover:bg-gray-700">
              <button
                className="cursor-pointer text-red-400"
                onClick={handleDelete}
              >
                {loading ? <Spinner size={1} /> : "delete"}
              </button>
              <button className="text-text" onClick={() => setIsOpen(false)}>
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
