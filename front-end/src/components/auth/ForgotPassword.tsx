import clsx from "clsx";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Spinner from "../Spinner";
import { ForgotPassowrd, forgotPasswordSchema } from "../../lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorMsg from "./ErrorMsg";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit: SubmitHandler<ForgotPassowrd> = async data => {
    try {
      console.log(data.email);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <div className="my-3 flex flex-col items-center gap-2">
        <NavLink to="/login" className="link">
          Remember your password? Login now!
        </NavLink>
      </div>
      <div className="my-3 flex flex-col items-center gap-2">
        <NavLink to="/register" className="link">
          Don't have an account? Register now!
        </NavLink>
      </div>
    </>
  );
}
