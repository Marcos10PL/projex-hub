import clsx from "clsx";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Spinner from "../Spinner";
import {
  ApiResponse,
  apiResponseSchema,
  ForgotPassowrdForm,
  forgotPasswordSchema,
} from "../../lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorMsg from "./ErrorMsg";
import API from "../../lib/axiosConfig";
import { AxiosError } from "axios";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit: SubmitHandler<ForgotPassowrdForm> = async data => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.post("auth/forgot-password", data);
      const dataRes = apiResponseSchema.safeParse(res.data);

      if (dataRes.data?.success) {
        setMessage(
          "Reset link sent successfully! <br /> You can close this page."
        );
        setSuccess(true);
      }
    } catch (err) {
      const { response } = err as AxiosError<ApiResponse>;

      if (response) {
        if (response.status >= 500)
          setMessage("Server error. <br /> Please try again later.");
        if (response.status === 404)
          setMessage("No user found with this email address.");
        if (response.status === 429)
          setMessage(response.data.msg + "." || "Too many requests.");
        if (response.status === 400)
          setMessage(
            "Your address is not verified. <br /> Please login and verify your email address."
          );
      } else {
        setMessage("Something went wrong. <br /> Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message ? (
        <div className="text-center">
          <div className="px-3 pb-6">
            <p dangerouslySetInnerHTML={{ __html: message }} />
          </div>
          {!success && (
            <button className="button w-full" onClick={() => setMessage("")}>
              Try again
            </button>
          )}
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
        </form>
      )}

      <div className="my-6 text-center">
        <NavLink to="/login" className="link">
          Back to login
        </NavLink>
      </div>
    </>
  );
}
