import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectType } from "../../../../../utils/zodSchemas";

type MemberProps = {
  member: ProjectType["members"][number];
};

export default function Member({ member }: MemberProps) {
  return (
    <div key={member._id} className="flex items-center gap-2 my-2">
      <FontAwesomeIcon icon={faUser} />
      <span>{member.username}</span>
    </div>
  );
}
