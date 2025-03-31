import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  apiResponseSchema,
  ResetPasswordForm,
  resetPasswordSchema,
} from "../../utils/zodSchemas";
import ErrorMsg from "../../components/ErrorMsg";
import Spinner from "../../components/Spinner";
import useApi from "../../utils/myHooks/useApi";

export default function ResetPassword() {
  const { token } = useParams();
  const [success, setSuccess] = useState(false);

  const { fetchData, errorMsg, loading } = useApi(
    "auth/reset-password",
    apiResponseSchema,
    "post",
    {
      400: "Sorry, something went wrong. If you want to change your password again, you must request a new reset email. If you arrived here accidentally, please leave this page.",
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit: SubmitHandler<ResetPasswordForm> = async data => {
    const res = await fetchData({
      data: { ...data, token },
    });

    if (res?.success) setSuccess(true);
  };

  if (success || errorMsg) {
    return (
      <>
        <div className="text-center">
          <div className="px-3 pb-6">
            {errorMsg ? (
              <ErrorMsg message={errorMsg} />
            ) : (
              <p>
                "Password reset successfully! <br /> You can close this page."
              </p>
            )}
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
