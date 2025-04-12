import { SubmitHandler, useForm } from "react-hook-form";
import {
  UpdateProfileForm,
  updateProfileResponseSchema,
  updateProfileSchema,
} from "../../utils/zodSchemas";
import ErrorMsg from "../../components/ErrorMsg";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { resendEmail } from "../../utils/utils";
import useApi from "../../utils/myHooks/useApi";
import { AppDispatch, RootState } from "../../state/store";
import {
  setEmail,
  setUsername,
} from "../../state/current-user/currentUserSlice";

export default function Profile() {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [seconds, setSeconds] = useState(3);

  const dispatch = useDispatch<AppDispatch>();

  const { fetchData, errorMsg, loading } = useApi(
    "auth/update-profile",
    updateProfileResponseSchema,
    "patch",
    {
      400: "Email or username already taken",
      401: "Invalid password. Please try again.",
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(updateProfileSchema) });

  const onSubmit: SubmitHandler<UpdateProfileForm> = async data => {
    setSuccess(false);
    const res = await fetchData({ data });
    if (res?.success) {
      setSuccess(true);
      if (res.user.email) dispatch(setEmail(res.user.email));
      if (res.user.username) dispatch(setUsername(res.user.username));
    }
  };

  useEffect(() => {
    if (!success) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.reload();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [success]);

  const handleResendEmail = useCallback(async () => {
    const res = await resendEmail(user?.email || "");
    if (res) setMessage("Email has been sent.");
    else setMessage("Something went wrong. Please try again later.");
  }, [user]);

  return (
    <>
      <h1 className="text-2xl font-semibold text-center mb-5">Your profile</h1>

      <div className="text-center my-5">
        {!user?.isActivated ? (
          <div>
            You need to confirm your email to update your data. <br /> Check
            your inbox for the confirmation email or{" "}
            <button onClick={handleResendEmail} className="link cursor-pointer">
              resend it.
            </button>
            {message && <p className="py-2">{message}</p>}
          </div>
        ) : (
          <div>
            You can update your information here. <br /> There's no need to
            change everything. <br /> <br />
            If you update your email, you'll need to confirm it again.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
        <div className="mb-5">
          <input
            type="email"
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
            placeholder="Email..."
            {...register("email")}
            defaultValue={user?.email}
          />
          <ErrorMsg message={errors.email?.message} />
        </div>
        <div className="mb-5">
          <input
            type="text"
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
            placeholder="Username..."
            {...register("username")}
            defaultValue={user?.username}
          />
          <ErrorMsg message={errors.username?.message} />
        </div>
        <div className="mb-5">
          <input
            type="password"
            placeholder="New password..."
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block w-full p-2.5 bg-gray-800"
            {...register("newPassword")}
            defaultValue=""
          />
          <ErrorMsg message={errors.newPassword?.message} />
        </div>
        <div className="mt-10">
          <input
            type="password"
            placeholder="Your password..."
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block w-full p-2.5 bg-gray-800"
            {...register("password")}
          />
          <ErrorMsg message={errors.password?.message} />
        </div>
        <button
          type="submit"
          className={clsx(
            "button w-full my-5 h-11",
            loading && "opacity-80 pointer-events-none"
          )}
        >
          {loading ? <Spinner size={1.5} /> : "Change your data"}
        </button>
      </form>

      <ErrorMsg message={errorMsg} />

      {success && (
        <div className="text-center text-secondary my-2">
          Your data has been updated. <br /> If you updated your email, check
          your inbox. <br />
          <span>
            Page will be reloaded in {seconds} second{seconds > 1 && "s"}.
          </span>
        </div>
      )}
    </>
  );
}
