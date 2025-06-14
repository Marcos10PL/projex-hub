import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

export default function AddProjectButton() {
  return (
    <NavLink
      to="/projects/create"
      className="button flex items-center gap-2 justify-center my-4 uppercase"
    >
      <FontAwesomeIcon icon={faPlus} />
      <span>new</span>
    </NavLink>
  );
}
