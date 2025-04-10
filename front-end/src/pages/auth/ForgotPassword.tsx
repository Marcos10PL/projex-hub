import clsx from "clsx";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Spinner from "../../components/Spinner";
import {
  apiResponseSchema,
  ForgotPassowrdForm,
  forgotPasswordSchema,
} from "../../utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorMsg from "../../components/ErrorMsg";
import useApi from "../../utils/myHooks/useApi";

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);

  const { loading, errorMsg, fetchData } = useApi(
    "auth/forgot-password",
    apiResponseSchema,
    "post",
    {
      400: "Your address is not verified. <br /> Please log in and verify your email address.",
      404: "No user found with this email address.",
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit: SubmitHandler<ForgotPassowrdForm> = async data => {
    const res = await fetchData({ data });

    if (res?.success) {
      setSuccess(true);
    }
  };

  return (
    <>
      {success ? (
        <div className="text-center">
          <div className="px-3 pb-6">
            Reset link sent successfully! <br /> You can close this page.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <input
              id="forgot-password-email"
              type="email"
              className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
              placeholder="Email..."
              {...register("email")}
            />
            <button
              type="submit"
              className={clsx(
                "button w-full my-3 h-11",
                loading && "opacity-80 pointer-events-none"
              )}
            >
              {loading ? <Spinner size={1.5} /> : "Sent reset link"}
            </button>
            <ErrorMsg message={errors.email?.message} />
            <label
              htmlFor="forgot-password-email"
              className="block text-center py-3"
            >
              Enter your email address and we will send you a link to reset your
              password.
            </label>
          </div>
          <ErrorMsg message={errorMsg} />
        </form>
      )}

      <div className="my-6 text-center">
        <NavLink to="/login" className="link">
          Back to log in
        </NavLink>
      </div>
    </>
  );
}
