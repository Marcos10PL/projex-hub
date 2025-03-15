import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  apiResponseSchema,
  ResetPasswordForm,
  resetPasswordSchema,
} from "../../lib/zodSchemas";
import ErrorMsg from "./ErrorMsg";
import API from "../../lib/axiosConfig";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Spinner from "../Spinner";

export default function ResetPassword() {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit: SubmitHandler<ResetPasswordForm> = async data => {
    try {
      setLoading(true);

      const res = await API.post("auth/reset-password", { ...data, token });
      const dataRes = apiResponseSchema.safeParse(res.data);

      if (dataRes.data?.success) {
        setMessage(
          "Password reset successfully! <br /> You can close this page."
        );
      }
      // eslint-disable-next-line
    } catch (err) {
      // console.error(err)
      setMessage(
        "Sorry, something went wrong. If you want to change your password again, you must request a new reset email. If you arrived here accidentally, please leave this page."
      );
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <>
        <div className="text-center">
          <div className="px-3 pb-6">
            <p dangerouslySetInnerHTML={{ __html: message }} />
          </div>
        </div>
        <div className="text-center">
          <NavLink to="/login" className="link">
            Back to login
          </NavLink>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5">
        <input
          type="password"
          placeholder="Password..."
          className="border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block w-full p-2.5 bg-gray-800"
          {...register("password")}
        />
        <ErrorMsg message={errors.password?.message} />
      </div>
      <button type="submit" className="button w-full">
        {loading ? <Spinner size={1.5} /> : "Reset Password"}
      </button>
    </form>
  );
}
