import { useState } from "react";
import Logo from "../logo";
import clsx from "clsx";

export default function LoginhtmlForm() {
  const [checked, setChecked] = useState(false);
  console.log(checked);
  return (
    <>
      <header className="text-center my-8">
        <Logo />
      </header>
      <main className="max-w-md mx-auto text-xl shadow-lg">
        <form className="mx-5">
          <div className="mb-5">
            <input
              type="email"
              className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
              placeholder="Email..."
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              placeholder="Password..."
              className="border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block w-full p-2.5 bg-gray-800"
              required
            />
          </div>

          <div className="my-5">
            <label
              className="flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={() => setChecked(!checked)}
                required
              />
              <div
                className={clsx(
                  "bg-gray-800 w-6 h-6 border-2 border-gray-500 rounded-md outline-0",
                  checked && "bg-primary border-3 border-gray-800 outline-2 outline-purple-500",
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
      </main>
    </>
  );
}
