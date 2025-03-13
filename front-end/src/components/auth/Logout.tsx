import API from "../../lib/axiosConfig";
import { clearCurrentUser } from "../../state/current-user/currentUserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await API.post("/api/auth/logout");
      dispatch(clearCurrentUser());
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={logout} className="button">Logout</button>;
}
