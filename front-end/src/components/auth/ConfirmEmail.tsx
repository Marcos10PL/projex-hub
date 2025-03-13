import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import API from "../../lib/axiosConfig";

export default function ConfirmEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await API.post("api/auth/confirm-email", { token });
        if (res.data.success) {
          setMessage("Email has been confirmed.");
        }
        // eslint-disable-next-line
      } catch (err) {
        setMessage(
          "Sorry, but we couldn't confirm your email. Please try again later."
        );
        // console.log(err);
      }
    };

    if (token) verifyEmail();
  }, [token]);

  if (!token) {
    navigate("/login");
  }

  return (
    <div className="text-center">
      <p className="px-3 mb-6">{message}</p>
      <NavLink to="/login" className="link">
        Back to login
      </NavLink>
    </div>
  );
}
