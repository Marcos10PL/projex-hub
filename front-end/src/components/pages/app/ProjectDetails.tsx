import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  console.log(id);

  return (
    <div>
      {id}
    </div>
  );
}