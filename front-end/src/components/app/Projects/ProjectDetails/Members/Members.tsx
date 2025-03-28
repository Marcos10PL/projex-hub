import { ProjectType } from "../../../../../utils/zodSchemas";
import Member from "./Member";

type MemebersProps = {
  owner: ProjectType["owner"];
  members: ProjectType["members"];
};

export default function Members({ owner, members }: MemebersProps) {
  return (
    <div className="text-emerald-200 bg-slate-900 p-4 rounded-lg border-slate-700 border-2">
      <h1 className="pb-1">
        Memebers: <span className="text-gray-400">({members.length + 1})</span>
      </h1>
      <Member member={owner} />
      {members
        .map(member => <Member key={member._id} member={member} />)
        .sort((a, b) =>
          a.props.member.username.localeCompare(b.props.member.username)
        )}
    </div>
  );
}
