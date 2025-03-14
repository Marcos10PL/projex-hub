import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import API from "../../lib/axiosConfig";
import Spinner from "../Spinner";

export default function ConfirmEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState<string | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    const verifyEmail = async () => {
      try {
        const res = await API.post("api/auth/confirm-email", { token });
        if (res.data.success) {
          setMessage("Email has been confirmed.");
        }
        setMessage(
          "Sorry, but we couldn't confirm your email. Please try again later. If you arrived here accidentally, please leave this page."
        );
        // eslint-disable-next-line
      } catch (err) {
        // console.log(err);
        setMessage(
          "Sorry, something went wrong. Please try again later. If you arrived here accidentally, please leave this page."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) verifyEmail();
  }, [token, navigate]);

  return (
    <div className="text-center">
      <div className="px-3 pb-6">
        {!loading ? (
          <p>{message}</p>
        ) : (
          <Spinner size={2} />
        )}
      </div>
      <NavLink to="/login" className="link">
        Back to login
      </NavLink>
    </div>
  );
}
