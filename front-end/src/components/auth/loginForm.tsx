import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../../lib/axiosConfig";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../state/current-user/currentUserSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  type LoginForm,
  LoginResponse,
  loginResponseSchema,
  loginSchema,
} from "../../lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMsg from "./ErrorMsg";
import Spinner from "../Spinner";
import clsx from "clsx";
import { AxiosError } from "axios";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginForm> = async data => {
    try {
      setErrorMsg("");
      setLoading(true);

      const res = await API.post("auth/login", data);
      const dataRes = loginResponseSchema.safeParse(res.data);

      if (dataRes.data?.success) {
        dispatch(setCurrentUser(dataRes.data?.user));
        navigate("/");
      }
    } catch (err: unknown) {
      const { response } = err as AxiosError<LoginResponse>;

      if (response) {
        if (response.status >= 500)
          setErrorMsg("Server error. Please try again later.");
        if (response.status === 401) 
          setErrorMsg("Invalid login or password.");
        if (response.status === 429) 
          setErrorMsg(response.data.msg + '.' || "Too many requests.");
        
      } else {
        setErrorMsg("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <input
            type="text"
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
            placeholder="Email or username..."
            {...register("login")}
          />
          <ErrorMsg message={errors.login?.message} />
        </div>

        <div className="mb-5">
          <input
            type="password"
            placeholder="Password..."
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block w-full p-2.5 bg-gray-800"
            {...register("password")}
          />
          <ErrorMsg message={errors.password?.message} />

          <NavLink to="/forgot-password" className="link text-right block my-2">
            Forgot password?
          </NavLink>
        </div>

        <button
          type="submit"
          className={clsx(
            "button w-full",
            loading && "pointer-events-none opacity-80"
          )}
        >
          {loading ? <Spinner size={1.5} /> : "Login"}
        </button>
      </form>

      <ErrorMsg message={errorMsg} />

      <div className="my-3 flex flex-col items-center gap-2">
        <NavLink to="/register" className="link">
          Don't have an account? Register now!
        </NavLink>
      </div>
    </>
  );
}
