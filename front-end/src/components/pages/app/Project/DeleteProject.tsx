import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../../utils/myHooks/useApi";
import { apiResponseSchema } from "../../../../utils/zodSchemas";
import Spinner from "../../../Spinner";
import ErrorMsg from "../../../ErrorMsg";

export default function DeleteProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading, errorMsg, fetchData } = useApi(
    "projects/" + id,
    apiResponseSchema,
    "delete",
    { 404: "Project not found." }
  );

  const deleteProject = async () => {
    const res = await fetchData();
    if (res) {
      navigate("/projects", { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-5 text-center">
      <p className="text-red-400">
        Are you sure you want to delete this project? <br />
        There is no way to undo this action.
      </p>

      <button className="button h-12 w-40" onClick={deleteProject}>
        {loading ? <Spinner size={2} /> : "Delete project"}
      </button>

      <ErrorMsg message={errorMsg} />
    </div>
  );
}
