import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../lib/axiosConfig";
import Spinner from "../Spinner";
import { apiResponseSchema } from "../../lib/zodSchemas";

export default function ConfirmEmail() {
  const { token } = useParams();

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await API.post("auth/confirm-email", { token });
        const dataRes = apiResponseSchema.safeParse(res.data);

        if (dataRes.data?.success) {
          setMessage("Email has been confirmed. You can leave this page.");
        }
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

    verifyEmail();
  }, [token]);

  return (
    <div className="text-center max-w-sm mx-auto px-3 pb-6">
      {!loading ? <p>{message}</p> : <Spinner size={2} />}
    </div>
  );
}
