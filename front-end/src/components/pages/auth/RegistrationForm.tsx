import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, NavLink } from "react-router-dom";
import API from "../../../lib/axiosConfig";
import {
  RegisterForm,
  RegisterResponse,
  registerResponseSchema,
  registerSchema,
} from "../../../lib/zodSchemas";
import { useCallback, useState } from "react";

import clsx from "clsx";
import Spinner from "../../Spinner";
import { AxiosError } from "axios";
import ErrorMsg from "../../auth/ErrorMsg";
import { resendEmail } from "../../../lib/utils";

export default function RegistrationForm() {
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit: SubmitHandler<RegisterForm> = async data => {
    try {
      setErrorMsg("");
      setLoading(true);

      const res = await API.post("auth/register", data);
      const dataRes = registerResponseSchema.safeParse(res.data);

      if (dataRes.data?.success) {
        setEmail(data.email);
      }
    } catch (err: unknown) {
      const { response } = err as AxiosError<RegisterResponse>;

      if (response) {
        if (response.status >= 500)
          setErrorMsg("Server error. Please try again later.");
        if (response.status === 400)
          setErrorMsg(response.data.msg || "Invalid data");
        if (response.status === 429)
          setErrorMsg(response.data.msg + "." || "Too many requests.");
      } else {
        setErrorMsg("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = useCallback(async () => {
    const res = await resendEmail(email);
    if (res) setMessage("Email has been sent.");
    else setMessage("Something went wrong. Please try again later.");
  }, [email]);

  if (message) {
    return (
      <div className="text-center">
        <p
          className="px-3 mb-6"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <NavLink to="/login" className="link">
          Back to login
        </NavLink>
      </div>
    );
  }

  if (email) {
    return (
      <div className="text-center">
        <p className="px-3 pb-3">
          You have successfully registered! <br />
          Check your email to confirm your account. <br />
        </p>
        <p className="px-3 pb-3">
          If you don't see the email, check the spam folder or click{" "}
          <button className="link cursor-pointer" onClick={handleResendEmail}>
            resend the email.
          </button>
        </p>
        <p className="px-3 pb-3">
          If you do not confirm your email address, you will not be able to
          recover your account if you forget or lose your password.
        </p>
        <NavLink to="/login" className="link">
          You can login now!
        </NavLink>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <input
            type="email"
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
            placeholder="Email..."
            {...register("email")}
          />
          <ErrorMsg message={errors.email?.message} />
        </div>

        <div className="mb-5">
          <input
            type="text"
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
            placeholder="Username..."
            {...register("username")}
          />
          <ErrorMsg message={errors.username?.message} />
        </div>

        <div className="mb-5">
          <input
            type="password"
            placeholder="Password..."
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block w-full p-2.5 bg-gray-800"
            {...register("password")}
          />
          <ErrorMsg message={errors.password?.message} />
        </div>

        <div className="text-center my-3">
          By registering you acknowledge that you have read and accept the{" "}
          <Link to="/privacy-policy" className="link">
            privacy policy
          </Link>
          , you can withdraw it at any time by deleting an account.
        </div>

        <button
          type="submit"
          className={clsx(
            "button w-full my-3 h-11",
            loading && "opacity-80 pointer-events-none"
          )}
        >
          {loading ? <Spinner size={1.5} /> : "Register"}
        </button>
      </form>

      <ErrorMsg message={errorMsg} />

      <div className="my-3 flex flex-col items-center gap-2">
        <NavLink to="/login" className="link">
          Already have an account? Login now!
        </NavLink>
      </div>
    </>
  );
}
