import { useState } from "react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

export default function LoginhtmlForm() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <form>
        <div className="mb-5">
          <input
            type="email"
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
            placeholder="Email or username..."
            // required
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Password..."
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block w-full p-2.5 bg-gray-800"
            // required
          />
          <NavLink to="/forgot-password" className="link text-right block my-2">
            Forgot password?
          </NavLink>
        </div>

        <div className="my-5">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={checked}
              onChange={() => setChecked(!checked)}
              // required
            />
            <div
              className={clsx(
                "bg-gray-800 w-6 h-6 border-2 border-gray-500 rounded-md outline-0",
                checked &&
                  "bg-primary border-3 border-gray-800 outline-2 outline-purple-500",
                "peer-focus:outline-2 peer-focus:outline-purple-500"
              )}
            />
            <p className="mx-2">Remember me</p>
          </label>
        </div>

        <button type="submit" className="button w-full">
          Login
        </button>
      </form>

      <div className="my-3 flex flex-col items-center gap-2">
        <NavLink to="/register" className="link">
          Don't have an account? Register now!
        </NavLink>
      </div>
    </>
  );
}
