import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      {id}
    </div>
  );
}