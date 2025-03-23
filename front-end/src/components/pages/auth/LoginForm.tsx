import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../../state/current-user/currentUserSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  type LoginForm,
  loginResponseSchema,
  loginSchema,
} from "../../../utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "../../Spinner";
import clsx from "clsx";
import ErrorMsg from "../../auth/ErrorMsg";
import useApi from "../../../utils/myHooks/useApi.ts";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, errorMsg, fetchData } = useApi(
    "auth/login",
    loginResponseSchema,
    "post",
    { 401: "Invalid login or password." }
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginForm> = async data => {
    const res = await fetchData({ data });

    if (res?.success) {
      dispatch(setCurrentUser(res.user));
      navigate("/");
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
