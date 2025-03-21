import API from "../../utils/axiosConfig";
import { clearCurrentUser } from "../../state/current-user/currentUserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Spinner from "../Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);
      await API.post("auth/logout");
      dispatch(clearCurrentUser());
      navigate("/login", { replace: true });
      // eslint-disable-next-line
    } catch (error) {
      //console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={logout} className="flex flex-col items-center px-5 link">
      {loading ? (
        <Spinner size={2} />
      ) : (
        <>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="text-2xl md:text-3xl cursor-pointer"
          />
          <span>Logout</span>
        </>
      )}
    </button>
  );
}
