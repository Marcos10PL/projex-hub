import API from "../../lib/axiosConfig";
import { clearCurrentUser } from "../../state/current-user/currentUserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await API.post("auth/logout");
        dispatch(clearCurrentUser());
        navigate("/login", { replace: true });
        // eslint-disable-next-line
      } catch (error) {
        //console.error(error);
      }
    };

    logout();
  });

  return <div>Sorry, we are unable to log you out at this time.</div>;
}
