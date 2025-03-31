import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

type ButtonBackProps = {
  path?: "/projects";
};

export default function ButtonBack({ path }: ButtonBackProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (path ? navigate(path) : navigate(-1))}
      type="button"
      className="link cursor-pointer uppercase flex items-center gap-2"
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      <span>Back</span>
    </button>
  );
}
