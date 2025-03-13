import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, NavLink } from "react-router-dom";
import API from "../../lib/axiosConfig";
import { registerSchema } from "../../lib/zodSchemas";
import { useState } from "react";
import ErrorMsg from "./ErrorMsg";

export default function RegistrationForm() {
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  type Inputs = {
    email: string;
    username: string;
    password: string;
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(registerSchema) });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    try {
      const res = await API.post("api/auth/register", data);
      if (!res.data.success) {
        throw new Error("Invalid login or password");
      }
      setSuccess(true);
      setEmail(data.email);
      // eslint-disable-next-line
    } catch (err) {
      setErrorMsg("Invalid username, password or email");
    }
  };

  const resendEmail = async () => {
    try {
      const res = await API.post("api/auth/resend-confirm-email", { email });
      if (!res.data.success) {
        setMessage(
          "Something went wrong. Maybe you have already confirmed your email?"
        );
        throw new Error("Something went wrong");
      }
      setMessage("Email has been sent");
      // eslint-disable-next-line
    } catch (err) {
      // console.error(err);
      setMessage("Sorry, but we couldn't send the email. <br /> Please try again later.");
    }
  };

  if(message) {
    return (
      <div className="text-center" >
        <p className="px-3 mb-6" dangerouslySetInnerHTML={{ __html: message }} />
        <NavLink to="/login" className="link">
          Back to login
        </NavLink>
      </div>
    )
  }


  if (success) {
    return (
      <div className="text-center">
        <p className="px-3 pb-3">
          You have successfully registered! <br />
          Check your email to confirm your account. <br />
        </p>
        <p className="px-3 pb-3">
          If you don't see the email, check the spam folder or click{" "}
          <button className="link cursor-pointer" onClick={resendEmail}>
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

  if (!success)
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

          <button type="submit" className="button w-full my-3">
            Register
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
