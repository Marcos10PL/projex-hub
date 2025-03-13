import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../../lib/axiosConfig";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../state/current-user/currentUserSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginSchema } from "../../lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMsg from "./ErrorMsg";

export default function LoginhtmlForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  type Inputs = {
    login: string;
    password: string;
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    try {
      const res = await API.post("api/auth/login", data);
      if (!res.data.success) {
        throw new Error("Invalid login or password");
      }
      dispatch(setCurrentUser(res.data.user));
      navigate("/");
      // eslint-disable-next-line
    } catch (err) {
      setErrorMsg("Invalid login or password");
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

        <button type="submit" className="button w-full">
          Login
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