import { daysOverdue, daysUpdated } from "../../../../utils/utils";
import { ProjectType } from "../../../../utils/zodSchemas";

type MainPanelProps = {
  createdAt: ProjectType["createdAt"];
  updatedAt: ProjectType["updatedAt"];
  name: ProjectType["name"];
  dueDate: ProjectType["dueDate"];
  description: ProjectType["description"];
};

export default function MainPanel({
  createdAt,
  updatedAt,
  name,
  dueDate,
  description,
}: MainPanelProps) {
  return (
    <div className="space-y-4 p-4 rounded-4xl border-2 border-transparent border-l-gray-400">
      <p className="flex items-center gap-2 text-gray-500">
        Created at {new Date(createdAt).toLocaleDateString()}
        <br className="block md:hidden" />
        {createdAt !== updatedAt && daysUpdated(updatedAt)}
      </p>

      <p className="text-3xl">{name}</p>

      <p className="font-bold">
        {dueDate ? (
          <>
            <span>Due date: {new Date(dueDate).toLocaleDateString()}</span>
            <br className="block md:hidden" />
            {new Date(dueDate) < new Date() && (
              <span className="font-normal text-red-500">
                {daysOverdue(dueDate)}
              </span>
            )}
          </>
        ) : (
          "No due date"
        )}
      </p>

      <p>{description}</p>
    </div>
  );
}
