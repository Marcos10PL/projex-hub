import { faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectType } from "../../../../../utils/zodSchemas";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../state/store";
import { useState } from "react";
import DeleteAlert from "../../../../DeleteAlert";
import { useRemoveMemberMutation } from "../../../../../state/projects/projectsApi";

type MemberProps = {
  id: ProjectType["_id"];
  member: ProjectType["members"][number];
  owner: ProjectType["owner"];
  isOwner?: true;
};

export default function Member({ id, member, isOwner, owner }: MemberProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);

  const [isOpen, setIsOpen] = useState(false);

  const [removeMember, { isLoading }] = useRemoveMemberMutation();

  const projectOwner = user?._id === owner._id;
  const you = user?._id === member._id;

  const handleDelete = async () => {
    try {
      await removeMember({ id, memberId: member._id }).unwrap();
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
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

      <DeleteAlert
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleDelete={handleDelete}
        message={`Are you sure you want remove "${member.username}" from your project?`}
        loading={isLoading}
      />
    </div>
  );
}
