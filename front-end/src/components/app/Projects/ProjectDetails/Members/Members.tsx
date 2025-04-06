import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addMemberSchema, ProjectType } from "../../../../../utils/zodSchemas";
import Member from "./Member";
import { faPeopleGroup, faPlus } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../../../../state/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import AddForm from "../AddForm";
import { addMember } from "../../../../../state/project/membersThunk";

type MemebersProps = {
  id: ProjectType["_id"];
  owner: ProjectType["owner"];
  members: ProjectType["members"];
};

export default function Members({ id, owner, members }: MemebersProps) {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const { loadingMembers, error } = useSelector(
    (state: RootState) => state.project
  );
  const projectOwner = user?._id === owner._id;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-emerald-200 p-4 rounded-4xl border-2 border-transparent border-l-emerald-500">
      <h1 className="pb-1 flex items-center gap-2">
        <FontAwesomeIcon icon={faPeopleGroup} />
        Memebers <span className="text-gray-400">({members.length + 1})</span>
      </h1>

      <div className="flex flex-wrap gap-x-2.5">
        {projectOwner && (
          <>
            {!isOpen && (
              <button
                type="button"
                className="flex items-center justify-center h-13 my-2 px-10 rounded-lg bg-gray-700 w-full md:w-fit border-2 border-emerald-400 hover:bg-gray-600 transition-colors cursor-pointer shadow-[0_0_2px_2px_#113233] active:bg-gray-600 py-3"
                onClick={() => setIsOpen(!isOpen)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            )}
            <AddForm
              id={id}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              schema={addMemberSchema}
              placeholder="Username..."
              fieldName="username"
              loading={loadingMembers}
              error={error}
              asyncThunk={addMember}
            />
          </>
        )}

        <Member id={id} member={owner} owner={owner} isOwner />

        {members
          .map(member => (
            <Member key={member._id} id={id} member={member} owner={owner} />
          ))
          .sort((a, b) =>
            a.props.member.username.localeCompare(b.props.member.username)
          )}
      </div>
    </div>
  );
}
